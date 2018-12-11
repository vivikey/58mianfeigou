var app = getApp()
Page({
    data: {
        isowner: 1,
        zsindex: 0,
        zsnumber: 1,
        scheme_id: 0,
        storeId: 0,
        currentShop: 0,
        bd_shopids: [], //-- 已确定的产口列表
        chosed_shopids: [], //-- 新选择的产口IDs
        can_chose_shop: [], //-- 能被选择的产品列表
        shop_list: [],
        giftList: [],
        bd_shop_gifts: [{
            shop_id: 0,
            gifts: [{
                gift_id: 0,
                gift_num: 0
            }]
        }],
        hide: 'hide',
        gift_hide: 'hide',
        schemeObj: {
            token: '',
            action_id: 0,
            store_id: 0,
            action_name: '',
            start_money: 0, ///-- 初始限制金额
            suit_type: 2, //--0:没有门槛 2- 购买产品 3 - 累积消费
            start_time: '2018-08-01',
            end_time: '2099-01-01',
            bd_shopids: '', //-- 方案中的产品，用,隔开
            bd_shop_gifts: [], //-- 方案中产品配置的赠品信息
            propositus_num: 1,
            propositus_consume_type: 2,
            propositus_consume_money: 0,
            award_type: 2,
            award_money: 0,
            award_ratio: 0,
            award_product_id: 0,
            award_product_num: 1,
            validate_days: 0,
            xg_type: 1,
            share_content: 'A|试一试!|(sku_price)|你能获得几份|(title)?|荐三送一',
            //-- 2018.11.13 Add
            action_type: 1, //-- 1:老模式，以产品为主 2：新模式，以方案为主
            action_awardtype: 3, //--0:无 1.返奖余额 2.返奖赠品 3.返奖余额+赠品
            award_moneytype: 2, //-- 金钱奖励的方式 0：不奖励 1：奖励一定的金额 2：奖励一定的比例
            award_money_content: [{
                award_id: 0,
                award_con: 50,
                award_mon_rat: 35,
                award_presents: []
            }] //-- {"award_id":0,"award_con":50,"award_mon_rat":35}
        },
        newAwardMoney: {
            award_con: 0,
            award_mon_rat: 0,
            award_id: 0,
            award_presents: []
        }, //-- 添加时临时中转的

        text1: '试一试！',
        text2: '你能获得几份',
        text3: '荐三送一',
        text0: 'A'
    },
    removeAwardGift: function(e) {
        let schemeObj = this.data.schemeObj
        let idx=e.currentTarget.dataset.idx
        let index = e.currentTarget.dataset.index
        schemeObj.award_money_content[idx].award_presents.splice(index,1)
        this.setData({
            schemeObj: schemeObj
        })
    },
    changeAwardPresentInput: function(e) {
        let award_present = this.data.award_present
        award_present.award_con = e.detail.value
        this.setData({
            award_present: award_present
        })
    },
    //-- 移除返奖明细
    removeAwardMmoneyItem: function(e) {
        let schemeObj = this.data.schemeObj
        let idx = e.currentTarget.dataset.idx
        schemeObj.award_money_content.splice(idx, 1)
        this.setData({
            schemeObj: schemeObj
        })
    },
    //-- 增加返奖明细
    addAwardMoneyItem: function() {
        let schemeObj = this.data.schemeObj
        let newAwardMoney = this.data.newAwardMoney
        if (newAwardMoney.award_con <= 0) {
            app.msg('被推荐者消费额度必须大于0！')
            return;
        }
        let idx = schemeObj.award_money_content.findIndex(u => u.award_con == newAwardMoney.award_con)
        if (idx >= 0) {
            schemeObj.award_money_content[idx].award_mon_rat = newAwardMoney.award_mon_rat
        } else {
            schemeObj.award_money_content.push(newAwardMoney)
        }
        this.setData({
            schemeObj: schemeObj,
            newAwardMoney: {
                award_con: 0,
                award_mon_rat: 0,
                award_id: 0,
                award_presents:[]
            }
        })
    },
    //-- 被推荐人消费额度改变事件
    changeAwardConInput: function(e) {
        let newAwardMoney = this.data.newAwardMoney
        newAwardMoney[e.currentTarget.id] = e.detail.value
        this.setData({
            newAwardMoney: newAwardMoney
        })
    },
    //-- 输入框改变事件1
    handleInputChange1: function(e) {
        this.setData({
            text1: e.detail.value
        })
    },
    handleInputChange2: function(e) {
        this.setData({
            text2: e.detail.value
        })
    },
    handleInputChange3: function(e) {
        this.setData({
            text3: e.detail.value
        })
    },
    onShareModelChanged: function(e) {
        this.setData({
            text0: e.detail.value
        })
    },
    //-- 配置方案产品改变
    onProductChosed: function(e) {
        console.log(e.detail.value)
        this.setData({
            chosed_shopids: e.detail.value
        })
    },
    //--配置赠品
    setGift: function(e) {
        this.showGiftbox(e.currentTarget.dataset.idx)
    },
    //--显示选择产品
    show: function() {
        this.setData({
            hide: ''
        })

    },
    hide: function() {
        this.setData({
            hide: 'hide'
        })
        this.updateChosedProducts()
    },
    //-- 隐藏赠品选择器
    closeGiftbox: function() {
        this.setData({
            gift_hide: 'hide'
        })
    },
    showGiftbox: function(idx) {
        this.setData({
            gift_hide: '',
            currentShop: idx
        })

    },
    //-- 确定增加赠品到产品
    addGiftToShop: function() {
        let gift = this.data.giftList[this.data.zsindex]
        if (gift) {
            let numb = this.data.zsnumber
            gift.num = numb
            this.concatGift(this.data.currentShop, gift)
        }
        this.closeGiftbox()
    },
    //-- zsnumberChange
    zsnumberChange: function(e) {
        this.setData({
            zsnumber: e.detail.value
        })
    },
    removeGift: function(e) {
        let index = e.currentTarget.dataset.index
        let idx = e.currentTarget.dataset.idx
        this.spliceGift(idx, index)
    },
    //-- updateChosedProducts??
    updateChosedProducts: function() {
        let chosed_shopids = this.data.chosed_shopids
        let fix_shopidx = chosed_shopids.concat(this.data.schemeObj.bd_shopids.split(','))
        let bd_shopids = this.data.bd_shopids
        //-- 需要保留的
        if (bd_shopids && bd_shopids.length > 0) {
            bd_shopids = bd_shopids.filter(u => {
                if (u) {
                    let fsidx = fix_shopidx.findIndex((item, index) => {
                        return u.id == item
                    })
                    return fsidx >= 0
                }
            })
        }
        //-- 需要移除的
        bd_shopids = bd_shopids.concat(chosed_shopids.map(u => {
            let csidx = bd_shopids.findIndex((item, index) => {
                return u == item.id
            })
            if (csidx < 0) { //-- 不在方案中
                let shop_list = this.data.shop_list
                let obj = shop_list.find((value, index) => {
                    return value.id == u
                })
                obj.gifts = []
                return obj
            }
        }))

        this.setData({
            bd_shopids: bd_shopids
        })
    },
    //-- 列表已选择或已配置的产品
    listBindShops: function(str) {
        console.log('listBindShops runing...', str)
        if (str && str.length > 0) {
            let tempArr = str.split(',') || []
            this.setData({
                bd_shopids: this.shopMapHandle(tempArr)
            }, this.giftMapHandle)
        }
    },
    //-- 映射产品数据
    shopMapHandle: function(arr) {
        console.log('shopMapHandle:', arr)
        let shop_list = this.data.shop_list
        if (!arr || arr.length <= 0) {
            return [];
        }
        let rarr = []
        arr.forEach(u => {
            let obj = shop_list.find((value, index) => {
                return value.id == u
            })
            if (obj) {
                obj.gifts = []
                rarr.push(obj)
            }
        })

        return rarr;
    },
    //-- 映射产品的赠品数据
    giftMapHandle: function() {
        let giftsList = this.data.schemeObj.bd_shop_gifts || []
        let bd_shopids = this.data.bd_shopids

        console.log('bd_shopids,giftslist', bd_shopids, giftsList)

        giftsList.forEach((item, index) => {
            console.log('item:', item)
            let gifts = item.gifts
            let idx = bd_shopids.findIndex(u => {
                return u.id == item.shop_id
            })
            gifts.forEach((item, index) => {
                let gift_idx = this.data.giftList.findIndex(u => {
                    return u.id == item.gift_id
                })
                if (gift_idx >= 0) {
                    let gift = this.data.giftList[gift_idx]
                    console.log('gift:', gift)
                    gift.num = item.gift_num
                    this.concatGift(idx, gift)
                }
            })
        })
    },
    //-- 为某个产品关联赠品
    concatGift: function(idx, gift) {
        if (this.data.schemeObj.action_type == 1) { //-- 产品模式
            let bd_shopids = this.data.bd_shopids
            let index = bd_shopids[idx].gifts.findIndex((v, i) => {
                return gift.id == v.id
            })
            if (index >= 0) {
                bd_shopids[idx].gifts[index] = gift
            } else {
                bd_shopids[idx].gifts.push(gift)
            }
            this.setData({
                bd_shopids: bd_shopids
            })
        } else { //-- 方案模式
            let schemeObj = this.data.schemeObj
            let award_present = {
                id: gift.id,
                title: gift.title
            }
            schemeObj.award_money_content[idx].award_presents.push(award_present)
            this.setData({
                schemeObj: schemeObj
            })
        }
    },
    //-- 移除一个赠品关联
    spliceGift: function(idx, index) {
        let bd_shopids = this.data.bd_shopids
        bd_shopids[idx].gifts.splice(index, 1)
        this.setData({
            bd_shopids: bd_shopids
        })
    },
    //-- 从配置列表中移除产品
    removeProduct: function(e) {
        let bd_shopids = this.data.bd_shopids
        let idx = e.currentTarget.dataset.idx
        bd_shopids.splice(idx, 1)
        this.setData({
            bd_shopids: bd_shopids
        })
    },
    //-- 获取可配置的产品列表
    loadCanSetShopList: function() {
        app.post('https://m.58daiyan.com/StoreApi/getRecommendShopList', {
            store_id: this.data.storeId
        }, res => {
            console.log('loadCanSetShopList:', res.data)
            if (res.data.data && res.data.data.length > 0) {
                this.setData({
                    can_chose_shop: res.data.data
                })
            }
        })
    },
    //-- 输入名称
    inputChange: function(e) {
        let schemeObj = this.data.schemeObj
        schemeObj[e.currentTarget.id] = e.detail.value
        this.setData({
            schemeObj: schemeObj
        })
    },
    onLoad: function(options) {
        this.setData({
            storeId: options.storeId,
            scheme_id: options.scheme_id || 0,
            isowner: options.isowner || 1
        })
        this.getShopList()

    },
    onShow: function() {
        this.loadCanSetShopList()
    },
    //-- 赠送产品改变事件
    onAwardProductChanged: function(e) {
        console.log(e.detail.value)
        let schemeObj = this.data.schemeObj
        schemeObj.award_product_id = this.data.giftList[e.detail.value].id
        this.setData({
            zsindex: e.detail.value,
            schemeObj: schemeObj
        })
    },
    //-- 选择改变事件
    onRadioChanged: function(e) {
        let schemeObj = this.data.schemeObj
        schemeObj[e.currentTarget.id] = e.detail.value
        if (e.detail.value == 2) {
            schemeObj.suit_type = 5
        }
        this.setData({
            schemeObj: schemeObj
        })
    },
    //-- 初始化方案数据
    initSchemeData: function() {
        console.log('initSchemeData:');
        let schemeObj = this.data.schemeObj
        let scheme_id = this.data.scheme_id
        if (scheme_id > 0) {
            app.post('https://m.58daiyan.com/StoreApi/getRecommendActionDetails', {
                action_id: scheme_id
            }, res => {
                console.log('getRecommendActionDetails:', res.data)
                if (res.data.data.action_name) {
                    let obj = res.data.data;
                    schemeObj.token = app.userInfo().token
                    schemeObj.action_id = obj.id
                    schemeObj.store_id = obj.store_id
                    schemeObj.action_name = obj.action_name
                    schemeObj.start_money = obj.start_money
                    schemeObj.suit_type = obj.suit_type
                    schemeObj.start_time = obj.start_time.split(' ')[0]
                    schemeObj.end_time = obj.end_time.split(' ')[0]
                    schemeObj.bd_shopids = obj.bd_shopids || obj.shop.map(u=>{
                        return u.shop_id;
                    }).join(',')
                    schemeObj.propositus_num = obj.propositus_num
                    schemeObj.propositus_consume_type = 2
                    schemeObj.propositus_consume_money = obj.propositus_consume_money
                    schemeObj.award_type = obj.award_type
                    schemeObj.award_money = obj.award_money
                    schemeObj.award_ratio = obj.award_ratio
                    schemeObj.award_product_id = obj.award_product_id
                    schemeObj.award_product_num = obj.award_product_num
                    schemeObj.bd_shop_gifts = obj.bd_shop_gifts
                    schemeObj.xg_type = obj.xg_type
                    schemeObj.share_content = obj.share_content

                    schemeObj.action_type = obj.action_type
                    schemeObj.action_awardtype = obj.action_awardtype || 3
                    schemeObj.award_moneytype = obj.award_moneytype || 1
                    schemeObj.award_money_content = obj.award_money || []

                    if (obj.share_content) {
                        let share_texts = obj.share_content.split('|')
                        if (share_texts[0] == "A") {
                            this.setData({
                                text0: share_texts[0],
                                text1: share_texts[1],
                                text2: share_texts[3],
                                text3: share_texts[5]
                            })
                        }
                        if (share_texts[0] == "B") {
                            this.setData({
                                text0: share_texts[0],
                                text1: share_texts[1],
                                text2: share_texts[5],
                                text3: share_texts[3]
                            })
                        }

                    }
                    this.setData({
                        schemeObj: schemeObj,
                        zsindex: this.data.giftList.findIndex(u => u.id == schemeObj.award_product_id)
                    }, () => {
                        this.listBindShops(schemeObj.bd_shopids)
                    })

                }
            })
        } else {
            this.initValidateTime()
        }
    },
    //-- 新增方案初始化有效期
    initValidateTime: function() {
        console.log('initValidateTime:');
        let schemeObj = this.data.schemeObj
        let today = new Date()
        schemeObj.start_time = `${today.getFullYear()}-${(today.getMonth() + 1) < 10 ? "0" + (today.getMonth() + 1) : (today.getMonth() + 1)}-${today.getDate() < 10 ? "0" + today.getDate() : today.getDate()}`
        schemeObj.end_time = `${today.getFullYear()+1}-${(today.getMonth() + 1) < 10 ? "0" + (today.getMonth() + 1) : (today.getMonth() + 1)}-${today.getDate() < 10 ? "0" + today.getDate() : today.getDate()}`
        schemeObj.store_id = this.data.storeId
        this.setData({
            schemeObj: schemeObj
        })
    },
    //-- 获取产品列表
    getShopList: function() {
        app.post('https://m.58daiyan.com/StoreApi/getShopList', {
            tuanselect: 0,
            store_id: this.data.storeId,
            lastId: 0,
            num: 99
        }, res => {
            console.log('getShopList:', res.data)
            if (res.data.data.shop_list) {
                this.setData({
                    shop_list: res.data.data.shop_list.map(u => {
                        u.gallery = !u.gallery ? [] : u.gallery.split(',')
                        u.label = !u.label ? [] : u.label.split(' ')
                        return u;
                    })
                })
            } else {
                this.setData({
                    shop_list: []
                })
            }
            this.getGiftList(() => {
                this.initSchemeData()
            })
        })
    },
    //-- 获取赠品列表
    getGiftList: function(callback) {
        app.post('https://m.58daiyan.com/StoreApi/getPresentListByID', {
            store_id: this.data.storeId,
            is_template: 0,
            type: 2,
            num: 999
        }, res => {
            console.log('getGiftList:', res.data)
            if (res.data.data.shop_list) {
                this.setData({
                    giftList: res.data.data.shop_list.filter(u => u.check_status == 1),
                    zsindex: 0
                })
            }
            callback()
        })
    },
    //-- 设置方案
    setScheme: function() {
        if (this.data.isowner == 0) {
            app.msgbox({
                content: "管理者无此操作的权限！",
                title: '警告',
                showCancel: false,
            })
            return;
        }
        let schemeObj = this.data.schemeObj
        schemeObj.token = app.userInfo().token
        schemeObj.bd_shop_gifts = []
        if (schemeObj.action_type == 1) {
            //-- 处理产品模式的赠品 
            this.data.bd_shopids.forEach((item, index) => {
                if (item.gifts.length > 0) {
                    let arr = item.gifts.map(u => {
                        return {
                            shop_id: item.id,
                            gift_id: u.id,
                            gift_num: u.num
                        }
                    })
                    if (arr.length > 0)
                        schemeObj.bd_shop_gifts = schemeObj.bd_shop_gifts.concat(arr)
                }
            })
            schemeObj.bd_shop_gifts = JSON.stringify(schemeObj.bd_shop_gifts)
        } else {
            //-- 处理方案模式中的赠品列表明细
            schemeObj.award_money_content = schemeObj.award_money_content.map(u=>{
                u.award_presents = u.award_presents.map(p=>{
                    return p.id
                }).join(',')
                return u;
            })
        }
        schemeObj.award_money_content = JSON.stringify(schemeObj.award_money_content)

        schemeObj.bd_shopids = this.data.bd_shopids.map(u => u.id).join(',')
        if (this.data.text0 == 'A')
            schemeObj.share_content = `${this.data.text0}|${this.data.text1}|(sku_price)|${this.data.text2}|(title)|${this.data.text3}`
        if (this.data.text0 == 'B')
            schemeObj.share_content = `${this.data.text0}|${this.data.text1}|(title)|${this.data.text3}|(sku_price)|${this.data.text2}`
        console.log('schemeObj:', schemeObj)
        app.post('https://m.58daiyan.com/StoreApi/add_recommend_action', schemeObj, res => {
            console.log('setScheme:', res.data)
            app.msgbox({
                content: res.data.message,
                showCancel: false,
                success: d => {
                    if (res.data.status == 1) {
                        wx.navigateBack({
                            delta: 1
                        })
                    }
                }
            })
        })
    }
})