const regeneratorRuntime = require('./comm/regenerator-runtime') //-- v2.X
import $ from './comm/request.js'
App({
  globalData: {
    version: '2.6.0', //-- v2.X
    appname: '热网小程序',
    login: false,
    baseUrl: 'https://m.58daiyan.com',
    xcxUrl: 'https://xcx.58daiyan.com', //-- v2.X
    userInfo: {
      code: null,
      nickName: null,
      avatarUrl: null,
      token: null,
      phoneNumber: null,
      latitude: null,
      longitude: null,
      user_id: null,
      integral: 0,
      daibi: 0,
      myBalance: 0
    },
    share_store: 0,
    higher_up: 0, //-- 上级ID v2.X
    long_lat: [], //-- 当前经纬度 v2.X
    user: null, //-- 当前用户 v2.X
    member: null,
    authed: null,
    shareImg: ['https://m.58daiyan.com/static/game/game_share.jpg', 'https://m.58daiyan.com/static/game/mall_share.jpg'],
    shareTB: '免费好产品，人人都有份!',
    showPage: '/pages/index/index',
    currGift: null
  },
  /**
   * 以下是2.X的API
   */
	//-- 转换订单状态
	getOrderStatusTxt(order_status) {
		switch (order_status) {
			case 0:
				return '待付款'
			case 1001:
			case 1021:
				return '待发货'
			case 1011:
			case 2011:
				return '拼团中'
			case 1002:
			case 1012:
			case 1022:
			case 1043:
				return '待收货'
			case 2003:
			case 2013:
			case 2023:
			case 2043:
				return '待消费'
			default:
				return '已完成'
		}
	},
	//-- 订单来源
	getOrderFrm(order_status) {
		switch (order_status) {
			case 1001:
			case 1002:
			case 1003:
			case 2001:
			case 2004:
			case 2003:
				return '直购'
			case 1011:
			case 1012:
			case 1013:
			case 2011:
			case 2014:
			case 2013:
				return '拼团'
			case 1021:
			case 1022:
			case 1023:
			case 2021:
			case 2024:
			case 2023:
				return '赠品'
			case 1043:
			case 2043:
				return '推荐奖励'
		}
	},
  //--获取用户经纬度和地址
  async _localAddress() {
    return await new Promise((resolve, reject) => {
      wx.getLocation({
        type: 'gcj02',
        success: res => {
          console.log('wx.getUserLocation => ', res)
          $.Post(`/api/Addapi/addLocation`, {
              long: res.longitude,
              lat: res.latitude,
              user_id: this.USER_ID()
            },
            r => {
              this.UPD_LOCATION(res.longitude, res.latitude)
              if (r.data.code == 200) {
                r.data["area"] = r.data.data.match(/.+?(市|自治区|自治州|县|区)/g)
              }
              resolve(r.data)
            }, null, false)

        }
      })
    })
  },
  //--上传图片 
  async _uploadImage(path) {
    return await new Promise((resolve, reject) => {
      wx.uploadFile({
        url: `${this.globalData.xcxUrl}/api/addapi/uploadImg`,
        filePath: path,
        name: 'file',
        formData: {},
        success: r => {
          resolve(r)
        }
      })
    })
  },
  //--init code
  async _init(share_store) {
		share_store = share_store || 0
    return await new Promise((resolve, reject) => {
      wx.login({
        success: res => {
          console.log("2.X Methond[_init] call wx.login:", res)
          if (res.code) {
            this.globalData.userInfo.code = res.code
          }
          $.Post(`/api/Wxapi/wxLogin`, {
            code: res.code,
            higher_up: this.HIGHER_UP(),
						store_id: share_store
          }, res => {
						console.log('api/Wxapi/wxLogin => ',res)
						if(res.data.code==200){
							res.data.data["user_id"] = res.data.data.id
							res.data.data["user_img"] = res.data.data.userInfo.user_img
							res.data.data["nick_name"] = res.data.data.userInfo.nick_name
							this.USER(res.data.data)
						}
            resolve(res.data);
          }, null, false)
        }
      });
    })
  },
  //--登录到平台
  async _nplogin(data) {
    return await new Promise((resolve, reject) => {
      $.Post(`/api/Wxapi/wxUserInfo`, data, r => {
        resolve(r.data)
      }, null, true)
    })
  },
  //--获取微信用户信息
  async _getUserInfo() {
    return await new Promise((resolve, reject) => {
      wx.getUserInfo({
        withCredentials: true,
        success: res => {
          resolve(res);
        },
        fail: res => {
          //-- 未授权时
          wx.navigateTo({
            url: '/pages/index/auth',
          })
        }
      });
    })
  },
  //-- 获取默认分享数据
  SHARE_DEFAULT(imgidx, success) {
    imgidx = imgidx || 0
    let obj = {
      path: `${this.globalData.showPage}?higher_up=${this.USER_ID()}`,
      title: this.globalData.shareTB,
      imageUrl: this.globalData.shareImg[imgidx],
      success: success
    }
    return obj;
  },
  //-- 设置或获取上级用户的ID
  HIGHER_UP(uid) {
    if (uid) {
      this.globalData.higher_up = uid
    } else {
      return this.globalData.higher_up
    }
  },
  //-- 设置或获取当前用户实体
  USER(obj) {
    if (obj) {
      this.globalData.user = obj
    } else {
      return this.globalData.user
    }
  },
	//-- 获取系统信息
	SYSTEM_INFO(){
		return wx.getSystemInfoSync()
	},
  //-- 获取当前用户的ID
  USER_ID() {
    return this.globalData.user.id
  },
  //-- 获取当前小程序的版本
  VERSION() {
    return this.globalData.version
  },
  //-- 更新当前经纬度
  UPD_LOCATION(long, lat) {
    this.globalData.userInfo.longitude = long
    this.globalData.userInfo.latitude = lat
  },
  //-- 获取当前经纬度
  LOCATION() {
    return {
      longitude: this.globalData.userInfo.longitude,
      latitude: this.globalData.userInfo.latitude
    }
  },
  ERROR(err_msg, fn) {
    wx.showModal({
      title: 'ERROR',
      content: err_msg,
      confirmColor: '#f00',
      confirmText: '确定',
      showCancel: false,
      success: fn
    })
  },
  SUCCESS(ok_msg, fn) {
    wx.showModal({
      title: 'SUCCESS',
      content: ok_msg,
      confirmColor: '#0f0',
      confirmText: '确定',
      showCancel: false,
      success: fn
    })
  },
  CONFIME(msg, okhandle) {
    wx.showModal({
      title: '确认提醒',
      content: msg,
      success: res => {
        if (res.confirm) {
          okhandle()
        }
      }
    })
  },
  onLaunch() {
		
  },  
  //-- 拼接图片路径
  joinPath(p1, p2) {
    var pa = p1,
      pb = p2;
    if (pb.indexOf(p1) >= 0) {
      return p2;
    } else {
      if (p2.startsWith('/'))
        return p1 + p2;
      else
        return p1 + '/' + p2;
    }
  },
    //-- 获取微信用户位置
  getUserLocation(fn) {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        console.log('getUserLocation:', res)
        this.updateUserLocation(res.latitude, res.longitude)
        if (typeof fn === 'function')
          fn(res.latitude, res.longitude);
      }
    })
  },
  //-- 更新用户位置信息
  updateUserLocation(latitude, longitude) {
    this.userInfoData({
      latitude: latitude,
      longitude: longitude
    })
  },
  //-- 强行转向页面
  Launch: url => {
    wx.reLaunch({
      url: url
    })
  },
	getJson: function (url, success, failHandle) {
		return this.ajax(url, 'GET', null, success, failHandle);
	},
	post: function (url, data, success, failHandle) {
		return this.ajax(url, 'POST', data, success, failHandle);
	},
	//-- 通用的异步请求方法
	ajax: function (url, method, data, success, failHandle) {
		this.request(url, method, data, true, success, failHandle)
	},
	request: function (url, method, data, showload, success, failHandle) {
		if (showload) {
			wx.showLoading({
				title: '加载中...',
			})
		}
		wx.request({
			url: url,
			method: method,
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			data: data,
			success: success,
			complete: function () {
				if (showload) {
					wx.hideLoading()
				}
			},
			fail: failHandle || function (res) {
				console.debug('request fail:', res)
			}
		});
	},
  //-- 获取轮播图数据
  getBanner(callback) {
    this.post('https://m.58daiyan.com/MinimallApi/getBanner', {}, callback)
  },
  //-- 分享到群成功后调用
  endSendShare(shareTicket, callback) {
    wx.getShareInfo({
      shareTicket: shareTicket,
      success: callback
    })
  },
  msg(msg) {
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 2000
    })
  },
  //-- 模态提示
  msgbox(obj) {
    wx.showModal({
      title: obj.title || '提示',
      content: obj.content || '未设置内容',
      confirmColor: '#f00',
      cancelColor: '#50d1fe',
      cancelText: obj.cancelText || '取消',
      confirmText: obj.confirmText || '确定',
      showCancel: obj.showCancel,
      success: obj.success,
      fail: obj.fail
    })
  },
  //-- 转换时间
  convertDate(dateStr) {
    var dateStr = dateStr.split(' ')
    var today = new Date(Date.now())
    var t = new Date(dateStr.join('T') + 'Z')
    console.log('today:', today)
    console.log('date:', t.getFullYear())

    var yearsub = today.getFullYear() - t.getFullYear()
    var monthsub = today.getMonth() - t.getMonth()
    var daysub = today.getDate() - t.getDate()
    var hoursub = today.getHours() - t.getHours()
    var minsub = today.getMinutes() - t.getMinutes()

    console.log(yearsub, monthsub, daysub, hoursub, minsub)
    if (yearsub > 0)
      return `${yearsub}年前`
    else if (monthsub > 0)
      return `${monthsub}月前`
    else if (daysub > 0)
      return `${daysub}天前`
    else if (hoursub > 0)
      return `${hoursub}小时前`
    else if (minsub > 0)
      return `${minsub}分钟前`
    else
      return `刚刚`
  },
})