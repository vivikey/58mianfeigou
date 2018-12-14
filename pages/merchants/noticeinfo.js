import Notice from '../../comm/Notice.js'

var app = getApp()
Page({
    data: {
        version: '',
        notice: {
            id: 0,
            store_id: 0,
            notice_name: '',
            notice_content: ''
        },
        storeId: 0,
        storeName: ''
    },
    onLoad: function (options) {
        console.log(options)
        let notice = this.data.notice
        let notice_id = options.noticeId || 0
        if (notice_id > 0) {
            Notice.Get({ user_id: app.USER_ID(), notice_id }).then(r => {
                console.log('Poster.Get => ', r)
                if (r.code == 200) {
                    notice = r.data.map(u=>{
                        u.addtime = new Date(u.addtime).toLocaleString();
                        return u;
                    })
                    this.setData({
                        notice: notice[0]
                    })
                }
            })
        }

        this.setData({
            storeId: options.storeId,
            storeName: options.storeName,
            version: app.VERSION()
        })
    },
    //-- 输入改变事件
    onInputChanged(e) {
        var notice = this.data.notice;
        notice[e.currentTarget.id] = e.detail.value;
        this.setData({
            notice: notice
        })
    },
    //-- 执行操作
    onSubmit() {
        let notice = Object.assign({}, this.data.notice)
        if (notice.notice_name.length <= 0) {
            app.msg("请输入公告标题")
            return;
        }
        if (notice.notice_content.length <= 0) {
            app.msg("请输入公告内容")
            return;
        }

        notice.store_id = this.data.storeId
        Notice.Post(notice).then(r => {
            console.log("Poster.Post => ", r)
            if (r.code === 200) {
                app.SUCCESS(r.message, wx.navigateBack({
                    delta: 1
                }))
            } else {
                app.ERROR(r.message)
            }
        })
    }
})