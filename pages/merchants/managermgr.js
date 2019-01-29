var app = getApp()
import Store from '../../comm/Store.js'
import TimeConverter from '../../comm/TimeConverter.js'

Page({
  data: {
    storeId: 0,
    storeName: "",
		version:'',
		mgrList:[]
  },
  onLoad: function(options) {
		this.data.storeId = options.storeId
    this.setData({
      storeName: options.storeName,
			version:app.VERSION()
    })
  },
  onShow: function() {
		this.loadAdminList()
  },
	loadAdminList(){
		Store.ListAdmin({
			user_id: app.USER_ID(),
			store_id: this.data.storeId
		}).then(r => {
			console.log('Store.ListAdmin => ', r)
			if (r.code == 200 && r.data.length>0) {
					this.data.mgrList= r.data.map(u => {
						u.addtime = TimeConverter.ToLocal(u.addtime)
						if(u.userInfo){
							u.userInfo.user_phone = u.userInfo.user_phone || "未绑定手机"
						}else{
							u.userInfo = {
								user_phone:'未绑定手机'
							}
						}
						return u
					})
			}else{
				this.data.mgrList = []
			}
			this.setData({
				mgrList: this.data.mgrList
			})
		})
	},
  scanQR: function(e) {
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
				let params = res.result.split('?')[1].split('&') //-- id=1&idx=1&rd=1
				let uid = params[0].split('=')[1]
				console.log(`wx.scanCode => uid:${uid}`)
				if(uid && uid>0){
					Store.SetAdmin({
						id: 0,
						store_id: this.data.storeId,
						user_id: uid,
						shop_limit: 10,
						recom_limit: 10,
						news_limit: 10,
						notice_limit: 10,
						poster_limit: 10,
						member_limit: 10,
						order_limit: 10,
						confirm: 1
					}).then(r=>{
						console.log('Store.SetAdmin => ',r)
						if(r.code == 200){
							app.SUCCESS(r.message)
						}else{
							app.ERROR(r.message)
						}
					})
				}else{
					app.ERROR('无效的二维码')
				}
      }
    })
  },
	removeOneMgr(e){
		app.CONFIME("确定要移除吗？",()=>{
			Store.DeleteAdmin({
				user_id: e.currentTarget.dataset.uid,
				store_id: this.data.storeId
			}).then(r => {
				if (r.code == 200) {
					app.msg(r.message)
					this.loadAdminList()
				} else {
					app.ERROR(r.message)
				}
			})
		})
	}
})