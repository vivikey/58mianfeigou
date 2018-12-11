//-- 活动海报对象
var Poster = function (token, id, store_id) {
    this.poster_id = id || 0;
    this.store_id = store_id || 0;
    this.title = '';
    this.posters = [];
    this.content = '';
    this.token = token;
}

Poster.prototype.post_url = 'https://m.58daiyan.com/StoreApi/add_poster'
Poster.prototype.get_url = 'https://m.58daiyan.com/StoreApi/getPosterDetails'
Poster.prototype.delete_url = 'https://m.58daiyan.com/StoreApi/del_ poster'


Poster.prototype.Add = function (post, callback) {
    post(this.post_url, this, callback)
}
Poster.prototype.Update = function (post, callback) {
    post(this.post_url, this, callback)
}
Poster.prototype.Get = function (post, callback) {
    post(this.get_url, {
        poster_id: this.poster_id,
        token: this.token
    }, callback)
}
Poster.prototype.Delete = function (post, callback) {
    post(this.delete_url, {
        poster_id: this.poster_id,
        token: this.token
    }, callback)
}

module.exports = Poster