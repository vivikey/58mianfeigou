export default {
  data: {
    showToTop: false
  },
  methods: {
    onPageScroll(obj) {
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
    },
    toTop() {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 500
      })
    }
  }
}