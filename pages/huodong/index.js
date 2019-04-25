import Activity from '../../comm/Activity.js'
var app=getApp()
Page({
	data: {
		version:'',
		activityList:[]
	},
	onLoad: function (options) {
		this.setData({
			version:app.VERSION()
		})
	},
	onShow: function () {
		this.showActivityList()
	},
	showActivityList(){
		let user_id = app.USER_ID()
		Activity.ShowActivityListAtView({user_id})
		.then(r=>{
			console.log('Activity.ShowActivityListAtView => ',r)
			let activityList = []
			if(r.code==200 && r.data.length>0){
				activityList = [...r.data.map(u=>{
					const {act_img} = u
					if(act_img.length>0){
						u.act_img = act_img.split(',')
					}else{
						u.act_img = []
					}
					return u
				})]
			}
			this.setData({
				activityList
			})
		})
	},
	onReachBottom: function () {

	},
	onShareAppMessage: function () {
		
	}
})