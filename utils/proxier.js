
//-- 代理人对象
var Proxier = function (id,token) {
    this.agent_id=id
    this.name = ''
    this.phone = ''
    this.sex = 0
    this.identity  = ''
    this.idnumber_image = []
    this.grade_id=0
    this.token=token
    this.area_code='A'
    this.rec_cardNo=''
    this.introduce = ''
    }
Proxier.prototype.post_url ='https://m.58daiyan.com/AgentApi/add_agent'
Proxier.prototype.Post = function(post,callback){
    post(this.post_url, this, callback)
}
module.exports = Proxier