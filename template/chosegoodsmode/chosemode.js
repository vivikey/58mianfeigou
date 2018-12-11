module.exports = function (pageObj) {
    pageObj.data.shopMode = {
        image:null,
        title:'',
        shop_sku:[],
        chosedIdx:0,
        count:1,
        injoin:true, 
        show:false       
    }

    pageObj.tagChoseBox = function(){
        var shopMode = this.data.shopMode
        shopMode.show = !shopMode.show
        this.setData({
            shopMode: shopMode
        })
    }
    pageObj.chosedOK = function(){
        this.tagChoseBox()
    }
    pageObj.addcount = function(){
        var shopMode = this.data.shopMode
        shopMode.count = parseInt(shopMode.count) + 1
        this.setData({
            shopMode: shopMode
        })
    }
    pageObj.subcount = function(){
        var shopMode = this.data.shopMode
        if (shopMode.count>1){
        shopMode.count = parseInt(shopMode.count) - 1
        }
        this.setData({
            shopMode: shopMode
        })
    }
    pageObj.setChosedItem=function(e){
        var shopMode = this.data.shopMode
        shopMode.chosedIdx = e.currentTarget.dataset.idx
        shopMode.image = shopMode.shop_sku[e.currentTarget.dataset.idx].sku_img
        this.setData({
            shopMode: shopMode
        })
    }
    pageObj.injoinTuan=function(){
        console.log(this.data.shopMode)
        wx.setStorageSync(this.data.shop_id, this.data.shopMode)
        wx.navigateTo({
            url: `grouporder?id=${this.data.shop_id}&store_name=${this.data.goods.order_info.store_name}&tuan_id=${this.data.tuan_id}`,
        })
    }
}