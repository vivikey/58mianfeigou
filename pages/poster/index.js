import smallmenuevent from '../../template/smallmenu/smallmenu.js'
import FrontEndPoster from '../../comm/FrontEndPoster.js'
var app = getApp()
var pageObj = {
  data: {
    smallmenuclosed: true,
    distance: 10,
    lastId: 0,
    posterHotList: [],
    showbload: false,
    is_init: false,
		version:''
  },
  openCloseSmallMenu: function(e) {
    smallmenuevent(this)
  },
  onLoad: function(options) {
		this.setData({
			version:app.VERSION()
		})
		this.loadPosterList()
  },
  //-- 获取海报列表
  loadPosterList() {
		let local = app.LOCATION()
		let long_lat = `${local.longitude},${local.latitude}`
		FrontEndPoster.List({
      user_id: app.USER_ID(),
			user_location: long_lat,
      page: 1,
      num: 99
    }).then(r => {
			console.log('FrontEndPoster.List => ', r)
      if (r.code == 200) {
        this.setData({
          posterHotList: r.data.map(u => {
            u.poster_imgs = u.poster_imgs.split(',')
            return u;
          })
        })
      }
    })
  },
}
import pageex from "../../utils/pageEx.js"
import poster from "../../template/posteritem/posteritem.js"
pageex(pageObj)
poster(pageObj, app)
Page(pageObj)