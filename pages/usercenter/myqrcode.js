var app = getApp()
import drawQrcode from '../../utils/weapp.qrcode.esm.js'
Page({
  data: {
    user: {},
  },
  onLoad(options) {
    this.setData({
      user: app.globalData.user
    })
    this.drawQrCode()
  },
  drawQrCode() {
    var text = `{"grade":"${this.data.user.member.member_grade}","uid":"${this.data.user.id}"}`
    var qrctx = drawQrcode({
      width: 200,
      height: 200,
      canvasId: 'qrCanvas',
      foreground: '#d81e06',
      text: text
    })
  }
})