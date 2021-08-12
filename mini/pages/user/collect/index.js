
const App = getApp();

const func = require('../../../utils/func');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    page:1,
    no_more:false,
    isLoading: true, // 是否正在加载中
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
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
     page = page || 1;
		App._requestApi(_this, App.globalData.config.apiGetCollectListUrl, {
			pagesize: 5, 
			page: page,
		}, function (res) {
			if (res.code == 1) {
        if (isPage == true) {
          let dataList = _this.data.list;
          _this.setData({
            'list.data': dataList.data.concat(res.data.list.data),
            isLoading: false
          });
        } else {
          let list = res.data.list;
          _this.setData({
            list,
            isLoading: false
          });
        }
			} else {
				App.showError(res.data.msg, function () {
					wx.navigateBack({
						delta: 1
					})
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
   * 页面相关事件处理函数--监听用户下拉动作
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
   * 页面上拉触底事件的处理函数
   */
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
		_this.getPageData(true, ++_this.data.page);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  jumpView(e) {
		func.jumpView(e)
	},
  cancelCollect(e){
    let _this = this,
    aid = e.currentTarget.dataset.aid,
    index = e.currentTarget.dataset.index,
    arr = _this.data.list;
			  App._requestPost(_this,App.globalData.config.apiGetCollectUrl, {
			    aid: aid
			  }, result => {
			    if (result.code === 1) {
            arr.data.splice(index,1);
            this.setData({
              list: arr
            })
			    } else {
			      App.showError(result.msg);
			    }
			  },
			  false,
			  function() {
			    wx.hideLoading();
			  });
  }
})