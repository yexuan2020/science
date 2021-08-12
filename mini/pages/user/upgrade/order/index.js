const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [], // 升级明细
    isLoading: true, // 是否正在加载中
    page: 1, // 当前页码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let _this = this;
    // 设置列表容器高度
    _this.setListHeight();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let _this = this;
    // 获取升级明细
    _this.getUpgradeOrder();
  },

  /**
   * 获取升级明细列表
   */
  getUpgradeOrder(isPage, page) {
    let _this = this;
    App._requestGet(_this, App.globalData.config.userUpgradeListsUrl, {
      page: page || 1
    }, function (res) {
      let resList = res.data.list,
        dataList = _this.data.list;
      if (isPage == true) {
        _this.setData({
          'list.data': dataList.data.concat(resList.data),
          isLoading: false,
        });
      } else {
        _this.setData({
          list: resList,
          isLoading: false,
        });
      }
    });
  },

  /**
   * 设置列表容器高度
   */
  setListHeight: function() {
    let _this = this,
      systemInfo = wx.getSystemInfoSync();
    _this.setData({
      scrollHeight: systemInfo.windowHeight * 0.98
    });
  },

  /**
   * 下拉到底加载数据
   */
  bindDownLoad() {
    let _this = this;
    // 已经是最后一页
    if (_this.data.page >= _this.data.list.last_page) {
      _this.setData({
        no_more: true
      });
      return false;
    }
    // 加载下一页列表
    _this.getUpgradeOrder(true, ++_this.data.page);
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    let _this = this;
    // 获取升级明细
    _this.getUpgradeOrder();
    wx.stopPullDownRefresh(); // 停止下拉刷新
  },
  // 页面上拉触底事件的处理函数
  onReachBottom: function () {
    let _this = this;
    // 已经是最后一页
    if (_this.data.page >= _this.data.list.last_page) {
      _this.setData({
        no_more: true
      });
      return false;
    }
    // 加载下一页列表
    _this.getUpgradeOrder(true, ++_this.data.page);
  },
})