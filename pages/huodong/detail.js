import Activity from '../../comm/Activity.js'
var app = getApp()
Page({
	data: {
		act_id:0,
		store_id:0,
		higher_up:0,
		version: '',
		activityObj:{}
	},
	onLoad: function (options) {
		/**老版本 */
		if (options.q) {
			let link = decodeURIComponent(options.q);
			let params = link.split('?')[1].split('&') //-- id=1&idx=1&rd=1
			let id = params[0].split('=')[1]
			let rd = params[1].split('=')[1]
			let st = params[2].split('=')[1]

			options['id'] = id || 0
			options['higher_up'] = rd || 0
			options['store_id'] = st || 0
		}
		/**新版本 */
		if (options.scene) {
			let link = decodeURIComponent(options.scene);
			let params = link.split('&')
			let id = params[0].split('=')[1]
			let rd = params[1].split('=')[1]
			let st = params[2].split('=')[1]

			options['id'] = id || 0
			options['higher_up'] = rd || 0
			options['store_id'] = st || 0
		}

		this.data.higher_up = options.higher_up || 0
		this.data.act_id = options.id || 0
		this.data.store_id = options.store_id

		this.setData({
			version: app.VERSION()
		})

		wx.showShareMenu({
			withShareTicket: true
		})
	},
	onShow: function () {
		app.HIGHER_UP(this.data.higher_up)
		if (!app.USER()) {
			app.globalData.bkPage = this.route
			wx.navigateTo({
				url: `/pages/index/index?id=${this.data.act_id}&higher_up=${this.data.higher_up}`,
			})
		} else {
		this.showActivityInfoAtView()
		}
	},
	showActivityInfoAtView() {
		let user_id = app.USER_ID()
		const { store_id,act_id} = this.data
		Activity.ShowActivityInfoAtView({ user_id, act_id, store_id})
			.then(r => {
				console.log('Activity.ShowActivityInfoAtView => ', r)
				let activityObj = {}
				if(r.code==200){
					let { act_img}= r.data					
					activityObj = { ...r.data }
					if(act_img.length>0){
						activityObj.act_img = act_img.split(',')
					}
				}
				this.setData({
					activityObj
				})
			})
	},
	onShareAppMessage: function () {
		const {act_id,store_id} = this.data

		let title = `${app.USER().nick_name}向您推荐【${this.data.activityObj.act_name}】！更多优惠尽在58热网`

		let path = `/pages/huodong/detail?id=${act_id}&higher_up=${app.USER_ID()}&store_id=${store_id}`
		return {
			title,
			path,
			imageUrl: this.data.activityObj.act_img[0] || '',
			success: res => {
				console.log('ShareAppMessage.res => ', res)
				this.hideShareBox()
			}
		}
	}
})