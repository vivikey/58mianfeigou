var app = getApp()
import Evaluate from '../../comm/Evaluate.js'
Page({
  data: {
    stat: 0, //-- 0:商品评价，1：商铺评价
   	id: 0,
    grade: 5,
    evaluate: '',
    evaluate_img: []
  },
  onLoad: function(options) {
		this.data.stat = options.stat
		this.data.id = options.id
  }, //-- 图片
  choseImg: function() {
		let evaluate_img = this.data.evaluate_img
		wx.chooseImage({
			count: 6 - evaluate_img.length,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success: (res) => {
				var tempFilePaths = res.tempFilePaths
				for (var i = 0; i < tempFilePaths.length; i++) {
					var image = tempFilePaths[i]

					app._uploadImage(image).then(r => {
						var resd = JSON.parse(r.data)
						if (resd.code == 200) {
							evaluate_img.push(app.joinPath(app.globalData.xcxUrl, resd.data));
							this.setData({
								evaluate_img: evaluate_img
							})
						} else {
							app.msg(resd.message)
						}
					})
				}
			}
		})
  },
  //-- 
  inputBlur: function(e) {
		var evaluate = this.data.evaluate;
		evaluate = e.detail.value.trim();
    this.setData({
			evaluate: evaluate
    })
  },
  //-- 移除操作
  removeImg: function(e) {
		var evaluate_img = this.data.evaluate_img
		evaluate_img.splice(e.target.dataset.idx, 1)
    this.setData({
			evaluate_img: evaluate_img
    })
  },
  //-- 执行操作
  Save: function() {
		Shop.Post(goods).then(r => {
			console.log("Shop.Post => ", r)
			if (r.code === 200) {
				if (goods.id <= 0) {
					spec_item.goods_id = r.data
					spec_item.user_id = app.USER_ID()
					Spec.Post(spec_item).then(r => {
						if (r.code == 200) {
							app.SUCCESS(r.message, wx.navigateBack({
								delta: 1
							}))
						} else {
							app.ERROR('商品提交成功，但规格增加失败!', wx.navigateBack({
								delta: 1
							}))
						}
					})
				} else {
					app.SUCCESS(r.message, wx.navigateBack({
						delta: 1
					}))
				}

			} else {
				app.ERROR(res.message || "提交失败！")
			}
		})
  }
})