let app = getApp()
import RecomPlan from '../../comm/RecomPlan.js'
import Shop from '../../comm/Shop.js'
import TimeConverter from '../../comm/TimeConverter.js'
Page({
  data: {
    version: '',
    type: 1,
    store_id: 0,
    shopList: [],
    recomTypes: [{
      val: 0,
      cap: '无门槛'
    }, {
      val: 1,
      cap: '购买商品'
    }, {
      val: 2,
      cap: '消费满额'
    }, {
      val: 3,
      cap: '充值满额'
    }],
    awardTypes: [ {
      val: 1,
      cap: '赠品'
    }, {
      val: 2,
      cap: '红包'
    }],
    recommend: {
      id: 0,
      store_id: 23,
      recom_name: '', //名称
      recom_explain: '', //说明
      recom_goods: [], //方案中的商品
      goods_limit: 0, //限购
      recom_type: 1, //获得推荐资格的条件：0-无门槛 1-购买任一商品 2-消费满额 3-充值满额
      assign_goods: [], //指定购买的商品
      recom_consume: 20, //需要消费满金额的多少
      recom_recharge: 29.9, //充值达到的金额
      recom_consume_type: 1, //需要消费满金额的方式 1-一次性消费 2-累计消费
      start_time: '2018-12-01', //方案启动时间
      end_time: '2018-12-15', //方案终止时间

    },
    recomAward: {
      id: 0,
      recom_id: 0, //方案ID
      recom_success_consume: 0, //成功推荐一人的判定条件：被推荐人消费满金额
      recom_success_num: 0, //获得一次推荐奖励需要成功推荐的人数
      award_type: 2, //推荐奖励种类：1-奖励赠品 2-奖励红包 
      award_gifts: [], //奖励的赠品
      award_cash_type: 0, //奖励红包大小的方式 0-固定金额 1-固定比例
			award_money_one_min: 0, //直接推荐奖金最小值
			award_money_one_max: 0, //直接推荐奖金最大值
			award_money_two_min: 0, //下给推荐奖金最小值
			award_money_two_max: 0, //下给推荐奖金最大值
      award_ratio_one: 0, //固定比例
      award_ratio_two: 0, //固定比例
      consume_type: 1, //需要消费满金额的方式 1-一次性消费 2-累计消费
    },
    recom_goods_index: 0, //-- 选择方案中的商品时的索引
    recom_spec_index: 0,
		showyusell:false
  },
	onResetrecomAward(){
		this.setData({
			recomAward: {
				id: 0,
				recom_id: 0,
				recom_success_consume: 0,
				recom_success_num: 0,
				award_type: 2,
				award_gifts: [],
				award_cash_type: 0,
				award_money_one_min: 0,
				award_money_one_max: 0,
				award_money_two_min: 0,
				award_money_two_max: 0,
				award_ratio_one: 0, 
				award_ratio_two: 0, 
				consume_type: 1, 
			},
		})
	},
	onOpenAddAwardWnd(){
		this.setData({
			showyusell:true
		})
	},
	onCloseAddAwardWnd() {
		this.setData({
			showyusell: false
		}, this.onResetrecomAward)
	},
  //-- 切换类型
  onChangeType(e) {
    this.setData({
      type: e.currentTarget.id
    })
  },
	//-- 有效期
	bindTimeChange(e){
		let recommend = this.data.recommend;
		recommend[e.currentTarget.id] = e.detail.value;
		this.setData({
			recommend: recommend
		})
	},
  onInputChanged(e) {
    let recommend = this.data.recommend;
    recommend[e.currentTarget.id] = e.detail.value;
    this.setData({
      recommend: recommend
    })
  },
  onInput2Changed(e) {
    let recomAward = this.data.recomAward;
    recomAward[e.currentTarget.id] = e.detail.value;
    this.setData({
      recomAward: recomAward
    })
  },
  onAddHasInputChanged(e) {
    let recommend = this.data.recommend;
    recommend.award[e.currentTarget.dataset.index][e.currentTarget.id] = e.detail.value;
    this.setData({
      recommend: recommend
    })
  },
  onRecomTypeChanged(e) {
    let recommend = this.data.recommend;
    recommend.recom_type = e.currentTarget.dataset.val;
    this.setData({
      recommend: recommend
    })
  },
  onAwardTypeChanged(e) {
    let recomAward = this.data.recomAward;
    recomAward.award_type = e.currentTarget.dataset.val;
    this.setData({
      recomAward: recomAward
    })
  },
  onRecomConsumeTypeChanged(e) {
    let recommend = this.data.recommend;
    recommend.recom_consume_type = e.currentTarget.dataset.val;
    this.setData({
      recommend: recommend
    })
  },
  /**已经存在的奖励的种类切换事件 */
  onHasAwardTypeChanged(e) {
    let recommend = this.data.recommend;
    recommend.award[e.currentTarget.dataset.index].award_type = e.currentTarget.dataset.val;
    this.setData({
      recommend: recommend
    })
  },
  /**移除方案中的某个商品事件 */
  onRemoveRecomGoods(e) {
    let recommend = this.data.recommend
    let idx = e.currentTarget.dataset.idx
    recommend.recom_goods.splice(idx, 1)
    this.setData({
      recommend: recommend
    })
  },
  /**移除指定购买中的某个商品事件 */
  onRemoveAssignGoods(e) {
    let recommend = this.data.recommend
    let idx = e.currentTarget.dataset.idx
    recommend.assign_goods.splice(idx, 1)
    this.setData({
      recommend: recommend
    })
  },
  /**移除已经增加的奖励中的赠品 */
  onRemoveAwardGift(e) {
    let idx = e.currentTarget.dataset.idx
    let index = e.currentTarget.dataset.index
    let recommend = this.data.recommend
    recommend.award[index].award_gifts.splice(idx, 1)
    this.setData({
      recommend: recommend
    })
  },
  /**移除待增加的奖励中的赠品事件 */
  onRemoveNewAwardGift(e) {
    let idx = e.currentTarget.dataset.idx
    let recomAward = this.data.recomAward
    recomAward.award_gifts.splice(idx, 1)
    this.setData({
      recomAward: recomAward
    })
  },
  /**选择增加方案中的商品事件 */
  onAddShopHandle(e) {
    let shop = { ...this.data.shopList[e.detail.value]
    }
    let recommend = this.data.recommend
    if (!recommend.recom_goods || recommend.recom_goods.length <= 0) {
      recommend.recom_goods = [shop]
    } else {
      let index = recommend.recom_goods.findIndex(item => item.id == shop.id)
      if (index >= 0) {
        app.msg(`${shop.goods_name} 已经被添加了~~`)
        return;
      }
      recommend.recom_goods = [...recommend.recom_goods, shop]
    }
    this.setData({
      recommend: recommend
    })
  },
  /**选择增加方案中指定购买的商品事件 */
  onAddSpecialShopHandle(e) {
    let shop = { ...this.data.shopList[e.detail.value]
    }
    let recommend = this.data.recommend
    if (!recommend.assign_goods || recommend.assign_goods.length <= 0) {
      recommend.assign_goods = [shop]
    } else {
      let index = recommend.assign_goods.findIndex(item => item.id == shop.id)
      if (index >= 0) {
        app.msg(`${shop.goods_name} 已经被添加了~~`)
        return;
      }
      recommend.assign_goods = [...recommend.assign_goods, shop]
    }
    this.setData({
      recommend: recommend
    })
  },
  /**选择增加待增加的奖励中的赠品事件 */
  onAddNewAwardGiftHandle(e) {
    let shop = {
      ...this.data.shopList[e.detail.value]
    }
    let recomAward = this.data.recomAward
    if (!recomAward.award_gifts || recomAward.award_gifts.length <= 0) {
      recomAward.award_gifts = [shop]
    } else {
      //-- 检查是否已经存在了
      // let index = recomAward.award_gifts.findIndex(item => item.id == shop.id)
      // if (index >= 0) {
      // 	app.msg(`${shop.goods_name} 已经被添加了~~`)
      // 	return;
      // }
      recomAward.award_gifts = [...recomAward.award_gifts, shop]
    }
    this.setData({
      recomAward: recomAward
    })
  },
  /**已有奖励的增加赠品事件 */
  onAddHasAwardGiftHandle(e) {
    let shop = {
      ...this.data.shopList[e.detail.value]
    }
    let index = e.currentTarget.dataset.index
    let recommend = this.data.recommend
    if (!recommend.award[index].award_gifts || recommend.award[index].award_gifts.length <= 0) {
      recommend.award[index].award_gifts = [shop]
    } else {
      recommend.award[index].award_gifts = [...recommend.award[index].award_gifts, shop]
    }
    this.setData({
      recommend: recommend
    })
  },
  /**方案保存提交事件 */
  onSubmit() {
    let recommend = this.data.recommend
    let recom = { ...recommend
    }
    if (recom.recom_goods) {
      recom.recom_goods = recom.recom_goods.map(u => {
        return u.id
      }).join(',')
    }
    if (recom.assign_goods) {
      recom.assign_goods = recom.assign_goods.map(u => {
        return u.id
      }).join(',')
    }
    delete recom.award
    delete recom.addtime

    RecomPlan.SetRecom(recom).then(r => {
      console.log('RecomPlan.SetRecom => ', r)
      if (r.code == 200) {
        app.SUCCESS(r.message)
        this.getRecommend(r => {
          if (r.code == 200) {
            this.setData({
              recommend: r.data,
            })
          }
        })
      } else {
        app.ERROR(r.message)
      }
    })
  },
  /**保存提交新奖励 */
  onSubmitNewAward() {
    let award = { ...this.data.recomAward
    }
    if (award.award_gifts) {
      award.award_gifts = award.award_gifts.map(u => {
				return u.spec_id
      }).join(',')
    }
    award.id = 0
    award.recom_id = this.data.recommend.id
    RecomPlan.SetAward(award).then(r => {
      console.log('RecomPlan.SetAward => ', r)
      if (r.code == 200) {
        app.SUCCESS(r.message,()=>{
					this.onCloseAddAwardWnd()
				})
        this.getRecommend(r => {
          if (r.code == 200) {
            this.setData({
              recommend: r.data,
            })

          }
        })
      } else {
        app.ERROR(`保存失败：${r.message}`)
      }
    })
  },
  /**保存已有奖励 */
  onSetAward(e) {
    let index = e.currentTarget.dataset.index
    let award = { ...this.data.recommend.award[index]
    }
    if (award.award_gifts) {
      award.award_gifts = award.award_gifts.map(u => {
				return u.spec_id
      }).join(',')
    }
    RecomPlan.SetAward(award).then(r => {
      console.log('RecomPlan.SetAward => ', r)
      if (r.code == 200) {
        app.SUCCESS(r.message)
        this.getRecommend(r => {
          if (r.code == 200) {

            this.setData({
              recommend: r.data,
            })
          }
        })
      } else {
        app.ERROR(`保存失败：${r.message}`)
      }
    })
  },
  /**获取方案详情 */
  getRecommend(callback) {
    RecomPlan.Get({
        user_id: app.USER_ID(),
        recom_id: this.data.recommend.id
      })
      .then(r => {
        console.log('RecomPlan.Get => ', r)
				if(r.code==200){
					r.data.addtime = TimeConverter.ToLocal(r.data.addtime)
					if (r.data.award.length>0){
						r.data.award = r.data.award.map(u=>{
							console.log('u => ',u)
							if (u.award_gifts && u.award_gifts.length>0){
								u.award_gifts = u.award_gifts.map(uu=>{
									let showText = `(${uu.spec_color} ${uu.spec_size})${uu.goods_name}`
									return {...uu,showText};
								})
							}
							return u;
						})
					}
				}
        callback(r)
      })
  },
  /**移除一个奖励事件 */
  onRemoveAward(e) {
    app.CONFIME('删除后不可恢复，确定删除此推荐奖励吗？', () => {
      let index = e.currentTarget.dataset.index
      let item = this.data.recommend.award[index]
      console.log('wait for delete => ', item)
      RecomPlan.RemoveAward({
        user_id: app.USER_ID(),
        award_id: item.id
      }).then(r => {
        console.log('RecomPlan.RemoveAward => ', r)
        if (r.code == 200) {
          app.SUCCESS(r.message)
          this.getRecommend(r => {
            if (r.code == 200) {
              
              this.setData({
                recommend: r.data,
              })
            }
          })
        } else {
          app.ERROR(r.message)
        }
      })
    })
  },
  onLoad(options) {
    this.data.store_id = options.store_id || 0
    this.data.recommend.id = options.recom_id || 0
    this.data.version = app.VERSION()
  },
  onReady() {
    let user_id = app.USER_ID()
    let store_id = this.data.store_id
    Shop.List({
      user_id,
      store_id
    }).then(res => {
      let shopList = []
      if (res.code == 200) {
        res.data.forEach(item => {
          let oo = { ...item
          }
          oo.spec.forEach(sp => {
            let spec_id = sp.id
            let {
              spec_size,
              spec_color
            } = sp
            let showText = `(${spec_color} ${spec_size})${oo.goods_name}`
            let pp = { ...oo,
              spec_id,
              spec_size,
              spec_color,
              showText
            }
						shopList.push(pp)
          })
        })
      } else {
        console.error('Shop.List ERROR => ', r.message)
      }
      this.getRecommend(r => {
        if (r.code == 200) {
          this.setData({
            recommend: r.data,
            shopList: shopList
          })
        }
      })
    })
    this.setData({
      version: this.data.version
    })
  }
})