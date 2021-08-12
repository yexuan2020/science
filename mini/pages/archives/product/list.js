
const App = getApp();
const func = require('../../../utils/func')

Page({
  data: {
    channelid: 2, // 文档模型ID
    typeid: 0, // 当前的分类id (0则代表全部)
    channelList: [], // 顶部分类列表
    arctypeInfo: [], // 当前分类信息
    archivesList: [], // 文档列表

    scrollHeight: null,
    no_more: false, // 没有更多数据
    isLoading: true, // 是否正在加载中
    page: 1, // 当前页码

    //分类导航下拉初始值
    uhide: 0, // 是否隐藏子栏目导航
    tabScroll: 0,
    currentNav: 0, // 展开栏目导航的焦点选中
    beforeCurrentNav: 0, // 点击展开栏目导航之前tag的index值
    clickCurrentNav: 0, // 点击展开栏目导航tag的index值
    isClickSub: 0, // 是否点击子栏目
    subCurrentNav: 0, // 子栏目焦点选中
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
      let channelid = func.getQueryVariable('channelid', scene);
      _this.data.channelid = !channelid ? _this.data.channelid : channelid;
    } else { //这里为开发环境
      if (options.typeid !== 'undefined') {
        _this.data.typeid = !options.typeid ? _this.data.typeid : options.typeid;
      }
      if (options.channelid !== 'undefined') {
        _this.data.channelid = !options.channelid ? _this.data.channelid : options.channelid;
      }
    }
    _this.setData({
      typeid: _this.data.typeid,
      channelid: _this.data.channelid,
      currentNav: _this.data.typeid, // 展开栏目导航的焦点选中
      beforeCurrentNav: _this.data.typeid, // 点击展开栏目导航之前tag的index值
      clickCurrentNav: _this.data.typeid, // 点击展开栏目导航tag的index值
      subCurrentNav: _this.data.typeid, // 子栏目焦点选中
    })
    _this.setListHeight(); // 设置文档列表高度
    _this.getPageData(); // 获取页面数据

    //分类下拉导航
    wx.getSystemInfo({ // 获取当前设备的宽高，文档有
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      },
    })
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
    _this.setListHeight(); // 设置文档列表高度
    _this.getPageData(); // 获取页面数据
    wx.stopPullDownRefresh(); // 停止下拉刷新
  },
  // 页面上拉触底事件的处理函数
  onReachBottom: function () {
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
  /**
   * 获取页面数据
   */
  getPageData() {
    this.getArchivesList(); // 获取文档列表
  },
  /**
   * 获取文档列表
   */
  getArchivesList(isPage, page) {
    let _this = this;
    page = page || 1;
    App._requestApi(_this, App.globalData.config.apiListUrl, {
      channelid: _this.data.channelid, // 模型ID
      typeid: _this.data.typeid, // 栏目ID
      apiType: `ekey=1&type=self`, // 指定栏目标签type，在列表页未指定typeid，则默认是当前栏目ID
      apiList: `ekey=1&page=${page}`, // 文档列表分页标签list，列表页只存在一个apiList标签
      apiChannel: `ekey=1&type=sonself&currentstyle=active&showalltext=on`, // 栏目列表标签channel
      // 这里可以根据需求填写更多的api标签
    }, function (res) {
      // 特别说明：中括号[1]的数字必须与api标签的参数ekey=1值对应，否则数据对不上。
      let resList = res.data.apiList[1], // list文档列表分页数据
        type_1 = res.data.apiType[1], // type指定栏目数据
        channel_1 = res.data.apiChannel[1], // channel栏目列表数据
        dataList = _this.data.archivesList; // 每次下拉分页之后的所有文档列表
      if (isPage == true) {
        _this.setData({
          'archivesList.data': dataList.data.concat(resList.data),
          isLoading: false
        });
      } else {
        let arctypeInfo = type_1.data,
          channelList = channel_1.data;
        // 设置导航标题
        wx.setNavigationBarTitle({
          title: arctypeInfo.typename || '全部列表'
        })
        _this.setData({
          arctypeInfo: arctypeInfo,
          channelList: channelList,
          archivesList: resList,
          isLoading: false
        });
        // 点击进入三级栏目列表，处理二级导航焦点
        if (arctypeInfo.grade == 2) {
          let currentNav = arctypeInfo.parent_id;
          let beforeCurrentNav = currentNav;
          _this.setData({
            currentNav: currentNav, // 展开栏目导航的焦点选中
            beforeCurrentNav: beforeCurrentNav, // 点击展开栏目导航之前tag的index值
          });
        }
      }
    });
  },
  /**
   * 切换导航栏
   */
  onSwitchTab: function (e) {
    let _this = this;
    // 第一步：切换当前的分类id
    _this.setData({
      typeid: e.currentTarget.dataset.id,
      archivesList: {},
      page: 1,
      no_more: false,
      isLoading: true
    });
    // 第二步：更新当前的文档列表
    _this.getArchivesList();
  },
  //导航下拉显示隐藏
  dropMeun: function (e) {
    var _this = this;
    var toggleBtnVal = _this.data.uhide; // 是否隐藏子栏目导航
    var num = e.currentTarget.dataset.num;
    let channel = e.currentTarget.dataset.channel; // 分类所属模型ID
    let typeid = e.currentTarget.dataset.typeid; // 分类ID
    let sub_level = e.currentTarget.dataset.sub_level; // 当前分类下有几级子栏目

    /*点击的栏目没有子栏目*/
    if (0 == sub_level) {
      _this.data.typeid = typeid;
      _this.setData({
        typeid: _this.data.typeid,
        currentNav: e.currentTarget.dataset.current,
        beforeCurrentNav: e.currentTarget.dataset.current,
        uhide: 0,
        tabScroll: 0,
        isClickSub: 0,
        clickCurrentNav: 1,
        subCurrentNav: 0,
        page: 1,
        archivesList: {},
        no_more: false,
        isLoading: true
      })
      if (6 == channel || 8 == channel) { // 单页模型和留言模型另外跳转到各自的落地页
        func.jumpList(e);
      } else {
        _this.getPageData(); // 获取页面数据
      }
      return false;
    }
    /*end*/

    if (toggleBtnVal == num) {
      _this.setData({
        uhide: 0,
        isRuleTrue: false
      })
    } else {
      _this.setData({
        uhide: num,
        isRuleTrue: true
      })
    }
    var curtoggleBtnVal = _this.data.currentNav;
    var current = e.currentTarget.dataset.current; //获取当前tab的index
    var tabWidth = _this.data.windowWidth / 5; // 导航tab显示5个，获取一个的宽度
    _this.setData({
      navScroll: (current - 3) * tabWidth //使点击的tab始终在居中位置
    })
    if (curtoggleBtnVal == current) {
      _this.setData({
        currentNav: _this.data.beforeCurrentNav,
        clickCurrentNav: current
      })
    } else {
      _this.setData({
        currentNav: current,
        clickCurrentNav: current
      })
    }
  },
  /*点击空白隐藏下拉导航 */
  inbtn: function (e) {
    let _this = this;
    let isClickSub = _this.data.isClickSub;
    if (0 == isClickSub) {
      _this.setData({
        isRuleTrue: false,
        currentNav: _this.data.beforeCurrentNav,
        uhide: 0
      })
    } else {
      _this.setData({
        isRuleTrue: false,
        beforeCurrentNav: _this.data.clickCurrentNav,
        uhide: 0,
        isClickSub: 0
      })
    }
  },
  /**
   * 读取列表数据
   */
  onTargetList: function (e) {
    let channel = e.target.dataset.channel
    let typeid = e.target.dataset.typeid
    let parent_id = e.target.dataset.parent_id
    let is_all = e.target.dataset.is_all
    let _this = this;
    if (6 == channel || 8 == channel) { // 单页模型和留言模型另外跳转到各自的落地页
      func.jumpList(e);
    } else {
      let currentNav = parent_id;
      if (1 == is_all) {
        currentNav = typeid;
      }
      let subCurrent = e.currentTarget.dataset.current; //获取当前tab的index
      _this.data.typeid = typeid;
      _this.setData({
        typeid: typeid,
        currentNav: currentNav,
        isRuleTrue: false,
        uhide: 0,
        isClickSub: 1,
        subCurrentNav: subCurrent,
      })
      _this.getPageData(); // 获取页面数据
    }
  },
  /**
   * 设置文档列表高度
   */
  setListHeight() {
    let systemInfo = wx.getSystemInfoSync(),
      rpx = systemInfo.windowWidth / 750, // 计算rpx
      tapHeight = Math.floor(rpx * 98), // tap高度
      scrollHeight = systemInfo.windowHeight - tapHeight; // swiper高度
    this.setData({
      scrollHeight
    });
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
      title: _this.data.arctypeInfo.typename,
      path: "/pages/archives/product/list?" + params
    };
  },
  /**
   * 分享到朋友圈
   */
  onShareTimeline() {
    let _this = this;
    return {
      title: _this.data.arctypeInfo.typename,
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
})