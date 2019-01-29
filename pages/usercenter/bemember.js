var app = getApp()
import Comm from '../../comm/Comm.js'
import UserCenter from '../../comm/UserCenter.js'
import Q2O from '../../comm/QueryToObj.js'
Page({
  data: {
    userinfo: {},
    version: '',
    memberMetric: [],
    ty: '开通',
    sc: 0,
    inputWndShow: false,
    region: ['', '', ''],
    obj: null,
    memberObj: {
      user_name: '',
      higher_member_code: '',
      member_province: '请选择区域',
      member_city: '',
      member_district: ''
    },
  },
  onAreaClick() {
    return false;
  },
  swiperChange: function(e) {
    this.setData({
      sc: e.detail.current
    })
  },
  onLoad(options) {
    if (!app.USER()) {
      app.globalData.bkPage = this.route
      wx.navigateTo({
        url: `/pages/index/index?id=0&higher_up=0`,
      })
    }
  },
  onUserNameChange(e) {
    this.data.memberObj.user_name = e.detail.value
    this.setData({
      memberObj: this.data.memberObj
    })
  },
  onCodeChange(e) {
    this.data.memberObj.higher_member_code = e.detail.value
    this.setData({
      memberObj: this.data.memberObj
    })
  },
  bindRegionChange(e) {
    let [member_province, member_city, member_district] = e.detail.value
    this.data.memberObj = { ...this.data.memberObj,
      member_province,
      member_city,
      member_district
    }
    this.setData({
      region: e.detail.value,
      memberObj: this.data.memberObj
    })
  },
  /**从相机或相册中扫码 */
  onScanCode() {
    wx.scanCode({
      success: (res) => {
        if (res.errMsg == 'scanCode:ok') {
          let obj = Q2O(res.result)
          console.log('wx.scanCoce => ', res.result, obj)
          if (!obj.mc) {
            app.ERROR("无效的自强联盟会员码！")
          } else {
            this.data.memberObj.higher_member_code = obj.mc
            this.setData({
              memberObj: this.data.memberObj
            })
          }
        } else {
          app.ERROR(res.errMsg)
        }
      }
    })
  },
  /**选择不同的等级，支付对应的费用 */
  onToPayHandle(e) {
    let memberMetric = this.data.memberMetric
    let index = e.currentTarget.dataset.index
    this.data.obj = memberMetric[index]		
    this.openInputWnd()
  },
  openInputWnd() {
    //--判断是否有授权
    if (!this.data.userinfo.user.nick_name) {
      wx.navigateTo({
        url: '/pages/index/auth',
      })
    } else
      //--判断是否有绑定手机号
      if (!this.data.userinfo.user.user_phone) {
        wx.navigateTo({
          url: '/pages/index/bindphone',
        })
      } else {
        this.setData({
          inputWndShow: true,
          obj: this.data.obj
        })
      }
  },
  hideInputWnd() {
    this.setData({
      inputWndShow: false,
			obj:null
    })
  },
  /**选择支付 */
  payChosed() {
    if (this.data.memberObj.user_name.length <= 0) {
      app.msg('请输入真实姓名！')
      return;
    }
		if (!this.data.memberObj.member_district || this.data.memberObj.member_district.length<=0){
			app.msg('请选择区域')
			return;
		}
    let obj = this.data.obj
    Comm.AfterPayMemberSuccess({
        ...this.data.memberObj,
        user_id: app.USER_ID()
      })
      .then(r => {
        console.log('Comm.AfterPayMemberSuccess => ', r)
        if (r.code == 200) {
          Comm.MemberPay({
            user_id: app.USER_ID(),
            member_grade: obj.member_grade,
            pay_fee: obj.pay_money
          }).then(r => {
            console.log('Comm.MemberPay => ', r)
            if (r.code == 200) {
              this.useWeChatPay(r.data, obj)
            } else {
              app.ERROR(r.message)
            }
          })
        } else {
          app.ERROR(r.message)
        }
      })

  },
  /**微信支付 */
  useWeChatPay(data, obj) {
    wx.requestPayment({
      'timeStamp': data.timeStamp.toString(),
      'nonceStr': data.nonceStr,
      'package': data.package,
      'signType': data.signType,
      'paySign': data.paySign,
      'success': (data) => {
        console.log('WeXin Pay Success => ', data)
        this.onSuccess(obj)
      },
      'fail': res => {
        var msg = '支付失败:';
        if (res.err_desc) {
          msg = msg + res.err_desc
        }
        if (res.errMsg && res.errMsg.indexOf('cancel') > 0) {
          msg = msg + '取消支付'
        }
        app.ERROR(msg)
      }
    })
  },
  /** 用户支付成功后，调用 */
  onSuccess(res) {
    app.msgbox({
      content: '支付成功',
      showCancel: false,
      success: d => {
        Comm.MemberPaySuccess({
          user_id: app.USER_ID(),
          member_grade: res.member_grade
        }).then(r => {
          console.log('Comm.MemberPaySuccess => ', r)
          if (r.code == 200) {
            this.hideInputWnd()
            if (res.member_grade != 1 || res.pay_money < 50.00) {
              app.SUCCESS(r.message)
            } else {
              app.Success(r.message, () => {
                wx.redirectTo({
                  url: '/pages/store/detail?id=51',
                })
              })
            }
          } else {
            app.ERROR(r.message)
          }
        })
      }
    })
  },
  onReady() {
    this.getMemberMetric()
  },
  onShow() {
    this.setData({
      version: app.VERSION()
    })
		//this.refreshUserInfo()
		UserCenter.Get({
			user_id: app.USER_ID()
		})
			.then(res => {
				console.log('UserCenter.Get => ', res)
				let userinfo = res.data
				let memberObj = this.data.memberObj
				if (userinfo.higher) {
					memberObj.higher_member_code = userinfo.higher.member_code
				}
				if (userinfo.member.user_name) {
					memberObj.user_name = userinfo.member.user_name
				}
				if (userinfo.member.member_district) {
					this.data.region = [userinfo.member.member_province, userinfo.member.member_city, userinfo.member.member_district]
				}
				let [member_province, member_city, member_district] = this.data.region
				memberObj = {
					...memberObj,
					member_province,
					member_city,
					member_district
				}
				this.setData({
					userinfo: userinfo,
					memberObj: memberObj,
					region: this.data.region
				},()=>{
					if(this.data.obj){
						this.openInputWnd()
					}
				})
			})
  },
  getMemberMetric() {
    Comm.MemberMetric({
      user_id: app.USER_ID()
    }, false).then(r => {
      console.log('Comm.MemberMetric => ', r)
      let memberMetric = []
      if (r.code == 200) {
        memberMetric = r.data.sort((a, b) => {
          return a.member_grade > b.member_grade ? 1 : -1
        })
      }
      this.setData({
        memberMetric: memberMetric
      })
    })
  }
})