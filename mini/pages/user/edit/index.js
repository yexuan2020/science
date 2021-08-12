
const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      head_pic:options.head_pic,
      nickname:options.nickname,
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
   
  //选择图片
  chooseImage: function(e) {
    let _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 默认原图和压缩图
      sourceType: ['album', 'camera'], // 默认指定来源是相册和相机
      success: function(res) {
        //上传
        wx.uploadFile({
          url: App.globalData.config.userUploadHeadPicUrl,
          filePath: res.tempFilePaths[0],
          name: 'file',
          success: function(res) {
            let result = typeof res.data === "object" ? res.data : JSON.parse(res.data);
            if (result.code === 1) {
              _this.setData({
                head_pic:result.data.img_url
              })
              _this.saveHeadPic(result.data.url);
            }
          }
        });
      }
    });
  },

  // 保存
  saveHeadPic(img_url){
    let _this = this;
    App._requestPost(_this,App.globalData.config.userSaveUserInfoUrl, {
      head_pic: img_url,
    }, result => {
    })
  }
  
})