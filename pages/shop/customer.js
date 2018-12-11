import StoreObj from '../../utils/util.js'
var app=getApp()
Page({
  data: {
      store_id:0,
      store:{},
      comment: '',
      message_list:[]
  },
  onLoad: function (options) {
      var id=options.id
    this.setData({
        store_id:id
    })
    this.initStore()
  },
      //-- 初始化数据
    initStore: function () {
        var store = new StoreObj.Store(app.globalData.userInfo.token, this.data.store_id)
        store.Get(app.post, res => {
            var ob = res.data.data
            console.log('Get Store:', res.data)
            store.title = ob.title;
            store.rel_name = ob.rel_name;
            store.rel_phone = ob.rel_phone;
            store.rel_mobile = !ob.rel_mobile || ob.rel_mobile.length <= 0 ? ob.rel_phone : ob.rel_mobile;
            store.rel_address = ob.rel_address;
            store.province = ob.province;
            store.city = ob.city;
            store.district = ob.district;
            store.lng = ob.lng;
            store.lat = ob.lat;
            store.logo = app.joinPath(app.globalData.baseUrl, ob.logo);
            store.store_id = ob.id;
            store.pt_jieshao = ob.pt_jieshao;
            store.is_attention = ob.is_attention;
            store.business_start_time = !ob.business_start_time ? "08:00" : ob.business_start_time;
            store.business_end_time = !ob.business_end_time ? "21:00" : ob.business_end_time;

            this.setData({
                store: store,
            })

            this.myMessages()
        })
    },
    //-- 打电话
    callPhone: function(e) {
        console.log(e)
        wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.tel,
        })
    },
    onInputChange:function(e){
        var comment = e.detail.value
        this.setData({
            comment: comment
        })
    },
    //-- 发送发言
    sendComment: function () {
        var comment = this.data.comment
        if (comment.length <= 0) {
            wx.showModal({
                title: '警告',
                showCancel: false,
                confirmColor: '#50d1fe',
                content: '留言内容不能为空！',
                success: function (res) { }
            })
            return false;
        }
       
        app.sendComment({
            token: app.userInfo().token,
            is_anonymous: 0,
            store_id: this.data.store.store_id,
            content: comment,
            type: 1
        }, res => {
            this.myMessages()
            if (res.data.status == 1) {
                wx.showModal({
                    title: '提示',
                    showCancel: false,
                    confirmColor: '#50d1fe',
                    content: res.data.message,
                    success: (data) => {
                        if (data.confirm) {
                            this.setData({
                                comment: ''
                            })
                        }
                    }
                })
            } else {
                wx.showModal({
                    title: '提示',
                    showCancel: false,
                    confirmColor: '#50d1fe',
                    content: res.data.message
                })
            }

        })
    },
    myMessages:function(){
        app.loadMessageList({
            token: app.userInfo().token,
            store_id:this.data.store_id,
            is_store: 1,
            type: 1,
            num: 99
        }, res => {
            console.log('getMyMessages:', res.data)
            if (res.data.data.message_list) {
                this.setData({
                    message_list: res.data.data.message_list
                })
            }
        })
    }
})