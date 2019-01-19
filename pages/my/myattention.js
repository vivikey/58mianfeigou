var app = getApp()
import UserCenter from '../../comm/UserCenter.js'
Page({
  data: {
		type: 0, //-- 1.我的关注 2.我的收藏 3.会员店铺
    title: '',
    storeList: [],
    shopList: [],
		memberStores:[],
    emptymsg: '',
    isempty: true,
    version: ''
  },
  onLoad(options) {
		this.data.type = options.type
		this.data.version = app.VERSION()
  },
  onShow() {
		this.setData({
			type : this.data.type,
			version:this.data.version
		},this.getData)
	},
	getData(){
		if (this.data.type == 1) {
			this.setData({
				title: "我关注的商铺",
				emptymsg: '您还没有关注任何商铺哦~'
			})
			wx.setNavigationBarTitle({
				title: '关注的商铺'
			})
			this.getMyAttention()
		}

		if (this.data.type == 2) {
			this.setData({
				title: "我收藏的商品",
			})
			wx.setNavigationBarTitle({
				title: '收藏的商品'
			})
			this.getMyCollect()
		}

		if (this.data.type == 3) {
			this.setData({
				title: "我是会员的商铺",
			})
			wx.setNavigationBarTitle({
				title: '我的会员商铺'
			})
			this.getMyMemberStores()
		}
	},
	/**获取我的收藏 */
  getMyCollect() {
		UserCenter.CollectList({user_id:app.USER_ID()}).then(r=>{
			console.log('UserCenter.CollectList => ',r)
			if(r.code==200){
				this.setData({
					shopList: r.data,
					isempty: r.data.length <= 0
				})	
			}
		})
  },
	/**获取我的关注 */
  getMyAttention() {
		UserCenter.AttentList({ user_id: app.USER_ID() }).then(r => {
			console.log('UserCenter.StoreList => ', r)
			if(r.code==200){
				this.setData({
					storeList:r.data,
					isempty:r.data.length<=0
				})
			}
		})
  },
	/**获取我的会员商铺 */
	getMyMemberStores() {
		UserCenter.MemberStores({ user_id: app.USER_ID() }).then(r => {
			console.log('UserCenter.StoMemberStoresreList => ', r)
			if (r.code == 200) {
				this.setData({
					memberStores: r.data,
					isempty: r.data.length <= 0
				})
			}
		})
	}
})