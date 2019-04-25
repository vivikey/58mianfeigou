var app = getApp();
Page({
  data: {
    f: 1
  },
  onLoad(options) {
    this.data.f = options.f || 1
  },
  onShow() {},
  bindGetUserInfo(e) {
    console.log("wx.getUserInfo => ", e)
    wx.login({
      success: res => {
        if (res.code) {
          let {
            encryptedData,
            iv,
            rawData,
            signature,
            userInfo
          } = e.detail
          let {
            gender,
            country,
            province,
            city,
          } = userInfo
          let data = {
            user_img: userInfo.avatarUrl,
            nick_name: userInfo.nickName,
            gender,
            country,
            province,
            city,
            encryptedData,
            iv,
            rawData,
            signature,
            user_id: app.USER_ID(),
            code: res.code
          }

          app._nplogin(data).then(r => {
            console.log('app._nplogin => ', r)
            if (r.code === 200) {
              app.USER(r.data)
              if (this.data.f != 1) {
								wx.setStorageSync('has_authorization', 1)
              } 
							wx.navigateBack({
								delta: 1
							})
            } else {
              app.ERROR(`授权登录失败：${r.message}`);
            }
          })
        } else {
          app.msg('获取code失败！')
        }
      }
    });
  }
})