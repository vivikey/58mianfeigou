var app = getApp()
import Notice from '../../comm/Notice.js'
import TimeConverter from '../../comm/TimeConverter.js'
Page({
    data: {
        version: '',
        noticeList: [],
        storeName: '',
        storeId: 0
    },
    onLoad(options) {
        console.log(options)
        this.setData({
            storeName: options.storeName,
            storeId: options.storeId,
            version: app.VERSION()
        })

    },
    onShow() {
        this.getNoticeList(this.data.storeId)
    },
    getNoticeList(store_id) {
        Notice.List({ user_id: app.USER_ID(), store_id }).then(r => {
            console.log('Notice.List => ', r)
            if (r.code == 200) {
                this.setData({
                    noticeList: r.data.map(u => {
                        u.addtime = TimeConverter.ToLocal(u.addtime);
                        return u;
                    })
                })
            }
        })
    },
    deleteNotice(e) {
        app.CONFIME("公告删除后不能恢复，确定删除该公告吗？", () => {
            Notice.Delete({ user_id: app.USER_ID(), notice_id: e.currentTarget.dataset.id }).then(r => {
                if (r.code === 200) {
                    app.SUCCESS(r.message, this.getNoticeList(this.data.storeId))
                } else {
                    app.ERROR(r.message)
                }
            })
        })
    },
    editNotice(e) {
        wx.navigateTo({
            url: `/pages/merchants/noticeinfo?storeId=${this.data.storeId}&storeName=${this.data.storeName}&noticeId=${e.currentTarget.dataset.id}`,
        })
    }
})