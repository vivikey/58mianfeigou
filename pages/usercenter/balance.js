var app = getApp()
import UserCenter from '../../comm/UserCenter.js'
import TimeConverter from '../../comm/TimeConverter.js'
Page({
  data: {
    version: '',
    type: 1,
    user: {},
    list: []
  },
  onLoad(options) {
    this.setData({
      type: options.type || 1
    })
  },
  //-- 切换类型
  onChangeType(e) {
    this.setData({
      type: e.currentTarget.id
    }, () => {
      this.loadData(e.currentTarget.id)
    })
  },
  onShow() {
    this.setData({
      version: app.VERSION()
    }, () => {
      this.loadData(this.data.type)
    })

  },
  loadData(type) {
    UserCenter.Get({
      user_id: app.USER_ID()
    }).then(r => {
      console.log('UserCenter.Get => ', r)
      if (r.code == 200 && r.data.user.user_img) {
        let user = r.data.user
        if (r.data.higher) {
          user.higher = r.data.higher
        } else {
          user.higher = null
        }
        user.member = r.data.member
        this.setData({
          user: user,
        })
      }

      if (type == 1) {
        this.loadMemberMoneyList()
      }

      if (type == 2) {
        this.loadMemberAwardList()
      }
    })
  },
  /**加载余额明细 */
  loadMemberMoneyList() {
    UserCenter.MemberMoneyList({
      user_id: this.data.user.id
    }).then(r => {
      console.log('UserCenter.MemberMoneyList => ', r)
			let list = []
			if(r.code==200){
				list = r.data.map(u=>{
					u.addtime = TimeConverter.ToLocal(u.addtime)
					u["money_type_name"] = u.money_type == 1 ? "推广费" : "充值"
					return u
				})
			}
			this.setData({
				list:list
			})
    })
  },
  /**加载推广费明细 */
  loadMemberAwardList() {
    UserCenter.MemberAwardList({
      user_id: this.data.user.id
    }).then(r => {
      console.log('UserCenter.MemberAwardList => ', r)
			let list = []
			if (r.code == 200) {
				list = r.data.map(u => {
					u.addtime = TimeConverter.ToLocal(u.addtime)
					u["money_type_name"] = u.award_type==1?"推广费":"充值"
					u.money = u.award_money

					return u
				})
			}
			this.setData({
				list: list
			})
    })
  }
})