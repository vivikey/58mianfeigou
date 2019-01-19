export default {
  /**
   * 将秒级时间戳转换为24小时标准时间 2018-12-12 12:12:12
   */
  ToLocal(timespan) {
    timespan = timespan * 1000
    let tz = new Date(timespan) //--2018-12-12T12:12:12.000Z
    let o = {
      YY: tz.getFullYear(),
      MM: tz.getMonth() + 1, //月份
      DD: tz.getDate(), //日
      h: tz.getHours(), //小时
      m: tz.getMinutes(), //分
      s: tz.getSeconds(), //秒
      q: Math.floor((tz.getMonth() + 3) / 3), //季度
      SS: tz.getMilliseconds() //毫秒
    }
    o.MM = `${o.MM < 10 ? "0" : ""}${o.MM}`
    o.DD = `${o.DD < 10 ? "0" : ""}${o.DD}`
    o.h = `${o.h < 10 ? "0" : ""}${o.h}`
    o.m = `${o.m < 10 ? "0" : ""}${o.m}`
    o.s = `${o.s < 10 ? "0" : ""}${o.s}`

    return `${o.YY}-${o.MM}-${o.DD} ${o.h}:${o.m}:${o.s}`
  },
  //-- 获取今天的日期
  GetToday() {
    let date = new Date()
    let year = date.getFullYear()
    let month = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1)
    let day = (date.getDate() < 10 ? '0' : '') + date.getDate()
    return year + '-' + month + '-' + day
  },
  //-- 获取一年后的今天的日期
  GetYearLatterToday() {
    let date = new Date()
    let year = date.getFullYear()+1
    let month = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1)
    let day = (date.getDate() < 10 ? '0' : '') + date.getDate()
    return year + '-' + month + '-' + day
  },
}