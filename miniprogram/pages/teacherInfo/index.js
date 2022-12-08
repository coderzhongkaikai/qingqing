// pages/teacherInfo/index.js
Page({
  options: {
    styleIsolation: 'shared'
  },
  /**
   * 页面的初始数据
   */
  data: {
    fileList: [],
    avarList:[],//头像
    tagList: [],
    active: 0,
    columns: ['网红舞', '芭蕾舞', '拉丁舞','民族舞', '街舞', '爵士舞'],
  },
  delete_photo(e) {
    console.log(e)
    wx.showLoading({
      title: '...',
    })
    const index=e.detail.index
    const url=e.detail.file.url
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
  uploader_photo(e) {
    console.log(e)
    const item_photo = {
      type:e.detail.type,
      name: e.detail.file.name,
      url: e.detail.file.url
    }
    wx.showLoading({
      title: '...',
    })
    wx.cloud.uploadFile({
      // 指定上传到的云路径
      cloudPath: e.detail.file.type == 'image' ? `${new Date().getTime()}.png` : item_photo.name,
      // cloudPath: `${new Date().getTime()}.png`,
      // 指定要上传的文件的小程序临时文件路径
      filePath: e.detail.file.url,
      // config: {
      //   env: this.data.envId
      // }
    }).then(res => {
      console.log('上传成功', res);
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
  
    // // 将图片上传至云存储空间
    // wx.cloud.uploadFile({
    //   // 指定上传到的云路径
    //   cloudPath: `${new Date().getTime()}.png`,
    //   // 指定要上传的文件的小程序临时文件路径
    //   filePath: e.detail.file.url,
    //   // config: {
    //   //   env: this.data.envId
    //   // }
    // }).then(res => {
    //   console.log('上传成功', res);
 
    // this.data.fileList.push({
    //   url: res.fileID
    // })
    // this.setData({
    //   fileList: this.data.fileList
    // });
    //   wx.hideLoading();
    // }).catch((e) => {
    //   console.log(e);
    //   wx.hideLoading();
    // });
    // this.data.fileList.push(item_photo)

  },
  delete_avar(e) {
    console.log(e)
    wx.showLoading({
      title: '...',
    })
    const index=e.detail.index
    const url=e.detail.file.url
    this.data.avarList.splice([index], 1)
    wx.cloud.deleteFile({
      fileList: [url]
    }).then(res => {
      // handle success
      console.log("删除成功")
      this.setData({
        avarList: this.data.avarList
      });
      wx.hideLoading()
    }).catch(error => {
      // handle error
      console.log(error)
      wx.hideLoading()
    })
  },
  uploader_avar(e) {
    console.log(e)
    const item_photo = {
      type:e.detail.type,
      name: e.detail.file.name,
      url: e.detail.file.url
    }
    wx.showLoading({
      title: '...',
    })
    wx.cloud.uploadFile({
      // 指定上传到的云路径
      cloudPath: e.detail.file.type == 'image' ? `${new Date().getTime()}.png` : item_photo.name,
      // cloudPath: `${new Date().getTime()}.png`,
      // 指定要上传的文件的小程序临时文件路径
      filePath: e.detail.file.url,
      // config: {
      //   env: this.data.envId
      // }
    }).then(res => {
      console.log('上传成功', res);
      this.data.avarList.push({
        url: res.fileID
      })
      this.setData({
        avarList: this.data.avarList
      });
      wx.hideLoading();
    }).catch((e) => {
      console.log(e);
      wx.hideLoading();
    });
  
    // // 将图片上传至云存储空间
    // wx.cloud.uploadFile({
    //   // 指定上传到的云路径
    //   cloudPath: `${new Date().getTime()}.png`,
    //   // 指定要上传的文件的小程序临时文件路径
    //   filePath: e.detail.file.url,
    //   // config: {
    //   //   env: this.data.envId
    //   // }
    // }).then(res => {
    //   console.log('上传成功', res);
 
    // this.data.fileList.push({
    //   url: res.fileID
    // })
    // this.setData({
    //   fileList: this.data.fileList
    // });
    //   wx.hideLoading();
    // }).catch((e) => {
    //   console.log(e);
    //   wx.hideLoading();
    // });
    // this.data.fileList.push(item_photo)
  },
  tag_add() {
    this.setData({
      sheet_show: true
    })
  },
  action_sheet_hidden() {
    // console.log(e)
    this.setData({
      sheet_show: false
    })
  },
  picker_confirm(e) {
    console.log(e)
    this.data.tagList.push(e.detail.value)
    this.setData({
      tagList: this.data.tagList
    })
    this.action_sheet_hidden()
  },
  onTagClose(e) {
    const index = e.currentTarget.dataset.index
    this.data.tagList.splice([index], 1)
    this.setData({
      tagList: this.data.tagList
    })
    console.log(e)
  },
  uploadfile(name, tempFile) {
    console.log("要上传文件的临时路径", tempFile)
    return new Promise((resolve, reject) => {
      // let timestamp = (new Date()).valueOf()
      wx.showLoading({
        title: '上传中...',
      })
      wx.cloud.uploadFile({
        cloudPath: name, //云存储的路径，开发者自定义
        filePath: tempFile, // 文件路径
      }).then(res => {
        console.log("上传成功", res)
        resolve(res.fileID)
        wx.hideLoading()
      })

    })
  },
  //选择文件
  uploader_excel(e) {
    var that = this
    console.log(e)
    const {
      name,
      url
    } = e.detail.file
    this.uploadfile(name, url).then(res => {
      console.log(res)
      this.jiexi(res) //将文件id传到解析方法
    }).catch(e => {
      wx.showToast({
        title: '上传失败...',
        icon: 'none'
      })
    })
  },

  jiexi(fileID) {
    wx.showLoading({
      title: '文件解析中...',
    })
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'kebiao',
        data: {
          type: 'item',
          fileID: fileID,
        }
      },
      success: res => {
        wx.hideLoading()
        console.log('解析并上传成功', res);
        wx.showToast({
          title: '导入发表成功',
          icon: 'success',
        })
      },
      fail: err => {
        console.log('解析失败', err);
      }
    })
  },
  edit(){
    this.setData({
      type:'edit'
    })
  },
  publish(){
    const {avarList,tagList,name,jianjie}=this.data
    console.log(avarList)
    console.log(tagList)
    console.log(name)
    console.log(jianjie)
    //想清楚是批量上传，还是单个。
    //批量上传相册不好上传
    //单个上传感觉鸡肋
    
    // wx.cloud.callFunction({
    //   name: 'quickstartFunctions',
    //   data: {
    //     type: 'teacher',
    //     data:{
    //       type:'create',
    //       fileList,beizhu,title,createTime:new Date(),
    //       watch:0
    //     }
    //   }
    // }).then((resp) => {
    //   console.log(resp)
    //   if (resp.result.success) {
    //     // this.setData({
    //     //   haveCreateCollection: true
    //     // });
    //     this.setData({
    //       type:'publish'
    //     })
    //   }
    //   wx.hideLoading();
    // }).catch((e) => {
    //   console.log(e);
    //   // this.setData({
    //   //   showUploadTip: true
    //   // });
    //   wx.hideLoading();
    // });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      type: 'edit'
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