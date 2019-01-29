var app = getApp();
import Comm from '../../comm/Comm.js'
Page({
  data: {
		version:'',
    canGetcode: true,
    getTitle: '获取验证码',
    phone: '',
    hasSended: false,
    msg: ' ',
    timer: null,
    countrec: 59,
    code: null,
    user: {},
		needtoback:false,
		prePage:{}
  },
  onLoad(options) {		
    let user = app.USER()
		this.data.needtoback = options.needtoback || false
    let msg = '';
    if (!user.user_phone || user.user_phone.length < 11) {
      msg = '您未绑定手机号'
    } else {
      msg = `您已绑定手机号【${user.user_phone}】`
    }
    this.setData({
      user: user,
      msg: msg,
			version:app.VERSION()
    })
  },
	onShow(){
		let routePages = getCurrentPages()
		let prePage = routePages[routePages.length - 2]
		this.data.prePage = prePage
	},
  bindingPhone() {
    let phone = this.data.phone
    let code = this.data.code
    if (!phone || phone.length < 11) {
			app.msg('请输入11位有效手机号码')
      return;
    }
    if (!code || code.length < 4) {
			app.msg('请输入验证码')
      return;
    }
		Comm.BindPhone({
			user_id:app.USER_ID(),
			phone,code
		}).then(r=>{
			console.log('Comm.BindPhone => ',r)
			if(r.code==200){
				app.SUCCESS(r.message,()=>{
					wx.navigateBack({
						delta: 1
					})
				})
			}else{
				app.ERROR(r.message || "绑定失败了~~")
			}
		})
  },
  codeinput(e) {
    this.setData({
      code: e.detail.value
    })
  },
  endinput(e) {
    this.setData({
      phone: e.detail.value
    })
  },
	setTimeInterval(){
		this.data.timer = setInterval(res => {
			var countrec = this.data.countrec
			if (countrec > 0) {
				this.setData({
					countrec: countrec - 1,
					hasSended: true,
					getTitle: `${countrec - 1}秒后可重发`,
				})
			} else {
				this.setData({
					canGetcode: true,
					countrec: 59,
					getTitle: '获取验证码',
				})
				clearInterval(this.data.timer)
			}
		}, 1000)
	},
  getCode() {
		Comm.GetPhoneCode({ phone: this.data.phone})
		.then(r=>{
			console.log('Comm.GetPhoneCode => ',r)
			if(r.code==200){
				app.SUCCESS(r.message,()=>{
					this.setData({
						canGetcode: false,
						getTitle: '59秒后重发',
					}, this.setTimeInterval)
				})				
			}else{
			app.ERROR('发送失败了~~')
			}
		})    
  },
  getPhoneNumber(e) {
    //-- 解码微信授权的手机号数据
    wx.login({
      success: res => {
        console.log("2.X Methond[_init] call wx.login:", res)
        if (res.code) {
          Comm.GetWeChatPhone({
						user_id:app.USER_ID(),
            code: res.code,
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv
          }).then(r=>{
						console.log('Comm.GetWeChatPhone => ',r)
						if(r.code==200){
							app.SUCCESS(r.message,()=>{
								wx.navigateBack({
									delta: 1
								})
							})
						}else{
							app.ERROR('失败了~~')
						}
					})
        }
      }
    })    
  }
})