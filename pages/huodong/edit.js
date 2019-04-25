var app = getApp()
import Activity from '../../comm/Activity.js'
import Shop from '../../comm/Shop.js'
import TimeConverter from '../../comm/TimeConverter.js'
import ActivityType from '../../utils/activitytype.js'
Page({
  data: {
    store_id: 0,
    activityType: [],
    activityTypeIdx: 0,
    activityObj: {
      id: 0,
      store_id: 0,
      act_name: '初始化的活动，请配置...',
      act_describe: '',
      act_img: [],
      act_start: '',
      act_end: '',
      act_type: 0,
      act_price: 0,
      act_old_price: 0,
      buy_num: 2, //-- 第几件
      buy_discount: 8.8, //-- 打几折
      attain_money: 100, //-- 满多少
      subtract_money: 10 //-- 减多少
    },
  },
  onInputChanged(e) {
    let activityObj = {
      ...this.data.activityObj
    }
    activityObj[e.currentTarget.id] = e.detail.value;
    this.setData({
      activityObj
    })
  },
  bindTypeChange(e) {
    const activityTypeIdx = e.detail.value
    let activityObj = {
      ...this.data.activityObj
    }
    activityObj.act_type = this.data.activityType[activityTypeIdx].act_type
    this.setData({
      activityTypeIdx,
      activityObj
    })
  },
  //-- 移除活动图片操作
  removeImg(e) {
    let activityObj = {
      ...this.data.activityObj
    }
    activityObj.act_img.splice(e.currentTarget.dataset.idx, 1)
    this.setData({
      activityObj
    })
  },
  //-- 选择活动图片
  choseImg(e) {
    let activityObj = {
      ...this.data.activityObj
    }
    let maxpics = 999
    wx.chooseImage({
      count: maxpics - activityObj.act_img.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        var tempFilePaths = res.tempFilePaths
        wx.showLoading({
          title: '图片上传中...',
        })
        let promiseObjs = []
        for (var i = 0; i < tempFilePaths.length; i++) {
          var image = tempFilePaths[i]
          promiseObjs.push(app._uploadImage(image, {
            file_type: 3,
            file_name: ''
          }))
        }
        Promise.all(promiseObjs).then(arrayR => {
          console.log('arrayR => ', arrayR)
          let act_img = arrayR.filter(v => v.statusCode == 200).map(u => {
            let data = JSON.parse(u.data)
            return app.joinPath(app.globalData.xcxUrl, data.data)
          })
          activityObj.act_img = [...activityObj.act_img, ...act_img]
          this.setData({
            activityObj
          }, () => wx.hideLoading())
        }).catch(r => app.ERROR('上传图片遇到错误！请重试。'))
      }
    })
  },
  onSubmit() {
    let activityObj = {
      ...this.data.activityObj
    }
    const {
      id,
      act_img
    } = activityObj
    activityObj.act_id = id
    activityObj.act_img = act_img.join(',')
    delete activityObj.id

    if (activityObj.act_name.length <= 0) {
      app.msg('请输入活动名称！')
      return;
    }
    if (activityObj.act_type == 0) {
      if (activityObj.act_old_price * 1.0 <= 0.0) {
        app.msg('请输入有效的活动商品打包原价！')
        return;
      }
      if (activityObj.act_price * 1.0 <= 0.0) {
        app.msg('请输入有效的活动商品打包活动价！')
        return;
      }
    }

    if (activityObj.act_type == 1) {
      if (activityObj.buy_num * 1 <= 0) {
        app.msg('需要打折的件次数必须为正整数！')
        return;
      }
      if (activityObj.buy_discount * 1.0 <= 0 || activityObj.buy_discount * 1.0 > 10) {
        app.msg('请输入有效的商品的折扣数（0.0~10.0之间）！')
        return;
      }
    }
    if (activityObj.act_type == 2) {
      if (activityObj.attain_money * 1 <= 0) {
        app.msg('满减迭代的基数金额必须大于0')
        return;
      }
      if (activityObj.subtract_money * 1 <= 0 || activityObj.subtract_money * 1 >= activityObj.attain_money * 1) {
        app.msg('每次减免的金额必须大于0并小于满减迭代的基数金额！')
        return;
      }
    }
    if (activityObj.act_img.length <= 0) {
      app.msg('至少需要一张活动图片，建议750px宽度！')
      return;
    }
    const user_id = app.USER_ID()

    //-- 修改
    const data = {
      ...activityObj,
      user_id
    }
    Activity.AddOrModeActivity(data)
      .then(r => {
        if (r.code == 200) {
          app.SUCCESS(r.message)
        } else {
          app.ERROR(r.message)
        }
      })
  },
  onLoad(options) {
    console.log('options => ', options)
    this.data.store_id = options.storeId
    this.data.activityObj.id = options.id || 0
  },
  onReady() {
    this.setData({
      activityType: ActivityType
    })
  },
  onShow() {
    let {
      activityTypeIdx,
      activityObj
    } = this.data
    if (activityObj.id > 0) {
      Activity.ShowActivityInfo({
        user_id: app.USER_ID(),
        store_id: this.data.store_id,
        act_id: activityObj.id
      }).then(r => {
        if (r.code == 200) {
          if (r.data.act_img.length > 0) {
            r.data.act_img = r.data.act_img.split(',')
          } else {
            r.data.act_img = []
          }
          activityObj = { ...r.data
          }
					activityTypeIdx = ActivityType.findIndex(v => v.act_type == activityObj.act_type)
        }
        this.setData({
          activityObj,
					activityTypeIdx, activityType: ActivityType
        })
      })
    }
  },
})