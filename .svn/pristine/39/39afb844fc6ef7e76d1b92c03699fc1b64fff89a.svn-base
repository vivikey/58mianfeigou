var app=getApp()
import Proxier from '../../utils/proxier.js'
import provecode from '../../utils/proveCode.js'
Page({
  data: {
      user:{},
      member:{},
      proxier: {},
      provecode: [],
      validate: false,
      oldphone: null,
      getTitle: '获取验证码',
      canGetcode: true,
      countrec: 59,
      timer: null,
      code: null,
      proxyLevel: [],
      pcidx: 0,
      user: {},
      status: null,
      money: 0.0,
      reason: '',
      is_fee: null
  },
  onLoad: function (options) {
      this.setData({
          provecode: provecode
      })
      app.getUserFullInfo(res => {
          console.log('getUserFullInfo:', res.data.data.user)
          if (res.data.data.user) {
              app.globalData.user = res.data.data.user
              app.globalData.member = res.data.data.member
              this.setData({
                  user: res.data.data.user,
                  member: res.data.data.member
              })
          }
      });
  },
  indexOfProveCode:function(code){
      var provecode=this.data.provecode
      console.log(code,provecode)
      for(var i=0;i<provecode.length;i++){
          if(provecode[i].k==code){
              return i;
          }
      }
  },
  onShow: function () {
      wx.clearStorage()
      this.initData()
  },
    initData: function (callback) {
        this.getProxyLevel(() => {
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
                    proxier.introduce = !obj.introduce || obj.introduce == "null" ? "" : obj.introduce
                    this.setData({
                        status: obj.status,
                        money: obj.money,
                        reason: obj.reason,
                        is_fee: obj.is_fee,
                        pcidx: this.indexOfProveCode(obj.area_code)
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
        })

    },
    bindCodeChange: function (e) {
        var proxier = this.data.proxier
        proxier.area_code = provecode[e.detail.value].k
        this.setData({
            proxier: proxier,
            pcidx: e.detail.value
        })
    },
    changeGender: function (e) {
        var proxier = this.data.proxier
        proxier.sex = e.detail.value
        this.setData({
            proxier: proxier
        })
    },
    proxyLevelChange: function () {
        var proxier = this.data.proxier
        proxier.grade_id = e.detail.value
        this.setData({
            proxier: proxier
        })
    },
    //-- 图片
    choseIdNumberImg: function () {
        wx.chooseImage({
            count: 2 - this.data.proxier.idnumber_image.length,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                var tempFilePaths = res.tempFilePaths
                var proxier = this.data.proxier;
                for (var i = 0; i < tempFilePaths.length; i++) {
                    var image = tempFilePaths[i]
                    app.UploadImg(image, res => {
                        proxier.idnumber_image.push(app.joinPath(app.globalData.baseUrl, JSON.parse(res.data).data.saveURL));
                        this.setData({
                            proxier: proxier
                        })
                    })
                }
            }
        })
    },
    //-- 获取代理级别
    getProxyLevel: function (fn) {
        app.request('https://m.58daiyan.com/AgentApi/getGradeList', 'POST', {
            token: app.userInfo().token
        }, false, res => {
            if (res.data.data) {
                this.setData({
                    proxyLevel: res.data.data
                })
            }
            console.log('getProxyLevel complete', typeof fn)
            if (typeof fn === 'function') fn()
        })
    },
    //-- 移除操作
    removeImg: function (e) {
        var proxier = this.data.proxier
        proxier.idnumber_image.splice(e.target.dataset.idx, 1)
        this.setData({
            proxier: proxier
        })
    },
    //-- 输入框失去焦点事件
    inputBlur: function (e) {
        var proxier = this.data.proxier;
        proxier[e.currentTarget.id] = e.detail.value;
        this.setData({
            proxier: proxier
        })
    },
    inputPhoneBlur: function (e) {
        var proxier = this.data.proxier;
        proxier.phone = e.detail.value;
        var validate = this.data.validate
        var oldphone = this.data.oldphone
        if (proxier.phone.length <= 0 || proxier.phone == app.globalData.user.phone || (proxier.phone == oldphone && oldphone != null)) {
            validate = false;
        } else {
            validate = true;
        }
        this.setData({
            proxier: proxier,
            validate: validate
        })
    },
    bindingPhone: function () {
        var phone = this.data.proxier.phone
        if (!phone || phone.length < 11) {
            app.msg("请输入11位有效手机号码")
            return;
        }
        var code = this.data.code
        if (!code || code.length < 4) {
            app.msg('请输入验证码')
            return;
        }

        app.validatePhoneCode(code, phone, res => {
            if (res.data.status == 0) {
                app.msg('验证码错误')
                return;
            }
            wx.showToast({
                title: '验证通过！',
                duration: 2000,
                success: res => {
                    this.setData({
                        validate: false
                    })
                    wx.setStorage({
                        key: phone,
                        data: true,
                    })
                }
            })
        })
    },
    codeinput: function (e) {
        this.setData({
            code: e.detail.value
        })
    },
    //-- 验证手机号
    validatePhone: function () {
        var proxier = this.data.proxier
        if (!proxier.phone || proxier.phone.length < 11) {
            app.msg("请输入11位有效手机号码")
            return;
        }
        app.canUsedPhone(proxier.phone, res => {
            console.log('validatePhone：', res.data)
            if (res.data.status == 1) {
                app.msg("此号码已被占用！")
            } else {
                app.sendPhoneCode(proxier.phone, res => {
                    if (res.data.status == 1) {
                        app.msg('验证码已发送！')
                        this.setData({
                            canGetcode: false,
                            getTitle: '59秒后重发',
                            timer: setInterval(res => {
                                var countrec = this.data.countrec
                                if (countrec > 0) {
                                    this.setData({
                                        countrec: countrec - 1,
                                        hasSended: true,
                                        getTitle: `${countrec - 1}秒后重发`,
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
                        })
                    }
                })
            }
        })
    },
    //-- 提交审核
    Save: function () {
        var proxier = this.data.proxier;
        console.log('proxier:', proxier)
        if (proxier.name.length <= 0) {
            app.msg("请输入姓名")
            return;
        }
        if (proxier.phone.length < 11) {
            app.msg("请输入11位有效手机号码")
            return;
        }
        if (proxier.phone != app.globalData.user.phone) {
            wx.getStorage({
                key: proxier.phone,
                fail: res => {
                    app.msg('手机号码未验证！')
                    return;
                },
                success: function (res) {
                    if (!res.data) {
                        app.msg('手机号码未验证！')
                        return;
                    }
                },
            })
        }
        if (proxier.rec_cardNo.length <= 0) {
            app.msg("请输入推荐码")
            return;
        }
        if (proxier.introduce.length <= 0) {
            app.msg("请输入自我介绍")
            return;
        }
        if (!/^[1-9]\d{16}[0-9X]$/.test(proxier.identity)) {
            app.msg("身份证号码无效")
            return;
        }
        if (proxier.idnumber_image.length != 2) {
            app.msg("请上传身份证正反两面照片")
            return;
        }
        proxier.Post(app.post, res => {
            console.log(res.data)
            if (res.data.status == 1) {
                this.initData()
            }
            app.msgbox({
                content: res.data.message,
                showCancel: false
            })
        })
    }
})