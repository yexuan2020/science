const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false, // 是否登录
    userInfo: {}, // 用户信息
    inputValue: '', // 自定义金额
    disabled: false, //按钮禁用
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let _this = this;
    _this.setData({
      isLogin: App.checkIsLogin()
    });
    // 获取充值中心数据
    _this.getRechargeIndex();
  },
  /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    let _this = this;
    // 获取充值中心数据
    _this.getRechargeIndex();
    wx.stopPullDownRefresh(); // 停止下拉刷新
  },

  /**
   * 获取充值中心数据
   */
  getRechargeIndex() {
    let _this = this;
    App._requestGet(_this, App.globalData.config.userRechargeUrl, {}, function (res) {
      if (!res.data.userInfo) {
        res.data.isLogin = false;
        wx.removeStorageSync('token'); // 移除token
        wx.removeStorageSync('users_id'); // 移除users_id
      }
      _this.setData(res.data);
    });
  },

  /**
   * 绑定金额输入框
   */
  bindMoneyInput(e) {
    let _this = this;
    _this.setData({
      inputValue: e.detail.value,
    })
  },

  /**
   * 立即充值
   */
  onSubmit(e) {
    let _this = this;

    // 按钮禁用
    _this.setData({
      disabled: true
    });
    App._requestPost(_this,App.globalData.config.userRechargeUrl, {
      customMoney: _this.data.inputValue
    }, function (res) {
      // 发起微信支付
      App.wxPayment({
        payment: res.data.payment,
        success() {
          _this.OrderPayDealWith(res.data.order_id, res.data.order_code);
          // App.showSuccess(res.msg, () => {
          //   wx.navigateBack();
          // });
        },
        fail(res) {
          // 解除禁用
          _this.setData({
            disabled: false
          });
          App.showError(res.msg);
        },
        complete(res) {

        }
      });
    }, function (res) {
      // 解除禁用
      _this.setData({
        disabled: false
      });
    })
  },
  /**
   * 路径跳转
   */
  onTargetPath(e) {
    wx.navigateTo({
      url: '/' + e.currentTarget.dataset.url
    })
  },
  OrderPayDealWith: function (order_id, order_code) {
    if (order_id && order_code) {
      App._requestPost(_this, App.globalData.config.userOrderPayDealWithUrl, {
          order_id: order_id,
          order_code: order_code,
          logicType: 'recharge'
        },
        function (res) {
          App.showSuccess(res.msg, () => {
            wx.navigateBack();
            // wx.redirectTo({
            //   url: res.url
            // });
          });
        }
      );
    }
  },
})