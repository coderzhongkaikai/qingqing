// pages/activityInfo/index.js

var Ttime = require('../util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:'',
    fileList: [
      {
        url: 'https://img.yzcdn.cn/vant/leaf.jpg',
      },
      // Uploader 根据文件后缀来判断是否为图片文件
      // 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明
      {
        url: 'http://iph.href.lu/60x60?text=default',
      },
    ],
    beizhu:'',
    title:''
  },
  showImg(e){
    console.log(e)
    const imgList= this.data.fileList.map(item=>item.url)
    console.log(e.currentTarget.dataset.index+'')
    wx.previewImage({
      urls: imgList,
      current:e.currentTarget.dataset.url,
      success:function(res){},
      fail:function(res){},
      complete:function(res){}
    })
  },
  delete_photo(e) {
    console.log(e)
    wx.showLoading({
      title: '...',
    })
    const index=e.currentTarget.dataset.index
    const url=this.data.fileList[index].url
    this.data.fileList.splice([index], 1)
    wx.cloud.deleteFile({
      fileList: [url]
    }).then(res => {
      // handle success
      console.log("删除成功")
      this.setData({
        fileList: this.data.fileList
      });
      wx.hideLoading()
    }).catch(error => {
      // handle error
      console.log(error)
      wx.hideLoading()
    })
 

  },
  uploader_photo(e){
    console.log(e)
    const item_photo= {
      url:e.detail.file.url
    }
    wx.showLoading({
      title: '...',
    })
    // 将图片上传至云存储空间
    wx.cloud.uploadFile({
      // 指定上传到的云路径
      cloudPath: `${new Date().getTime()}.png`,
      // 指定要上传的文件的小程序临时文件路径
      filePath: e.detail.file.url,
      // config: {
      //   env: this.data.envId
      // }
    }).then(res => {
      console.log('上传成功', res);
      // this.setData({
      //   haveGetImgSrc: true,
      //   imgSrc: res.fileID
      // });
    this.data.fileList.push({
      url: res.fileID
    })
    this.setData({
      fileList: this.data.fileList
    });
      wx.hideLoading();
    }).catch((e) => {
      console.log(e);
      wx.hideLoading();
    });
    // this.data.fileList.push(item_photo)
   
  },
  publish(){  
    const {fileList,beizhu,title}=this.data
    console.log(fileList)
    console.log(beizhu)
    console.log(title)
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      // config: {
      //   env: this.data.selectedEnv.envId
      // },
      data: {
        type: 'ActivityInfo',
        data:{
          type:'create',
          fileList,beizhu,title,createTime:new Date(),
          watch:0
        }
      }
    }).then((resp) => {
      console.log(resp)
      if (resp.result.success) {
        // this.setData({
        //   haveCreateCollection: true
        // });
      }
      // this.setData({
      //   powerList
      // });
      wx.hideLoading();
    }).catch((e) => {
      console.log(e);
      // this.setData({
      //   showUploadTip: true
      // });
      wx.hideLoading();
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    this.setData({
      type:'edit'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})