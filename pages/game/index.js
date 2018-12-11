var app = getApp()
Page({
    data: {
        steps: [],
        player_x: 0,
        player_y: 0,
        playingPath: [
            'https://m.58daiyan.com/static/game/dice.gif',
            'https://m.58daiyan.com/static/game/dice6.png',
            'https://m.58daiyan.com/static/game/dice1.png',
            'https://m.58daiyan.com/static/game/dice2.png',
            'https://m.58daiyan.com/static/game/dice3.png',
            'https://m.58daiyan.com/static/game/dice4.png',
            'https://m.58daiyan.com/static/game/dice5.png'
        ],
        openWnd: {
            content: '',
            title: '提示',
            show: false,
            cancleText: '以后再说',
            shareText: '立即分享',
            type: 'share',
            round_num: 0,
            reason: 1,
            msgtitle: ''
        },
        playPath: '',
        user: {},
        userInfo: {},
        gameData: {},
        jifeng: '',
        integral: 0,
        gameintegral: 0,
        gamejifeng: '',
        playidx: 11,
        isplaying: false,
        gameMsg: ['点击右边按钮开始游戏赚积分!'],
        currmsg: '',
        topList: [],
        topType: 2,
        topShow: false,
        deg: 0,
        timer: 0,
        dif: 10,
        mytop: 0 //-- 我的排名
    },
    onLoad: function(options) {
        app.globalData.rec_token = options.rec_token
        if (!app.globalData.user) {
            app.globalData.showPage = '/pages/game/index?rec_token=' + app.userInfo().token
            app.Launch('/pages/index/index')
        }
        console.log('游戏数据加载启动。。。。')
        this.setData({
            userInfo: app.globalData.userInfo,
            user: app.globalData.user
        })
        wx.showShareMenu({
            withShareTicket: true
        })
        this.calculateDifference()
    },
    //-- 切换榜单类型
    changeTopType: function(e) {
        console.log('changeTopType:', e)
        this.setData({
            topType: e.target.dataset.type
        })
        app.post('https://m.58daiyan.com/MinimallApi/getRanklist', {
            type: this.data.topType
        }, res => {
            console.log('积分排行：', res.data)
            var topList
            if (res.data.data.log) {
                topList = res.data.data.log
            } else {
                topList = []
            }
            this.setData({
                topList: topList
            })
            this.getMyTop()
        })
    },
    //-- 获取排行榜
    getTopList: function() {
        var topShow = this.data.topShow
        if (!topShow) {
            app.post('https://m.58daiyan.com/MinimallApi/getRanklist', {
                type: this.data.topType
            }, res => {
                console.log('积分排行：', res.data)
                var topList
                if (res.data.data.log) {
                    topList = res.data.data.log.map(u => {
                        if (u.user_pic.indexOf('http') >= 0) {
                            u.user_pic = u.user_pic
                        } else {
                            u.user_pic = app.globalData.baseUrl + u.user_pic
                        }
                        return u;
                    })
                } else {
                    topList = []
                }
                this.setData({
                    topList: topList,
                    topShow: !topShow
                })
                this.getMyTop()
            })
        } else {
            this.setData({
                topShow: !topShow
            })
        }
    },
    //-- 获取我的排名
    getMyTop: function() {
        var topList = this.data.topList
        if (topList && topList.length > 0) {
            for (let i = 0; i < topList.length; i++) {
                if (topList[i].uid == this.data.user.id) {
                    this.setData({
                        mytop: i + 1
                    })
                    return;
                }
            }
        }
    },
    //-- 关闭排行
    closeTopWnd: function() {
        this.setData({
            topShow: !this.data.topShow
        })
    },
    //-- 弹窗点击
    openWndClick: function(e) {
        var openWnd = this.data.openWnd
        if (openWnd.type == 'share') {} else {
            this.closeOpenWnd()
        }
    },
    //-- 关闭弹窗
    closeOpenWnd: function() {
        var timer = this.data.timer
        clearInterval(timer)
        var openWnd = this.data.openWnd
        openWnd.show = false;
        this.setData({
            openWnd: openWnd,
            deg: 0,
            timer: 0,
            isplaying:false
        })
    },
    //-- 打开弹窗
    showOpenWnd: function(obj, fn) {
        this.setData({
            isplaying:true,
            timer: setInterval(() => {
                var deg = this.data.deg + 1
                if (deg >= 360) deg = 0
                this.setData({
                    deg: deg
                })
            }, 100)
        })
        var openWnd = this.data.openWnd
        openWnd.show = true;
        openWnd.title = obj.title || "提示"
        openWnd.content = obj.content || ""
        openWnd.type = obj.type || 'showmsg'
        openWnd.cancleText = obj.cancleText || "以后再说"
        openWnd.shareText = obj.shareText || "立即分享"
        openWnd.round_num = obj.round_num || 0
        openWnd.reason = obj.reason || 1
        openWnd.msgtitle = obj.msgtitle || ""
        this.setData({
            openWnd: openWnd
        })
        if (fn && typeof fn === 'function')
            fn()
    },
    //-- 计算骰子盒子最上边到主容器最上边的差值
    calculateDifference: function() {
        var query = wx.createSelectorQuery()
        query.select('#gameCenter').boundingClientRect()
        query.select('#itemBox').boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec((res) => {
            console.log('calculateDifference:', res)
            this.setData({
                dif: (res[0].top - res[1].top - 58) * 1.5 - 217
            })
            this.initSteps();
        })


    },
    //-- 初始化游戏元素
    initSteps: function() {
        var dif = this.data.dif
        app.post('https://m.58daiyan.com/MinimallApi/getGamestep', {
            token: app.globalData.userInfo.token
        }, res => {
            console.log('初始化游戏:', res.data.data)
            var rob=res.data.data
            if(rob.last_rount_num<=0 && rob.last_play_num<=0){
                app.msgbox({
                    title: '好消息',
                    content: '从1.6.8版本开始，玩游戏不再扣减用户积分，一局结束分享到相同的群也能获得游戏积分。',
                    showCancel: false
                })
            }
            if (rob.game_step_list) {
                var last_step = rob.last_step
                this.setData({
                    steps: rob.game_step_list.map(u => {
                        u.background_y = parseInt(u.background_y) + dif;
                        u.player_y = parseInt(u.player_y) + dif;
                        return u;
                    }),
                    playPath: this.data.playingPath[1],
                    playidx: last_step-1
                })
                
                this.refreshGameIntegral(rob.last_total_integral)
                if (rob.last_step_details.player_x && !rob.last_is_over) {
                    this.resetPlayer(rob.last_step_details.player_x, parseInt(rob.last_step_details.player_y) + dif)
                } else {
                    this.setData({
                        playidx:11
                    })
                    this.resetPlayer(this.data.steps[11].player_x, this.data.steps[11].player_y)
                }
                this.refreshIntegral(() => {})
            }else{
                app.msgbox({
                    content:'游戏轨迹初始化出错！',
                    showCancel:false
                })
            }
            
        });
    },
    //-- 刷新游戏积分
    refreshGameIntegral: function(addgameintegral) {
        var gameintegral = (addgameintegral || 0) + ''
        this.setData({
            gameintegral: gameintegral,
            gamejifeng: this.converIntegral(gameintegral, gameintegral.length < 4 ? 4 : gameintegral.length)
        })
    },
    //-- 刷新总积分
    refreshIntegral: function(fn) {
        app.getIntegral(res => {
            console.log('获取积分:', res)
            var integral = res.data.data.integral
            app.globalData.userInfo.integral = integral
            this.setData({
                userInfo: app.globalData.userInfo,
                integral: integral,
                jifeng: this.converIntegral(integral, integral.length < 4 ? 4 : integral.length)
            })
            if (typeof fn === 'function')
                fn()
        })
    },
    converIntegral: function(integral, len) {
        var temp = integral.toString()
        var length = temp.length;
        var subl = len - length;
        var zero = '';
        for (var i = 0; i < subl; i++) {
            zero += '0';
        }
        return zero + temp;
    },
    checkPlay: function(fn) {

    },
    //-- 请求当前步骤数据
    getStepData: function(callback) {
        app.post('https://m.58daiyan.com/MinimallApi/play', {
            token: app.globalData.userInfo.token
        }, callback)
    },
    //-- 延时加载
    delayLoad: function(times, callback) {
        setTimeout(callback, times)
    },
    //-- 设置骰子状态：0-开始动画 1-1点 2-2点 3-3点......
    setPlayStat: function(stat) {
        this.setData({
            playPath: this.data.playingPath[stat]
        });
    },
    //-- 开始玩游戏
    playGame: function() {
        //-- 如果游戏已结束了，则开始
        if (!this.data.isplaying) {
            this.playing()
        }
    },
    //-- 增加日志
    addMsg: function() {
        var msg = this.data.currmsg
        var gameMsg = this.data.gameMsg
        gameMsg.push(msg)
        this.setData({
            gameMsg: gameMsg
        })
    },
    //--游戏进行中
    playing: function() {
        this.disabledPlayClick()
        console.log('playing begin...playidx:',this.data.playidx)
        var playPath = this.data.playPath;
        var playingPath = this.data.playingPath;
        //-- 开始骰子动画
        this.setPlayStat(0)
        //-- 记骰子转1.2秒后继续
        this.delayLoad(1200, () => {
            //-- 从后台获取此次游戏结果数据
            this.getStepData(res => {
                console.log('Playing StepData:', res.data)
                //-- if status is zero，show the message,and return
                if (res.data.status == 0) {
                    this.setPlayStat(1)
                    this.showOpenWnd({
                        title: '提示',
                        content: '',
                        msgtitle: res.data.message
                    }, () => {
                        this.delayLoad(2000, this.closeOpenWnd)
                    })
                }
                //--if status is not zero ,go on...
                var gameData = res.data.data;
                var title = '第' + gameData.round_num + '局 第' + gameData.play_num + '次 ';
                var tips = gameData.step_details.tips;
                var msg = title + res.data.data.step_details.tips_title;
                //-- 保存此次游戏结果数据
                this.setData({
                    gameData: gameData,
                    currmsg: msg
                });
                //-- 1.Normal State
                if (res.data.status === 1) {
                    var step = res.data.data.dice_num;
                    console.log('playing get step:', res.data.data.step_details.step, res.data.data.step_details.tips)
                    //-- 停止骰子动画，显示当前掷到的骰子值
                    this.setPlayStat(step)
                    //-- 开始移动玩家
                    this.playerMove(step);
                }
                //-- Specail State 
                else if (res.data.status === 3) {
                    //-- 停止骰子动画，显示当前骰子值为默认值
                    this.setPlayStat(1)
                    this.addMsg()
                    //-- 初始化弹窗
                    var options = {
                        title: title,
                        type: 'share',
                        round_num: res.data.data.round_num,
                        reason: 3,
                        msgtitle: '本局您共获得' + res.data.data.total_integral + '积分',
                        content: res.data.message
                    }
                    this.refreshGameIntegral(res.data.data.total_integral)
                    this.showOpenWnd(options, this.useShareTicket)
                } else {
                    console.debug(res.data.message)
                }
            })
        })

    },
    //-- 玩家走动：step需要走动的格数
    playerMove: function(step) {
        if (step > 0) {
            console.log('player go...')
            var playidx = this.data.playidx;
            console.log('playidx:', playidx)
            if (playidx === 11) {
                playidx = 0
            } else {
                playidx++
            }
            this.setData({
                player_x: this.data.steps[playidx].player_x,
                player_y: this.data.steps[playidx].player_y,
                playidx: playidx
            })
            console.log('player go finished...')
            step--;
            setTimeout(() => {
                this.playerMove(step)
            }, 500)
        } else {
            //移动结束
            console.log('移动结束：', this.data.gameData)
            this.addMsg()
            this.refreshGameIntegral(this.data.gameData.total_integral)
            this.refreshIntegral()

            var title = '第' + this.data.gameData.round_num + '局 第' + this.data.gameData.play_num + '次 ';
            if (this.data.gameData.is_over === 1) { //-- 一局结束了
                this.setData({
                    playidx: 11
                })
                this.resetPlayer(this.data.steps[11].player_x, this.data.steps[11].player_y)
                this.showOpenWnd({
                    title: title,
                    content: '本局您共获得' + this.data.gameData.total_integral + '积分',
                    type: 'share',
                    reason: 3,
                    msgtitle: this.data.gameData.step_details.tips_title + ' 本局结束',
                    round_num: this.data.gameData.round_num
                }, this.useShareTicket)
            } else if (this.data.gameData.step_details.step === '12') { //-- 随机积分
                this.showOpenWnd({
                    title: title,
                    content: this.data.gameData.step_details.tips,
                    msgtitle: '您获得随机：【' + this.data.gameData.integral + '积分】',
                    round_num: this.data.gameData.round_num
                }, this.delayLoad(2000, this.closeOpenWnd))
            } else { //-- Normal
                this.showOpenWnd({
                    title: title,
                    content: this.data.gameData.step_details.tips,
                    msgtitle: this.data.gameData.step_details.tips_title,
                }, this.delayLoad(2000, this.closeOpenWnd))
            }
        }
    },
    //-- 使用分享密钥
    useShareTicket: function() {
        wx.showShareMenu({
            withShareTicket: true
        })
    },
    //-- 重置玩家大本营
    resetPlayer: function(playerX, playerY) {
        this.setData({
            player_x: playerX,
            player_y: playerY,
            playPath: this.data.playingPath[1]
        })
    },
    //-- 允许玩家点击开始
    enablePlayClick: function() {
        this.setData({
            isplaying: false
        })
    },
    //-- 禁止玩家点击开始
    disabledPlayClick: function() {
        this.setData({
            isplaying: true
        })
    },
    //-- 回到商城首页
    toShop: function() {
        wx.switchTab({
            url: '/pages/shop/index',
        })
    },
    onShow: function() {

    },
    onShareAppMessage: function(res) {
        var resObj;
        if (res.from === 'button') {
            console.log(res.target)
            var stitle = app.globalData.shareTB
            if (this.data.openWnd.reason == 2) {
                stitle = '这里有免费的好东西哦'
            }
            if (this.data.openWnd.reason == 3) {
                stitle = '我一局赚了' + this.data.gameData.total_integral + '积分，你来试试？';
            }
            console.log('share Title:', stitle)
            resObj = {
                title: stitle,
                path: '/pages/game/index?rec_token=' + app.userInfo().token,
                imageUrl: app.globalData.shareImg[0],
                success: res => {
                    if (res.shareTickets) { //-- 分享到群
                        app.endSendShare(res.shareTickets[0], res => {
                            console.log(res)
                            var data = {
                                encryptedData: res.encryptedData,
                                iv: res.iv,
                                token: app.globalData.userInfo.token,
                                shareType: 1,
                                share_reason: this.data.openWnd.reason,
                                share_round: this.data.openWnd.round_num,
                                play_num: this.data.gameData.play_num,
                                sharefor_day: this.data.gameData.sharefor_day
                            }
                            this.closeOpenWnd();
                            app.sendShareResult(data, res => {
                                console.log('sendShareResult:', data, res.data)
                                //-- 初始化弹窗
                                var openWnd = this.data.openWnd
                                openWnd.type = 'showmsg'
                                openWnd.title = '提示';
                                openWnd.msgtitle = res.data.message
                                openWnd.content = ''
                                this.showOpenWnd(openWnd, this.delayLoad(2000, this.closeOpenWnd))
                                this.refreshIntegral()
                                if (openWnd.reason == 3 && res.data.status == 1)
                                    this.refreshGameIntegral()
                            })
                        })
                    } else { //-- 分享到个人

                    }
                }
            }
        } else {
            resObj = {
                title: app.globalData.shareTB,
                path: '/pages/game/index?rec_token=' + app.userInfo().token,
                imageUrl: app.globalData.shareImg[0],
                success: res => {}
            }
        }
        return resObj
    }
})