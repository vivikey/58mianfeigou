var openCloseSmallMenu = function(that) {
    var smallmenuclosed = that.data.smallmenuclosed;
    that.setData({
        smallmenuclosed: !smallmenuclosed
    })
}
//导出，供外部使用
export default openCloseSmallMenu