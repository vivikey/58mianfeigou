var app = getApp()
import Activity from '../../comm/Activity.js'
import Shop from '../../comm/Shop.js'
import Store from '../../comm/Store.js'
import TimeConverter from '../../comm/TimeConverter.js'
Page({
  data: {
    store_id: 0,
    shopList: [],
    shopListIdx: 0,
    couponsList: [],
    couponsListIdx: 0,
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
	handleChangeActContentNumber(e){
		const {
			idx, subb
		} = e.currentTarget.dataset
		const item = {
			...this.data.activityObj.act_content[idx]
		}
		item.content_num = item.content_num - subb
		if (item.content_num < 1) {
			app.msg('数量不能小于1！')
			return;
		}
		const {act_id,store_id,content_type,content_id,content_num} = item
		Activity.AddOrModeActivityContent({
			con_id:item.id,
			act_id,
			store_id,
			content_type,
			content_id,
			content_num
		}).then(r => {
			if (r.code == 200) {
				this.getActivityObj()
			} else {
				app.ERROR(r.message)
			}
		})

	},
  hanldeDeleteActContent(e) {
    app.CONFIME('活动内容删除后可重新添加，确定删除吗？', () => {
      const {
        idx
      } = e.currentTarget.dataset
      const item = { ...this.data.activityObj.act_content[idx]
      }
      const {
        store_id,
        act_id,
        id
      } = item
      Activity.DeleteActivityContent({
        con_id: id,
        act_id,
        store_id,
        user_id: app.USER_ID()
      }).then(r=>{
				if(r.code==200){
					app.SUCCESS(r.message,this.getActivityObj)
				}else{
					app.ERROR(r.message)
				}
			})
    })
  },
  bindCouponChange(e) {
    let item = {
      ...this.data.couponsList[e.detail.value]
    }
    Activity.AddOrModeActivityContent({
      act_id: this.data.activityObj.id,
      store_id: this.data.store_id,
      content_type: 1,
      content_id: item.id,
      content_num: 1
    }).then(r => {
      if (r.code == 200) {
        this.getActivityObj()
      } else {
        app.ERROR(r.message)
      }
    })
  },
  bindShopChange(e) {
    let item = {
      ...this.data.shopList[e.detail.value]
    }
    Activity.AddOrModeActivityContent({
      act_id: this.data.activityObj.id,
      store_id: this.data.store_id,
      content_type: 0,
      content_id: item.id,
      content_num: 1
    }).then(r => {
      if (r.code == 200) {
        this.getActivityObj()
      } else {
        app.ERROR(r.message)
      }
    })
  },
  //-- 优惠券列表
  getCouponList() {
    let user_id = app.USER_ID()
    let store_id = this.data.store_id
    Store.CouponList({
        user_id,
        store_id
      })
      .then(r => {
        let couponsList = []
        if (r.code == 200) {
          couponsList = r.data
        }
        this.setData({
          couponsList
        })
      })
  },
  //-- 获取本商铺所有商品列表
  getShopList() {
    Shop.List({
      user_id: app.USER_ID(),
      store_id: this.data.store_id
    }).then(r => {
      console.log('Shop.List => ', r)
      let shopList = []
      if (r.code == 200 && r.data.length > 0) {
        r.data.forEach(item => {
          let {
            spec,
            goods_name
          } = item
          if (goods_name.length > 18) {
            goods_name = `${goods_name.substr(0,18)}...`
          } else {
            goods_name = `${goods_name}...`
          }
          if (spec.length > 0) {
            spec.forEach(sp => {
              sp.showText = `${goods_name}${sp.spec_size}${sp.spec_color}`
              shopList.push(sp)
            })
          }
        })
        // shopList = [...r.data.map(u => {
        //   u.goods_banners = u.goods_banners.split(',')
        //   u.addtime = TimeConverter.ToLocal(u.addtime);
        //   u.chosed = false;
        //   u.chosed_number = 0;
        //   return u;
        // })]
      } else {
        app.ERROR(r.message)
      }
      this.setData({
        shopList
      })
    })
  },
  onLoad(options) {
    console.log('options => ', options)
    this.data.store_id = options.storeId
    this.data.activityObj.id = options.id || 0
  },
  onShow() {
    this.getShopList()
    this.getCouponList()    
  },
	onReady(){
		this.getActivityObj()
	},
  getActivityObj() {
    let {
      activityTypeIdx,
      activityObj
    } = this.data
    Activity.ShowActivityInfo({
      user_id: app.USER_ID(),
      store_id: this.data.store_id,
      act_id: activityObj.id
    }).then(r => {
      if (r.code == 200) {
				r.data.act_content = r.data.act_content.map(u=>{
					if (u.content_type == 0){
						let goods = {...u.goods}
						let shop = this.data.shopList.find(v=>v.id==goods.id)
						u.goods = {...shop}
					}
					return u
				})
        activityObj = {
          ...r.data
        }
      }
      this.setData({
        activityObj
      })
    })
  }
})