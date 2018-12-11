var app = getApp()
import provecode from '../../utils/proveCode.js'
import Proxier from '../../utils/proxier.js'
Page({
    data: {
        proxier: {},
        provecode: [],
        user:{},
    },
    onLoad: function(options) {
        this.setData({
            provecode: provecode,
            user:app.globalData.user
        })
    },
    onShow: function() {
        wx.clearStorage()
        this.initData()
    },
    initData: function (callback) {
            var proxier = new Proxier(0, app.userInfo().token)
            app.post('https://m.58daiyan.com/AgentApi/getAgentDetails', {
                token: proxier.token
            }, res => {
                console.log('getProxier:', res.data)
                var obj = res.data.data
                if (obj.id) {
                    proxier.agent_id = obj.id
                    proxier.name = obj.name
                    proxier.phone = obj.phone
                    proxier.sex = obj.sex
                    proxier.identity = obj.identity
                    proxier.idnumber_image = obj.idnumber_image
                    proxier.grade_id = obj.grade_id
                    proxier.area_code = obj.area_code,
                        proxier.rec_cardNo = obj.rec_cardNo
                    this.setData({
                        status: obj.status,
                        money: obj.money,
                        reason: obj.reason,
                        is_fee: obj.is_fee
                    })
                } else {
                    proxier.grade_id = this.data.proxyLevel[0].id
                    proxier.phone = app.globalData.user.phone
                    proxier.identity = app.globalData.user.identity
                    proxier.idnumber_image = !app.globalData.user.idnumber_image ? [] : app.globalData.user.idnumber_image.split(',')
                }

                this.setData({
                    proxier: proxier
                })

                if (typeof callback === 'function') {
                    callback()
                }
            })
    },

})