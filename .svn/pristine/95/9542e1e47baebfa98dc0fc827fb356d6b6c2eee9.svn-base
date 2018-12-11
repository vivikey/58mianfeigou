var app=getApp()
import Address from '../../comm/Address.js'
Page({
    data: {
        version:'',
        user:{},
        addresscount:0
    },
    onLoad: function (options) {
        this.setData({
            version:app.VERSION(),
            user:app.USER()
        })
    },
    onShow(){
        Address.List({user_id:app.USER_ID()}).then(r=>{
            if(r.code==200){
                this.setData({
                    addresscount:r.data.length
                })
            }
        })
    }
})