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