const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    level_id: 0, // VIP套餐的级别ID
    selectedPrice: 0,
    userInfo: {}, // 用户信息
    selectedTypeId: 0, // 当前选中的套餐id
    disabled: false, //按钮禁用
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let _this = this;
    if (options.scene) { //这里为线上操作
      // scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
      let scene = decodeURIComponent(options.scene);
      let level_id = func.getQueryVariable('level_id', scene);
      _this.data.level_id = !level_id ? _this.data.level_id : level_id;
    } else { //这里为开发环境
      if (options.level_id !== 'undefined') {
        _this.data.level_id = !options.level_id ? 0 : options.level_id;
      }
    }
    _this.setData({
      level_id: _this.data.level_id,
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let _this = this;
    _this.setData({
      isLogin: App.checkIsLogin()
    });
    // 获取会员升级套餐数据
    _this.getUpgradeIndex();
  },
  /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    let _this = this;
    // 解除禁用
    _this.setData({
      disabled: false
    });
    // 获取会员升级套餐数据
    _this.getUpgradeIndex();
    wx.stopPullDownRefresh(); // 停止下拉刷新
  },

  /**
   * 获取会员升级套餐数据
   */
  getUpgradeIndex() {
    let _this = this;
    App._requestGet(_this, App.globalData.config.userUpgradeUrl, {
      level_id: _this.data.level_id || 0
    }, function (res) {
      if (!res.data.userInfo) {
        res.data.isLogin = false;
        wx.removeStorageSync('token'); // 移除token
        wx.removeStorageSync('users_id'); // 移除users_id
      }
      _this.setData(res.data);
    });
  },

  /**
   * 选择会员升级套餐
   */
  onSelectUpgrade(e) {
    let _this = this;
    let level_value = e.currentTarget.dataset.level_value;
    if (_this.data.userInfo.level_value > level_value) {
      App.showError('不能选择比当前级别低的套餐');
      return false;
    }
    _this.setData({
      selectedTypeId: e.currentTarget.dataset.id,
      selectedPrice: e.currentTarget.dataset.price
    });
  },

  /**
   * 立即升级
   */
  onSubmit(e) {
    let _this = this;

    // 按钮禁用
    _this.setData({
      disabled: true
    });
    App._requestPost(_this, App.globalData.config.userUpgradeUrl, {
      type_id: _this.data.selectedTypeId || 0,
    }, function (res) {
      if ('balance' == res.data.payment.pay_method) {
        App.showSuccess(res.msg, () => {
          wx.navigateBack();
        });
      } else {
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
      }
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
          logicType: 'upgrade'
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