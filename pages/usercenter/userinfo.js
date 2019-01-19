var app=getApp()
import UserCenter from '../../comm/UserCenter.js'

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
			UserCenter.SettedCount({user_id:app.USER_ID()})
			.then(r=>{
				console.log('UserCenter.SettedCount => ',r)
				if(r.code==200){
					app.globalData.user.user_phone = r.data.user_phone
					this.setData({
						addresscount: r.data.addr_num,
						user:app.USER()
					})
				}else{
					app.msg(`数据加载失败：${r.message}`)
				}
			})
    }
})