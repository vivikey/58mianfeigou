export default {
    //--2.X 通用的异步请求方法
    Get(url, data, success, failHandle, showload = true) {
        this.request(url, 'GET', data, showload, success, failHandle);
    },
    Post(url, data, success, failHandle, showload = false) {
        this.request(url, 'POST', data, showload, success, failHandle);
    },
    Put(url, data, success, failHandle, showload = false) {
        this.request(url, 'PUT', data, showload, success, failHandle);
    },
    Delete(url, data, success, failHandle, showload = false) {
        this.request(url, 'DELETE', data, showload, success, failHandle);
    },
    //-- 2.X 底层微信请求方法,增加了fail方法
    request(url, method, data, showload, success, failHandle) {
        if (showload) {
            wx.showLoading({
                title: '加载中...',
            })
        }
        url = `https://xcx.58daiyan.com${url}`
        const contentType = 'application/json'
        wx.request({
            url: url,
            method: method,
            data: data,
            header: {
                'content-type': contentType
            },
            success: success,
            complete: () => {
                if (showload) {
                    wx.hideLoading()
                }
            },
            fail: failHandle || function (err) {
                console.error(`URL：${url}请求失败 -> `,err)
                wx.showModal({
                    title: 'ERROR',
                    content: '服务器请求失败!',
                    confirmColor: '#f00',
                    cancelColor: '#50d1fe',
                    cancelText: '取消',
                    confirmText: '确定',
                    showCancel: false
                })
            }
        });
    }
}
