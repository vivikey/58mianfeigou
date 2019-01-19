var app = getApp()
import Comm from '../../comm/Comm.js'
import TimeConverter from '../../comm/TimeConverter.js'
Page({
  data: {
    version: '',
    user: {},
    level: 0,
    currUser: [],
    list: [{
      name: ''
    }]
  },
  onLoad: function(options) {
    this.setData({
      version: app.VERSION(),
      user: app.USER(),
      currUser: [{
        img: app.USER().user_img,
        name: app.USER().nick_name,
				user_id:app.USER_ID()
      }]
    })
  },
  initList(user_id) {
		user_id = user_id || app.USER_ID()
		Comm.SubUserList({
			user_id: user_id
		}).then(r=>{
			console.log('Comm.SubUserList => ',r)
			let list = []
			if(r.code==200 && r.data.length>0){
					list= r.data.map((item, idx) => {
						item.addtime = TimeConverter.ToLocal(item.addtime)
						return item
					})
			}
			this.setData({
				list:list
			})
		})
  },
  //-- 上一级
  onPreLevel() {
		this.data.currUser.splice(-1, 1)
		this.data.level--
    this.setData({
			level: this.data.level,
			currUser: this.data.currUser,
    }, () => {
				this.initList(this.data.currUser[this.data.level].user_id)
    })

  },
  //-- 下一级
  onNextLevel(e) {
    let idx = e.currentTarget.dataset.idx
    let currUser = this.data.currUser
    let list = this.data.list
		let {id,nick_name,user_img} = list[idx].user_info
    currUser.push({
			user_id: id,
			img: user_img,
			name: nick_name
    })
    this.setData({
      currUser: currUser,
      level: this.data.level + 1
    })
		this.initList(id)
  },
  getRandomArrayElements(arr, count) {
    var shuffled = arr.slice(0),
      i = arr.length,
      min = i - count,
      temp, index;
    while (i-- > min) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
    }
    return shuffled.slice(min);
  },
  onShow: function() {
    this.initList()
  },
})