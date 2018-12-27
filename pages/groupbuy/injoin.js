var app = getApp()
import Order from '../../comm/Order.js'
var pageObj = {
    data: {
			group_id:0,
			version:'',
			group_info:{}
    },
    onLoad: function(options) {
			console.log('injoin.options => ', options)
			app.HIGHER_UP(options.higher_up || 0)
			this.data.group_id= options.group_id || 0
			this.setData({
				version: app.VERSION()
			})
    },
    onShow: function() {
			Order.GetGroup({ user_id: app.USER_ID(), group_id:this.data.group_id})
			.then(r=>{
				console.log('Order.GetGroup => ',r)
				if(r.code==200){
					this.setData({
						group_info:r.data
					})
				}
			})
    },
    //-- 分享到用户或群
    onShareAppMessage: function(res) {
        var resObj = {
            title: `邀您拼团：${this.data.shopMode.title.substr(0, 10)}...￥${this.data.shopMode.shop_sku[this.data.shopMode.chosedIdx].sku_price_tuan}`,
            path: '/pages/groupbuy/injoin?shop_id=' + this.data.shop_id + '&tuan_id=' + this.data.tuan_id + '&rec_token=' + app.userInfo().token,
            imageUrl: this.data.shopMode.image,
            success: res => {}
        }
        console.log('resObj:', resObj)
        return resObj
    },
    //-- 重开一团
    reOpenOneBuy: function() {
        wx.redirectTo({
            url: '/pages/groupbuy/detail?id=' + this.data.shop_id,
        })
    },
    //-- 我要参团
    toInjoinGroup: function() {
        var shopMode = this.data.shopMode
        shopMode.injoin = true;
        shopMode.show = true;
        this.setData({
            shopMode: shopMode
        })
    }
}

import chosemode from "../../template/chosegoodsmode/chosemode.js"
chosemode(pageObj)
Page(pageObj)