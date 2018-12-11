Page({
    data: {
        tp: 1,
        itemList:[]
    },
    onLoad: function(options) {
        var tp = options.tp
        this.setData({
            tp:tp
        })
    },
    onShow:function(){
        let itemList=[]
        itemList.push({
            title:`通过“免费赠品”来引流`,
            content:`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;“人人都有贪便宜的心理”，使用有吸引力的免费赠品自然可以吸引客流。
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;为了保证精准性，可以设置使用条件，比如消费满100元才可以领用、周末特别赠品等。
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在本小程序中，抵用券、优惠券都可以当做赠品来发放。赠品领用后都放置在“个人中心”-“赠品券”中，赠品消费时点击相应的赠品券自动生成二维码以便于商家确认。
            `
        })
        itemList.push({
            title: `通过“同城团购”来裂变`,
            content: `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;典型的“拼多多”模式，可以设置两人或者多人拼团。但目前没有开通快递功能，需要到线下消费或者线下领取。
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;利用有吸引力的价格，让客户带来更多的客户一起买单，不就是实现了客户的“裂变”么！当然，有一定的客户基数是基础哦。
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;无论是“免费赠品”还是“同城团购”，想直接赚钱是不太可能的，因为他们解决的核心问题是帮商家引流。是需要付出一定利润或者成本作为代价的。`
        })
        itemList.push({
            title: `通过“推荐有奖”来分销`,
            content: `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;让有资源的客户帮你推荐新客户，同时给予他们一定的报酬，这就是“推荐有奖”。
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;给予推荐者的报酬可以是一定比例的分红，也可以是赠品（有的人心理上不接受通过推荐来赚钱的）。还可以是分红和赠品的组合。可以设置的方案很多哦。
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;不要说我没有提醒你，拿出来推荐的产品或者服务必须要打造好价值，并且具有很好的性价比，否则，愿意为它来买单的人也许不多的哦。`
        })
        itemList.push({
            title: `通过“活动海报”来宣传`,
            content: `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;过年过节有什么促销活动，离不开宣传，“58免费购”提供了线上发布活动海报的地方。
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;有图有文字，还可以点赞可以评论的哦。
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;另外，还可以帮你直接转发到微信好友群，怎么样，赞一个吧！
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如果以后还可以直接线上报名，可以直接做活动收费，是不是更好啊？敬请期待吧！`
        })
        itemList.push({
            title: `通过“消息反馈”来沟通`,
            content: `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这就不用多说了，现在双向沟通已经成为标配啦。

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;对了，
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;你或许会问，如果我想把我的所有产品都搬到“58免费购”上面来，怎么办呢？
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;建议在“推荐有奖”栏目中设置一个方案（是的，可以设置多个方案），其中推荐的奖励为0，赠品为无，这不就是一个常规的产品列表么！
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;不要谢我，我是“58免费购”！`
        })
        this.setData({
            itemList:itemList
        })
    },
    preImg:function(){
        wx.previewImage({
            urls: [`https://m.58daiyan.com/static/game/explain-${this.data.tp}.jpg?${Math.random() / 9999}`],
            current: `https://m.58daiyan.com/static/game/explain-${this.data.tp}.jpg?${Math.random() / 9999}`
        })
    }
})