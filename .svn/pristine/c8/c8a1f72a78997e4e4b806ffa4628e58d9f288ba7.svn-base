module.exports = function (pageObj){
    pageObj.toProxy= function() {
        if (!this.data.user.phone || this.data.user.phone.length < 11) {
            wx.navigateTo({
                url: '/pages/index/bindphone',
            })
        } else {
            wx.navigateTo({
                url: '/pages/proxy/index',
            })
        }
    }

    pageObj.toMerchants= function() {
        wx.navigateTo({
            url: '/pages/merchants/index',
        })
        // if (!this.data.user.phone || this.data.user.phone.length < 11) {
        //     wx.navigateTo({
        //         url: '/pages/index/bindphone',
        //     })
        // } else {
        //     wx.navigateTo({
        //         url: '/pages/merchants/index',
        //     })
        // }
    }
}