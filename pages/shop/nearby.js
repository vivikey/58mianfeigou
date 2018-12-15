var app = getApp()
var pageObj={
    data: {
        user: {},
        version:''
    },
    onLoad: function(options) {
        this.setData({
            version: app.VERSION(),
            user: app.USER()
        })
    },
    onShow: function() {
    },
    onReachBottom: function () {
    }
}
import pageex from "../../utils/pageEx.js"
pageex(pageObj)
Page(pageObj)