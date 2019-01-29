var app = getApp()
import Comm from '../../comm/Comm.js'
import TimeConverter from '../../comm/TimeConverter.js'
Page({
  data: {
    version: '',
		type: 1,
    user: {},
    level: 0,
    currUser: [],
    off_line_direct_num: 0,
    off_line_total_num: 0,
    list1: [],
		list0: [],
		sort1:['时间升序','级别降序','团队人数降序'],//- index
		sortIdx:0,
    pageWhere1: {
      page: 1,
      num: 30
    },
		pageWhere0: {
			page: 1,
			num: 30
		},
    member_grade: 1, //--0:消费者 1：金牌 2：经理 3：总监 4：高级总监 5：合伙人 6：创始人
  },
	onChangeSort(){
		wx.showActionSheet({
			itemList: this.data.sort1,
			success:(res)=> {
				console.log(res.tapIndex)
				this.setData({
					sortIdx: res.tapIndex
				},this.listSort)
			},
			fail(res) {
				console.log(res.errMsg)
			}
		})
	},
	listSort(){
		if (this.data.sortIdx == 0) {
			//-- 时间升序
			this.data.list1.sort(this.sortByAddtime)
			this.data.list0.sort(this.sortByAddtime)
		}
		if (this.data.sortIdx == 1) {
			//-- 级别降序
			this.data.list1.sort(this.sortByGradeDesc)
		}
		if (this.data.sortIdx == 2) {
			//-- 团队人数降序
			this.data.list1.sort(this.sortByTotalNumDesc)
		}
		this.setData({
			list0:this.data.list0,
			list1: this.data.list1,
		})
	},
	sortByAddtime(a,b){
		return a.addtime>=b.addtime?1:-1
	},
	sortByGradeDesc(a, b) {
		return a.user_info.member_grade >= b.user_info.member_grade ? -1 : 1
	},
	sortByTotalNumDesc(a, b) {
		return a.off_line_total_num >= b.off_line_total_num ? -1 : 1
	},
	//-- 切换类型
	onChangeType(e) {
		this.setData({
			member_grade: e.currentTarget.id,
		}, () => {
			if (this.data[`pageWhere${e.currentTarget.id}`].page==1){
				this.initList()
			}
		})
	},
  onLoad: function(options) {
    if (!app.USER()) {
      app.globalData.bkPage = this.route
      wx.navigateTo({
        url: `/pages/index/index?id=0&higher_up=0`,
      })
    }
    this.setData({
      version: app.VERSION(),
      user: app.USER(),
      currUser: [{
        img: app.USER().user_img,
        name: app.USER().nick_name,
        user_id: app.USER_ID()
      }]
    })
  },
  initList() {
		let pageWhere = this.data[`pageWhere${this.data.member_grade}`]
    Comm.SubUserList({
				user_id: this.data.currUser[this.data.level].user_id || app.USER_ID(),
      member_grade: this.data.member_grade,
			...pageWhere
    }).then(r => {
      console.log('Comm.SubUserList => ', r)
      let list = []
      let off_line_total_num = 0
      let off_line_direct_num = 0
      if (r.code == 200 && r.data.off_line_list.length > 0) {
        list = r.data.off_line_list.map((item, idx) => {
          item.addtimeLocal = TimeConverter.ToLocal(item.addtime)
          if (!item.user_info.nick_name) {
            item.user_info.nick_name = '[***]'
          }
          if (!item.user_info.user_img) {
            item.user_info.user_img = "/resource/icon/defheadimg.png"
          }
          return item
        })
        off_line_direct_num = r.data.off_line_direct_num
        off_line_total_num = r.data.off_line_total_num
				if (pageWhere.page > 1) {
					this.data[`list${this.data.member_grade}`] = [...this.data[`list${this.data.member_grade}`], ...list]
        } else {
					this.data[`list${this.data.member_grade}`] = [...list]
        }
        this.setData({
					list1:this.data.list1,
					list0:this.data.list0,
          off_line_direct_num: off_line_direct_num,
          off_line_total_num: off_line_total_num
        },()=>{
					this.listSort()
					pageWhere.page++
				})
      } else {
				if (pageWhere.page > 1) {
						pageWhere.page--
            app.msg("没有更多了~~")
        }
      }

    })
  },
  //-- 上一级
  onPreLevel() {
    this.data.currUser.splice(-1, 1)
    this.data.level--
		this.data.pageWhere0.page = 1
		this.data.pageWhere1.page = 1
      this.setData({
        level: this.data.level,
        currUser: this.data.currUser,
      }, () => {
				
        this.initList()
      })

  },
  //-- 下一级
  onNextLevel(e) {
    let idx = e.currentTarget.dataset.idx
    let currUser = this.data.currUser
    let list = this.data.list
    let {
      id,
      nick_name,
      user_img
    } = list[idx].user_info
    currUser.push({
      user_id: id,
      img: user_img,
      name: nick_name
    })
    this.setData({
      currUser: currUser,
      level: this.data.level + 1
    })
		this.data.pageWhere0.page = 1
		this.data.pageWhere1.page = 1
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
	onReachBottom() {
			this.initList()
	},
})