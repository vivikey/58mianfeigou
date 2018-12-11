//-- 商铺对象
var Store = function(token, id) {
    this.store_id = id || 0;
    this.title = '';
    this.rel_name = '';
    this.rel_phone = '';
    this.rel_address = '';
    this.rel_mobile = '';
    this.province = '';
    this.city = '';
    this.district = '';
    this.lng = 123;
    this.lat = 123;
    this.logo = '';
    this.banner = '';
    this.pt_jieshao = '';
    this.token = token;
    this.business_start_time = '';
    this.business_end_time = '';
    this.idnumber_image = [];
    this.business_license = [];
}

Store.prototype.post_url = 'https://m.58daiyan.com/StoreApi/add_store'
Store.prototype.get_url = 'https://m.58daiyan.com/StoreApi/getStoreDetails'
Store.prototype.down_url = 'https://m.58daiyan.com/StoreApi/down_store'

Store.prototype.Add = function(post, callback) {
    post(this.post_url, this, callback)
}
Store.prototype.Update = function(post, callback) {
    post(this.post_url, this, callback)
}
Store.prototype.Get = function (post, callback) {
    post(this.get_url, {
        store_id: this.store_id,
        token: this.token
    }, callback)
}
Store.prototype.Down = function(post, callback) {
    post(this.down_url, {
        store_id: this.store_id,
        token: this.token
    }, callback)
}

//-- 赠品对象
var Present = function(token, id, store_id) {
    this.token = token;
    this.present_id = id || 0;
    this.store_id = store_id || 0;
    this.title = '';// name -> title（赠品名称, 必选，默认为0)
    this.price = '';
    this.integral = 100;
    this.type = '';
    this.type_id=153;
    this.image = '';
    this.specs = '';
    this.description = '';
    this.max_times = 1;
    this.end_time = '';
    this.num = 9;    
    // 新增属性
    this.content = '';//（赠品详情）
    this.gallery = []; // 赠品轮番图
    this.is_deposit=false;//(是否缴纳保证金),
    this.cash_deposit=0;//（保证金额）
    this.return_deposit_num=3;//（推荐满多少人返回保证金）
    this.is_delivery=0;//（1是发货 0为不发货）
    this.freight=0;//（运费）
    this.use_rule='';//（使用规则）
    this.content_imgs=[];//（赠品详情图）
    this.videos = []; // 视频
    this.is_check = 0; //-- 1为提交审核，0为不提交审核
    this.type = 1;//-- 赠品类型：1-积分赠品 2-推荐有奖赠品
    this.valid_time_type = 2;//-- 赠品兑换有效期类型，1：时间区间模式 2：发放之日开始N天内
    this.valid_time_days = 7;//-- 当valid_time_type ==2 时的，有效天数
}

Present.prototype.post_url = 'https://m.58daiyan.com/StoreApi/add_present'
Present.prototype.get_url = 'https://m.58daiyan.com/StoreApi/getPresentDetails'
Present.prototype.del_url = 'https://m.58daiyan.com/StoreApi/del_present'

Present.prototype.Set = function(post, callback) {
    post(this.post_url, this, callback)
}
Present.prototype.Get = function (post, is_template, callback) {
    post(this.get_url, {
        present_id: this.present_id,
        token: this.token,
        is_template: is_template,
        type:this.type
    }, callback)
}
Present.prototype.Delete = function(post, callback) {
    post(this.del_url, {
        present_id: this.present_id,
        token: this.token,
        ishidden:2
    }, callback)
}

module.exports = {
    Store,
    Present
}
