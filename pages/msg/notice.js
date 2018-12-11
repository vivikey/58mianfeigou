var app = getApp()
Page({
    data: {
        type: 0,
        noticeList: []
    },
    getNoticeList: function(type) {
        app.getMsgNoticeList(type, 2, res => {
            console.log('getNoticeList:', res.data)
            if (res.data.status == 1) {
                this.setData({
                    noticeList: res.data.data.map(u => {
                        u.addtime = app.convertDate(u.addtime)
                        return u;
                    })
                })
            }
        })
    },
    onLoad: function(options) {
        var title = options.type == 2 ? '平台公告' : '商家公告'
        wx.setNavigationBarTitle({
            title: title
        })
        this.setData({
            type: options.type
        })
        this.getNoticeList(options.type)
    },
    onShow: function() {
        console.log('notice type:', this.data.type)
    }
})