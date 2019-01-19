var app = getApp()
import Evaluate from '../../comm/Evaluate.js'
Page({
  data: {
		evaluateList: [],
		goods_id:0,
		goods_name: '',
    storeId: 0,
		version:'',
  },
  onLoad: function(options) {
		this.data.goods_id = options.goods_id || 0
		this.data.goods_name = options.goods_name || 0
		this.data.storeId = options.storeId || 0
  },
  onShow: function() {
		this.setData({
			goods_name: this.data.goods_name,
			storeId: this.data.storeId,
			version: app.VERSION()
		})
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
					evaluateList: r.data.map(u => {
						u.addtime = TimeConverter.ToLocal(u.addtime)
						u.evaluate_img = u.evaluate_img && u.evaluate_img.length > 0 ? u.evaluate_img.split(',') : []
						return u
					})
				})
			}
		})
	},
})