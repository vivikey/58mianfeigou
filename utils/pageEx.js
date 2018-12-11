module.exports = function(pageObj) {
    pageObj.data.showToTop = false
    pageObj.onPageScroll = function(obj) {
        if (obj.scrollTop >= 1000 && !this.data.showToTop) {
            this.setData({
                showToTop: true
            })
        }
        if (obj.scrollTop < 1000 && this.data.showToTop) {
            this.setData({
                showToTop: false
            })
        }
    }
    pageObj.toTop = function() {
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 500
        })
    }
}