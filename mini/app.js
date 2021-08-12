
// 工具类
import util from './utils/util.js';
const func = require('./utils/func.js');

import config from './config.js';

App({

  /**
   * 全局变量
   */
  globalData: {
    timer: 0,
    users_id: null,
    config: config,
    tabbar: config.tabbar, // 底部导航菜单
  },

  /**
   * 生命周期函数--监听小程序初始化
   */
  onLaunch(e) {
    let _this = this;
    _this.updateManager(); // 小程序主动更新
    _this.onStartupScene(e.query); // 小程序启动场景
  },

  /**
   * 小程序启动场景
   */
  onStartupScene(query) {

  },

  /**
   * 获取小程序appid
   */
  getAppId() {
    return config.appId;
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow(options) {

  },

  /**
   * 执行用户登录
   */
  doLogin(delta) {
    // 保存当前页面
    let pages = getCurrentPages();
    if (pages.length) {
      let currentPage = pages[pages.length - 1];
      "pages/login/login" != currentPage.route &&
        wx.setStorageSync("currentPage", currentPage);
    }
    // 跳转授权页面
    wx.navigateTo({
      url: "/pages/login/login?delta=" + (delta || 1)
    });
  },

  /**
   * 当前用户id
   */
  getUserId() {
    return wx.getStorageSync('users_id');
  },

  /**
   * 显示成功提示框
   */
  showSuccess(msg, callback) {
    wx.showToast({
      title: msg,
      icon: 'success',
      mask: true,
      duration: 1500,
      success() {
        callback && (setTimeout(function () {
          callback();
        }, 1500));
      }
    });
  },

  /**
   * 显示失败提示框
   */
  showError(msg, callback) {
    wx.showModal({
      title: '操作提示',
      content: msg,
      showCancel: false,
      success(res) {
        callback && callback();
      }
    });
  },

  // api标签接口数据
  _requestApi: function (that, url, data, success, fail, complete) {
    let _this = this;
    wx.showLoading({
      title: '加载中',
      mask: true,
      fail: function () {
        wx.hideLoading();
      }
    });

    // 构造请求参数
    data = data || {};
    data.appId = _this.getAppId();
    data.token = wx.getStorageSync('token');
    data._ajax = 1;

    let request = function () {
      wx.request({
        url: url,
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        data: data,
        success(res) {
          if (res.statusCode !== 200 || typeof res.data !== 'object') {
            console.log(res);
            _this.showError(res.data);
            return false;
          }
          if (res.data.code == 1) {
            success && success(res.data);
            that.setData({
              isApiLoaded: true // api请求加载完成
            });
          } else {
            _this.showError(res.data.msg);
          }
        },
        fail(res) {
          _this.showError(res.errMsg, function () {
            fail && fail(res);
          });
        },
        complete(res) {
          wx.hideLoading();
          complete && complete(res);
        },
      });
    };
    // 执行接口请求
    request();
  },

  /**
   * get提交
   */
  _requestGet: function (that, url, data, success, fail, complete) {
    let _this = this;
    wx.showLoading({
      title: '加载中',
      mask: true,
      fail: function () {
        wx.hideLoading();
      }
    });

    // 构造请求参数
    data = data || {};
    data.appId = _this.getAppId();
    data.token = wx.getStorageSync('token');
    data._ajax = 1;

    let request = function () {
      wx.request({
        url: url,
        header: {
          'content-type': 'application/json'
        },
        method: 'GET',
        data: data,
        success(res) {
          if (res.statusCode !== 200 || typeof res.data !== 'object') {
            console.log(res);
            _this.showError(res.data);
            return false;
          }
          if (res.data.code == 1) {
            success && success(res.data);
            that.setData({
              isApiLoaded: true // api请求加载完成
            });
          } else {
            _this.showError(res.data.msg);
          }
        },
        fail(res) {
          _this.showError(res.errMsg, function () {
            fail && fail(res);
          });
        },
        complete(res) {
          wx.hideLoading();
          complete && complete(res);
        },
      });
    };
    // 执行接口请求
    request();
  },

  /**
   * post提交
   */
  _requestPost: function (that, url, data, success, fail, complete, showLoadTitle, isShowNavBarLoading) {
    let _this = this;

    // 在当前页面显示导航条加载动画
    isShowNavBarLoading || true;
    isShowNavBarLoading && wx.showNavigationBarLoading();

    // 构造请求参数
    data = data || {};
    data.appId = _this.getAppId();
    data.token = wx.getStorageSync('token');

    let request = function () {
      wx.request({
        url: url,
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
        method: 'POST',
        data: data,
        success(res) {
          if (res.statusCode !== 200 || typeof res.data !== 'object') {
            console.log(res);
            _this.showError('未知错误，无法继续~');
            return false;
          }
          if (res.data.data.code === -1) {
            // 登录态失效, 重新登录
            isShowNavBarLoading && wx.hideNavigationBarLoading();
            _this.doLogin(1);
          } else if (res.data.code === 0) {
            _this.showError(res.data.msg, function () {
              fail && fail(res);
            });
            return false;
          } else {
            success && success(res.data);
          }
        },
        fail(res) {
          _this.showError(res.errMsg, function () {
            fail && fail(res);
          });
        },
        complete(res) {
          showLoadTitle !== false && wx.hideLoading();
          isShowNavBarLoading && wx.hideNavigationBarLoading();
          complete && complete(res);
        },
      });
    };
    if (showLoadTitle === false) {
      request();
    } else {
      wx.showLoading({
        title: showLoadTitle || '处理中',
        mask: true,
        success: function () {
          request();
        },
        fail: function () {
          wx.hideLoading();
        }
      });
    }
  },

  /**
   * 验证是否存在user_info
   */
  validateUserInfo() {
    // let user_info = wx.getStorageSync('user_info');
    return !!wx.getStorageSync('user_info');
  },

  /**
   * 小程序主动更新
   */
  updateManager() {
    if (!wx.canIUse('getUpdateManager')) {
      return false;
    }
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
    });
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，即将重启应用',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate();
          }
        }
      });
    });
    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      wx.showModal({
        title: '更新提示',
        content: '新版本下载失败！',
        showCancel: false
      });
    });
  },

  /**
   * 跳转到指定页面
   * 支持tabBar页面
   */
  navigationTo(url) {
    if (!url || url.length == 0) {
      return false;
    }
    func.switchTab(url, 'navigateTo');
  },

  /**
   * 记录formId
   */
  saveFormId(formId) {
    let _this = this;
    if (formId === 'the formId is a mock one') {
      return false;
    }
  },

  /**
   * 生成转发的url参数
   */
  getShareUrlParams(params) {
    let _this = this;
    return util.urlEncode(Object.assign({
      referee_id: _this.getUserId()
    }, params));
  },

  /**
   * 发起微信支付
   */
  wxPayment(option) {
    let options = Object.assign({
      payment: {},
      success: () => {},
      fail: () => {},
      complete: () => {},
    }, option);
    wx.requestPayment({
      timeStamp: options.payment.timeStamp,
      nonceStr: options.payment.nonceStr,
      package: 'prepay_id=' + options.payment.prepay_id,
      signType: 'MD5',
      paySign: options.payment.paySign,
      success(res) {
        options.success(res);
      },
      fail(res) {
        options.fail(res);
      },
      complete(res) {
        options.complete(res);
      }
    });
  },

  /**
   * 验证登录
   */
  checkIsLogin() {
    return wx.getStorageSync('token') != '' && wx.getStorageSync('users_id') != '';
  },

  /**
   * 授权登录
   */
  getUserProfile(obj, callback) {
    let _this = this;
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (e) => {
        let App = this;
        if (e.errMsg !== 'getUserProfile:ok') {
          return false;
        }
        wx.showLoading({
          title: "正在登录",
          mask: true
        });
        // 执行微信登录
        wx.login({
          success(res) {
            // 发送用户信息
            App._requestPost(_this, App.globalData.config.apiUsersloginUrl, {
              code: res.code,
              user_info: e.rawData,
              encrypted_data: e.encryptedData,
              iv: e.iv,
              signature: e.signature,
              // referee_id: wx.getStorageSync('referee_id')
            }, result => {
              // 记录token users_id
              wx.setStorageSync('token', result.data.token);
              wx.setStorageSync('users_id', result.data.users_id);
              // 执行回调函数
              callback && callback();
            }, false, () => {
              wx.hideLoading();
            });
          }
        });
      }
    })
  },
});