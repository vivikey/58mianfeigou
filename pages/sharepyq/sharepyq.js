var app = getApp()
Page({
    data: {
        canvasHeight: 320,
        canvasWidth: 180,
        wB: 180 / 40,
        hB: 320 / 40,
        access_token: null,
        shareData: {},
        sysinfo: null,
        imgTitle: '我在58免费购发现一个好商品',
        qrcodeimg: null, //-- 转换后的小程序码临时图片
        shopimg: null, //-- 转换后的产品临时图片
        ar: 1, //-- 产品图片的宽高比
        lines: 40,
        txtObj: { //-- 将要画到画布上的文本对象
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            line: 2,
            color: 'black',
            size: 14,
            align: 'left',
            baseline: 'top',
            text: `58免费购小程序`,
            bold: true,
            enddot: true
        }
    },
    onLoad: function(options) {
        var shareData = wx.getStorageSync('shareData')
        console.log('shareData:', shareData)
        //-- 计算画布的宽高
        var sysinfo = wx.getSystemInfoSync()
        console.log('sysinfo:', sysinfo)
        this.setData({
            shareData: shareData,
            sysinfo: sysinfo,
            canvasHeight: parseInt(sysinfo.windowHeight * 0.76),
            canvasWidth: parseInt(sysinfo.windowWidth * 0.76),
            wB: sysinfo.windowWidth * 0.76 / this.data.lines, //-- 画布上设定的最小单元格的宽度 px
            hB: sysinfo.windowHeight * 0.76 / this.data.lines //-- 画布上设定的最小单元格的高度 px
        }, () => {
            //-- 获得产品对应的小程序码图片
            wx.showLoading({
                title: '图片生成中...',
            })

            app.getBinaryQrCode({
                token: app.userInfo().token,
                pageLoad: shareData.url,
                pageScene: `id=${shareData.id}&rt=${shareData.rec_token}`
            }, res => {
                console.log('getBinaryQrCode:', res.data)
                if (res.data.status == 1) {
                    wx.downloadFile({
                        url: `${app.globalData.baseUrl}${res.data.data}`,
                        success: res => {
                            console.log('downloadfile:', res)
                            if (res.statusCode == 200) {
                                this.setData({
                                    qrcodeimg: res.tempFilePath
                                })
                                //-- 初始化产品图片
                                this.initImageInfo()
                            } else {
                                app.msgbox({
                                    content: res.errMsg,
                                    showCancel: false
                                })
                            }
                        }
                    });
                }
            })
        })
    },
    //-- 网格
    gradLind: function(ctx) {
        let cWidth = this.data.canvasWidth
        let cHeight = this.data.canvasHeight

        let wB = this.data.wB;
        let hB = this.data.hB;

        ctx.beginPath()
        ctx.setStrokeStyle('#ccc')
        for (let i = 1; i < this.data.lines; i++) {
            //-- 画纵轴
            ctx.moveTo(wB * i, 0)
            ctx.lineTo(wB * i, cHeight)
            //-- 画横轴
            ctx.moveTo(0, hB * i)
            ctx.lineTo(cWidth, hB * i)
        }
        ctx.stroke()
    },
    //-- 初始化产品图片信息
    initImageInfo: function() {
        wx.downloadFile({
            url: this.data.shareData.img,
            success: res => {
                if (res.statusCode == 200) {
                    let path = res.tempFilePath
                    //-- 获取图片信息
                    wx.getImageInfo({
                        src: path,
                        success: d => {
                            let ar = d.width / d.height
                            this.setData({
                                ar: ar,
                                shopimg: path
                            }, this.drawBegin) //-- 开始画图
                        }
                    })
                } else {
                    app.msgbox({
                        content: res.errMsg,
                        showCancel: false
                    })
                }
            }
        });
    },
    //-- begin绘制分享图片
    drawBegin: function () {
        let ctx = wx.createCanvasContext('share_canvas');
        //-- 0.初始化画布
        this.initCanvas(ctx)
    },
    //--0. 初始化画布
    initCanvas: function(ctx) {
        // 初始化canvas背景色
        ctx.setFillStyle('white')
        ctx.fillRect(0, 0, this.data.canvasWidth, this.data.canvasHeight);
        ctx.setTextBaseline('top');
        //this.gradLind(ctx, 40)
        //-- 1.绘制主图片:path:路径
        this.drawMainImage(ctx)
    },
    //--1. 绘制主要图片 ar:纵横比
    drawMainImage: function(ctx) {
        let ar = this.data.ar
        let wB = this.data.wB
        let hB = this.data.hB
        ctx.beginPath()
        //-- 图片绘制区域的有效高度固定为画布高度的60%
        let validaH = this.data.canvasHeight * 0.6
        //-- 计算图片绘制区域的有效宽度
        let validaW = validaH * ar;
        let vx = 0,vy = 0
        if (validaW < this.data.canvasWidth) {
            vy = vx = (this.data.canvasWidth - validaW) / 2
        }
        ctx.drawImage(this.data.shopimg, vx, vy, validaW, validaH)
        //-- 2. 填充图片下边的背景色
        this.fillBackGroundInfo(ctx, validaH)
    },
    //--2. 填充主图片下边的背景
    fillBackGroundInfo: function(ctx, vH) {
        const grd = ctx.createLinearGradient(0, vH, 0, this.data.canvasHeight)
        grd.addColorStop(0, 'white')
        grd.addColorStop(1, '#50d1fe')
        ctx.setFillStyle(grd)
        ctx.fillRect(0, vH, this.data.canvasWidth, this.data.canvasHeight);
        //-- 绘制商品信息
        //this.drawInfo(ctx, vH)
        this.drawWeChatQrcode(ctx,vH)
    },
    //-- 3. 绘制小程序码
    drawWeChatQrcode:function(ctx,vH){
        //-- 图片的宽高
        let r = this.data.canvasHeight * 0.4*0.4
        let spaceT = this.data.canvasHeight * 0.4 * 0.1
        let xLeft = this.data.canvasWidth - r
        let vx = xLeft - 10,
            vy = vH + spaceT
        //-- 保存当前场景
        ctx.save()
        ctx.beginPath()
        ctx.arc(vx + r / 2, vy + r / 2, r / 2, 0, Math.PI * 2);
        ctx.clip()
        ctx.setFillStyle('white')
        ctx.fill()
        ctx.drawImage(this.data.qrcodeimg, vx+3, vy+3, r-6, r-6)
        ctx.restore()
        //-- 画小程序码说明文案
        ctx.beginPath()
        ctx.setTextAlign('center')

        ctx.setFontSize(spaceT*0.6)
        ctx.setFillStyle('#fff')
        ctx.fillText('长按/扫描识别', vx + r / 2, vy + r + spaceT )
        ctx.setFontSize(spaceT*0.8)
        ctx.setFillStyle('red')
        ctx.fillText(this.data.shareData.qrMsg, vx + r / 2, vy+r+spaceT*2)


        //-- 4.基本信息
        if (this.data.shareData.type<3){
            this.drawInfo(ctx, vH, xLeft)
        }else{
            this.drawPosterInfo(ctx,vH,xLeft)
        }
    },
    //--4. 绘制基本信息
    drawInfo: function(ctx, vH,maxW) {
        let lessH = this.data.canvasHeight * 0.4
        let spaceT = lessH * 0.1
        let obj = this.data.txtObj
        let wB = this.data.wB
        let hB = this.data.hB
        //-- 绘制标题
        obj.x = wB
        obj.y = vH + spaceT
        obj.text = `${this.data.shareData.title}[${this.data.shareData.content}]`
        obj.height = spaceT
        obj.color = 'black'
        obj.line = 3
        obj.bold = false
        obj.size = spaceT
        obj.width = maxW - 2 * spaceT
        obj.enddot= true
        ctx.beginPath()
        this.textWrap(ctx, obj)

        //-- 绘制价格
        obj.x = this.data.wB
        obj.y = obj.y + spaceT*5
        if (this.data.shareData.type==1)
            obj.text = `${this.data.shareData.tuan_num}人拼 ￥${this.data.shareData.tuan_price} `
        if (this.data.shareData.type == 2)
            obj.text = `￥${this.data.shareData.price} `
        obj.height = spaceT
        obj.color = 'red'
        obj.line = 1
        obj.size = spaceT
        obj.bold = true
        obj.enddot = false
        this.textWrap(ctx, obj)
        
        //-- 绘制商铺信息
        obj.x = wB
        obj.y = this.data.canvasHeight - spaceT
        obj.text = `${this.data.shareData.store_name}`
        obj.height = spaceT
        obj.color = 'gray'
        obj.line = 1
        obj.bold = false
        obj.size = spaceT*0.6
        obj.width = maxW - 2 * spaceT
        ctx.beginPath()        
        this.textWrap(ctx, obj)
        //-- 5.End
        this.endDraw(ctx)
    },
//-- 4.活动海报基本信息
    drawPosterInfo:function(ctx,vH,maxW){
        let lessH = this.data.canvasHeight * 0.4
        let spaceT = lessH * 0.1
        let obj = this.data.txtObj
        let wB = this.data.wB
        let hB = this.data.hB
        //-- 绘制标题
        obj.x = wB
        obj.y = vH + spaceT
        obj.text = `${this.data.shareData.title}`
        obj.height = spaceT*0.8
        obj.color = 'red'
        obj.line = 2
        obj.bold = false
        obj.size = spaceT*0.8
        obj.width = maxW - 2 * spaceT
        ctx.beginPath()
        this.textWrap(ctx, obj)

        //-- 绘制内容
        obj.x = wB
        obj.y = vH + spaceT*3
        obj.text = `${this.data.shareData.content}`
        obj.height = spaceT
        obj.color = '#333'
        obj.line = 4
        obj.bold = false
        obj.size = spaceT*0.7
        obj.width = maxW - 2 * spaceT
        ctx.beginPath()
        this.textWrap(ctx, obj)
        //-- 绘制商铺信息
        obj.x = wB
        obj.y = this.data.canvasHeight - spaceT
        obj.text = `${this.data.shareData.store_name}`
        obj.height = spaceT
        obj.color = 'gray'
        obj.line = 1
        obj.bold = false
        obj.size = spaceT * 0.6
        obj.width = maxW - 2 * spaceT
        ctx.beginPath()
        this.textWrap(ctx, obj)
        this.endDraw(ctx)
    },
    //-- 5.End
    endDraw:function(ctx){
        wx.hideLoading()
        ctx.draw()
    },
    //--绘制文本
    drawText: function(ctx, obj) {
        console.log('渲染文字', obj.text)
        ctx.save();
        ctx.setFillStyle(obj.color);
        ctx.setFontSize(obj.size);
        ctx.setTextAlign(obj.align);
        ctx.setTextBaseline(obj.baseline);
        if (obj.bold) {
            ctx.fillText(obj.text, obj.x, obj.y - 0.5);
            ctx.fillText(obj.text, obj.x - 0.5, obj.y);
        }
        ctx.fillText(obj.text, obj.x, obj.y);
        if (obj.bold) {
            ctx.fillText(obj.text, obj.x, obj.y + 0.5);
            ctx.fillText(obj.text, obj.x + 0.5, obj.y);
        }
        ctx.restore();
    },
    /**
     * 文本换行
     *
     * @param {Object} obj
     */
    textWrap: function(ctx, obj) {
        let tr = this.getTextLine(ctx, obj);
        console.log('tr:',tr)
        for (let i = 0; i < tr.length; i++) {
            if (i < obj.line) {
                let txt = {
                    x: obj.x,
                    y: obj.y + (i * obj.height),
                    color: obj.color,
                    size: obj.size,
                    align: obj.align,
                    baseline: obj.baseline,
                    text: tr[i],
                    bold: obj.bold
                };
                if (i === obj.line - 1) {
                    console.log('i:', i, ctx.measureText(tr[i]).width >= (obj.width - obj.size))
                    if (obj.enddot && ctx.measureText(tr[i]).width >= obj.width - obj.size) {
                        console.log('•••')
                        txt.text = txt.text.substring(0, txt.text.length - 2) + '•••';
                    } 
                }
                this.drawText(ctx, txt);
            }
        }
    },
    getTextLine: function(ctx, obj) {
        ctx.setFontSize(obj.size);
        let arrText = obj.text.split('');
        let line = '';
        let arrTr = [];
        for (let n = 0; n < arrText.length; n++) {
            let str = `${line}${arrText[n]}`
            if (ctx.measureText(str).width <= obj.width) {
                line = str
                if(n<arrText.length-1)
                    continue;
            }
            if (arrTr.length< obj.line) {
                arrTr.push(line)
                line = arrText[n]
            } else {
                break;
            }

        }
        return arrTr;
    },
    saveShareImage: function() {
        wx.showLoading({
            title: '正在保存图片..',
        });
        let that = this;
        wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: that.data.canvasWidth,
            height: that.data.canvasHeight,
            canvasId: 'share_canvas',
            success: function(res) {
                wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success(res) {
                        console.log(res);
                        wx.showToast({
                            title: '保存到相册成功',
                            duration: 1500,
                            icon: 'success',
                            success:r=>{
                                wx.navigateBack({
                                    delta:1
                                })
                            }
                        })
                    },
                    fail(res) {
                        console.log(res)
                        wx.showToast({
                            title: '保存到相册失败',
                            icon: 'fail'
                        })
                    },
                    complete(res) {
                        console.log(res)
                    }
                })
            }
        })
    }
})