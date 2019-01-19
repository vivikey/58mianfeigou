var app = getApp()
import Comm from '../../comm/Comm.js'
import UserCenter from '../../comm/UserCenter.js'
Page({
  data: {
    userinfo: {},
    version: '',
    memberMetric: [],
    ty: '开通',
		sc: 0,
    inputWndShow: false,
    region: ['江苏省', '苏州市', '姑苏区'],
    obj: {},
    memberObj: {
      user_name: '',
      higher_member_code: '',
      member_province: '江苏省',
      member_city: '苏州市',
      member_district: '姑苏区'
    },
    memberpwe: [
			{
				id:1,
				content: '加入“自强联盟”，在实践中学习社群运营。',
				detail:''
			},
			{
				id: 2,
				content: '有偿推荐新人加入“自强联盟”。',
				detail: ''
			},
			{
				id: 3,
				content: '有偿推荐线上or线下商家入驻“热网”。',
				detail: ''
			},
			{
				id: 4,
				content: '有偿推荐“热网”商铺中的好产品。',
				detail: ''
			},
			{
				id: 5,
				content: '可以会员价购买“热网”商铺中推广产品。',
				detail: ''
			},
			{
				id: 6,
				content: '发展团队、管理团队并从中获得相应的管理佣金。',
				detail: ''
			}
    ]
  },
  onAreaClick() {
    return false;
  },
	swiperChange: function (e) {
		this.setData({
			sc: e.detail.current
		})
	},
  onLoad(options) {},
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
  bindRegionChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
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
        console.log(res)
        if (res.errMsg == 'scanCode:ok') {
          let robj = JSON.parse(res.result)
          console.log('wx.scanCoce => ', robj)
          if (!robj.mc) {
            app.ERROR("无效的自强联盟会员码！")
          } else {

            this.data.memberObj.higher_member_code = robj.mc
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
    let obj = memberMetric[index]

    //--判断是否有授权
    if (!this.data.userinfo.user.nick_name) {
      wx.navigateTo({
        url: '/pages/index/auth',
      })
      return;
    }
    //--判断是否有绑定手机号
    if (!this.data.userinfo.user.user_phone) {
      wx.navigateTo({
        url: '/pages/index/bindphone',
      })
      return;
    }
    this.setData({
      inputWndShow: true,
      obj: obj
    })
  },
  hideInputWnd() {
    this.setData({
      inputWndShow: false
    })
  },
  /**选择支付 */
  payChosed() {
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
            app.SUCCESS('开通成功', this.onShow)
            this.hideInputWnd()
          } else {
            app.ERROR(r.message)
          }
        })
      }
    })
  },
  onShow() {
    this.setData({
      version: app.VERSION()
    })
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
        Comm.MemberMetric({
          user_id: app.USER_ID()
        }).then(r => {
          console.log('Comm.MemberMetric => ', r)
          let memberMetric = []
          if (r.code == 200) {
            memberMetric = r.data.sort((a, b) => {
              return a.id > b.id ? 1 : -1
            })
          }
          let [member_province, member_city, member_district] = this.data.region
          memberObj = { ...memberObj,
            member_province,
            member_city,
            member_district
          }
          this.setData({
            memberMetric: memberMetric,
            userinfo: userinfo,
            memberObj: memberObj,
            region: this.data.region
          })
        })
      })
  },
})