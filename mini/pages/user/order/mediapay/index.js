const App = getApp();

const func = require('../../../../utils/func');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 1,
    no_more: false,
    isLoading: true, // 是否正在加载中
    scrollHeight: null, // 列表容器高度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    // 设置scroll-view高度
    _this.setListHeight();
    _this.getPageData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  getPageData(isPage, page) {
    let _this = this;
    App._requestGet(_this, App.globalData.config.userVideopayListsUrl, {
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  /**
   * 切换标签
   */
  bindHeaderTap(e) {
    let _this = this;
    _this.setData({
      list: [],
      isLoading: true,
      page: 1,
      no_more: false,
    });
    // 获取订单列表
    _this.getPageData();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let _this = this;
    // 获取订单列表
    _this.bindHeaderTap();
    wx.stopPullDownRefresh();
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
    _this.getPageData(true, ++_this.data.page);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  // onReachBottom: function () {
  //   let _this = this;
  //   // 已经是最后一页
  //   if (_this.data.page >= _this.data.list.last_page) {
  //     _this.setData({
  //       no_more: true
  //     });
  //     return false;
  //   }
  //   // 加载下一页列表
  //   _this.getPageData(true, ++_this.data.page);
  // },
  /**
   * 设置商品列表高度
   */
  setListHeight() {
    let systemInfo = wx.getSystemInfoSync(),
      rpx = systemInfo.windowWidth / 750, // 计算rpx
      tapHeight = Math.floor(rpx * 88), // tap高度
      scrollHeight = systemInfo.windowHeight - tapHeight; // swiper高度
    this.setData({
      scrollHeight
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  jumpView(e) {
    func.jumpView(e)
  },

  /**
   * 跳转详情页
   */
  onViewPath(e) {
    let aid = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/archives/media/view?aid=' + aid
    });
  },
  /**
   * 路径跳转
   */
  onTargetPath(e) {
    wx.navigateTo({
      url: '/' + e.currentTarget.dataset.url
    })
  },
})