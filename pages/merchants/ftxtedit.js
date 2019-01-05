var app = getApp()
import Store from '../../comm/Store.js'
Page({
  data: {
    version: '',
    storeId: 0,
    goods_id: 0,
    ad_id: 0,
    colors: [],
    currItem: {
      idx: 0,
      type: 'text', //-- text/image
      content: '',
      fontSize: 14,
      color: '#000000',
      bolder: false,
      italic: false
    },
    showColorList: false,
    ftxtData: []
  },
  /**插入图片事件 */
  onInsertImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        let image = res.tempFilePaths[0]
        app._uploadImage(image).then(r => {
          var resd = JSON.parse(r.data)
          if (resd.code == 200) {
            let imgsrc = app.joinPath(app.globalData.xcxUrl, resd.data);
            let ftxtData = this.data.ftxtData
            ftxtData.push({
              idx: this.getMaxIdx() + 1,
              type: 'image', //-- text/image
              content: imgsrc,
              fontSize: 14,
              color: '#000000',
              bolder: false,
              italic: false
            })
            this.setData({
              ftxtData: ftxtData
						}, this.pageScrollToBottom)
          } else {
            app.msg(resd.message)
          }
        })
      }
    })
  },
  getMaxIdx() {
    let maxIdx = 0
    this.data.ftxtData.forEach(v => {
      if (v.idx > maxIdx) {
        maxIdx = v.idx
      }
    })
    return maxIdx
  },
  /**插入段落事件 */
  onInsertText() {
    let currItem = this.data.currItem
    if (currItem.content.length <= 0) {
      app.msg("请输入段落内容！")
      return;
    }
    currItem.idx = this.getMaxIdx() + 1
    let ftxtData = this.data.ftxtData
    ftxtData.push({ ...currItem
    })
    currItem.content = ""
    this.setData({
      ftxtData: ftxtData,
      currItem: currItem
		}, this.pageScrollToBottom)
  },
  /**提交事件 */
  onSubmit() {
    let ftxtData = this.data.ftxtData
    let firstimg = ftxtData.find(v => v.type == "image")
    let firsttxt = ftxtData.find(v => v.type == "text")
    let data = {
      store_id: this.data.storeId,
      user_id: app.USER_ID(),
      goods_id: this.data.goods_id,
      blog: JSON.stringify(ftxtData),
      ad_img: !firstimg ? null : firstimg.content,
      ad_title: !firsttxt ? "" : firsttxt.content,
			id:this.data.ad_id
    }
    Store.AddFTxt(data).then(r => {
      console.log('Store.AddFTxt => ', r)
      if (r.code == 200) {
        this.setData({
          ad_id: r.data
        })
				app.SUCCESS("OK",()=>{
					wx.navigateBack({
						delta:1
					})
				})
      }else{
				app.ERROR(r.message)
			}
    })
  },
	pageScrollToBottom() {
		wx.createSelectorQuery().select('#container').boundingClientRect(rect=> {
			// 使页面滚动到底部
			wx.pageScrollTo({
				scrollTop: rect.bottom
			})
		}).exec()
	},
  /**打开颜色选择板 */
  openColorList() {
    this.setData({
      showColorList: true
    })
  },
  /**加粗选择事件 */
  openItalicClick(e) {
    let currItem = this.data.currItem
    currItem.italic = !currItem.italic
    this.setData({
      currItem: currItem
    })
  },
  /**加粗选择事件 */
  openBolderClick(e) {
    let currItem = this.data.currItem
    currItem.bolder = !currItem.bolder
    this.setData({
      currItem: currItem
    })
  },
  /**颜色选择事件 */
  onColorChange(e) {
    let currItem = this.data.currItem
    currItem.color = e.currentTarget.dataset.val
    this.setData({
      currItem: currItem,
      showColorList: false
    })
  },
  /**字体大小事件 */
  onFontSizeClick(e) {
    let currItem = this.data.currItem
    currItem.fontSize = e.currentTarget.dataset.val
    this.setData({
      currItem: currItem
    })
  },
  /**段落输入事件 */
  onTextareaInput(e) {
    let currItem = this.data.currItem
    currItem.content = e.detail.value
    this.setData({
      currItem: currItem
    })
  },
  onLoad(options) {
    this.data.storeId = options.storeId
    this.data.goods_id = options.goods_id
    this.data.ad_id = options.ad_id || 0
    this.initColors()
		this.setData({
			version:app.VERSION(),
			ad_id: this.data.ad_id
		})
  },
  onShow() {
    if (this.data.ad_id > 0) {
      this.loadFTxt()
    } else {
      this.initData()
    }
  },
  loadFTxt() {
    Store.GetFTxt({
      ad_id: this.data.ad_id,
      user_id: app.USER_ID()
    }).then(r => {
      console.log('Store.GetFTxt => ', r)
      let arr = JSON.parse(r.data.ad.blog)
      this.setData({
        ftxtData: arr
      })
    })
    this.data.currItem.idx = this.getMaxIdx() + 1
  },
  initData() {
    this.data.currItem.idx = this.getMaxIdx() + 1
  },
  /**初始化Web安全色 */
  initColors() {
    let colors = []
    for (let r = 0; r < 6; r++) {
      for (let g = 0; g < 6; g++) {
        for (let b = 0; b < 6; b++) {
          colors.push(`#${this.covertColor(r)}${this.covertColor(g)}${this.covertColor(b)}`)
        }
      }
    }
    this.setData({
      colors: colors
    })
  },
  /**转换颜色16进制值 */
  covertColor(n) {
    switch (n) {
      case 0:
        return '00';
      case 1:
        return '33';
      case 2:
        return '66';
      case 3:
        return '99';
      case 4:
        return 'cc';
      case 5:
        return 'ff';
    }
  }
})