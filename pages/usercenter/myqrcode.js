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
    // let text = `{"grade":"${this.data.user.member.member_grade}","uid":"${this.data.user.id}"}`
    // if (this.data.user.member.member_code) {
    //   text = `{"grade":"${this.data.user.member.member_grade}","uid":"${this.data.user.id}","mc":"${this.data.user.member.member_code}"}`
    // }
		let text = `https://xcx.58daiyan.com/index/?higher_up=${this.data.user.id}&mc=${this.data.user.member.member_code}`
    var qrctx = drawQrcode({
      width: 200,
      height: 200,
      canvasId: 'qrCanvas',
      foreground: '#e97f23',
      text: text
    })
  }
})