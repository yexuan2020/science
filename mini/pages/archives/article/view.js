const App = getApp();
const func = require('../../../utils/func');
import wxParse from '../../../wxParse/wxParse.js'; // 富文本插件

Page({

  /**
   * 页面的初始数据
   */
  data: {
    aid: 0, // 文档ID
    typeid: 0, // 栏目ID
    detail: {}, // 文档详情 
    preDetail: {}, // 上一篇
    nextDetail: {}, // 下一篇
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let _this = this;
    if (options.scene) { //这里为线上操作
      // scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
      let scene = decodeURIComponent(options.scene);
      let aid = func.getQueryVariable('aid', scene);
      _this.data.aid = !aid ? _this.data.aid : aid;
      let typeid = func.getQueryVariable('typeid', scene);
      _this.data.typeid = !typeid ? _this.data.typeid : typeid;
    } else { //这里为开发环境
      if (options.aid !== 'undefined') {
        _this.data.aid = !options.aid ? 0 : options.aid;
      }
      if (options.typeid !== 'undefined') {
        _this.data.typeid = !options.typeid ? 0 : options.typeid;
      }
    }
    _this.setData({
      aid: _this.data.aid,
      typeid: _this.data.typeid
    });
    _this.getPageData(); // 获取页面数据
  },
  /**
   * 生命周期回调—监听页面显示
   */
  onShow() {

  },
  /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    let _this = this;
    _this.getPageData(); // 获取页面数据
    wx.stopPullDownRefresh() // 停止下拉刷新
  },
  /**
   * 获取页面数据
   */
  getPageData() {
    this.getArchivesView(); // 获取文档详情
  },
  /**
   * 获取文档详情
   */
  getArchivesView() {
    let _this = this;
    App._requestApi(_this, App.globalData.config.apiViewUrl, {
      aid: _this.data.aid, // 文档ID
      typeid: _this.data.typeid, // 文档所属的栏目ID
      apiPrenext: `ekey=1&get=all`, // 文档上下篇标签prenext
      // 这里可以根据需求填写更多的api标签
    }, function (res) {
      let detail = res.data.detail.data, // 文档详情页数据
        preDetail = res.data.apiPrenext[1].preDetail, // 上一篇文档的数据
        nextDetail = res.data.apiPrenext[1].nextDetail; // 下一篇文档的数据
      if (detail) {
        if (detail.arcrank <= -1) {
          App.showError('文档待审核中，无权查看！');
          return false;
        }
        // 富文本转码
        if (detail.content.length > 0) {
          wxParse.wxParse('content', 'html', detail.content, _this, 0);
        }
        // 设置导航标题
        wx.setNavigationBarTitle({
          title: detail.title || '内容详情'
        })
        _this.setData({
          detail,
          preDetail,
          nextDetail,
        });
      } else {
        App.showError('文档不存在！');
        return false;
      }
    });
  },
  /**
   * 分享当前页面
   */
  onShareAppMessage() {
    let _this = this;
    // 构建页面参数
    let params = App.getShareUrlParams({
      'aid': _this.data.detail.aid
    });
    return {
      title: _this.data.detail.title,
      path: "/pages/archives/article/view?" + params
    };
  },
  /**
   * 分享到朋友圈
   */
  onShareTimeline() {
    let _this = this;
    return {
      title: _this.data.detail.title,
    }
  },
  /**
   * 跳转列表页
   */
  jumpList(e) {
    func.jumpList(e)
  },
  /**
   * 跳转详情页
   */
  jumpView(e) {
    func.jumpView(e)
  },
  /**
   * 立即开通会员级别
   */
  onSubmitLevel(e) {
    let _this = this;

    // 按钮禁用
    _this.setData({
      disabled: true
    });
    App._requestPost(_this, App.globalData.config.userUpgradeUrl, {
      level_id: _this.data.detail.arc_level_id, // 文档ID
    }, function (res) {
      if ('balance' == res.data.payment.pay_method) {
        App.showSuccess(res.msg, () => {
          _this.getPageData(); // 获取页面数据
        });
      } else {
        // 发起微信支付
        App.wxPayment({
          payment: res.data.payment,
          success() {
            _this.OrderPayDealWith(res.data.order_id, res.data.order_code, 'upgrade');
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
   * 立即付费文章
   */
  onSubmitFreePay(e) {
    let _this = this;

    // 按钮禁用
    _this.setData({
      disabled: true
    });
    App._requestPost(_this, App.globalData.config.userArticlepayUrl, {
      aid: _this.data.aid, // 文档ID
    }, function (res) {
      if ('balance' == res.data.payment.pay_method) {
        App.showSuccess(res.msg, () => {
          _this.getPageData(); // 获取页面数据
        });
      } else {
        // 发起微信支付
        App.wxPayment({
          payment: res.data.payment,
          success() {
            _this.OrderPayDealWith(res.data.order_id, res.data.order_code, 'articlepay');
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
  OrderPayDealWith: function (order_id, order_code, logicType) {
    let _this = this;
    if (order_id && order_code) {
      App._requestPost(_this, App.globalData.config.userOrderPayDealWithUrl, {
          order_id: order_id,
          order_code: order_code,
          logicType: logicType
        },
        function (res) {
          App.showSuccess(res.msg, () => {
            if ('reload' == res.url) {
              _this.getPageData(); // 刷新页面数据
            } else {
              wx.redirectTo({
                url: res.url
              });
            }
          });
        }
      );
    }
  },
})