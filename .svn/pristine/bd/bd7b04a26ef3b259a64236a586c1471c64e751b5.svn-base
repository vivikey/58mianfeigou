//-- 商品对象
var Goods = function (token, id, store_id) {
    this.token = token; //-- 用户
    this.shop_id = id || 0; //-- 商品ID
    this.store_id = store_id || 0; //-- 商铺ID
    this.title = ''; //-- 商品名称
    this.price = 0.0; //-- 商品原价
    this.integral = 100; //-- 兑换积分
    this.type = 1; //-- 类型，1产品2服务3抵用劵4折扣券
    this.type_id = 0; //-- 商品分类ID
    this.image = ''; //-- 商品缩略图
    this.specs = ''; //-- 
    this.description = ''; //-- 商品描述
    this.details = []; //--  图片详情
    this.max_times = 0; //-- 人次限制
    this.gallery =[];//-- 商品轮播图
    this.tuan_buynum = 0;//-- 团购限制购买数量 0 不限制
    this.tuan_time = 24;//-- 开团有效时间，单位为小时，0表示不限制
    this.tuan_price = 0;//-- 团购价格
    this.tuan_num = 2;//-- 几人成团
    this.tuanselect = 1;//-- 是否为团购，1为团，0为不参加团购
    this.tuanz_starttime = '';//-- 团购开始时间
    this.tuanz_endtime = '';//-- 团购结束时间
    this.start_time = ''; //-- 兑现开始时间
    this.end_time = '';//-- 兑现结束时间
    this.num = 999; //-- 库存
    this.shop_sku =[];
}

Goods.prototype.post_url = 'https://m.58daiyan.com/StoreApi/add_shop'
Goods.prototype.get_url = 'https://m.58daiyan.com/StoreApi/getShopDetails'
Goods.prototype.del_url = 'https://m.58daiyan.com/StoreApi/del_shop'

Goods.prototype.Set = function (post, callback) {
    let data = Object.assign(this)
    if (typeof data.shop_sku !=='string')
        data.shop_sku=JSON.stringify(data.shop_sku)
    post(this.post_url, data, callback)
}
Goods.prototype.Get = function (post, callback) {
    post(this.get_url, {
        shop_id: this.shop_id,
        token: this.token
    }, callback)
}
Goods.prototype.Delete = function (post, callback) {
    post(this.del_url, {
        shop_id: this.shop_id,
        token: this.token
    }, callback)
}

module.exports =  Goods