var app = getApp()
import MemberMgr from '../../comm/MemberMgr.js'
Page({
  data: {
    version: '',
    storeName: '',
    storeId: 0,
		members:[],

  },
	onConfiem(){
		app.CONFIME("确认之后将无法再更改，确定吗？",()=>{
			MemberMgr.ConFirm({user_id:app.USER_ID(),store_id:this.data.storeId})
			.then(r=>{
				console.log('MemberMgr.ConFirm => ',r)
				if (r.code == 200) {
					app.SUCCESS(r.message, this.listGrades)
				} else {
					app.ERROR(r.message)
				}
			})
		})
	},
	onDelete(e){
		app.CONFIME("确定删除当前会员级别吗？", () => {
			MemberMgr.Delete({ user_id: app.USER_ID(), store_gradeId:e.currentTarget.dataset.id })
				.then(r => {
					console.log('MemberMgr.Delete => ', r)
					if(r.code==200){
						app.SUCCESS(r.message,this.listGrades)
					}else{
						app.ERROR(r.message)
					}
				})
		})
	},
  onLoad(options) {
    this.data.storeName = options.storeName
    this.data.storeId = options.storeId
  },
  onShow() {
		this.setData({
			storeName: this.data.storeName,
			storeId: this.data.storeId,
			version: app.VERSION(),
		})
    this.listGrades()
  },
	/**列表所有会员级别 */
	listGrades(){
		MemberMgr.List({user_id:app.USER_ID(),store_id:this.data.storeId})
		.then(r=>{
			console.log('MemberMgr.List => ',r)
			if(r.code==200){
				this.data.members = r.data
			}else{
				this.data.members = []
			}
			this.setData({
				members: this.data.members
			})
		})
	}
})