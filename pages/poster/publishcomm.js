var app = getApp()
Page({
    data: {
        id:0,
        store_id:0,
        title:'',
        comm:''
    },
    onLoad: function(options) {
        this.setData({
            id:options.id,
            store_id: options.store_id,
            title:options.title
        })
    },
    comminputchanged:function(e){
        this.setData({
            comm:e.detail.value
        })
    },
    //-- 提交评论
    submitComm: function () {
        var content = this.data.comm
        if (!content || content.length < 10) {
            app.msg("请输入评论，至少10个字符！");
            return;
        }
        app.post('https://m.58daiyan.com/MinimallApi/comment', {
            token: app.userInfo().token,
            is_anonymous: 0,
            poster_id: this.data.id,
            store_id: this.data.store_id,
            content: content
        }, res => {
            if (res.data.status == 1) {
                //--success
                this.setData({
                    comm_content: '',
                    open_comm: 0,
                    commentList: []
                })
                app.msg("评论成功")
                wx.navigateBack({
                    delta:1
                })
            } else {
                app.msgbox({
                    title: "ERROR",
                    content: res.data.message,
                    showCancel: false
                })
            }
        })
    },
})