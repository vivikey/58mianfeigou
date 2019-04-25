var app = getApp()
import UserCenter from '../../comm/UserCenter.js'
import TimeConverter from '../../comm/TimeConverter.js'
Page({
  data: {
    list: [],
    version: '',
    type: 2,
  },
  onLoad: function(options) {

  },
  //-- 切换类型
  onChangeType(e) {
    this.data.type = e.currentTarget.id
    this.loadRecommendAwardList()
    this.setData({
      type: this.data.type
    })
  },
  onShow: function() {
    this.setData({
      version: app.VERSION()
    })
    this.loadRecommendAwardList()
  },
  /**加载推荐有奖列表 */
  loadRecommendAwardList() {
    let list = []
    UserCenter.RecommendAwardList({
      user_id: app.USER_ID(),
      award_type: this.data.type //-- 1:赠品 2：奖励
    }).then(r => {
      console.log('UserCenter.RecommendAwardList => ', r)
      if (r.code == 200) {

        if (this.data.type == 2) {
          list = r.data.map(u => {
            u.addtime = TimeConverter.ToLocal(u.addtime)
            return u
          })
        }

        if (this.data.type == 1) {
          list = r.data.map(u => {
            u.addtime = TimeConverter.ToLocal(u.addtime)
						u.is_get = u.is_get || 0
						u.store_info.transport_cost = u.store_info.transport_cost || 0
            return u
          })
        }
      }
      this.data.list = list
      this.setData({
        list: this.data.list,
      })
    })
  },
	onTakeRecommendAwardPresentPay(e){
		UserCenter.TakeRecommendAwardPresent({
			user_id: app.USER_ID(),
			award_id: e.currentTarget.id
		}).then(r => {
			console.log('UserCenter.TakeRecommendAwardPresent => ', r)
			if (r.code == 200) {
				wx.navigateTo({
					url: `/pages/orders/orderdetail?id=${r.data.id}`,
				})
			} else {
				app.ERROR(r.message)
			}
		})
	},
	onTakeRecommendAwardPresent(e){
		UserCenter.TakeRecommendAwardPresent({
			user_id:app.USER_ID(),
			award_id: e.currentTarget.id
		}).then(r=>{
			console.log('UserCenter.TakeRecommendAwardPresent => ',r)
			if(r.code == 200){
				app.SUCCESS(r.message, this.loadRecommendAwardList)
			}else{
				app.ERROR(r.message)
			}
		})
	}
})