var app = getApp()
import Login from '../../comm/Login.js'

Page({
  data: {
		id:null,
		higher_up:null,
		spec:null,
		store:null,
    version: '',
    networkType: '',
    loginFaile: false
  },
  onLoad(options) {
		/**老版本 */
		if (options.q) {
			let link = decodeURIComponent(options.q);
			console.log(link);
			let params = link.split('?')[1].split('&') //-- id=1&idx=1&rd=1
			let rd = params[0].split('=')[1]
			options['higher_up'] = rd || 0
		}

		/**新版本 */
		if (options.scene) {
			let link = decodeURIComponent(options.scene);
			let params = link.split('&')
			let rd = params[0].split('=')[1]
			options['higher_up'] = rd || 0
		}
		console.log('Page.index.index Did Load => ',options)
		this.data.id = options.id || 0
		this.data.higher_up = options.higher_up || 0
		this.data.spec = options.spec || 0
		this.data.store = options.store || 0
    app.HIGHER_UP(options.higher_up || 0)
		
  },
  login() {
    console.log('CurrPage => ', this.route)
		app._init(this.data.store).then(r => {
      console.log('index.login => ', r)
      if (r.code == 200) {
					if(this.data.id>0){
						wx.redirectTo({
							url: `/${app.globalData.bkPage}?id=${this.data.id}&higher_up=${this.data.higher_up}&spec=${this.data.spec}&store=${this.data.store}`,
						})
					}else{
						wx.switchTab({
							url: '/pages/shop/index',
						}) 
					}
       
      } else {
        app.ERROR(`wxLogin Faile：${r.message}`, () => {
          this.setData({
            loginFaile: true
          })
        })
      }
    })
  },
	onReady(){
		this.login()
	},
  onShow() {
    //-- 获取当前网络状态
    wx.getNetworkType({
      success: res => {
        this.setData({
          networkType: res.networkType.toUpperCase(),
					version:app.VERSION()
        })
      }
    })

  }
})