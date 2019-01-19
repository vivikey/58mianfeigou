var app = getApp()
import FrontEndFTxt from '../../comm/FrontEndFTxt.js'
import TimeConverter from '../../comm/TimeConverter.js'
var pageObj = {
  data: {
    version: '',
    ad_id:0,
		higher_up:0,
    user: {},
    ftxt: {},
    goods:{},
    store:{},
    spec_chosed: 0,
    sc: 0,
    showShareWnd: false,
  },
  //-- 页面加载事件
  onLoad: function (options) {
		if (options.q) {
			let link = decodeURIComponent(options.q);
			console.log('from Qrcode => ',link);
			let params = link.split('?')[1].split('&') //-- id=1&idx=1&rd=1
			let id = params[0].split('=')[1]
			let rd = params[1].split('=')[1]
			options['id'] = id || 0
			options['higher_up'] = rd || 0
		}
		this.data.ad_id = options.id || 0
		this.data.higher_up = options.higher_up || 0
    wx.showShareMenu({
      withShareTicket: true
    })
    this.setData({
      version: app.VERSION(),
      user: app.USER(),
    })

  },
	//-- 每次进入页面触发
	onShow() {
		app.HIGHER_UP(this.data.higher_up)
		if (!app.USER()) {
			app.globalData.bkPage = this.route
			wx.navigateTo({
				url: `/pages/index/index?id=${this.data.ad_id}&higher_up=${this.data.higher_up}`,
			})
		} else {
			this.loadFText()
		}
	},
  swiperChange: function (e) {
    this.setData({
      sc: e.detail.current
    })
  },
  //-- 商品详情
  toShopDetail(){
    wx.navigateTo({
      url: `/pages/shop/details?id=${this.data.goods.id}`,
    })
  },
  //-- 打开分享窗口
  openShareWnd: function () {
    this.setData({
      showShareWnd: true
    })
  },
  //-- 关闭分享窗口
  hideShareBox: function () {
    console.log('hideShareBox is running...')
    this.setData({
      showShareWnd: false
    })
  },
	//-- 生成海报
	shareToPYQ: function () {
		let ftxt = this.data.ftxt
		let small_title = ``
		let content = ''
		let shareData = {
			img: ftxt.ad_img, //-- 图片
			title: ftxt.ad_title, //-- 标题
			small_title,//-- 小标题
			content,//-- 内容
			pageLoad: `pages/ftxt/detail`, //-- 页面地址
			pageScene: `id=${ftxt.id}&rd=${app.USER_ID()}`, //-- 加载页面的参数
			qrMsg: '查看详情',
			store_name: this.data.store.store_name //-- 商铺名称
		}

		wx.setStorageSync('shareData', shareData)
		this.hideShareBox();
		wx.navigateTo({
			url: '/pages/sharepyq/sharepyq',
		})
	},
  toHome() {
    wx.switchTab({
      url: '/pages/shop/index',
    })
  },
  //-- 分享到用户或群
  onShareAppMessage(res) {
		let title = `${this.data.ftxt.ad_title}`
		let path = `/pages/ftxt/detail?id=${this.data.ftxt.id}&higher_up=${app.USER_ID()}`
		let img = this.data.ftxt.ad_img || this.data.goods.goods_banners[0]

    return {
      title,
      path,
      imageUrl: img,
      success: res => {
        console.log('ShareAppMessage.res => ', res)
        this.hideShareBox()
      }
    }
  },
  loadFText() {
    FrontEndFTxt.Get({ user_id: app.USER_ID(), ad_id: this.data.ad_id }).then(r => {
      console.log('FrontEndFTxt.Get => ', r)
      if(r.code==200){
        r.data.ad.blog = JSON.parse(r.data.ad.blog)
				r.data.ad.addtime = TimeConverter.ToLocal(r.data.ad.addtime)
        r.data.goods.goods_img = r.data.goods.goods_img.split(',')
        r.data.goods.goods_banners = r.data.goods.goods_banners.split(',')
        this.setData({
          ftxt:r.data.ad,
          goods:r.data.goods,
          store:r.data.store
        })
      }
    })
  },

}
import pageex from "../../utils/pageEx.js"

pageex(pageObj)

Page(pageObj)