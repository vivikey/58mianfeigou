var app = getApp()
import Store from '../../comm/Store.js'
import TimeConverter from '../../comm/TimeConverter.js'
Page({
  data: {
    store_id: 0,
    luckyMoney: {
      red_id: 0,
      store_id: 0,
      user_id: 0,
      red_name: '', //-- 红包名称 1
      red_type: 0, //-- 红包类型：0-单向红包 1-双向红包 1
      red_num: 0, //-- 红包数量 1
      red_start: '2019-03-12', //-- 开启时间 1
      red_end: '2019-04-12', //-- 结束时间 1
      red_money_min: 0, //-- 最小金额
      red_money_max: 1, //-- 最大金额
    }
  },
  onTypeChanged(e) {
    let luckyMoney = {
      ...this.data.luckyMoney
    }
    if (luckyMoney.red_id <= 0) {
      luckyMoney.red_type = e.currentTarget.dataset.val;
      this.setData({
        luckyMoney
      })
    }
  },
  onInputChanged(e) {
    let luckyMoney = {
      ...this.data.luckyMoney
    }
		if (e.currentTarget.id == "red_start" || e.currentTarget.id == "red_end"){
			if(luckyMoney.red_id>0){
				return;
			}
		}
    luckyMoney[e.currentTarget.id] = e.detail.value;
    this.setData({
      luckyMoney
    })
  },
  onSubmit() {
    let {
      luckyMoney,
      store_id
    } = this.data
    if (luckyMoney.red_name.length <= 0) {
      app.msg('请输入红包名称！')
      return;
    }

    if (luckyMoney.red_num <= 0) {
      app.msg('请输入红包数量！')
      return;
    }

    if (luckyMoney.red_money_min <= 0) {
      app.msg('请输入红包最小金额！')
      return;
    }
    if (luckyMoney.red_money_max <= 0) {
      app.msg('请输入红包最大金额！')
      return;
    }

    if (luckyMoney.red_money_max <= luckyMoney.red_money_min) {
      app.msg('红包最大金额必须大于最小金额！')
      return;
    }

    const user_id = app.USER_ID()
    if (luckyMoney.red_id <= 0) {
      //-- 新增
      const data = { ...luckyMoney,
        user_id,
        store_id
      }
      delete data.red_id
      Store.LuckyMoneyAdd(data)
        .then(r => {
          if (r.code == 200) {
            app.SUCCESS(r.message, () => {
              wx.navigateBack({
                delta: 1
              })
            })
          } else {
            app.ERROR(r.message)
          }
        })
    } else {
      //-- 修改
      const data = { ...luckyMoney,
        user_id
      }
      delete data.store_id
      delete data.red_start
      delete data.red_end
      Store.LuckyMoneyUpdate(data)
        .then(r => {
          if (r.code == 200) {
            app.SUCCESS(r.message, () => {
              wx.navigateBack({
                delta: 1
              })
            })
          } else {
            app.ERROR(r.message)
          }
        })
    }
  },
  onLoad(options) {
    console.log('options => ', options)
    this.data.store_id = options.storeId
    this.data.luckyMoney.red_id = options.id || 0
    this.data.luckyMoney.red_start = TimeConverter.GetToday()
    this.data.luckyMoney.red_end = TimeConverter.GetYearLatterToday()
  },
  onShow() {
    let luckyMoney = { ...this.data.luckyMoney
    }
    if (luckyMoney.red_id > 0) {
      Store.LuckyMoneyInfo({
        user_id: app.USER_ID(),
        red_id: luckyMoney.red_id
      }).then(r => {
        if (r.code == 200) {
          const luckyMoney = { ...r.data
          }
          luckyMoney.red_id = luckyMoney.id
          delete luckyMoney.id
          this.setData({
            luckyMoney
          })
        } else {
          console.log('Store.LuckyMoneyInfo Error:', r.message)
        }
      })
    }
  },
})