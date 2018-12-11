var app = getApp()
import Shop from '../../comm/Shop.js'

Page({
    data: {
        shopTypeList: [
            [],
            [],
            []
        ],
        multiIndex: [
            [0],
            [0],
            [0]
        ],
        notuan: 0,
        isowner: false,
        specsItem: {
            sku_spec: '',
            sku_img: '',
            sku_stock: 0,
            sku_price: 0.0,
            sku_price_tuan: 0.0,
            sku_style: '',
            sku_series: ''
        },
        goods: {},
        validTimeIdx: 0,
        validTime: [{
                k: 24,
                v: '24小时'
            },
            {
                k: 48,
                v: '48小时'
            },
            {
                k: 72,
                v: '72小时'
            },
            {
                k: 0,
                v: '一直有效'
            },
        ]
    },
    onLoad: function(options) {
        var goods_id = options.goods_id || 0
        var store_id = options.storeId
        if(goods_id>0){
            Shop.Get({user_id:app.USER_ID(),goods_id}).then(r=>{
                if(r.code==200){
                    let g = r.data
                    this.setData({
                        goods:g
                    })
                    initTypeList(g.class_one,g.class_two,g.class_three)
                }    
            })
        }else{
            initTypeList(0,0,0)
        }
    },
    //-- 初始化商品类型列表数据
    initTypeList(cid1,cid2,cid3){
        let shopTypeList = this.data.shopTypeList
        let multiIndex = this.data.multiIndex

        //-- 1.获取一级列表数据
        
    },
    onShow: function() {}
})