var app = getApp()
import Index from '../../comm/Index.js'
import ToTop from "../../utils/ToTop.js"
Page({
  data: {
		...ToTop.data,
    higher_up: 0,
    version: {},
    user: {},
    shopList: [],
		sortType: [{
			key: 1,
			val: '智能排序'
		},
		{
			key: 2,
			val: '最新上架'
		},
		{
			key: 3,
			val: '销量最高'
		}
		],
		sortTypeId: 1,
  },
	...ToTop.methods,
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
        url: `/pages/index/index?id=0&higher_up=${this.data.higher_up}`,
      })
    } else {
      this.getVogueListAtView()
    }
  },
	onSortTypeClick(e) {
		this.setData({
			sortTypeId: e.currentTarget.id
		}, () => {
			this.getVogueListAtView()
		})
	},
  getVogueListAtView() {
    const data = {
      user_id: this.data.user.id,
			order_type: this.data.sortTypeId
    }
		Index.ShowVogueListByPlatformAtView(data)
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
  onShareAppMessage: function() {
		return {
			title: `${app.USER().nick_name}向您推荐爆款`,
			path: `/pages/shop/baokuang?id=0&rd=${app.USER_ID()}`,
			imageUrl: '/resource/images/baokuanlogo.jpg',
			success: res => {
				console.log('onShareAppMessage.success => ', res)
			}
		}
  }
})