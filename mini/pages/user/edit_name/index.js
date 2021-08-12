
const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickname:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      nickname:options.nickname
    })
  },
  bindNickname: function (e) {
    let _this = this;
    _this.setData({
      nickname: e.detail.value
    })
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  save(e){
    let _this = this;
    App._requestPost(_this,App.globalData.config.userSaveUserInfoUrl, {
      nickname: _this.data.nickname,
    }, result => {
      if(result.code ==1){
        wx.navigateTo({
          url: '/pages/user/index',
        })
      }
    })
  }
})