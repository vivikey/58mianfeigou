var app = getApp()
import Store from '../../comm/Store.js'
import TimeConverter from '../../comm/TimeConverter.js'
Page({
  data: {
    store_id: 0,
    couponsList: [],
    couponGroup: {
      id: 0,
      combinate_name: '',
      combinate_start: '2019-1-12', //--有效期开始日期 1
      combinate_end: '2019-12-30', //--有效期结束日期 1
      coupon: []
    }
  },
  onCouponChecked(e) {
    const {
      idx
    } = e.currentTarget.dataset
    let couponsList = [...this.data.couponsList]
    couponsList[idx].checked = !couponsList[idx].checked
    this.setData({
      couponsList
    })
  },
  onCouponCheckNumberInput(e) {
    const {
      idx
    } = e.currentTarget.dataset
    const {
      value
    } = e.detail
    console.log('onCouponCheckNumberInput => ', idx, value)
    let couponsList = [...this.data.couponsList]
    couponsList[idx].check_num = value
    this.setData({
      couponsList
    })
  },
  updateCouponGroup(fn) {
    this.setData({
      couponGroup: this.data.couponGroup
    }, () => {
      if (fn)
        fn()
    })
  },

  onInputChanged: function(e) {
    let couponGroup = {
      ...this.data.couponGroup
    }
    couponGroup[e.currentTarget.id] = e.detail.value;
    this.setData({
      couponGroup
    })
  },
  onSetCouponGroup() {
    let user_id = app.USER_ID()
    let store_id = this.data.store_id
    let data = { ...this.data.couponGroup,
      user_id,
      store_id
    }
    let couponsList = [...this.data.couponsList]
    let couponFilter = []
    couponsList.forEach(item => {
      if (item.checked == true) {
        if (item.check_num <= 0 || item.check_num > item.coupon_num) {
          app.ERROR(`请输入优惠券【${item.coupon_name}】的有效数量`)
          return;
        }
        couponFilter = [...couponFilter, {
          coupon_id: item.id,
          coupon_num: item.check_num
        }]
      }
    })
    const coupons = JSON.stringify(couponFilter)
    if (data.id <= 0) {
      const {
        combinate_describe,
        combinate_end,
        combinate_name,
        combinate_start,
        store_id,
        user_id
      } = data
			Store.CouponGroupSet({
				combinate_describe,
				combinate_end,
				combinate_name,
				combinate_start,
				store_id,
				user_id
			}).then(r => {
        if (r.code == 200) {
          this.onSetCouponGroupCoupons({
            combinate_id: r.data,
            coupon: coupons
          })
        } else {
          app.ERROR(r.message)
        }
      })
    } else {
      Store.CouponGroupMode({
        combinate_id: data.id,
        combinate_name: data.combinate_name,
        combinate_start: data.combinate_start,
        combinate_end: data.combinate_end,
        combinate_describe: data.combinate_describe,
        user_id: data.user_id
      }).then(r => {
        if (r.code == 200) {
          this.onSetCouponGroupCoupons({
            combinate_id: data.id,
            coupon: coupons
          })
        } else {
          app.ERROR(r.message)
        }
      })
    }
  },
  onSetCouponGroupCoupons(data) {
    Store.CouponGroupSetCoupons(data)
      .then(r => {
        if (r.code == 200) {
          app.SUCCESS(r.message,()=>{
						wx.navigateBack({
							delta:1
						})
					})
        } else {
          app.ERROR(r.message)
        }
      })
  },
  onLoad: function(options) {
    this.data.store_id = options.store_id
    this.data.couponGroup.id = options.id
  },
  onShow: function() {
    this.getCouponList(() => {
      const {
        id
      } = this.data.couponGroup
      if (id > 0) { //-- 获取已设置的组合券
        Store.CouponGroupInfo({
            user_id: app.USER_ID(),
            combinate_id: id
          })
          .then(r => {
            if (r.code == 200) {
              this.data.couponGroup = { ...r.data
              }
							this.updateCouponList()
              this.updateCouponGroup()
            } else {
              app.ERROR(r.message)
            }
          })
      }else{
				this.data.couponGroup.combinate_start = TimeConverter.GetToday()
				this.data.couponGroup.combinate_end = TimeConverter.GetYearLatterToday()
				this.updateCouponGroup()
			}
    })
  },
	updateCouponList(){
		let { coupon } = this.data.couponGroup
		let couponsList = [...this.data.couponsList]		
		this.setData({
			couponsList: couponsList.map(item => {
				const o = coupon.find(value => value.id == item.id)
				console.log('updateCouponList.o => ', o)
				if (o) {
					item.check_num = o.coupon_num
					item.checked = true
				}
				return item;
			})
		})
	},
  getCouponList(fn) {
    let user_id = app.USER_ID()
    let {
      store_id
    } = this.data
    Store.CouponList({
        user_id,
        store_id
      })
      .then(r => {
        let couponsList = []
        if (r.code == 200) {
          couponsList = r.data.map(u => {
            u.checked = false;
            u.check_num = 0;
            return u
          })
        }
        this.setData({
          couponsList
        }, fn)
      })
  },
})