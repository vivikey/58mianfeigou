import $ from 'request.js'
import regeneratorRuntime from 'regenerator-runtime.js'
/**
 * 公共接口
 */
let obj = {
  WeChatQrCode() {
		return '/api/showapi/getAppletCode'
  },//-- 获取小程序码
	GetWeChatPhone() {
		return '/api/wxapi/wxGetUserPhone'
	},//-- 获取小程序码绑定的手机号
	GetPhoneCode() {
		return '/api/showapi/getPhoneCode'
	},//-- 获取验证码
	BindPhone() {
		return '/api/showapi/personalCenterSetUserPhone'
	},//-- 绑定手机
	SubUserList() {
		return '/api/showapi/personalCenterOffLineList'
	},//-- 列表下线用户
	MemberMetric() {
		return '/api/Purchaseapi/showMemberFeeByNum'
	},//-- 显示平台的会员等级制度及所需缴纳的费用
	MemberPay() {
		return '/api/Purchaseapi/memberPayFeeByNum'
	},//-- 选择不同的等级，支付对应的费用
	MemberPaySuccess() {
		return '/api/Purchaseapi/memberPaySuccess'
	},//-- 用户支付成功后，调用
	AfterPayMemberSuccess() {
		return '/api/Purchaseapi/addMemberDistrictAndName'
	},//-- 续费/开通会员付费成功后调用
  async Do(data) {
    return await new Promise((resolve, reject) => {
      $.Post(this.url, data, r => {
        resolve(r.data)
      }, null, true)
    })
  }
}

const Comm = new Proxy(obj, {
  get(target, property) {
    target.url = target[property]()
    return target.Do.bind(target)
  }
})

export default Comm