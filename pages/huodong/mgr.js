var app=getApp()
import Activity from '../../comm/Activity.js'
import TimeConverter from '../../comm/TimeConverter.js'
Page({
	data: {
		storeName: '',
		storeId: 0,
		version: '',
		activityObj:{
			id:0,
			store_id:0,
			act_name:'初始化的活动，请配置...',
			act_describe:'',
			act_img:'',
			act_start:'',
			act_end:'',
			act_type: 0,
			act_price: 0,
			act_old_price: 0,
			buy_num: 2, //-- 第几件
			buy_discount: 8.8, //-- 打几折
			attain_money: 100, //-- 满多少
			subtract_money: 10 //-- 减多少
		},
		activities:[]
	},
	toAwards(e){
		const { id } = e.currentTarget.dataset
		wx.navigateTo({
			url: `/pages/huodong/awards?id=${id}&storeId=${this.data.storeId}&storeName=${this.data.storeName}`,
		})
	},
	toDetail(e){
		const {id} = e.currentTarget.dataset
		wx.navigateTo({
			url: `/pages/huodong/edit?id=${id}&storeId=${this.data.storeId}&storeName=${this.data.storeName}`,
		})
	},
	toContents(e) {
		const { id } = e.currentTarget.dataset
		wx.navigateTo({
			url: `/pages/huodong/contents?id=${id}&storeId=${this.data.storeId}&storeName=${this.data.storeName}`,
		})
	},
	onShowSet(e){
		const {idx} = e.currentTarget.dataset
		let { activities, storeId} = this.data
		let item = {...activities[idx]}
		let on_show = 1-item.on_show
		Activity.IsShowActivity({
			store_id: storeId,
			user_id:app.USER_ID(),
			act_id:item.id,
			on_show
		}).then(r=>{
			if(r.code==200){
				activities[idx].on_show = on_show
				this.setData({
					activities
				})
			}else{
				app.ERROR(r.message)
			}
		})
	},
	hanldeDeleteAct(e){
		const { id } = e.currentTarget.dataset
		app.CONFIME('活动删除后不可恢复，确定删除吗？',()=>{
			Activity.DeleteActivity({
				user_id: app.USER_ID(),
				store_id: this.data.storeId,
				act_id: id
			}).then(r => {
				if (r.code == 200) {
					app.SUCCESS(r.message, this.getActivities)
				} else {
					app.ERROR(r.message)
				}
			})
		})
	},
	onLoad(options) {
		this.setData({
			storeName: options.storeName,
			version: app.VERSION(),
			storeId: options.storeId
		})
	},
	onShow() {
		this.getActivities()
	},
	getActivities(){
		const { storeId } = this.data
		Activity.ShowActivityList({
			user_id:app.USER_ID(),store_id:storeId
		}).then(r=>{
			let activities = []
			if(r.code==200){
				activities = [...r.data]
			}
			this.setData({
				activities
			})
		})
	},
	handleInitActivityObj(){
		let {activityObj} = this.data
		delete activityObj.id
		activityObj.user_id = app.USER_ID()
		activityObj.store_id = this.data.storeId
		activityObj.act_start = TimeConverter.GetToday()
		activityObj.act_end = TimeConverter.GetYearLatterToday()
		Activity.AddOrModeActivity(activityObj)
		.then(r=>{
			if(r.code==200){
				app.SUCCESS('初始化成功，请完善活动配置！', () => this.handleInitActivityAward(r.data))

			}else{
				app.ERROR(`初始化失败：${r.message}`)
			}
		})
	},
	handleInitActivityAward(act_id){
		Activity.AddOrModeActivityAward({
			store_id:this.data.storeId,
			user_id:app.USER_ID(),
			act_id,
			award_type:15,
			award_object:0
		}).then(r=>{
			this.getActivities()
		})
	}

})