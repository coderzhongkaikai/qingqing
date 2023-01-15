// pages/teacherInfo/index.js
Page({
  options: {
    styleIsolation: 'shared'
  },
  /**
   * 页面的初始数据
   */
  data: {
    item:null,//代表是否有默认对象，
    fileList: [],
    avarList:[],//头像
    tagList: [],
    kebiao_data:[],//主要用来在页面显示数据
    new_kebiao_data:[],//主要用来数据库更新数据 
    active: 0,
    columns: ['网红舞', '芭蕾舞', '拉丁舞','民族舞', '街舞', '爵士舞'],
    is_kebiao_update:false,
    teacher_name:''
  },

  //上传修改头像
  uploader_avar(e) {
    console.log(e)
    const item_photo = {
      type:e.detail.type,
      name: e.detail.file.name,
      url: e.detail.file.url
    }
    wx.showLoading({
      title: '请等待...',
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
  delete_avar(e) {
    console.log(e)
    wx.showLoading({
      title: '请等待...',
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

  //上传修改老师相册
  uploader_photo(e) {
    console.log(e)
    const item_photo = {
      type:e.detail.type,
      name: e.detail.file.name,
      url: e.detail.file.url
    }
    wx.showLoading({
      title: '请等待...',
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

  },
  delete_photo(e) {
    console.log(e)
    wx.showLoading({
      title: '请等待...',
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
  tag_add() {
    this.setData({
      sheet_show: true
    })
  },
  onTagClose(e) {
    const index = e.currentTarget.dataset.index
    this.data.tagList.splice([index], 1)
    this.setData({
      tagList: this.data.tagList
    })
    console.log(e)
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
  //选择上传excel课表数据文件，保存云服务后返回文件ID，再通过云函数解析excel
  uploader_excel(e) {
    var that = this
    console.log(e)
    //文件上传接口，得到文件的名称和缓存路径
    const {
      name,//文件名
      url//缓存路径
    } = e.detail.file
    this.uploadfile(name, url).then(res => {
      console.log(res)
      this.kebiao_jiexi(res) //将文件id传到解析方法
    }).catch(e => {
      wx.showToast({
        title: '上传失败...',
        icon: 'none'
      })
    })
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
  kebiao_jiexi(fileID) {
    wx.showLoading({
      title: '文件解析中...',
    })
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'kebiao',
        data: {
          type: 'jiexi',
          fileID: fileID,
        }
      },
      success: res => {
        wx.hideLoading()
        console.log('解析并上传成功', res);
        const new_kebiao_data=this.data.new_kebiao_data.concat(res.result.data)
        this.setData({
          new_kebiao_data:new_kebiao_data,
          is_kebiao_update:true,//新增后需要保存数据库,其实可以通过判断new_kebiao_data是否为空数组来判断是否新增
        })
        wx.showToast({
          title: '解析成功',
          icon: 'success',
        })
      },
      fail: err => {
        wx.showToast({
          title: '解析失败',
          icon: 'none',
        })
        console.log('解析失败', err);
      }
    })
  },
  kebiao_add(teacher_id){
    const new_kebiao_data=this.data.new_kebiao_data
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'kebiao',
        data:{
          type:'add',
          new_kebiao_data,teacher_id,
          createTime:new Date().getTime(),
        }
      }
    }).then((res) => {
      console.log(res)
      if (res.result.success) {   
        // //合并已有的课表数据 重新获取reload后就不需要在这里合并，直接在reload函数里面赋值
        // const kebiao_data=this.data.kebiao_data.concat(new_kebiao_data)
        this.setData({
          type:'publish',
          // kebiao_data:kebiao_data,
          is_kebiao_update:false,
          new_kebiao_data:[]//更新后清空
        })
        wx.showToast({
          title: '成功',
          duration: 1000,
          icon: 'success',
        })
        this.reload(teacher_id)
      }
      wx.hideLoading();
    }).catch((e) => {
      console.log(e);
      wx.showToast({
        title:e.errMsg,
        duration: 1000,
        icon: 'none',
      })
      wx.hideLoading()
    });
    // //更新完成后，修改页面状态，课表状态
    // this.setData({
    //   type:'publish',
    //   is_kebiao_update:false
    // })

  },
  edit(){
    this.setData({
      type:'edit'
    })
  },
  publish(){
    const {avarList,fileList,tagList,teacher_name,jianjie,kebiao_data,item}=this.data
    console.log(teacher_name)
    console.log(avarList)
    console.log(tagList)
    console.log(fileList)
    console.log(jianjie)
    console.log(kebiao_data)
    wx.showLoading({
      title: '保存中...',
    })
    let data
    if(item){
      data={
        type:'update',
        avarList,fileList,tagList,teacher_name,jianjie,
        _id:item._id
      }
    }else{
      data={
        type:'create',
        avarList,fileList,tagList,teacher_name,jianjie,
        createTime:new Date().getTime(),
      }
    }
    //想清楚是创建教师是批量上传，还是单个。
    //批量上传相册不好上传
    //单个上传感觉鸡肋
    
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'teacher',
        data:data
      }
    }).then((res) => {
      console.log(res)
      if (res.result.success) {
    
      
            //是否有新课表上传，没有立刻变成publish状态，如果有新增课表上传，新增数据课表进入数据库后改变成publish
        //点击保存--》判断是否更新课表
        //有，添加新课表数据，然后修改页面状态publish
        //没有，直接修改页面状态publish
        //因为课表和老师页面是两张数据库表。分开更新的。
        let _id
        if(res.result.type=='create'){
          _id=res.result.data._id
        }else{
          _id=this.data.item._id
        }

          //**************************************************************？？？！！！！！！！
        //如果是data.type=update res.result.data._id是没有值的回报错
        if(this.data.is_kebiao_update){
          this.kebiao_add(_id)
        }else{
          this.setData({
            type:'publish'
          })
          wx.showToast({
            title: '成功',
            duration: 1000,
            icon: 'success',
          })
          this.reload(_id)

        }
        //数据修改后，重新获取一次页面。保证数据刷新，保证item是更新的
        //根据res.result.type
        //**************************************************************？？？！！！！！！！
        // this.reload(_id)
      }
    }).catch((e) => {
      console.log(e);
      // this.setData({
      //   showUploadTip: true
      // });
      wx.hideLoading();
    });
  },
  reload(_id){
    
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'teacher',
        data:{
          type:'getItem',
          _id:_id
        }
      }
    }).then((res) => {
      console.log(res)
      if (res.result.success) {
        const {kebiao,teacher}=res.result.data.data
        const {avarList,fileList,tagList,teacher_name,jianjie}=teacher.data
        this.setData({
          kebiao_data:kebiao.data,
          avarList,fileList,tagList,teacher_name,jianjie,
          item:teacher.data
        })
      }
      wx.hideLoading();
    }).catch((e) => {
      console.log(e);
      wx.showToast({
        title:e.errMsg,
        duration: 1000,
        icon: 'none',
      })
      wx.hideLoading()
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    const {jumpData}=options
    if(jumpData){
    // console.log(JSON.parse(jumpData))
      const {kebiao,teacher}=JSON.parse(jumpData)
      const {avarList,fileList,tagList,teacher_name,jianjie}=teacher.data
      this.setData({
        kebiao_data:kebiao.data,
        avarList,fileList,tagList,teacher_name,jianjie,
        item:teacher.data
      })

    }else{
      this.setData({
        type: 'edit'
      })
    }
   
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