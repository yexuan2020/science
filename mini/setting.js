
let domain = 'http://127.0.0.1'; // 网站域名，目前仅支持https
let root_dir = ''; // 子目录，比如：/sub
// let mobile = '13888888888'; // 客服电话

// 底部导航菜单
let tabbar = {
    selected: -1, // 默认选中位置
    color: "#666666", // 文字默认颜色
    selectedColor: "#ff9900", // 文字选中时的颜色
    backgroundColor: "#FFFFFF", // 背景色
    borderStyle: "#000000", // 边框的颜色
    list: [{
        text: "首页",
        pagePath: "/pages/index/index",
        iconPath: "/static/images/tabBar/home.png",
        selectedIconPath: "/static/images/tabBar/home-active.png"
      },
      {
        text: "免费",
        pagePath: "/pages/archives/article/list?typeid=1",
        iconPath: "/static/images/tabBar/news.png",
        selectedIconPath: "/static/images/tabBar/news-active.png"
      },
      {
        text: "付费",
        pagePath: "/pages/archives/article/list?typeid=2",
        iconPath: "/static/images/tabBar/product.png",
        selectedIconPath: "/static/images/tabBar/product-active.png"
      },
      {
        text: "视频",
        pagePath: "/pages/archives/media/list?typeid=11",
        iconPath: "/static/images/tabBar/product.png",
        selectedIconPath: "/static/images/tabBar/product-active.png"
      },
      {
        pagePath: "/pages/user/index",
        text: "我的",
        iconPath: "/static/images/tabBar/user.png",
        selectedIconPath: "/static/images/tabBar/user-active.png"
    }
  ]
};

let setting = {
  domain, // 网站域名
  root_dir, // 子目录
  tabbar, // 底部导航菜单
  // mobile,
};

module.exports = setting