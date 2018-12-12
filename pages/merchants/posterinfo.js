import Poster from '../../comm/Poster.js'

var app = getApp()
Page({
    data: {
        version:'',
        poster: {
            id: 0,
            store_id: 0,
            poster_name: '',
            poster_content: '',
            poster_imgs:[]
        },
        storeId: 0,
        storeName: ''
    },
    onLoad: function(options) {
        console.log(options)
        let poster = this.data.poster
        let poster_id = options.posterId || 0
        if (poster_id>0){
            Poster.Get({user_id:app.USER_ID(),poster_id}).then(r=>{
                console.log('Poster.Get => ',r)
                if(r.code==200){
                    poster = r.data.map(u=>{
                        u.poster_imgs = u.poster_imgs.split(',') || []
                        return u;
                    })
                    this.setData({
                        poster: poster[0]
                    })
                }
            })
        }

        this.setData({
            storeId: options.storeId,
            storeName: options.storeName,
            version:app.VERSION()
        })    
    },
    //-- 输入改变事件
    onInputChanged(e) {
        var poster = this.data.poster;
        poster[e.currentTarget.id] = e.detail.value;
        this.setData({
            poster: poster
        })
    },
    //-- 图片移除事件
    onImageRemoving(e) {
        var poster = this.data.poster
        poster[e.target.id].splice(e.target.dataset.idx, 1)
        this.setData({
            poster: poster
        })
    },
    //-- 图片选择事件
    onImageChosed() {
        let poster = this.data.poster;
        wx.chooseImage({
            count: 6 - poster.poster_imgs.length,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: res => {
                var tempFilePaths =[]
                res.tempFilePaths.forEach(u=>{
                    app._uploadImage(u).then(r => {
                        var resd = JSON.parse(r.data)
                        if (resd.code == 200) {
                            poster.poster_imgs.push(app.joinPath(app.globalData.xcxUrl, resd.data));
                            this.setData({
                                poster: poster
                            })  
                        } else {
                            app.msg(resd.message)
                        }

                    })
                })
            
            }
        })
    },
    //-- 执行操作
    onSubmit() {
        let poster = Object.assign({}, this.data.poster)
        if (poster.poster_name.length <= 0) {
            app.msg("请输入海报标题")
            return;
        }
        if (poster.poster_content.length <= 0) {
            app.msg("请输入海报内容")
            return;
        }
        if (!poster.poster_imgs || poster.poster_imgs.length <= 0) {
            app.msg("请上传海报图片")
            return;
        }

        poster.poster_imgs = poster.poster_imgs.join(',')
        poster.store_id = this.data.storeId
        Poster.Post(poster).then(res => {
            console.log("Poster.Post => ", res)
            if (res.code === 200) {
                app.SUCCESS('提交成功！请等待审核', wx.navigateBack({
                    delta: 1
                }))
            } else {
                app.ERROR(res.message)
            }
        })
    }
})