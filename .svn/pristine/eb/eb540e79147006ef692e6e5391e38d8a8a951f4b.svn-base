import $ from 'request.js'
import regeneratorRuntime from 'regenerator-runtime.js'

let obj = {
    Get() { return '/api/showapi/showUserAddrInfo' },
    Post() { return '/api/addapi/addUserAddress' },
    Delete() { return '/api/Deleteapi/delUserAddr' },
    List() { return '/api/showapi/showUserAddrList'},
    async Do(data){
        return await new Promise((resolve, reject) => {
            $.Post(this.url, data, r => {
                resolve(r.data)
            }, null, true)
        })
    }
}

const Address = new Proxy(obj,{
    get(target,property){
        target.url = target[property]()
        return target.Do.bind(target)
    }
})

export default Address