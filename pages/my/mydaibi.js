var app = getApp()
import JiFen from '../../comm/JiFen.js'
import TimeConverter from '../../comm/TimeConverter.js'
Page({
  data: {
    user: {},
    type: 1,
    imgList: [],
    usedList: []
  },
  //-- 切换类型
  onChangeType(e) {
    this.setData({
      type: e.currentTarget.id
    }, () => {
      this.refreshData()
    })
  },
  onLoad(options) {
		if (!app.USER()) {
			app.globalData.bkPage = this.route
			wx.navigateTo({
				url: `/pages/index/index?id=0&higher_up=0`,
			})
		}
    this.setData({
      user: app.USER()
    })
  },
  onShow() {
    this.refreshData()
  },
  refreshData() {
    if (this.data.type == 1) {
      //-- 获取积分记录
      this.getUploadImgToday()
    }
    if (this.data.type == 2) {
      //-- 使用积分记录
      this.getJiFenUsedList()
    }
  },
  //-- 获取用户今日已上传的海报
  getUploadImgToday() {
    JiFen.UserViewImg({
      user_id: app.USER_ID()
    }).then(r => {
      console.log('JiFen.UserViewImg => ', r)
      let list = []
      if (r.code == 200 && r.data.length) {
        list = r.data.sort((a, b) => a.addtime - b.addtime >= 0 ? -1 : 1)
          .map(u => {
            u.imgPath = app.joinPath(app.globalData.xcxUrl, u.check_img);
            u.addtime = TimeConverter.ToLocal(u.addtime)
            return u
          })
      }
      this.setData({
        imgList: list
      })
    })
  },
  //-- 获取用户积分使用记录
  getJiFenUsedList() {
    JiFen.UserList({
      user_id: app.USER_ID(),
      integral_type: 0 //-- 0：使用的积分记录1：赚取的积分记录
    }).then(r => {
      console.log('JiFen.UserList => ', r)
      let list = []
      if (r.code == 200 && r.data.length) {
        list = r.data.map(u => {
          u.addtime = TimeConverter.ToLocal(u.addtime)
          return u
        })
      }
      this.setData({
        usedList: list
      })
    })
  },
	//-- 重新上传
	reUpload(e){
		let imgFile=e.currentTarget.dataset.imgFile
		let check_img_id = e.currentTarget.dataset.id
		wx.chooseImage({
			count: 1,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success: (res) => {
				var tempFilePaths = res.tempFilePaths
				var store = this.data.store;
				var image = tempFilePaths[0]
				app._uploadImage(image, { file_type: 1, file_name: imgFile }).then(r => {
					var resd = JSON.parse(r.data)
					if (resd.code == 200) {
						let check_img = resd.data;
						JiFen.UserUploadImg({
							user_id: app.USER_ID(),
							store_id: 51,
							check_img,
							check_img_id
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
	//-- 上传截图
  choseImg() {
    if (!this.checkTodayCanUpload()) {
			app.ERROR('今日已经上传过了,请等待审核或明天再来')
      return;
    }
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        var tempFilePaths = res.tempFilePaths
        var store = this.data.store;
        var image = tempFilePaths[0]
				app._uploadImage(image, { file_type: 1, file_name: '' }).then(r => {
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
  /**检查今天还能不能上传 */
  checkTodayCanUpload() {
    let imgList = this.data.imgList
    if (imgList.length <= 0) {
      return true;
    }
    let last = imgList[0]
    let [lYear, lMonth, lDay] = last.addtime.split(' ')[0].split('-')
    let today = new Date()
    let year = today.getFullYear()
    let month = today.getMonth() + 1
    let day = today.getDate()
		console.log(lYear, lMonth, lDay)
		console.log(year, month, day)
		if (lYear == year && lMonth == month && lDay == day) {
			return false
    } else {
			return true
    }
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
})