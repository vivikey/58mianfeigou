var app = getApp()
import FrontEndStore from '../../comm/FrontEndStore.js'
Page({
  data: {
    store_id: 0,
    higher_up: 0,
    version: {},
    user: {},
    shopList: []
  },
  onLoad: function(options) {
    /**老版本 */
    if (options.q) {
      let link = decodeURIComponent(options.q);
      let params = link.split('?')[1].split('&') //-- id=1&idx=1&rd=1
      let id = params[0].split('=')[1]
      let rd = params[1] ? params[1].split('=')[1] : 0
      options['id'] = id || 0
      options['higher_up'] = rd || 0
    }
    /**新版本 */
    if (options.scene) {
      let link = decodeURIComponent(options.scene);
      let params = link.split('&')
      let id = params[0].split('=')[1]
      let rd = params[1].split('=')[1]
      options['id'] = id || 0
      options['higher_up'] = rd || 0
    }
    this.data.store_id = options.id || 0
    this.data.higher_up = options.higher_up || 0

    this.setData({
      version: app.VERSION(),
      user: app.USER(),
    })
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  onShow: function() {
    app.HIGHER_UP(this.data.higher_up)
    if (!app.USER()) {
      app.globalData.bkPage = this.route
      wx.navigateTo({
        url: `/pages/index/index?id=${this.data.store_id}&higher_up=${this.data.higher_up}`,
      })
    } else {
			this.getStoreInfo()
      this.getVogueListAtView()
    }
  },
  getStoreInfo() {
    const data = {
      store_id: this.data.store_id,
      user_id: this.data.user.id,
    }
    FrontEndStore.Get(data).then(r => {
      console.log('FrontEndStore.Get => ', r)
      if (r.code == 200) {
        this.data.store = r.data
        this.setData({
          store: this.data.store
        })
      } else {
        app.ERROR('系统错误，请稍候重试！')
      }
    })
  },
  getVogueListAtView() {
    const data = {
      store_id: this.data.store_id,
      user_id: this.data.user.id,
      order_type: 1
    }
		FrontEndStore.VogueListAtView(data)
      .then(r => {
        let list = []
        if (r.code == 200 && r.data.length > 0) {
          list = r.data.map(u => {
            u.goods_key = u.goods_key.split(/，|,/)
            return u;
          })
        }
        this.setData({
          shopList: list
        })
      })
  },
	//-- 商品点击事件:跳转至详情页
	onShopClick(e) {
		let id = e.currentTarget.dataset.id
		let spec = e.currentTarget.dataset.spec
		let url = `/pages/shop/details?id=${id}&spec=${spec}`
		wx.navigateTo({
			url
		})
	},
	handleToStore(){
		wx.navigateTo({
			url: `/pages/store/detail?id=${this.data.store_id}}}`,
		})
	},
  onShareAppMessage: function() {
		return {
			title: `${app.USER().nick_name}向您推荐【${this.data.store.store_name}】店铺爆款`,
			path: `/pages/store/baokuang?id=${this.data.store.id}&rd=${app.USER_ID()}`,
			imageUrl: '/resource/images/baokuanlogo.jpg',
			success: res => {
				console.log('onShareAppMessage.success => ', res)
			}
		}
  }
})