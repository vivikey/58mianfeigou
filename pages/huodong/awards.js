var app = getApp()
import Activity from '../../comm/Activity.js'
import Shop from '../../comm/Shop.js'
import Store from '../../comm/Store.js'
import TimeConverter from '../../comm/TimeConverter.js'
import {
  awardType,
  awardObject
} from './awardType.js'
Page({
  data: {
    store_id: 0,
    shopList: [],
    shopListIdx: 0,
    couponsList: [],
    luckyMoneyList: [],
    awardType: [],
    awardObject: [],
    awardObjectIdx: 0,
    couponsListIdx: 0,
    activityObj: {},
    showPopupWnd: false,
    popupWndData: {
      title: '现金奖励配置',
      submitText: '确定',
      inputData: [{
        key: 'award_money_min',
        value: 0,
        caption: '奖励最小值'
      }, {
        key: 'award_money_max',
        value: 0,
        caption: '奖励最大值'
      }]
    }
  },
  handlePopupWndSubmit() {
    let award_money_min = this.data.popupWndData.inputData[0].value * 1.0,
      award_money_max = this.data.popupWndData.inputData[1].value * 1.0
    if (award_money_min < 0) {
      app.msg("奖励最小值必须是非负数！")
      return;
    }
    if (award_money_max < 0 || award_money_max < award_money_min) {
      app.msg("奖励最大值必须是大于0且大于等于最小值！")
      return;
    }

    Activity.AddOrModeActivityAwardContent({
      act_id: this.data.activityObj.id,
      award_id: this.data.activityObj.award.id,
      store_id: this.data.store_id,
      award_type: 1,
      award_content_id: 0,
      award_content_num: 0,
      award_money_min,
      award_money_max
    }).then(r => {
      if (r.code == 200) {
        app.SUCCESS(r.message, () => {
          this.getActivityAwards()
          this.handlePopupWndClose()
        })
      } else {
        app.ERROR(r.message)
      }
    })
  },
  onPopupInputChanged(e) {
    console.log(e)
    let {
      popupWndData
    } = this.data
    const {
      inputData
    } = popupWndData
    popupWndData.inputData = [...inputData.map(u => {
      if (u.key == e.currentTarget.id) {
        u.value = e.detail.value
      }
      return u
    })]
    this.setData({
      popupWndData
    })
  },
  handlePopupWndClose() {
    this.setData({
      showPopupWnd: false
    })
  },
  handlePopupWndOpen() {
		let idx = this.data.activityObj.award.act_award_content.findIndex(v => v.award_type == 1)
		if (idx > 0) {
			app.ERROR('已存在现金奖励！')
			return;
		}
    this.setData({
      showPopupWnd: true
    })
  },
  bindAwardObjectChange(e) {
    let {
      awardObject,
      awardObjectIdx,
      activityObj
    } = this.data
    awardObjectIdx = e.detail.value
    let {
      award_object
    } = awardObject[awardObjectIdx]
    let data = { ...activityObj.award,
      award_object,
      award_id: activityObj.award.id,
      user_id: app.USER_ID()
    }
    Activity.AddOrModeActivityAward(data)
      .then(r => {
        if (r.code == 200) {
          activityObj.award.award_object = award_object
          this.setData({
            activityObj,
            awardObjectIdx
          })
        } else {
          app.ERROR(r.message)
        }
      })

  },
  handleChangeActContentNumber(e) {
    const {
      idx,
      subb
    } = e.currentTarget.dataset
    const item = {
      ...this.data.activityObj.award.act_award_content[idx]
    }
		item.award_content_num = item.award_content_num - subb
		if (item.award_content_num<1){
			app.msg('数量不能小于1！')
			return;
		}
		item.award_con_id = item.id
    const {
			award_con_id,
      act_id,
      store_id,
			award_type,
			award_content_id,
			award_content_num
    } = item
		Activity.AddOrModeActivityAwardContent({
			award_con_id,
			act_id: this.data.activityObj.id,
			award_id: this.data.activityObj.award.id,
			store_id: this.data.store_id,
			award_type,
			award_content_id,
			award_content_num,
			award_money_min: 0,
			award_money_max: 0
		}).then(r => {
			if (r.code == 200) {
				this.getActivityAwards()
			} else {
				app.ERROR(r.message)
			}
		})

  },
	hanldeDeleteActivityAwardContent(e) {
    app.CONFIME('活动奖励删除后可重新添加，确定删除吗？', () => {
      const {
        idx
      } = e.currentTarget.dataset
      const item = { ...this.data.activityObj.award.act_award_content[idx]
      }
      const {
        store_id,
        act_id,
				award_id,
        id
      } = item
			Activity.DeleteActivityAwardContent({
				award_content_id: id,
				award_id,
        act_id,
        store_id,
        user_id: app.USER_ID()
      }).then(r => {
        if (r.code == 200) {
					app.SUCCESS(r.message, this.getActivityAwards)
        } else {
          app.ERROR(r.message)
        }
      })
    })
  },
  bindLuckyMoneyChange(e) {
    let item = {
      ...this.data.luckyMoneyList[e.detail.value]
    }
    Activity.AddOrModeActivityAwardContent({
      act_id: this.data.activityObj.id,
      award_id: this.data.activityObj.award.id,
      store_id: this.data.store_id,
      award_type: 4,
      award_content_id: item.id,
      award_content_num: 1,
      award_money_min: 0,
      award_money_max: 0
    }).then(r => {
      if (r.code == 200) {
        this.getActivityAwards()
      } else {
        app.ERROR(r.message)
      }
    })
  },
  bindCouponChange(e) {
    let item = {
      ...this.data.couponsList[e.detail.value]
    }
    Activity.AddOrModeActivityAwardContent({
      act_id: this.data.activityObj.id,
      award_id: this.data.activityObj.award.id,
      store_id: this.data.store_id,
      award_type: 3,
      award_content_id: item.id,
      award_content_num: 1,
      award_money_min: 0,
      award_money_max: 0
    }).then(r => {
      if (r.code == 200) {
        this.getActivityAwards()
      } else {
        app.ERROR(r.message)
      }
    })
  },
  bindShopChange(e) {
    let item = {
      ...this.data.shopList[e.detail.value]
    }
    Activity.AddOrModeActivityAwardContent({
      act_id: this.data.activityObj.id,
      award_id: this.data.activityObj.award.id,
      store_id: this.data.store_id,
      award_type: 2,
      award_content_id: item.id,
      award_content_num: 1,
      award_money_min: 0,
      award_money_max: 0
    }).then(r => {
      if (r.code == 200) {
        this.getActivityAwards()
      } else {
        app.ERROR(r.message)
      }
    })
  },
  onLoad(options) {
    console.log('options => ', options)
    this.data.store_id = options.storeId
    this.data.activityObj.id = options.id || 0
    this.setData({
      awardType,
      awardObject
    })
  },
  onShow() {
    let user_id = app.USER_ID()
    let store_id = this.data.store_id
    let promiseObjs = [
      Shop.List({
        user_id,
        store_id
      }),
      Store.CouponList({
        store_id
      }),
      Store.LuckyMoneyList({
        store_id,
        user_id
      })
    ]
    Promise.all(promiseObjs).then(arrayR => {
      console.log('arrayR => ', arrayR)
      let shopList = [],
        couponsList = [],
        luckyMoneyList = []
      let errMsg = '',
        errCode = 0
      let [shopListReq, couponListReq, luckyMoneyListReq] = arrayR
      if (shopListReq.code == 200) {
        shopListReq.data.forEach(item => {
          let {
            spec,
            goods_name
          } = item
          if (goods_name.length > 18) {
            goods_name = `${goods_name.substr(0, 18)}...`
          } else {
            goods_name = `${goods_name}...`
          }
          if (spec.length > 0) {
            spec.forEach(sp => {
              sp.showText = `${goods_name}${sp.spec_size}${sp.spec_color}`
              shopList.push(sp)
            })
          }
        })
      } else {
        errCode++;
        errMsg = `${errMsg}商品列表信息出错：${shopListReq.message};`
      }

      if (couponListReq.code == 200) {
        couponsList = [...couponListReq.data]
      } else {
        errCode++;
        errMsg = `${errMsg}优惠券列表信息出错：${couponListReq.message};`
      }

      if (luckyMoneyListReq.code == 200) {
        luckyMoneyList = [...luckyMoneyListReq.data]
      } else {
        errCode++;
        errMsg = `${errMsg}优惠券列表信息出错：${luckyMoneyListReq.message};`
      }

      if (errCode > 0) {
        app.ERROR(errMsg)
      }
      this.setData({
        shopList,
        couponsList,
        luckyMoneyList
      }, this.getActivityObj)

    })
  },
  onReady() {
    //this.getActivityObj()
  },
  getActivityObj() {
    let {
      activityTypeIdx,
      activityObj,
      store_id
    } = this.data
    Activity.ShowActivityInfo({
      user_id: app.USER_ID(),
      store_id,
      act_id: activityObj.id
    }).then(r => {
      if (r.code == 200) {
        activityObj = {
          ...r.data,
          award: {}
        }
      }
      this.setData({
        activityObj
      }, this.getActivityAwards)
    })
  },
  getActivityAwards() {
    Activity.ShowActivityAward({
      user_id: app.USER_ID(),
      store_id: this.data.store_id,
      act_id: this.data.activityObj.id
    }).then(r => {
      console.log('Activity.ShowActivityAward => ', r)
      if (r.code == 200) {
        let {
          activityObj,
          awardObjectIdx,
          awardObject
        } = this.data
        let act_award_content = r.data.act_award_content.map(u => {
          if (u.award_type == 2) {
            let goods = { ...u.goods
            }
            let shop = this.data.shopList.find(v => v.id == goods.id)
            u.goods = { ...shop
            }
          }
          return u
        })
        activityObj.award = {
          ...r.data,
          act_award_content
        }
        if (activityObj.award.award_object) {
          awardObjectIdx = awardObject.findIndex(item => item.award_object == activityObj.award.award_object)
        }
        this.setData({
          activityObj,
          awardObjectIdx
        })
      }
    })
  }
})