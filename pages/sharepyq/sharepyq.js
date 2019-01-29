var app = getApp()
import Comm from '../../comm/Comm.js'
Page({
  data: {
    canvasHeight: 480,
    canvasWidth: 200,
    wB: 200 / 40,
    hB: 480 / 40,
    tempFile: '',
    access_token: null,
    shareData: {},
    sysinfo: null,
    imgTitle: '我在58热网发现一个好商品',
    qrcodeimg: null, //-- 转换后的小程序码临时图片
    qrradius: 144,
    shopimg: null, //-- 转换后的产品临时图片
    ar: 1, //-- 产品图片的宽高比
    lines: 100,
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
      text: `58热网小程序`,
      bold: true,
      enddot: true
    }
  },
  onLoad(options) {
    var shareData = wx.getStorageSync('shareData')
    console.log('shareData:', shareData)
    //-- 计算画布的宽高
    var sysinfo = wx.getSystemInfoSync()
    console.log('sysinfo:', sysinfo)
    this.setData({
      shareData: shareData,
      sysinfo: sysinfo,
      canvasHeight: parseInt(sysinfo.screenHeight),
      canvasWidth: parseInt(sysinfo.screenWidth),
      wB: sysinfo.screenWidth / this.data.lines,
      hB: sysinfo.screenHeight / this.data.lines
    }, () => {
      //-- 获得产品对应的小程序码图片
      wx.showLoading({
        title: '图片生成中...',
      })
      Comm.WeChatQrCode({
          page: shareData.pageLoad,
          scene: shareData.pageScene
        })
        .then(r => {
          console.log('Comm.WeChatQrCode => ', r)
          if (r.code == 200) {
            wx.downloadFile({
              url: `${app.globalData.xcxUrl}/${r.data}`,
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
              },
              fail: res => {
                app.ERROR(`下载小程序码失败`, () => {
                  wx.navigateBack({
                    delta: 1
                  })
                })
              }
            });
          } else {
            r.message = r.message || '出错了'
            app.ERROR(`微信获取小程序码：${r.message}`, () => {
              wx.navigateBack({
                delta: 1
              })
            })
          }
        })
    })
  },
  onReady() {
    wx.setNavigationBarTitle({
      title: `生成海报${this.data.canvasWidth}x${this.data.canvasHeight}`,
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
  initImageInfo() {
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
  drawBegin: function() {
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
  //--1. 绘制主要图片
  drawMainImage: function(ctx) {
    let ar = this.data.ar
    let wB = this.data.wB
    let hB = this.data.hB
    ctx.beginPath()
    //-- 图片绘制区域的有效高度固定为与画布宽度一致
    let validaH = this.data.canvasWidth;
    let validaW = this.data.canvasWidth;
    console.log(`海报图片大小(w*h)：${validaW}*${validaH}`)
    //-- 图片的左上角
    let vx = 0,
      vy = 0
    ctx.drawImage(this.data.shopimg, vx, vy, validaW, validaH)
    //-- 2. 填充图片下边的背景色
    this.fillBackGroundInfo(ctx, validaH)
  },
  //--2. 填充主图片下边的背景
  fillBackGroundInfo(ctx, vH) {
    const grd = ctx.createLinearGradient(0, vH - 20, this.data.canvasWidth, this.data.canvasHeight)
    grd.addColorStop(0, 'lightpink')
    grd.addColorStop(0.5, 'white')
    grd.addColorStop(1, '#ffc')
    ctx.setFillStyle(grd)
    ctx.fillRect(0, vH, this.data.canvasWidth, this.data.canvasHeight);
    //-- 绘制商品信息
    //this.drawInfo(ctx, vH)
    this.drawWeChatQrcode(ctx, vH)
  },
  //-- 3. 绘制小程序码
  drawWeChatQrcode: function(ctx, vH) {
    let lessH = this.data.canvasHeight - vH
    let spaceT = lessH * 0.1
    //-- 小程序码的直径
    let r = this.data.qrradius

    let xLeft = this.data.canvasWidth - r
    let yLeft = this.data.canvasHeight - r
    let vx = xLeft - 10,
      vy = yLeft - 10,
      arcx = vx + r / 2,
      arcy = vy + r / 2
    //-- 保存当前场景
    ctx.save()
    ctx.beginPath()
    ctx.arc(arcx, arcy, r / 2 + 5.5, 0, Math.PI * 2);
    ctx.clip()
    ctx.setFillStyle('white')
    ctx.fill()
    ctx.drawImage(this.data.qrcodeimg, vx + 0.5, vy + 0.5, r, r)
    ctx.restore()
    //-- 画小程序码说明文案
    ctx.beginPath()
    ctx.setTextAlign('center')
    let ix = (this.data.canvasWidth - r) / 2
    let iy1 = arcy - 20
    let iy2 = arcy + 4
		let iy3 = arcy + 38
    ctx.setFontSize(18)
		ctx.setFillStyle('#e97f23')
		ctx.fillText('你的好产品＋我的好团队', ix, iy1)
		ctx.setFillStyle('#e97f23')
		ctx.fillText('－－新一代社交电商', ix, iy2)
		ctx.beginPath()
    ctx.setFontSize(14)
    ctx.setFillStyle('gray')
    ctx.fillText('长按/扫描识别小程序码', ix, iy3)



    //-- 4.基本信息
    this.drawInfo(ctx, vH, xLeft - 10)

  },
  //--4. 绘制基本信息
  drawInfo(ctx, vH, maxW) {
    let lessH = this.data.canvasHeight - vH;
    let spaceT = lessH * 0.1
    let obj = this.data.txtObj
    let wB = this.data.wB
    let hB = this.data.hB
    if (spaceT < 30) {
      spaceT = 30
    }
    //-- 绘制标题
    obj.x = 9.5
    obj.y = vH + 0.5
    obj.text = this.data.shareData.title
    obj.height = spaceT
    obj.color = '#000'
    obj.line = 2
    obj.bold = false
    obj.size = 24.5
    obj.width = this.data.canvasWidth - 20
    obj.enddot = true
    ctx.beginPath()
    this.textWrap(ctx, obj)
    //-- 绘制副标题
    obj.x = 9.5
    obj.y = vH + spaceT * 2 + 0.5
    obj.text = this.data.shareData.small_title
    obj.height = spaceT
    obj.color = '#515151'
    obj.line = 1
    obj.size = 20.5
    obj.bold = false
    obj.enddot = false
    this.textWrap(ctx, obj)
    //-- 绘制价格
    obj.x = 9.5
    obj.y = vH + spaceT * 3 + 0.5
    obj.text = this.data.shareData.content
    obj.height = spaceT
    obj.color = 'red'
    obj.line = 1
    obj.size = 24.5
    obj.bold = false
    obj.enddot = false
    this.textWrap(ctx, obj)

    //-- 绘制商铺信息
    // obj.x = wB
    // obj.y = this.data.canvasHeight - spaceT * 1.2
    // obj.text = `(商铺)${this.data.shareData.store_name}`
    // obj.height = spaceT
    // obj.color = '#1296db'
    // obj.line = 1
    // obj.bold = false
    // obj.size = spaceT * 0.9
    // obj.width = maxW - 2 * spaceT
    // ctx.beginPath()
    // this.textWrap(ctx, obj)
    //-- 5.End
    this.endDraw(ctx)
  },
  //-- 5.End
  endDraw(ctx) {
    wx.hideLoading()
    ctx.draw(true, () => {
      wx.canvasToTempFilePath({
        canvasId: 'share_canvas',
        success: res => {
          this.setData({
            tempFile: res.tempFilePath
          })
        }
      })
    })
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
    console.log('tr:', tr)
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
        if (n < arrText.length - 1)
          continue;
      }
      if (arrTr.length < obj.line) {
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
      success: res => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            console.log(res);
            wx.showToast({
              title: '保存到相册成功',
              duration: 1500,
              icon: 'success',
              success: r => {
                wx.navigateBack({
                  delta: 1
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