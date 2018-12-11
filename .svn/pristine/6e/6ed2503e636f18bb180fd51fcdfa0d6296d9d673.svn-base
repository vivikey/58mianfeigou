var app=getApp()
import drawQrcode from '../../utils/weapp.qrcode.esm.js'
Page({
  data: {
      user:{},
  },
  onLoad: function (options) {
      this.setData({
          user:app.globalData.user
      })
      this.drawQrCode()
  },
    drawQrCode: function () {
        var text = `{"token":"${app.userInfo().token}","uid":"${this.data.user.id}"}`
        var qrctx = drawQrcode({
            width: 250,
            height: 250,
            canvasId: 'qrCanvas',
            foreground: '#000000',
            text: text
        })
    }
})