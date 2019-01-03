var app = getApp()
import Evaluate from '../../comm/Evaluate.js'
import TimeConverter from '../../comm/TimeConverter.js'
Page({
  data: {
    goods_id: 0,
		evaluateList: [],
  },
  onLoad: function(options) {
		this.data.goods_id = options.id
  },
  onShow() {
		this.getEvaluate()
  },
	//-- 获取商品评价
	getEvaluate() {
		Evaluate.ListForGoods({
			user_id: app.USER_ID(),
			goods_id: this.data.goods_id
		}).then(r => {
			console.log('Evaluate.ListForGoods => ', r)
			if (r.code == 200) {
				this.setData({
					evaluateList: r.data.filter((item, index) => index < 2).map(u => {
						u.addtime = TimeConverter.ToLocal(u.addtime)
						u.evaluate_img = u.evaluate_img && u.evaluate_img.length > 0 ? u.evaluate_img.split(',') : []
						return u
					})
				})
			}
		})
	},
  onReachBottom: function() {
		this.getEvaluate()
  },
  showCommBigImg: function(e) {
    let idx = e.currentTarget.dataset.idx
    let index = e.currentTarget.dataset.index
		let evaluateList = this.data.evaluateList
    wx.previewImage({
			current: evaluateList[index].evaluate_img[idx],
			urls: evaluateList[index].evaluate_img
    })
  }
})