import $ from 'request.js'
import regeneratorRuntime from 'regenerator-runtime.js'
/**
 * 海报
 */
let obj = {
    Get() { return '/api/showapi/showPosterInfo' },
    Post() { return '/api/addapi/posterHandle' },
    Delete() { return '/api/Deleteapi/delPoster' },
    List() { return '/api/showapi/showPosterList'},
    async Do(data){
        return await new Promise((resolve, reject) => {
            $.Post(this.url, data, r => {
                resolve(r.data)
            }, null, true)
        })
    }
}

const Poster = new Proxy(obj,{
    get(target,property){
        target.url = target[property]()
        return target.Do.bind(target)
    }
})

export default Poster