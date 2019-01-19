var app = getApp()
import MemberMgr from '../../comm/MemberMgr.js'
Page({
  data: {
    version: '',
    store_id: 0,
    shopList: [],
    memberTypes: [{
      val: 1,
      cap: '无门槛'
    }, {
      val: 2,
      cap: '购买商品'
    }, {
      val: 3,
      cap: '消费满额'
    }, {
      val: 4,
      cap: '充值满额'
    }],
    memberPower: [{
      val: 1,
      chosed: true,
      cap: '领取赠品'
    }, {
      val: 2,
      chosed: true,
      cap: '获得推荐奖励'
    }],
    mGrade: {
      store_id: 45,
      grade: 0,
      grade_name: '',
      member_type: 3, //（0：无门槛，1：只要购买了本店铺中的任一商品3：消费多少4、充值多少）
      member_money: 1000, //（消费或充值的限定额）
      user_id: 78,
      id: 0 //（有即修改，无添加）
    }
  },
  onMemberPowerClick(e) {
    let index = e.currentTarget.dataset.index
    let memberPower = this.data.memberPower
    memberPower[index].chosed = !memberPower[index].chosed
    this.setData({
      memberPower: memberPower
    })
  },
  //-- 切换类型
  onMemberTypeChanged(e) {
    var mGrade = this.data.mGrade;
    mGrade.member_type = e.currentTarget.dataset.val
    this.setData({
      mGrade: mGrade
    })
  },
  onInputChanged(e) {
    var mGrade = this.data.mGrade;
    mGrade[e.currentTarget.id] = e.detail.value;
    this.setData({
      mGrade: mGrade
    })
  },
  onSubmit() {
    if (this.data.mGrade.grade_name.length <= 0) {
      app.msg("请输入级别名称！")
      return;
    }
    MemberMgr.SetGrade(this.data.mGrade).then(r => {
      console.log('MemberMgr.SetGrade = > ', r)
      if (r.code == 200) {
        app.SUCCESS(r.message, () => {
          wx.navigateBack({
            delta: 1
          })
        })
      } else {
        app.ERROR(r.message)
      }
    })
  },
  onLoad(options) {
    console.log('MemberInfo.Page.onLoad.options => ', options)
    this.data.store_id = options.storeId || 0
    this.data.mGrade.id = options.grade_id || 0
    this.data.mGrade.store_id = options.storeId || 0
    this.data.mGrade.user_id = app.USER_ID()
    this.data.version = app.VERSION()
  },
  onShow() {
    this.setData({
      version: this.data.version
    })
    if (this.data.mGrade.id > 0) {
      let {
        user_id,
        id
      } = this.data.mGrade
      MemberMgr.Get({
        user_id,
        store_gradeId: id
      }).then(r => {
        console.log('MemberMgr.Get => ', r)
        if (r.code == 200) {
          let {
            store_id,
            grade,
            grade_name,
            member_type,
            member_money,
            user_id,
            id
          } = r.data
          this.setData({
            mGrade: {
              store_id,
              grade,
              grade_name,
              member_type,
              member_money,
              user_id,
              id
            }
          })
        } else {
          app.ERROR(r.message)
        }
      })
    }
  }
})