// pages/teacherInfo/index.js
Page({
  options: {
    styleIsolation: 'shared'
  },
  /**
   * 页面的初始数据
   */
  data: {
    fileList: [
      {
        url: 'https://img.yzcdn.cn/vant/leaf.jpg',
        name: '图片1',
      },
      // Uploader 根据文件后缀来判断是否为图片文件
      // 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明
      {
        url: 'http://iph.href.lu/60x60?text=default',
        name: '图片2',
        isImage: true,
        deletable: true,
      },
    ],
    tagList:[],
    active: 1,
    columns: ['网红舞', '芭蕾舞', '拉丁舞', '街舞', '爵士舞'],
  },
  delete_photo(e) {
    console.log(e)

    const index=e.detail.index
    this.data.fileList.splice(index, 1)
    this.setData({
      fileList: this.data.fileList
    })
    // wx.showLoading({
    //   title: '...',
    // })
    // const index=e.currentTarget.dataset.index
    // const url=this.data.fileList[index].url
    // this.data.fileList.splice([index], 1)
    // wx.cloud.deleteFile({
    //   fileList: [url]
    // }).then(res => {
    //   // handle success
    //   console.log("删除成功")
    //   this.setData({
    //     fileList: this.data.fileList
    //   });
    //   wx.hideLoading()
    // }).catch(error => {
    //   // handle error
    //   console.log(error)
    //   wx.hideLoading()
    // })
 

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
  tag_add(){
    this.setData({
      sheet_show:true
    })
  },
  action_sheet_hidden(){
    // console.log(e)
    this.setData({
      sheet_show:false
    })
  },
  picker_confirm(e){
    console.log(e)
    this.data.tagList.push(e.detail.value)
    this.setData({
      tagList:this.data.tagList
    })
    this.action_sheet_hidden()
  },
  onTagClose(e){
    const index=e.currentTarget.dataset.index
    this.data.tagList.splice([index], 1)
    this.setData({
      tagList: this.data.tagList
    })
    console.log(e)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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