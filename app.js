const regeneratorRuntime = require('./comm/regenerator-runtime')  //-- v2.X
import $ from './comm/request.js'
App({
    globalData: {
        version: 'V2.1.0', //-- v2.X
        appname: '58免费购小程序',
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
        rec_token: null,
        higher_up:0,//-- 上级ID v2.X
        long_lat: [],//-- 当前经纬度 v2.X
        user: null,//-- 当前用户 v2.X
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
    //--M6 获取用户经纬度和地址
    async _localAddress(){
        return await new Promise((resolve, reject) => {
            wx.getLocation({
                type: 'gcj02',
                success: res => {
                    console.log('wx.getUserLocation => ', res)
                    $.Post(`/api/Addapi/addLocation`, 
                    { long: res.longitude, lat: res.latitude,user_id:this.USER_ID()},
                     r => {
                         this.UPD_LOCATION(res.longitude,res.latitude)
                        if(r.data.code==200){
                            r.data["area"] = r.data.data.match(/.+?(市|自治区|自治州|县|区)/g)
                        }
                        resolve(r.data)
                    }, null, false)
                    
                }
            })
        })
    },
    //--M5 上传图片 
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
    //--M1 init code
    async _init() {
        return await new Promise((resolve, reject) => {
            wx.login({
                success: res => {
                    console.log("2.X Methond[_init] call wx.login:", res)
                    if (res.code) {
                        this.globalData.userInfo.code = res.code
                    }
                    $.Post(`/api/Wxapi/wxLogin`, {
                        code: res.code,
                        higher_up: this.HIGHER_UP()
                    }, res => {
                        resolve(res.data);
                    }, null, false)
                }
            });
        })
    },
    //--M2 登录到平台
    async _nplogin(data) {
        return await new Promise((resolve, reject) => {
            $.Post(`/api/Wxapi/wxUserInfo`, data, r => {
                resolve(r.data)
            }, null, true)
        })
    },
    //--M3 获取微信用户信息
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
    SHARE_DEFAULT(imgidx,success){
        imgidx = imgidx || 0
        let obj = {
            path: `${this.globalData.showPage}?higher_up=${this.USER_ID()}`,
            title: this.globalData.shareTB,
            imageUrl: this.globalData.shareImg[imgidx],
            success:success
        }
        return obj;
    },
    //-- 设置或获取上级用户的ID
    HIGHER_UP(uid){
        if (uid) {
            this.globalData.higher_up = uid
        } else {
            return this.globalData.higher_up
        }
    },
    //-- 设置或获取当前用户实体
    USER(obj){
        if (obj){
            this.globalData.user = obj 
        }else{
            return this.globalData.user
        }
    },
    //-- 获取当前用户的ID
    USER_ID() {
        return this.globalData.user.id
    },
    //-- 获取当前小程序的版本
    VERSION(){
        return this.globalData.version
    },
    //-- 更新当前经纬度
    UPD_LOCATION(long,lat){
        this.globalData.userInfo.longitude = long
        this.globalData.userInfo.latitude = lat
    },
    //-- 获取当前经纬度
    LOCATION(){
        return { longitude: this.globalData.userInfo.longitude, latitude:this.globalData.userInfo.latitude}
    },
    ERROR(err_msg,fn) {
        wx.showModal({
            title: 'ERROR',
            content: err_msg,
            confirmColor: '#f00',
            confirmText: '确定',
            showCancel: false,
            success:fn
        })
    },
    SUCCESS(ok_msg,fn) {
        wx.showModal({
            title: 'SUCCESS',
            content: ok_msg,
            confirmColor: '#0f0',
            confirmText: '确定',
            showCancel: false,
            success:fn
        })
    },
    CONFIME(msg,okhandle){
        wx.showModal({
            title: '确认提醒',
            content: msg,
            success: res=>{
                if (res.confirm){
                    okhandle()
                }
            }
        })
    },
    /**
     * 以下是1.X的API
     */
    onLaunch() {
        //this.getUserLocation()
    },
    request(url, method, data, showload, success, failHandle) {
        if (showload) {
            wx.showLoading({
                title: '加载中...',
            })
        }
        wx.request({
            url: url,
            method: method,
            data: data,
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: success,
            complete: () => {
                if (showload) {
                    wx.hideLoading()
                }
            },
            fail: failHandle || function (res) {
                wx.showModal({
                    title: '服务器请求失败',
                    content: url,
                    confirmColor: '#f00',
                    cancelColor: '#50d1fe',
                    cancelText: '取消',
                    confirmText: '确定',
                    showCancel: false
                })
            }
        });
    },
    //-- 获取小程序码二进制数据
    getBinaryQrCode(data, callback) {
        this.request('https://m.58daiyan.com/MinimallApi/creatQrCode', 'POST', data, false, callback)
    },
    //-- 获取推荐资格
    getTuijianQualification(shop_id, callback) {
        this.request('https://m.58daiyan.com/MinimallApi/is_rec', 'POST', {
            token: this.userInfo().token,
            shop_id
        }, false, callback)
    },
    //-- 获取初始时间
    getInitTime(yearspan) {
        let today = new Date()
        return `${today.getFullYear()+yearspan}-${(today.getMonth() + 1) < 10 ? "0" + (today.getMonth() + 1) : (today.getMonth() + 1)}-${today.getDate() < 10 ? "0" + today.getDate() : today.getDate()}`
    },
    //-- 获取商铺余额明细
    getStoreMoneyDetails(store_id, callback) {
        this.post('https://m.58daiyan.com/UsersApi/getbalancelog', {
            token: this.userInfo().token,
            store_id,
            from: 5
        }, callback)
    },
    //-- 获取商铺详情
    getStoreDetails(store_id, callback) {
        this.request('https://m.58daiyan.com/StoreApi/getStoreDetails', 'POST', {
            store_id,
            token: this.userinfo().token
        }, false, callback)
    },
    //-- 获取余额
    getBalance(callback) {
        this.request('https://m.58daiyan.com/MinimallApi/getMoney', 'POST', {
            token: this.userInfo().token
        }, false, callback)
    },
    //-- 获取用户在商铺的余额
    getStoreBalance(store_id, callback) {
        this.request('https://m.58daiyan.com/MinimallApi/getMoney', 'POST', {
            token: this.userInfo().token,
            store_id
        }, false, callback)
    },
    //-- 点赞
    doLike(id, callback) {
        this.request('https://m.58daiyan.com/MinimallApi/like', 'POST', {
            token: this.userInfo().token,
            type: 1,
            id
        }, false, callback)
    },
    //-- 取消点赞
    donotLike(id, callback) {
        this.request('https://m.58daiyan.com/MinimallApi/dellike', 'POST', {
            token: this.userInfo().token,
            type: 1,
            id
        }, false, callback)
    },
    //-- 删除订单
    removeOrder(order_id, callback) {
        this.post('https://m.58daiyan.com/UsersApi/del_order', {
            token: this.userInfo().token,
            order_id
        }, callback)
    },
    //-- 取消订单
    cancelOrder(order_id, callback) {
        this.post('https://m.58daiyan.com/UsersApi/cancel_order', {
            token: this.userInfo().token,
            order_id
        }, callback)
    },
    //-- 订单确认收货或扫码消费
    confirmOrder(data, callback) {
        this.post('https://m.58daiyan.com/UsersApi/confirm_order_by_seller', data, callback)
    },
    //-- 计算选择的商品金额
    getTotalPrice(data, callback) {
        this.post('https://m.58daiyan.com/MinimallApi/getTotalPrice', data, callback)
    },
    //-- 下订单
    createOrder(data, callback) {
        this.request('https://m.58daiyan.com/MinimallApi/order', 'POST', data, false, callback)
    },
    //-- 获取订单支付信息
    getOrderPayInfo(data, callback) {
        this.request('https://m.58daiyan.com/MinimallApi/orderQuery', 'POST', data, false, callback)
    },
    //-- 获取未读消息或公告数量
    getUnReadNum(param, callback) {
        this.request('https://m.58daiyan.com/MinimallApi/getUnReadNum', {
            token: this.userInfo().token,
            is_store: param.is_store,
            type: param.type
        }, false, callback)
    },
    //-- 获取消息或公告列表
    getMsgNoticeList(is_store, type, callback) {
        this.post('https://m.58daiyan.com/MinimallApi/getNoticeList', {
            token: this.userInfo().token,
            is_store,
            type
        }, callback)
    },
    //-- 设置状态
    setMsgStatus(id, type, status, callback) {
        this.post('https://m.58daiyan.com/StoreApi/check_message', {
            token: this.userInfo().token,
            message_id: id,
            type: type,
            status: status
        }, callback)
    },
    //-- 回复留言
    replyMsg(id, content, callback) {
        this.post('https://m.58daiyan.com/StoreApi/reply', {
            token: this.userInfo().token,
            message_id: id,
            reply_content: content
        }, callback)
    },
    //-- 移除回复
    removeReply(id, callback) {
        this.post('https://m.58daiyan.com/StoreApi/del_reply', {
            token: this.userInfo().token,
            reply_id: id
        }, callback)
    },
    //-- 关注或收藏
    addAOC(type, id, callback) {
        this.post('https://m.58daiyan.com/MinimallApi/collect', {
            token: this.userInfo().token,
            type,
            id
        }, callback)
    },
    //-- 取消关注或收藏
    removeAOC(type, id, callback) {
        this.post('https://m.58daiyan.com/MinimallApi/delcollect', {
            token: this.userInfo().token,
            type,
            id
        }, callback)
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
    //-- 获取某商家的标签
    getLabelsByStore(storeId, callback) {
        this.post('https://m.58daiyan.com/StoreApi/getLabelListByID', {
            token: this.userInfo().token,
            store_id: storeId,
            num: 999
        }, callback)
    },
    //-- 发表反馈、评价
    sendComment(data, callback) {
        this.post('https://m.58daiyan.com/MinimallApi/message', data, callback)
    },
    //-- 加载反馈
    loadMessageList(data, callback) {
        this.post('https://m.58daiyan.com/MinimallApi/myMessageList', data, callback)
    },
    //-- 加载反馈列表（后台）
    loadCommentList(data, callback) {
        this.post('https://m.58daiyan.com/StoreApi/getMessageListByID/', data, callback)
    },
    //-- 加载评价列表
    loadEvaluatList(data, callback) {
        this.post('https://m.58daiyan.com/MinimallApi/getEvaluate', data, callback)
    },
    //-- 进入小程序
    enter() {
        var data = {
            token: this.userInfo().token,
            longitude: this.userInfo().longitude,
            latitude: this.userInfo().latitude
        }
        if (this.globalData.rec_token)
            data.rec_token = this.globalData.rec_token
        this.getUserAccess(data, res => {
            console.log('access:', res.data)
            this.Launch(this.globalData.showPage)
        })

    },
    //-- 1.X 通用的异步请求方法
    ajax(url, method, data, success, failHandle) {
        this.request(url, method, data, true, success, failHandle)
    },
    //-- 1.X
    getJson(url, success, failHandle) {
        return this.ajax(url, 'GET', null, success, failHandle);
    },
    //-- 1.X
    post(url, data, success, failHandle) {
        return this.ajax(url, 'POST', data, success, failHandle);
    },
    //-- 设置 userInfo的数据
    userInfoData(valObj) {
        for (var key in valObj) {
            if (valObj.hasOwnProperty(key)) {
                this.globalData.userInfo[key] = valObj[key]
            }
        }
    },
    //-- 通用的设置globalData的直接数据项
    setData(key, value) {
        this.globalData[key] = value
    },
    //-- 获取用户基本信息
    getUserFullInfo(callback) {
        this.post('https://m.58daiyan.com/MinimallApi/getUserIndex', {
            token: this.globalData.userInfo.token
        }, callback);
    },
    //-- 获取 userInfo
    userInfo() {
        return this.globalData.userInfo;
    },
    //-- 能否进入检查
    getUserAccess(data, callback) {
        this.post('https://m.58daiyan.com/MinimallApi/access', data, callback)
    },
    //-- 获取微信用户信息
    getUserInfo(callback) {
        wx.getUserInfo({
            success: (res) => {
                console.log('getUserInfo:', res.userInfo)
                this.userInfoData({
                    avatarUrl: res.userInfo.avatarUrl,
                    nickName: res.userInfo.nickName
                })
                if (typeof callback === 'function')
                    callback();
            }
        })
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
    //-- 上传图片
    UploadImg(path, callback) {
        wx.uploadFile({
            url: 'https://m.58daiyan.com/StoreApi/uploadfile',
            filePath: path,
            name: 'file',
            formData: {},
            success: callback
        })
    },
    //-- 转换经纬度为实际地址
    changeLocation(dataobj, callback) {
        this.post('https://m.58daiyan.com/MinimallApi/getaddressbylatlag', dataobj, callback);
    },
    //-- 获取轮播图数据
    getBanner(callback) {
        this.post('https://m.58daiyan.com/MinimallApi/getBanner', {}, callback)
    },
    //-- 获取 为你推荐
    getRecommend(callback) {
        this.post('https://m.58daiyan.com/MinimallApi/getRecommend', {}, callback)
    },
    //-- 获取 动态通知
    getDynamic(callback) {
        this.request('https://m.58daiyan.com/MinimallApi/getDynamic', 'POST', {
            num: 10
        }, false, callback)
    },
    //-- 获取全部赠品
    getPresentListByCat(cat, callback) {
        this.request('https://m.58daiyan.com/MinimallApi/getPresentListByCat', 'POST', cat, false, callback)
    },
    //-- 获取积分
    getIntegral(callback) {
        this.post('https://m.58daiyan.com/MinimallApi/getIntegral', {
            token: this.globalData.userInfo.token
        }, callback)
    },
    //-- 获取代币
    getToken(callback) {
        this.request('https://m.58daiyan.com/UsersApi/getToken', 'POST', {
            token: this.userInfo().token
        }, false, callback)
    },
    //-- 获取签到信息
    getSigninfo(callback) {
        this.post('https://m.58daiyan.com/MinimallApi/getSigninfo', {
            token: this.globalData.userInfo.token
        }, callback)
    },
    //-- 刷新积分与签到信息
    refreshIntegralSigninfo(callback) {
        this.getIntegral(res => {
            console.log('获取积分：', res.data)
            this.userInfoData({
                integral: res.data.data.integral
            })
            this.getSigninfo(callback)
        })
    },
    //-- 删除赠品券
    removeGift(coupon_id, callback) {
        this.post('https://m.58daiyan.com/MinimallApi/del_coupon', {
            token: this.userInfo().token,
            coupon_id
        }, callback)
    },
    //-- 签到
    setSign(callback) {
        this.post('https://m.58daiyan.com/MinimallApi/sign', {
            token: this.globalData.userInfo.token
        }, callback)
    },
    //-- 分享到群成功后调用
    endSendShare(shareTicket, callback) {
        wx.getShareInfo({
            shareTicket: shareTicket,
            success: callback
        })
    },
    //-- 把分享结果发送给服务器
    sendShareResult(data, callback) {
        this.post('https://m.58daiyan.com/MinimallApi/share', data, callback)
    },
    //-- 获取今天的日期
    getToday() {
        var date = new Date()
        var year = date.getFullYear()
        var month = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1)
        var day = (date.getDate() < 10 ? '0' : '') + date.getDate()
        return year + '-' + month + '-' + day
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
    //-- 验证手机是否可用
    canUsedPhone(mobile, callback) {
        this.post('https://m.58daiyan.com/UsersApi/mobile_yz', {
            token: this.globalData.userInfo.token,
            mobile
        }, callback)
    },
    //-- 往手机发送验证码
    sendPhoneCode(phone, callback) {
        this.post('https://m.58daiyan.com/UsersApi/sendCode', {
            token: this.userInfo().token,
            phone
        }, callback)
    },
    //-- 验证输入的验证码
    validatePhoneCode(code, phone, callback) {
        this.post('https://m.58daiyan.com/UsersApi/code_verify', {
            token: this.userInfo().token,
            code,
            phone
        }, callback)
    },
    //-- 更新手机号
    rebindPhone(code, phone, is_code, callback) {
        this.post('https://m.58daiyan.com/UsersApi/updatePhone', {
            token: this.userInfo().token,
            phone,
            code,
            is_code
        }, callback)
    },
    //-- 充值
    recharge(type, money, code, store_id, callback) {
        this.post('https://m.58daiyan.com/UsersApi/recharge', {
            token: this.userInfo().token,
            code,
            type,
            money,
            store_id,
            from: 5
        }, callback)
    },
    //-- 获取团购列表（排序）
    getGroupBuyListByCat(cat, callback) {
        this.request('https://m.58daiyan.com/MinimallApi/getShopList', 'POST', cat, false, callback)
    },
    //-- 获取access_token
    getAccessToken(callback) {
        this.request('https://m.58daiyan.com/MinimallApi/get_access_token', 'GET', {}, false, callback)
    }
})