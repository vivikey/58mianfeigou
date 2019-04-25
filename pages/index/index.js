var app = getApp()
import Login from '../../comm/Login.js'

Page({
  data: {
    id: null,
    higher_up: null,
    spec: null,
    store: null,
    version: '',
    networkType: '',
    loginFaile: false,
    has_authorization: 0
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
    console.log('Page.index.index Did Load => ', options)
    this.data.id = options.id || 0
    this.data.higher_up = options.higher_up || 0
    this.data.spec = options.spec || 0
    this.data.store = options.store || 0
    app.HIGHER_UP(options.higher_up || 0)

  },
  loginNew() {
      wx.login({
        success: res => {
          console.log("wx.login => ", res)
          if (res.code) {
            app.globalData.userInfo.code = res.code
            Login.Login({
                code: res.code
              })
              .then(r => {
								console.log('Login.Login => ', r, r.data.has_authorization)
                if (r.code == 200) {
                  r.data.user_id = r.data.id
									let u = {...r.data}
                  app.USER(u)
									if (r.data.has_authorization!=undefined && r.data.has_authorization != 1) {
                    wx.navigateTo({
                      url: 'auth?f=0',
                    })
                  } else {
                    this.afterLogin()
                  }
                } else {
                  let errmsg = r.message || '服务器运行出错'
                  app.ERROR(errmsg, () => {
                    this.setData({
                      loginFaile: true
                    })
                  })
                }
              })
          } else {
            app.ERROR(`微信登录失败:${res.errMsg}`, () => {
              this.setData({
                loginFaile: true
              })
            })
          }
        }
      })
  },
	afterLogin(){
		Login.LoginSuccess({
			user_id: app.USER_ID(),
			higher_up: this.data.higher_up,
			store_id: this.data.store
		}).then(r => {
			console.log('Login.LoginSuccess => ', r)
			if (r.code == 200) {
				r.data.user = r.data.userInfo || r.data.user
				let user = { ...r.data.user,user_id:r.data.user.id}
				user.member = r.data.member
				if (r.data.higher) {
					user.higher = r.data.higher
				} else {
					user.higher = null
				}
				app.USER(user)
				this.goHome()
			} else {
				let errmsg = r.message || '服务器运行出错'
				app.ERROR(errmsg, () => {
					this.setData({
						loginFaile: true
					})
				})
			}
		})
	},
  goHome() {
    if (this.data.id > 0) {
      wx.redirectTo({
        url: `/${app.globalData.bkPage}?id=${this.data.id}&higher_up=${this.data.higher_up}&spec=${this.data.spec}&store=${this.data.store}`,
      })
    } else {
      wx.switchTab({
        url: '/pages/shop/index',
      })
    }
  },
  onReady() {
    //this.login()
  },
  onShow() {
    //-- 获取当前网络状态
    wx.getNetworkType({
      success: res => {
        this.setData({
          networkType: res.networkType.toUpperCase(),
          version: app.VERSION()
        })
      }
    })
    this.loginNew()
  }
})