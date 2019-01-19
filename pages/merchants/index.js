import StoreObj from '../../utils/util.js'
import Store from '../../comm/Store.js'
import TimeConverter from '../../comm/TimeConverter.js'
var app = getApp()
Page({
  data: {
    version: '',
    user: {},
    userInfo: {},
    storeList: [],
		knowok:true,
		know:`（1）、入驻平台商家需要缴纳保证金。保证金金额为1000元。店铺与平台每年签约一次，1年后可以申请退出平台并返还保证金。
（2）、店铺商家额外支付99元可以由“金牌会员”升级为价值3000元的“经理级会员”，仅限一人。
（3）、商家在店铺后台发布产品，结合店铺功能设计合适的推广模式。需要联盟会员推广的产品应设置好各个产品的推广费。推广费按件计算而不是按次来计算。
（4）、买家购物款一般在7天后进入平台中相应店铺账户，可以随时提现。
（5）、根据国家电商法的规定，所有店铺应具有营业执照和法人身份证明，包含有有特许经营的行业或者产品、服务需要上传相应的特许经营许可证。所经营内容不得超出营业执照的范围，不得从事各种违法违纪业务。`
  },
	onCheckClick(){
		this.setData({
			knowok: !this.data.knowok
		})
	},
  onLoad(options) {
    this.setData({
      version: app.VERSION(),
      user: app.globalData.user,
      userInfo: app.globalData.userInfo
    })
  },
	onNoVAS(){
		app.msg("未开通该增值服务!")
	},
  initData() {
    Store.List({
      user_id: app.USER_ID()
    }).then(res => {
      console.log('Store.List =>', res)
      if (res.code === 200) {
        this.setData({
          storeList: res.data.map(u => {
            u.addtime = TimeConverter.ToLocal(u.addtime)
            return u
          })
        })
      } else {
        app.ERROR(`StoreManage.LIST:${res.message}`)
      }
    })
  },
  onShow() {
    this.initData()
  },
  //-- 删除商铺
  delStore(e) {
    app.CONFIME("商铺删除后不能恢复，确定删除该商铺吗？", () => {
      Store.Delete({
        user_id: app.USER_ID(),
        store_id: e.currentTarget.id
      }).then(r => {
        if (r.code === 200) {
          app.SUCCESS(r.message, this.initData())
        } else {
          app.ERROR(r.message)
        }
      })
    })
  },
  //-- 转入信息编辑
  editStore(e) {
    wx.navigateTo({
      url: `/pages/merchants/info?id=${e.currentTarget.id}`,
    })
  },
  //-- 转至商铺展示首页
  toStoreHome(e) {
    wx.navigateTo({
      url: `/pages/store/detail?id=${e.currentTarget.id}`,
    })
  }
})