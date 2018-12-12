var app = getApp()
import Poster from '../../comm/Poster.js'
Page({
    data: {
        version:'',
        myPosters: [],
        storeName: '',
        storeId: 0
    },
    onLoad(options) {
        console.log(options)
        this.setData({
            storeName: options.storeName,
            storeId: options.storeId,
            version:app.VERSION()
        })
    },
    onShow() {
        this.getMyPosters(this.data.storeId)
    },
    getMyPosters(store_id){
        Poster.List({user_id:app.USER_ID(),store_id}).then(r=>{
            console.log('Poster.List => ',r)
            if(r.code==200){
                this.setData({
                    myPosters:r.data.map(u=>{
                        u.poster_imgs = u.poster_imgs.split(',')
                        return u;
                    })
                })
            }
        })
    },
    deletePoster(e){
        app.CONFIME("商铺删除后不能恢复，确定删除该商铺吗？", () => {
            Poster.Delete({ user_id: app.USER_ID(), poster_id: e.currentTarget.dataset.id }).then(r => {
                if (r.code === 200) {
                    app.SUCCESS(r.message, this.getMyPosters(this.data.storeId))
                } else {
                    app.ERROR(r.message)
                }
            })
        })
    },
    editPoster(e){
        wx.navigateTo({
            url: `/pages/merchants/posterinfo?storeId=${this.data.storeId}&storeName=${this.data.storeName}&posterId=${e.currentTarget.dataset.id}`,
        })
    }
})