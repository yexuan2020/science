
import setting from './setting.js';

const accountInfo = wx.getAccountInfoSync();
let appId = accountInfo.miniProgram.appId; // 小程序appid
let domain = setting.domain; // 网站域名
let root_dir = setting.root_dir; // 子目录
let tabbar = setting.tabbar;

// http与https网站的接口处理
let getApiUrl = function(act, clt, mdu) {
	mdu = mdu || 'api';
	clt = clt || 'Api';
	let url = '';
	if (domain) {
		let domainArr = domain.split("/");
		if (domainArr[domainArr.length - 1].length == 0) {
			domain = domain.slice(0, -1);
		}
	}
	if (root_dir) {
		let rootDirArr = root_dir.split("/");
		if (rootDirArr[rootDirArr.length - 1].length == 0) {
			root_dir = root_dir.slice(0, -1);
		}
		if (rootDirArr[0].length != 0) {
			root_dir = root_dir = '/' + root_dir;
		}
	}
	url = `${domain}${root_dir}/index.php?m=${mdu}&c=v2.${clt}&a=${act}&_ajax=1`;
	return url;
}

let config = {
	// 底部导航菜单
	tabbar,
	// 小程序appid
	appId,
	// 首页api地址
	apiIndexUrl: getApiUrl('index'),
	// 文档列表api地址
	apiListUrl: getApiUrl('archivesList'),
	// 文档详情页api地址
	apiViewUrl: getApiUrl('archivesView'),
	// 会员中心
	apiUsersdetailUrl: getApiUrl('users_detail'),
	// 用户登录
	apiUsersloginUrl: getApiUrl('users_login'),
	// 收藏/取消收藏
	apiGetCollectUrl: getApiUrl('get_collect', 'Users'),
	// 我的收藏列表
	apiGetCollectListUrl: getApiUrl('get_collect_list', 'Users'),
	// 上传头像
	userUploadHeadPicUrl: getApiUrl('upload_head_pic'),
	// 保存用户信息
	userSaveUserInfoUrl: getApiUrl('save_user_info', 'Users'),
	// 账户明细
	userAccountListsUrl: getApiUrl('account_lists', 'Users'),
	// 充值中心
	userRechargeUrl: getApiUrl('recharge', 'Users'),
	// 充值明细
	userRechargeListsUrl: getApiUrl('recharge_lists', 'Users'),
	// 升级VIP
	userUpgradeUrl: getApiUrl('upgrade', 'Users'),
	// 升级明细
	userUpgradeListsUrl: getApiUrl('upgrade_lists', 'Users'),
  // 订单支付后续操作
  userOrderPayDealWithUrl: getApiUrl('order_pay_deal_with', 'Users'),
	// 文章付费支付
	userArticlepayUrl: getApiUrl('articlepay', 'Users'),
	// 已购文章列表
	userArticlepayListsUrl: getApiUrl('articlepay_lists', 'Users'),
	// 视频付费支付
	userVideopayUrl: getApiUrl('videopay', 'Users'),
	// 已购视频列表
	userVideopayListsUrl: getApiUrl('videopay_lists', 'Users'),
};

module.exports = config