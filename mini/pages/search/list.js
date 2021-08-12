
const App = getApp();
const func = require('../../utils/func.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    keywords: '', // 搜索关键词
    archivesList: [], // 文档列表
    typeid: 0, // 当前的分类id (0则代表全部)
    no_more: false, // 没有更多数据
    isLoading: true, // 是否正在加载中
    page: 1, // 当前页码
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    if (options.scene) { //这里为线上操作
      // scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
      let scene = decodeURIComponent(options.scene);
      let typeid = func.getQueryVariable('typeid', scene);
      _this.data.typeid = !typeid ? _this.data.typeid : typeid;
      let keywords = func.getQueryVariable('keywords', scene);
      _this.data.keywords = !keywords ? _this.data.keywords : keywords;
    } else { //这里为开发环境
      if (options.typeid !== 'undefined') {
        _this.data.typeid = !options.typeid ? _this.data.typeid : options.typeid;
      }
      if (options.keywords !== 'undefined') {
        _this.data.keywords = !options.keywords ? _this.data.keywords : options.keywords;
      }
    }
    _this.setData({
      typeid: _this.data.typeid,
      keywords: _this.data.keywords
    })
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
    _this.data.page = 1
    _this.setData({
      page: _this.data.page
    })
    _this.getPageData(); // 获取页面数据
    wx.stopPullDownRefresh(); // 停止下拉刷新
  },
  /**
   * 获取页面数据
   */
  getPageData() {
    let _this = this;
    _this.getArchivesList(); // 获取文档列表
  },
  /**
   * 获取文档列表
   */
  getArchivesList(isPage, page) {
    let _this = this,
      typeid = _this.data.typeid,
      keywords = _this.data.keywords;
    App._requestApi(_this, App.globalData.config.apiListUrl, {
      apiList: `ekey=1&keywords=${keywords}&typeid=${typeid}&page=${page}`, // 文档列表分页标签list，列表页只存在一个apiList标签
    }, function (res) {
      // 特别说明：中括号[1]的数字必须与api标签的参数ekey=1值对应，否则数据对不上。
      let resList = res.data.apiList[1], // list文档列表分页数据
        dataList = _this.data.archivesList; // 每次下拉分页之后的所有文档列表
      if (isPage == true) {
        _this.setData({
          'archivesList.data': dataList.data.concat(resList.data),
          isLoading: false,
        });
      } else {
        // 设置导航标题
        wx.setNavigationBarTitle({
          title: `搜索词：` + keywords || '搜索列表'
        })
        _this.setData({
          archivesList: resList,
          isLoading: false,
        });
      }
    });
  },
  /**
   * 跳转详情页
   */
  jumpView(e) {
    func.jumpView(e)
  },
  /**
   * 分享当前页面
   */
  onShareAppMessage() {
    let _this = this;
    // 构建页面参数
    let params = App.getShareUrlParams({
      'typeid': _this.data.typeid
    });
    return {
      title: `搜索词：` + _this.data.keywords,
      path: "/pages/search/list?" + params
    };
  },
  // 分享到朋友圈
  onShareTimeline() {
    let _this = this;
    return {
      title: `搜索词：` + _this.data.keywords,
    }
  },
  /**
   * 下拉到底加载数据
   */
  bindDownLoad() {
    let _this = this;
    // 已经是最后一页
    if (_this.data.page >= _this.data.archivesList.last_page) {
      _this.setData({
        no_more: true
      });
      return false;
    }
    // 加载下一页列表
    _this.getArchivesList(true, ++_this.data.page);
  },
})