var app = getApp()
import JiFen from '../../comm/JiFen.js'
import TimeConverter from '../../comm/TimeConverter.js'
Page({
  data: {
    user: {},
    imgList: [],
    store_name: '',
    store_id: 0
  },
  onLoad(options) {
    this.data.store_id = options.id
    this.setData({
      store_name: options.title,
      user: app.USER()
    })
  },
  /**删除 */
  onDeleteJiFenImg(e) {
    JiFen.Delete({
      user_id: app.USER_ID(),
      integral_img_id: e.currentTarget.dataset.id
    }).then(r => {
      console.log('JiFen.Delete.onDeleteJiFenImg => ', r)
      if (r.code == 200) {
        if (r.code == 200) {
          this.getUploadImages()
        }
      }
    })
  },
  /**审核不通过 */
  onCheckJiFenImgNo(e) {
    JiFen.Check({
      user_id: app.USER_ID(),
      integral_img_id: e.currentTarget.dataset.id,
      check_status: 2,
      award_integral: 0
    }).then(r => {
      console.log('JiFen.Check.onCheckJiFenImgNo => ', r)
      if (r.code == 200) {
        if (r.code == 200) {
          this.getUploadImages()
        }
      }
    })
  },
  /**审核不通过 */
  onCheckJiFenImgYes(e) {
    JiFen.Check({
      user_id: app.USER_ID(),
      integral_img_id: e.currentTarget.dataset.id,
      check_status: 1,
      award_integral: 10
    }).then(r => {
      console.log('JiFen.Check.onCheckJiFenImgYes => ', r)
      if (r.code == 200) {
        this.getUploadImages()
      }
    })
  },
  //-- 预览图片
  showBigImg(e) {
    let src = e.currentTarget.dataset.src
    console.log('src => ', src)
    wx.previewImage({
      urls: [src],
      current: src
    })
  },
  onShow() {
    this.getUploadImages()
  },
  //-- 获取用户今日已上传的海报
  getUploadImages() {
    JiFen.List({
      user_id: app.USER_ID(),
      store_id: this.data.store_id
    }).then(r => {
      console.log('JiFen.UserViewImg => ', r)
      let imgList = []
      if (r.code == 200 && r.data.length > 0) {
        imgList = r.data.map(u => {
          u.imgPath = app.joinPath(app.globalData.xcxUrl, u.check_img);
          u.addtime = TimeConverter.ToLocal(u.addtime)
          return u
        })
      }
			this.setData({
				imgList: imgList
			})
    })
  },
  choseImg() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        var tempFilePaths = res.tempFilePaths
        var store = this.data.store;
        var image = tempFilePaths[0]
        app._uploadImage(image).then(r => {
          var resd = JSON.parse(r.data)
          if (resd.code == 200) {
            let check_img = resd.data;
            JiFen.UserUploadImg({
              user_id: app.USER_ID(),
              store_id: 51,
              check_img
            }).then(r => {
              console.log('JiFen.UserUploadImg => ', r)
              if (r.code == 200) {
                app.SUCCESS(r.message, this.getUploadImgToday)
              } else {
                app.ERROR(r.message)
              }
            })
          } else {
            app.msg(resd.message)
          }
        })
      }
    })
  },
})