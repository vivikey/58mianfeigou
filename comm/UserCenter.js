import $ from 'request.js'
import regeneratorRuntime from 'regenerator-runtime.js'
/**
 * 用户中心
 */
let obj = {
  Get() {
		return '/api/showapi/personalCenterIndex'
  }, //-- 获取用户信息
	AttentList() {
		return '/api/showapi/personalCenterAttentList'
	}, //-- 商铺关注列表
	CollectList() {
		return '/api/showapi/personalCenterCollectList'
	}, //-- 商品收藏列表
	SettedCount() {
		return '/api/showapi/personalCenterShowUserSetting'
	}, //-- 商品收藏列表
	MemberStores() {
		return '/api/Purchaseapi/showStoreMemberList'
	}, //-- 会员商铺列表
	MemberMoneyList() {
		return '/api/showapi/personalCenterShowMemberMoney'
	}, //-- 显示用户的余额列表
	MemberAwardList() {
		return '/api/showapi/personalCenterShowMemberAward'
	}, //-- 显示用户的余额列表
	RecommendAwardList() {
		return '/api/Purchaseapi/showRecommendAwardList'
	}, //-- 显示用户的推荐奖励列表
	TakeRecommendAwardPresent() {
		return '/api/Purchaseapi/userTakeRecommendAwardPresent'
	}, //-- 领取推荐有奖的赠品
	RecommendAwardPresentInfo() {
		return '/api/Purchaseapi/showRecommendAwardPresentInfo'
	}, //-- 显示推荐有奖赠品的详情 user_id store_id recommend_id offline_group_sn
	UserCouponShowList() {
		return '/api/coupon/userCouponShowList'
	}, //-- 显示用户领取的优惠券列表
	UserLuckyMoneyList() {
		return '/api/Redpackets/showUserGetRed'
	}, //-- 显示用户领取的红包
	async Do(data, showLoadding = true) {
		return await new Promise((resolve, reject) => {
			$.Post(this.url, data, r => {
				resolve(r.data)
			}, null, showLoadding)
		})
	}
}

const UserCenter = new Proxy(obj, {
  get(target, property) {
    target.url = target[property]()
    return target.Do.bind(target)
  }
})

export default UserCenter