var app = getApp()
import Store from '../../comm/Store.js'
import TimeConverter from '../../comm/TimeConverter.js'
import Comm from '../../comm/Comm.js'
import Shop from '../../comm/Shop.js'
Page({
  data: {
    version: '',
    shopList: [],
    memberMetric: [],
    memberIdx: 0,
    coupon: {
      coupon_name: '', //-- 名称 1
      coupon_num: 100, //-- 发放的数量 1
      coupon_goods: [], //-- 适用商品 
      coupon_use_money: 100, //-- 使用门槛：0-无 非0-订单金额满足 1
      coupon_discount: 10, //--优惠内容 1
      coupon_discount_max: 100, //--最大优惠内容 1
      coupon_time_type: 1, //-- 有效期方式 ：1-固定区间内有效 2-领券后多少天有效 1
      coupon_start: '2019-1-12', //--有效期开始日期 1
      coupon_end: '2019-12-30', //--有效期结束日期 1
      coupon_day: 0, //--有效期天数 1
      coupon_limit: 0, //-- 什么人可以领？0-任何人 非0-对应会员级别可以领 1
      coupon_get: 1, //-- 领取次数限制：0-无限制 非0-表示最大领取次数 1
      coupon_share: 0, //-- 分享设置：0-不可分享 1-分享，好友领取新券 2-分享，好友领取原券 1
      coupon_describe: '', //--描述 1
      coupon_type: 1, //--券类型：1-满减券 2-折扣券 3-随机金额券 1
      accumulate_use: 1, //-- 是否可叠加使用：0-不可叠加 1-可叠加
      user_id: 0,
      store_id: 0,
    },
    goods_index: 0,
  },

  onAccumulateUseChange(e) {
    let coupon = { ...this.data.coupon }
    if (coupon.id > 0) {
      coupon.accumulate_use = 1 - coupon.accumulate_use
      this.setData({
        coupon
      })
    }
  },
  /**选择增加商品事件 */
  onAddShopHandle(e) {
    let shop = {
      ...this.data.shopList[e.detail.value]
    }
    let coupon = { ...this.data.coupon
    }
    if (!coupon.coupon_goods || coupon.coupon_goods.length <= 0) {
      coupon.coupon_goods = [shop]
    } else {
      let index = coupon.coupon_goods.findIndex(item => item.id == shop.id)
      if (index >= 0) {
        app.msg(`${shop.goods_name} 已经被添加了~~`)
        return;
      }
      coupon.coupon_goods = [...coupon.coupon_goods, shop]
    }
    this.setData({
      coupon
    })
  },
  /**移除商品事件 */
  onRemoveGoods(e) {
    let coupon = { ...this.data.coupon
    }
    let idx = e.currentTarget.dataset.idx
    coupon.coupon_goods.splice(idx, 1)
    this.setData({
      coupon
    })
  },
  //-- 领取人切换事件
  bindTypeChange(e) {
    let memberIdx = e.detail.value
    let coupon = { ...this.data.coupon
    }
    coupon.coupon_limit = this.data.memberMetric[memberIdx].member_grade
    this.setData({
      coupon,
      memberIdx
    })
  },
  initCoupon({
    coupon_type,
    id = 0,
    store_id = 0
  }) {
    let coupon_start = TimeConverter.GetToday()
    let coupon_end = TimeConverter.GetYearLatterToday()
    let coupon = { ...this.data.coupon,
      id,
      coupon_type,
      store_id,
      coupon_start,
      coupon_end
    }
    this.data.coupon = coupon
  },
  //-- 更改类型
  handleChangeType(e) {
    let coupon = { ...this.data.coupon
    }
    if (coupon.id <= 0) {
      coupon.coupon_type = e.currentTarget.dataset.type
      this.setData({
        coupon
      })
    } else {
      app.msg('优惠券类型不能更改！')
    }
  },
  onInputChanged: function(e) {
    let coupon = { ...this.data.coupon
    }
    coupon[e.currentTarget.id] = e.detail.value;
    this.setData({
      coupon
    })
  },
  onRadioChanged: function(e) {
    let coupon = { ...this.data.coupon
    }
    coupon.coupon_time_type = e.detail.value
    this.setData({
      coupon
    })
  },
  onShareRadioChanged: function(e) {
    let coupon = { ...this.data.coupon
    }
    coupon.coupon_share = e.detail.value
    this.setData({
      coupon
    })
  },
  getMemberMetric() {
    Comm.MemberMetric({
      user_id: app.USER_ID()
    }, false).then(r => {
      let memberMetric = []
      if (r.code == 200) {
        memberMetric = r.data.sort((a, b) => {
          return a.member_grade > b.member_grade ? 1 : -1
        })
      }
      this.setData({
        memberMetric: [{
          member_grade: 0,
          member_name: '不限制，所有人可领取'
        }, ...memberMetric]
      })
    })
  },
  getShopList(fn) {
    let user_id = app.USER_ID()
    let store_id = this.data.coupon.store_id
    Shop.List({
      user_id,
      store_id
    }).then(res => {
      let shopList = []
      if (res.code == 200) {
        shopList = [...res.data]
      }
      this.setData({
        shopList
      }, fn)
    })
  },
  onLoad: function(options) {
    this.initCoupon(options)
  },
  onShow: function() {
    this.setData({
      version: app.VERSION()
    })

    this.getMemberMetric()
    this.getShopList(() => {
      if (this.data.coupon.id <= 0) {
        this.setData({
          coupon: this.data.coupon
        })
      } else {
        this.getCouponInfo(this.data.coupon.id)
      }
    })
  },
  getCouponInfo(id) {
    let user_id = app.USER_ID()
    Store.ShowCouponInfo({
        id,
        user_id
      })
      .then(r => {
        console.log('Store.ShowCouponInfo => ', r.data)
        if (r.code == 200) {
          let coupon = { ...r.data
          }
          coupon.accumulate_use = coupon.accumulate_use || 0
          if (coupon.coupon_goods && coupon.coupon_goods.length > 0) {
            let goods = [...coupon.coupon_goods.split(',')]
            coupon.coupon_goods = []
            goods.forEach(v => {
              const goodsHav = this.data.shopList.find(item => item.id == v)
              if (goodsHav) {
                coupon.coupon_goods = [...coupon.coupon_goods, goodsHav]
              }
            })
          } else {
            coupon.coupon_goods = []
          }
          this.setData({
            coupon
          })
        }
      })
  },
  onSubmit() {
    let coupon = {
      ...this.data.coupon,
      user_id: app.USER_ID()
    }

    if (coupon.coupon_goods && coupon.coupon_goods.length > 0) {
      coupon.coupon_goods = coupon.coupon_goods.map(u => {
        return u.id
      }).join(',')
    } else {
      coupon.coupon_goods = ''
    }
    if (coupon.coupon_name.length <= 0) {
      app.msg("请输入优惠券名称")
      return;
    }
    if (coupon.coupon_num <= 0) {
      app.msg("注意：发放数量必须大于0")
      return;
    }
    if (coupon.coupon_use_money < 0) {
      coupon.coupon_use_money = 0
    }
    if (coupon.coupon_discount < 0) {
      coupon.coupon_discount = 0
    }
    if (coupon.coupon_discount_max < 0) {
      coupon.coupon_discount_max = 0
    }
    if (coupon.coupon_get < 0) {
      coupon.coupon_get = 0
    }
    if (coupon.id <= 0) {
      Store.CouponAdd(coupon)
        .then(r => {
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
    } else {
      const {
        coupon_name,
        coupon_num,
        coupon_describe,
        oupon_limit,
        coupon_get,
        user_id,
        id,
      } = coupon
      Store.CouponMode({
          coupon_name,
          coupon_num,
          coupon_describe,
          oupon_limit,
          coupon_get,
          user_id,
          id,
        })
        .then(r => {
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
    }
  },
})