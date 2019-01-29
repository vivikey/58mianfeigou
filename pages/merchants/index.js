import StoreObj from '../../utils/util.js'
import Store from '../../comm/Store.js'
import TimeConverter from '../../comm/TimeConverter.js'
var app = getApp()
Page({
  data: {
    version: '',
    user: {},
		storeCashPledgeList:[],
    userInfo: {},
    storeList: [],
		knowok:true,
		know:`（1）、入驻平台商家需要缴纳保证金。保证金金额为1000元。店铺与平台每年签约一次，1年后可以申请退出平台并返还保证金。
（2）、商家在店铺后台发布产品，结合店铺功能设计合适的推广模式。需要联盟会员推广的产品应设置好各个产品的推广费。推广费按件计算而不是按次来计算。
（3）、买家购物款一般在7天后进入平台中相应店铺账户，可以随时提现。
（4）、根据国家电商法的规定，所有店铺应具有营业执照和法人身份证明，包含有有特许经营的行业或者产品、服务需要上传相应的特许经营许可证。所经营内容不得超出营业执照的范围，不得从事各种违法违纪业务。`
  },
	onCheckClick(){
		this.setData({
			knowok: !this.data.knowok
		})
	},
  onLoad(options) {
    this.setData({
      version: app.VERSION(),
      user: app.globalData.user,
      userInfo: app.globalData.userInfo
    })
  },
	onNoVAS(){
		app.msg("未开通该增值服务!")
	},
  initData() {
    Store.List({
      user_id: app.USER_ID()
    }).then(res => {
      console.log('Store.List =>', res)
      if (res.code === 200) {
        this.setData({
          storeList: res.data.map(u => {
            u.addtime = TimeConverter.ToLocal(u.addtime)
						u.showopt = u.store_check == 1 && u.cash_pledge_pay > 0.00
            return u
          })
        })
      } else {
        app.ERROR(`StoreManage.LIST:${res.message}`)
      }
    })
  },
  onShow() {
    this.initData()
  },
	/**选择保证金 */
	onChosedStreCashPledge(e){
		let store_id = e.currentTarget.dataset.sid
		Store.ShowStoreCashPledge({user_id:app.USER_ID()},false)
		.then(r=>{
			console.log('Store.ShowStoreCashPledge => ',r)
			let list = []
			if(r.code==200 && r.data.length>0){
				r.data.forEach(u=>{
					if(u.start_use == 1){
						list = [...list, `${u.store_area},${u.store_area_name},${u.pay_fee}`]
					}
				})
			}
			this.setData({
				storeCashPledgeList:list
			},()=>{
				wx.showActionSheet({
					itemList: this.data.storeCashPledgeList,
					success:(res)=> {
						console.log(res.tapIndex)
						this.payStoreCashPledge(this.data.storeCashPledgeList[res.tapIndex], store_id)
					},
					fail(res) {
						console.log(res.errMsg)
					}
				})
			})
		})
	},
	/** 缴费保证金 */
	payStoreCashPledge(item, store_id){
		let [store_area, store_area_name, pay_money] = item.split(',')
		Store.PayStoreCashPledge({
			user_id:app.USER_ID(),
			store_id, store_area, pay_money
		},false).then(r=>{
			console.log('Store.PayStoreCashPledge => ',r)
			if (r.code == 200) { //-- 微信支付
				this.useWeChatPay(r.data)
			} else {
				app.ERROR(r.message)
			}
		})
	},
	/**微信支付 */
	useWeChatPay(obj) {
		wx.requestPayment({
			'timeStamp': obj.timeStamp.toString(),
			'nonceStr': obj.nonceStr,
			'package': obj.package,
			'signType': obj.signType,
			'paySign': obj.paySign,
			'success': res => {
				app.msgbox({
					content: '支付成功',
					showCancel: false,
					success: d => {
						this.initData()
					}
				})
			},
			'fail': res => {
				var msg = '支付失败:';
				if (res.err_desc) {
					msg = msg + res.err_desc
				}
				if (res.errMsg && res.errMsg.indexOf('cancel') > 0) {
					msg = msg + '取消支付'
				}
				app.msgbox({
					content: msg,
					showCancel: false,
					success: d => {					
					}
				})
			}
		})
	},
  //-- 删除商铺
  delStore(e) {
    app.CONFIME("商铺删除后不能恢复，确定删除该商铺吗？", () => {
      Store.Delete({
        user_id: app.USER_ID(),
        store_id: e.currentTarget.id
      }).then(r => {
        if (r.code === 200) {
          app.SUCCESS(r.message, this.initData())
        } else {
          app.ERROR(r.message)
        }
      })
    })
  },
  //-- 转入信息编辑
  editStore(e) {
    wx.navigateTo({
      url: `/pages/merchants/info?id=${e.currentTarget.id}`,
    })
  },
  //-- 转至商铺展示首页
  toStoreHome(e) {
    wx.navigateTo({
      url: `/pages/store/detail?id=${e.currentTarget.id}`,
    })
  }
})