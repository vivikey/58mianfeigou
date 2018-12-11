var app=getApp()
Page({
  data: {
      present_id: 0,
      commentList: [],
      type:2
  },
  onLoad: function (options) {
      this.setData({
          present_id: options.id,
          type:options.type || 2,
          commentList: []
      })
      this.loadEvaluatList()
  },
  onShow: function () {
      
  },
    //-- 加载评价
    loadEvaluatList: function () {
        var commentList = this.data.commentList
        app.loadEvaluatList({
            id: this.data.present_id,
            num: 20,
            type:this.data.type,
            lastId: commentList.length > 0 ? commentList[commentList.length-1].id:0
        }, res => {
            console.log('全部评价:', res.data)
            var commentList = this.data.commentList
            if (res.data.data.evaluate) {
                this.setData({
                    commentList: commentList.concat(res.data.data.evaluate)
                })
            }
        })
    },
    onReachBottom:function(){
        this.loadEvaluatList()
    },
    showCommBigImg:function(e){
        let idx=e.currentTarget.dataset.idx
        let index=e.currentTarget.dataset.index
        let commentList = this.data.commentList
        wx.previewImage({
            current: commentList[index].image[idx],
            urls: commentList[index].image
        })
    }
})