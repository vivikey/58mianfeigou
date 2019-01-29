var app = getApp()
import drawQrcode from '../../utils/weapp.qrcode.esm.js'
Page({
    data: {
        user: {},
    },
    onLoad: function (options) {
        this.setData({
            store_id:options.id,
            store_title:options.title,
            store_logo:options.image,
            address: options.address,
            user: app.globalData.user
        })
        this.drawQrCode()
    },
    drawQrCode: function () {
			var text = `https://xcx.58daiyan.com/store2/?id=${this.data.store_id}`
        drawQrcode({
            width: 250,
            height: 250,
            canvasId: 'qrCanvas',
            foreground: '#000000',
            text: text
        })
    }
})