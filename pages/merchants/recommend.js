var app = getApp()
import RecomPlan from '../../comm/RecomPlan.js'
import TimeConverter from '../../comm/TimeConverter.js'

Page({
  data: {
    version: '',
    storeId: 0,
    storeName: '',
    recomList:[]
  },
  onLoad(options) {
    this.data.storeId = options.storeId
    this.data.storeName = options.storeName
    this.data.version = app.VERSION()
  },
  onShow() {
    this.listRecommends()
    this.setData({
			storeId: this.data.storeId,
      storeName: this.data.storeName,
      version: this.data.version
    })
    
  },
  //-- 方案列表
  listRecommends() {
    RecomPlan.List({
      user_id: app.USER_ID(),
      store_id: this.data.storeId
    }).then(r => {
      console.log('RecomPlan.List => ', r)
			let recomList = []
      if(r.code==200 && r.data.length>0){
          recomList=r.data.map(u=>{
            u.addtime = TimeConverter.ToLocal(u.addtime)
						u.recom_name = u.recom_name || '初始化的空方案，请配置...'
            return u
          })
      }
			this.setData({
				recomList: recomList
			})
    })
  },
  //-- 初始化一个空白方案
  initRecommend() {
    let today = new Date()
    let recom = {
      id: 0,
      store_id: this.data.storeId,
      recom_name: '', //名称
      recom_explain: '', //说明
      recom_goods: '', //方案中的商品
      goods_limit: 0, //限购
      recom_type: 0, //获得推荐资格的条件：0-无门槛 1-购买任一商品 2-消费满额 3-充值满额
      assign_goods: '', //指定购买的商品
      recom_consume: 0, //需要消费满金额的多少
      recom_recharge: 0, //充值达到的金额
      recom_consume_type: 1, //需要消费满金额的方式 1-一次性消费 2-累计消费
      start_time: TimeConverter.GetToday(), //方案启动时间
      end_time: TimeConverter.GetYearLatterToday(), //方案终止时间
    }
    RecomPlan.SetRecom(recom).then(r => {
      console.log('RecomPlan.SetRecom => ', r)
      if(r.code==200){
        app.msg(r.message)
        this.listRecommends()
      }else{
        app.ERROR(r.message)
      }
    })
  },
	/**删除一个方案 */
	onDeleteRecom(e){
		app.CONFIME('确定删除此推荐方案吗？',()=>{
			let id = e.currentTarget.dataset.id
			RecomPlan.Delete({
				user_id:app.USER_ID(),
				recom_id:id
			}).then(r=>{
				console.log('RecomPlan.Delete => ',r)
				if(r.code==200){
					app.SUCCESS(r.message)
					this.listRecommends()
				}else{
					app.ERROR(r.message)
				}
			})
		})
	}
})