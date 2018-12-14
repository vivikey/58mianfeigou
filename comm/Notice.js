import $ from 'request.js'
import regeneratorRuntime from 'regenerator-runtime.js'
/**
 * 海报
 */
let obj = {
    Get() { return '/api/showapi/showNoticeInfo' },
    Post() { return '/api/addapi/noticeHandle' },
    Delete() { return '/api/Deleteapi/delNotice' },
    List() { return '/api/showapi/showNoticeList'},
    async Do(data){
        return await new Promise((resolve, reject) => {
            $.Post(this.url, data, r => {
                resolve(r.data)
            }, null, true)
        })
    }
}

const Notice = new Proxy(obj,{
    get(target,property){
        target.url = target[property]()
        return target.Do.bind(target)
    }
})

export default Notice