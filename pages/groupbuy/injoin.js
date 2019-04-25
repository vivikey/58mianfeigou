var app = getApp()
import Order from '../../comm/Order.js'
import FrontEndStore from '../../comm/FrontEndStore.js'
var pageObj = {
  data: {
		user:{},
    group_id: 0,
    version: '',
    group_info: {},
    spec_chosed: 0,
    timer: 0,
    store_info: {}
  },
  //-- 增加数量
  addcount: function(e) {
    let group_info = this.data.group_info
    group_info.goods.goods_number++
      this.setData({
        group_info: group_info
      })
  },
  //-- 减少数量
  subcount: function(e) {
    if (this.data.group_info.goods.goods_number > 1) {
      let group_info = this.data.group_info
      group_info.goods.goods_number--
        this.setData({
          group_info: group_info
        })
    }
  },
  //-- 规格选择事件
  bindPickerChange(e) {
    this.setData({
      spec_chosed: e.currentTarget.dataset.idx
    })
  },
  onLoad: function(options) {
    console.log('injoin.options => ', options)
		this.data.group_id = options.group_id || options.id || 0
		this.data.spec_chosed = options.spec || 0
    this.setData({
      version: app.VERSION(),
			spec_chosed: this.data.spec_chosed
    })
  },
  onShow: function() {
    clearTimeout(this.data.timer)
    app.HIGHER_UP(this.data.higher_up)
    if (!app.USER()) {
      app.globalData.bkPage = this.route
      wx.navigateTo({
				url: `/pages/index/index?id=${this.data.group_id}&higher_up=${this.data.higher_up}&spec=${this.data.spec_chosed}`,
      })
    } else {
			this.setData({
				user:app.USER()
			})
      Order.GetGroup({
          user_id: app.USER_ID(),
          group_id: this.data.group_id
        })
        .then(r => {
          console.log('Order.GetGroup => ', r)
          if (r.code == 200) {
            FrontEndStore.Get({
              user_id: app.USER_ID(),
              store_id: r.data.goods.store_id
            }).then(res => {
              this.setData({
                store_info: res.data
              })
            })
            r.data.goods.goods_number = 1
            let [less_h, less_m, less_s] = r.data.short_time.split(':').map(u => {
              return parseInt(u)
            })

            r.data.less_h = less_h
            r.data.less_m = less_m
            r.data.less_s = less_s
            r.data.hastime = this.hasLessTime(less_h, less_m, less_s)
            r.data.user = r.data.user.map((u, idx) => {
              u.is_first = idx == 0 ? 1 : 0
              return u
            })
            this.setData({
              group_info: r.data
            }, this.checkTimeOut)
          }
        })
    }
  },
  //-- 时间减一秒
  timeSubOneSec() {
    let group_info = this.data.group_info
    let {
      less_h,
      less_m,
      less_s
    } = group_info
    if (less_s > 0) {
      less_s--
    } else {
      if (less_m > 0) {
        less_m--
        less_s = 59
      } else {
        if (less_h > 0) {
          less_h--
          less_m = 59
          less_s = 59
        } else {
          less_h = 0
          less_m = 0
          less_s = 0
        }
      }
    }
    group_info.short_time = `${this.ConvertLessThanTenNUm(less_h)}:${this.ConvertLessThanTenNUm(less_m)}:${this.ConvertLessThanTenNUm(less_s)}`
    group_info.hastime = this.hasLessTime(less_h, less_m, less_s)
    group_info.less_h = less_h
    group_info.less_m = less_m
    group_info.less_s = less_s
    this.setData({
      group_info: group_info
    }, this.checkTimeOut)
  },
  ConvertLessThanTenNUm(n) {
    if (n < 10) {
      return `0${n}`
    } else {
      return `${n}`
    }
  },
  //-- 每秒检查
  checkTimeOut() {
    clearTimeout(this.data.timer)
    let group_info = this.data.group_info
    if (group_info.hastime) {
      this.setData({
        timer: setTimeout(this.timeSubOneSec, 1000)
      })
    }
  },
  //-- 检测时间
  hasLessTime(h, m, s) {
    if (h <= 0 && m <= 0 && s <= 0) {
      return false;
    } else {
      return true;
    }
  },
  //-- 分享到用户或群
  onShareAppMessage(res) {
    let goods = this.data.group_info.goods
    let spec_chosed = this.data.spec_chosed
    let spec = goods.spec[spec_chosed]

    let title = `${app.USER().nick_name}邀您一起【拼购】：${goods.goods_name}只需￥${spec.group_price}`
    let path = `/pages/groupbuy/injoin?group_id=${this.data.group_id}&spec=${spec_chosed}&higher_up=${app.USER_ID()}`
    return {
      title,
      path,
      imageUrl: spec.spec_img,
      success: res => {
        console.log('ShareAppMessage.res => ', res)
      }
    }
  },
  //-- 打开商品详情
  toShopDetail() {
    wx.navigateTo({
      url: '/pages/shop/details?id=' + this.data.group_info.goods.id,
    })
  },
  //-- 我要参团
  joinOrder() {
    let chosedObj = {
      ...this.data.group_info.goods
    }
    chosedObj.goods_spec = {
      ...this.data.group_info.goods.spec[this.data.spec_chosed]
    }
    chosedObj.orderDirect = 1
    chosedObj.store_info = {
      ...this.data.store_info
    }
    chosedObj.group_id = this.data.group_info.group_id
    wx.setStorageSync('chosedObj', chosedObj)
    wx.navigateTo({
      url: `/pages/groupbuy/grouporder`,
    })

  },
}
Page(pageObj)