var app = getApp()
import Shop from '../../comm/Shop.js'
import Spec from '../../comm/Spec.js'
Page({
  data: {
    shopTypeList: [
      [],
      [],
      []
    ],
    multiIndex: [0, 0, 0],
    goods: {
      id: 0,
      store_id: 0,
      goods_name: '', //-- 商品名称
      goods_price: 0, //-- 商品标价（可以忽略，以规格为准）
      sale_num: 0, //-- 售出总量
      is_gift: 0, //-- 是否是赠品：1-Yes 0-No
      group_purchase: 0, //-- 是否参与拼团
      group_num: 2, //-- 成团人数
      class_one: 0, //-- 商品一级分类
      class_two: 0, //-- 商品二级分类
      class_three: 0, //-- 商品三级分类
      goods_click: 1000, //-- 商品热度
      goods_limit: 0, //--限购：0不限
      goods_key: '', //-- 商品键
      goods_brokerage: 20, //-- 推广佣金
      goods_describe: '', //-- 商品详情
      goods_img: [], //-- 商品图片
      goods_banners: [] //-- 商品轮播图
    },
    goods_spec: [],
    spec_item: {
      id: 0,
      spec_num: 999, //-- 库存
      spec_size: '', //-- 尺寸
      spec_color: '', //-- 颜色
      group_price: 1.9, //-- 拼团价
      integral: 200, //-- 所需积分
      spec_img: '', //-- 规格图片
      spec_price: 9.9 //-- 标价
    },
    storeId: 0,
    version: ''
  },
  onLoad: function(options) {
    let goods_id = options.goods_id || 0
    let store_id = options.storeId
    this.data.storeId = options.storeId
    this.setData({
      version: app.VERSION()
    })
    if (goods_id > 0) {
      Shop.Get({
        user_id: app.USER_ID(),
        goods_id
      }).then(r => {
        console.log('Shop.Get => ', r)
        if (r.code == 200) {
          let g = r.data
          g.goods_img = g.goods_img.split(',')
          g.goods_banners = g.goods_banners.split(',')
          this.setData({
            goods: g,
            goods_spec: g.spec
          })
          this.initTypeList(r.data.class_one, r.data.class_two, r.data.class_three)
        }
      })
    } else {
      this.initTypeList(0, 0, 0)
    }
  },
  //-- 初始化商品类型列表数据
  initTypeList(pid1, pid2, pid3) {
    let next = 0
    let shopTypeList = this.data.shopTypeList
    let multiIndex = this.data.multiIndex
    //-- 1.获取一级列表数据

    Shop.TypeList({
      class_id: next
    }).then(r => {
      console.log('Shop.TypeList[0] => ', r)
      if (r.code == 200) {
        shopTypeList[0] = r.data
        if (pid1 > 0) {
          multiIndex[0] = r.data.findIndex(u => u.id == pid1) || 0
          next = pid1
        } else {
          next = shopTypeList[0][0].id
        }
        this.setData({
          shopTypeList: shopTypeList,
          multiIndex: multiIndex
        })
        //-- 获取二级类型数据
        Shop.TypeList({
          class_id: next
        }).then(r => {
          console.log('Shop.TypeList[1] => ', r)
          if (r.code == 200) {
            shopTypeList[1] = r.data
            if (pid2 > 0) {
              multiIndex[1] = r.data.findIndex(u => u.id == pid2) || 0
              next = pid2
            } else {
              next = shopTypeList[1][0].id
            }
            this.setData({
              shopTypeList: shopTypeList,
              multiIndex: multiIndex
            })
            //-- 获取第三级数据
            Shop.TypeList({
              class_id: next
            }).then(r => {
              console.log('Shop.TypeList[2] => ', r)
              if (r.code == 200) {
                shopTypeList[2] = r.data
                if (pid3 > 0) {
                  multiIndex[2] = r.data.findIndex(u => u.id == pid3) || 0
                }
                this.setData({
                  shopTypeList: shopTypeList,
                  multiIndex: multiIndex
                })
              } else {
                app.ERROR(r.message)
              }
            })
          } else {
            app.ERROR(r.message)
          }
        })
      } else {
        app.ERROR(r.message)
      }
    })
  },

  //-- 类型切换事件
  bindTypeChange(e) {
    let index = e.currentTarget.dataset.index
    let value = e.detail.value
    if (index == 2) { //-- 更改的是三级分类
      this.data.multiIndex[index] = value
      this.setData({
        multiIndex: this.data.multiIndex
      })
    }

    if (index == 1) { //-- 更改的是二级分类
      this.onChangeTypeLevel2(value)
    }

    if (index == 0) { //-- 更改的是一级分类
      this.initTypeList(this.data.shopTypeList[0][value].id, 0, 0)
    }
  },
  //-- 更新二级分类事件
  onChangeTypeLevel2(idx) {
    let shopTypeList = this.data.shopTypeList
    let multiIndex = this.data.multiIndex
    multiIndex[1] = idx
    //-- 获取第三级数据
    Shop.TypeList({
      class_id: shopTypeList[1][idx].id
    }).then(r => {
      console.log('Shop.TypeList[2] => ', r)
      if (r.code == 200) {
        shopTypeList[2] = r.data
        multiIndex[2] = 0
        this.setData({
          shopTypeList: shopTypeList,
          multiIndex: multiIndex
        })
      } else {
        app.ERROR(r.message)
      }
    })

  },
  onShow: function() {},
  //-- 商品信息输入事件
  onInputChanged(e) {
    let goods = this.data.goods
    goods[e.currentTarget.id] = e.detail.value
    this.setData({
      goods: goods
    })
  },
  //-- 规格信息输入事件
  specsItemInput(e) {
    let spec_item = this.data.spec_item
    spec_item[e.currentTarget.id] = e.detail.value
    this.setData({
      spec_item: spec_item
    })
  },
  //-- 移除规格图片
  removeSpecsItemImg() {
    let spec_item = this.data.spec_item
    spec_item.spec_img = ''
    this.setData({
      spec_item: spec_item
    })
  },
  //-- 选择规格图片
  choseSpecsItemImg() {
    let spec_item = this.data.spec_item
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        let image = res.tempFilePaths[0]
        app._uploadImage(image).then(r => {
          var resd = JSON.parse(r.data)
          if (resd.code == 200) {
            spec_item.spec_img = app.joinPath(app.globalData.xcxUrl, resd.data);
            this.setData({
              spec_item: spec_item
            })
          } else {
            app.msg(resd.message)
          }
        })

      }
    })
  },
  //-- 移除商品图片操作
  removeImg(e) {
    let goods = this.data.goods
    goods[e.currentTarget.id].splice(e.currentTarget.dataset.idx, 1)
    this.setData({
      goods: goods
    })
  },
  //-- 选择商品图片
  choseImg(e) {
    let goods = this.data.goods

    wx.chooseImage({
      count: 6 - goods[e.currentTarget.id].length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        var tempFilePaths = res.tempFilePaths
        for (var i = 0; i < tempFilePaths.length; i++) {
          var image = tempFilePaths[i]

          app._uploadImage(image).then(r => {
            var resd = JSON.parse(r.data)
            if (resd.code == 200) {
              goods[e.currentTarget.id].push(app.joinPath(app.globalData.xcxUrl, resd.data));
              this.setData({
                goods: goods
              })
            } else {
              app.msg(resd.message)
            }
          })
        }
      }
    })
  },
  //-- 删除一个规格事件
  removeSpecsItem(e) {
    let goods_spec = this.data.goods_spec
    let idx = e.currentTarget.dataset.idx
    if (goods_spec[idx].id > 0) {
      Spec.Delete({
        user_id: app.USER_ID(),
        spec_id: goods_spec[idx].id
      }).then(r => {
        if (r.code == 200) {
          goods_spec.splice(idx, 1);
          this.setData({
            goods_spec: goods_spec
          })
        } else {
          app.ERROR("删除已有规格失败!")
        }
      })
    } else {
      goods_spec.splice(idx, 1);
      this.setData({
        goods_spec: goods_spec
      })
    }
  },
  validateSpec(spec_item) {
    if (spec_item.spec_size.length <= 0) {
      app.msg("请输入商品规格尺寸")
      return false;
    }
    if (spec_item.spec_num.length <= 0 || spec_item.spec_num < 0) {
      app.msg("规格库存必须为有效非负数")
      return false;
    }
    if (spec_item.spec_price.length <= 0 || spec_item.spec_price < 0) {
      app.msg("规格标价必须为有效非负数")
      return false;
    }
    if (spec_item.group_price.length <= 0 || spec_item.group_price < 0) {
      app.msg("规格团购价格必须为有效非负数")
      return false;
    }
    if (spec_item.integral.length <= 0 || spec_item.integral < 200) {
      app.msg("规格兑换积分必须不小于200")
      return false;
    }
    if (!spec_item.spec_img || spec_item.spec_img.length <= 0) {
      app.msg("请上传规格图片")
      return false;
    }
    return true;
  },
  //-- 增加一个规格
  addSpecsItem() {
    let spec_item = this.data.spec_item
    if (!this.validateSpec(spec_item)) {
      return;
    }
    if (this.data.goods.id > 0) {
      spec_item.goods_id = this.data.goods.id
      spec_item.user_id = app.USER_ID()
      Spec.Post(spec_item).then(r => {
        if (r.code == 200) {
          app.SUCCESS('规格添加成功！')
          let goods_spec = this.data.goods_spec
          spec_item.id = r.data
          goods_spec.push(spec_item)
          this.setData({
            goods_spec: goods_spec
          })
        } else {
          app.ERROR("规格添加失败！")
        }
      })
    }
  },
  //-- 执行操作
  onSubmit() {
    let goods = Object.assign({}, this.data.goods)
    let goods_spec = this.data.goods_spec
    let spec_item = this.data.spec_item
    //-- 商品名称检查
    if (goods.goods_name.length <= 0) {
      app.msg("请输入商品名称")
      return;
    }
    //-- 限购检查
    if (goods.goods_limit.length <= 0 || goods.goods_limit < 0) {
      goods.goods_limit = 0
    }
    //-- 佣金检查
    if (goods.goods_brokerage.length <= 0 || goods.goods_brokerage < 0) {
      goods.goods_brokerage = 0
    }
    //-- 规格检查
    if (goods.id > 0) {
      if (goods_spec.length <= 0) {
        app.msg("商品至少需要有一个规格！")
        return;
      }
    } else {
      if (!this.validateSpec(spec_item)) {
        return;
      }
    }
    //-- 轮播展示图检查
    if (!goods.goods_banners || goods.goods_banners.length <= 0) {
      app.msg("请上传商品轮播展示图")
      return;
    }
    //-- 商品描述图片检查
    if (!goods.goods_img || goods.goods_img.length <= 0) {
      app.msg("请上传商品描述图片")
      return;
    }
    let tl = this.data.shopTypeList
    let mi = this.data.multiIndex
    goods.goods_banners = goods.goods_banners.join(',')
    goods.goods_img = goods.goods_img.join(',')
    goods.user_id = app.USER_ID()
    goods.store_id = this.data.storeId
    goods.class_one = tl[0][mi[0]].id
    goods.class_two = tl[1][mi[1]].id
    goods.class_three = tl[2][mi[2]].id
    if (goods.spec) {
      delete goods.spec
    }
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