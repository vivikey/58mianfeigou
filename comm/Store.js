import $ from 'request.js'
import regeneratorRuntime from 'regenerator-runtime.js'
/**
 * 商铺
 */
let obj = {
  Get() {
    return '/api/showapi/showStoreInfo'
  },
  Post() {
    return '/api/addapi/storeHandle'
  },
  Delete() {
    return '/api/Deleteapi/delStore'
  },
  List() {
    return '/api/showapi/showStoreList'
  },
  ScanQr() {
    return '/api/Purchaseapi/storeOrderFinish'
  },
  OrderList() {
		return '/api/showapi/showStoreOrderList'
	}, 
	ExpressList() {
		return '/api/showapi/showExpressCompany'
	},
	AddExpress() {
		return '/api/addapi/storeAddExpress'
	},
	AddFTxt() {
		return '/api/addapi/addModeAdContent'
	},//-- 添加修改富文
	GetFTxt() {
		return '/api/addapi/showAdInfo'
	},//-- 富文详情
	DelFTxt() {
		return '/api/Addapi/delAd'
	},//-- 详情
	SetAdmin() {
		return '/api/Addapi/addOrModeStoreAdmin'
	},//-- 设置管理员
	ListAdmin() {
		return '/api/Addapi/showStoreAdmin'
	},//-- 管理员列表
	DeleteAdmin() {
		return '/api/Addapi/delStoreAdmin'
	},//-- 移除管理员
	ShowStoreCashPledge() {
		return '/api/Purchaseapi/showStoreCashPledge'
	},//-- 显示店铺保证金的费用
	PayStoreCashPledge() {
		return '/api/Purchaseapi/payStoreCashPledge'
	},//-- 选择对应的保证金费用进行支付
	ShowCouponInfo() {
		return '/api/coupon/couponShowInfo'
	},//-- 显示店铺优惠券详情
	CouponAdd() {
		return '/api/coupon/couponAdd'
	},//-- 添加优惠券
	CouponMode() {
		return '/api/coupon/couponMode'
	},//-- 修改优惠券
	CouponList() {
		return '/api/coupon/couponShowList'
	},//-- 显示店铺优惠券列表
	CouponGroupList() {
		return '/api/coupon/combinationCouponList'
	},//-- 显示店铺组合券列表
	CouponGroupSet() {
		return '/api/coupon/combinationCouponAdd'
	},//-- 店铺设置组合券
	CouponGroupSetCoupons() {
		return '/api/coupon/combinationCouponListAdd'
	},//-- 设置组合券中优惠券
	CouponGroupMode() {
		return '/api/coupon/combinationCouponMode'
	},//-- 修改组合券
	CouponGroupInfo() {
		return '/api/coupon/combinationCouponInfo'
	},//-- 显示店铺组合券详情
	CouponGroupDelete() {
		return '/api/coupon/combinationCoupondelete'
	},//-- 删除组合券
	LuckyMoneyAdd() {
		return '/api/Redpackets/storeAddRed'
	},//-- 设置新的红包
	LuckyMoneyUpdate() {
		return '/api/Redpackets/storeModeRed'
	},//-- 修改更新红包
	LuckyMoneyList() {
		return '/api/Redpackets/storeRedList'
	},//-- 显示店铺红包列表
	LuckyMoneyInfo() {
		return '/api/Redpackets/storeRedInfo'
	},//-- 显示店铺红包详情
	OpenLuckyMoney() {
		return '/api/Redpackets/userGetRed'
	},//-- 用户领取红包
	LuckyMoneyInfoAtView() {
		return '/api/Redpackets/storeRedInfoAtView'
	},//-- 店铺红包详情-前台使用
	ShareStoreRedInfoAtView() {
		return '/api/Redpackets/shareStoreRedInfoAtView'
	},//-- 选择用户分享红包详情
	async Do(data, showLoadding = true) {
		return await new Promise((resolve, reject) => {
			$.Post(this.url, data, r => {
				resolve(r.data)
			}, null, showLoadding)
		})
	}
}

const Store = new Proxy(obj, {
  get(target, property) {
    target.url = target[property]()
    return target.Do.bind(target)
  }
})

export default Store