
const App = getApp();
const func = require('../../utils/func');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false, // 是否登录
    userInfo: {}, // 用户信息
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    let _this = this;
    _this.setData({
      isLogin: App.checkIsLogin()
    });
    _this.getUserDetail(); // 获取当前用户信息
  },
  /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    let _this = this;
    _this.getUserDetail(); // 获取当前用户信息
    wx.stopPullDownRefresh() // 停止下拉刷新
  },
  /**
   * 获取当前用户信息
   */
  getUserDetail() {
    let _this = this;
    App._requestApi(_this, App.globalData.config.apiUsersdetailUrl, {}, function (res) {
      if (!res.data.userInfo) {
        res.data.isLogin = false;
        wx.removeStorageSync('token'); // 移除token
        wx.removeStorageSync('users_id'); // 移除users_id
      }
      _this.setData(res.data);
    });
  },
  /**
   * 跳转到登录页
   */
  onLogin() {
    App.doLogin();
  },
  /**
   * 验证是否已登录
   */
  onCheckLogin() {
    let _this = this;
    if (!_this.data.isLogin) {
      App.showError('很抱歉，您还没有登录');
      return false;
    }
    return true;
  },
  /**
   * 退出登录
   */
  onLogout: function (e) {
    wx.removeStorageSync('token'); // 移除token
    wx.removeStorageSync('users_id'); // 移除users_id
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  /**
   * 跳转详情页
   */
  jumpView: function (e) {
    func.jumpView(e);
  },
  /**
   * 个人资料
   */
  goEdit(e) {
    let _this = this,
      head_pic = _this.data.userInfo.head_pic, // 会员头像
      nickname = _this.data.userInfo.nickname; // 会员昵称
    wx.navigateTo({
      url: '/pages/user/edit/index?head_pic=' + head_pic + '&nickname=' + nickname
    })
  },
  /**
   * 路径跳转
   */
  onTargetPath(e) {
    let _this = this;
    if (!_this.data.isLogin) {
      _this.onLogin();
    }
    wx.navigateTo({
      url: '/' + e.currentTarget.dataset.url
    })
  },
})