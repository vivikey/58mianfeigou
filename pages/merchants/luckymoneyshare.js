var app = getApp()
import Store from '../../comm/Store.js'
import TimeConverter from '../../comm/TimeConverter.js'
Page({
  data: {
    store_id: 0,
    higher_up: 0,
    store_name: '',
    red_id: 0,
		user_red_id:0,
    luckyMoney: {}
  },
  toHome() {
    wx.switchTab({
      url: '/pages/shop/index',
    })
  },
  onLoad(options) {
    /**老版本 */
    if (options.q) {
      let link = decodeURIComponent(options.q);
      console.log(link);
      let params = link.split('?')[1].split('&') //-- id=1&idx=1&rd=1
      let id = params[0].split('=')[1]
      let rd = params[1].split('=')[1]

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
    this.data.higher_up = options.higher_up || app.HIGHER_UP()
    this.data.red_id = options.id || 0
		this.data.user_red_id = options.user_red_id || 0
  },
	getShareLuckyMoneyInfo(){
		Store.ShareStoreRedInfoAtView({
			user_id: app.USER_ID(),
			red_id: this.data.red_id
		}).then(r => {
			console.log('Store.ShareStoreRedInfoAtView => ', r)
			let luckyMoney = {}
			if (r.code == 200) {
				luckyMoney = { ...r.data, isOpen: r.data.red_money > 0 }
			}
			this.setData({
				luckyMoney
			})
		})
	},
  getLuckyMoneyInfoAtView() {
    Store.LuckyMoneyInfoAtView({
      user_id: app.USER_ID(),
			user_red_id: this.data.user_red_id
    }).then(r => {
			console.log('Store.LuckyMoneyInfoAtView => ',r)
      let luckyMoney = {}
			if (r.code == 200 ) {
				luckyMoney = { ...r.data, isOpen: r.data.red_money>0}
      } 
      this.setData({
        luckyMoney,
				red_id: luckyMoney.red_id
      })
    })
  },
  loadLuckyMoneyInfo() {
    Store.LuckyMoneyInfo({
      user_id: app.USER_ID(),
      red_id: this.data.red_id
    }).then(r => {
      if (r.code == 200) {
        const luckyMoney = {
          ...r.data
        }
        luckyMoney.red_id = luckyMoney.id
        delete luckyMoney.id
        this.setData({
          luckyMoney
        }, this.getLuckyMoneyInfoAtView)

        Store.Get({
          user_id: app.USER_ID(),
          store_id: r.data.store_id
        }).then(rr => {
          console.log('Store.Get => ', rr)
          if (rr.code == 200) {
            this.setData({
              store_id: r.data.store_id,
              store_name: rr.data.store_name
            })
          }
        })
      } else {
        console.log('Store.LuckyMoneyInfo Error:', r.message)
      }
    })
  },
  onShow() {
    app.HIGHER_UP(this.data.higher_up)
    if (!app.USER()) {
      app.globalData.bkPage = this.route
      wx.navigateTo({
        url: `/pages/index/index?id=${this.data.red_id}&higher_up=${this.data.higher_up}`,
      })
    } else { 
			if (this.data.user_red_id>0){
				this.getLuckyMoneyInfoAtView()
			}else{
				this.getShareLuckyMoneyInfo()
			}
    }

  },
  handleOpenLuckyMoney() {
    const {
      luckyMoney
    } = this.data
    if (!luckyMoney.isOpen) {
      Store.OpenLuckyMoney({
        red_id: luckyMoney.red_id,
        store_id: luckyMoney.store_id,
        user_id: app.USER_ID(),
        share_user_id: this.data.higher_up
      }).then(r => {
        if (r.code == 200) {
					// app.SUCCESS(r.message, this.loadLuckyMoneyInfo)
					this.loadLuckyMoneyInfo()
        } else {
          app.ERROR(r.message)
        }
      })
    }
  },
  onShareAppMessage() {

    let title = `${app.USER().nick_name}邀您一起领红包`
    let path = `/pages/merchants/luckymoneyshare?id=${this.data.red_id}&higher_up=${app.USER_ID()}`
    return {
      title,
      path,
      imageUrl: '/resource/admin/openluckymoney.png',
      success: res => {
        console.log('ShareAppMessage.res => ', res)
      }
    }
  }
})