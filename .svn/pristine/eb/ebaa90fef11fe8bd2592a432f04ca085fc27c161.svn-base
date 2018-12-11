module.exports = function (pageObj,app) {
//-- 点赞
pageObj.doLike= function(e) {
    let ds = { ...e.currentTarget.dataset }
    app.doLike(ds.id, res => {
        if (res.data.status == 1) {
            let pl = this.data.posterList
            pl[ds.idx].is_like = 1
            pl[ds.idx].like_count++
            this.setData({
                posterList: pl
            })
        } else {
            app.msg(res.data.message)
        }
    })
}
//-- 取消点赞
pageObj.donotLike= function (e) {
    let ds = { ...e.currentTarget.dataset }
    app.donotLike(ds.id, res => {
        if (res.data.status == 1) {
            let pl = this.data.posterList
            pl[ds.idx].is_like = 0
            pl[ds.idx].like_count--
            this.setData({
                posterList: pl
            })
        } else {
            app.msg(res.data.message)
        }
    })
}
//-- 去评论
pageObj.toComment= function(e) {
    wx.navigateTo({
        url: `/pages/poster/detail?id=${e.currentTarget.dataset.id}`,
    })
}
}