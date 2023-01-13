const app = getApp()

const defaultAvatarUrl = ''


Page({
  data: {
    avatarUrl: defaultAvatarUrl,
    theme: wx.getSystemInfoSync().theme,
    showUploadTip: false,
    haveGetImgSrc: false,
    envId: '',
    imgSrc: ''
  },
  onLoad() {
    console.log(wx.getSystemInfoSync().theme)
    wx.onThemeChange((result) => {
      console.log(result)
      this.setData({
        theme: result.theme
      })
    })
      console.log(app.globalData.User)
      const {User}=app.globalData
      if(User){
        this.setData({
          ...User,
          avatarUrl:User.imgSrc
        })
      }
  },
  onChooseAvatar(e) {
    const {
      avatarUrl
    } = e.detail
    console.log(e)
    this.setData({
      avatarUrl,
      haveGetImgSrc: true,
    })
  },

  uploadImg() {
    // wx.showLoading({
    //   title: '',
    // });
    // 让用户选择一张图片
    // 将图片上传至云存储空间

  },

  clearImgSrc() {
    this.setData({
      haveGetImgSrc: false,
      imgSrc: ''
    });
  },
  save() {
    console.log(this.data)
    const {
      avatarUrl,
      haveGetImgSrc,
      nickname,
      phone
    } = this.data
    wx.showLoading({
      title: '保存中...',
    })
    //头像是否存在
    if (haveGetImgSrc) {
      wx.cloud.uploadFile({
        // 指定上传到的云路径
        cloudPath: `avatar_${new Date().getTime()}.png`,
        // 指定要上传的文件的小程序临时文件路径
        filePath: this.data.avatarUrl,
      }).then(res => {
        console.log('上传成功', res);
        this.data.imgSrc = res.fileID
        this.saveUser()
        // wx.showToast({
        //   title: '保存成功',
        //   icon:'success',
        //   duration:1000
        // })
        this.setData({
          // haveGetImgSrc: true,
          imgSrc: res.fileID
        });
        wx.hideLoading();
      }).catch((e) => {
        console.log(e);
        wx.hideLoading();
      });
    }else{
      this.saveUser()
    }

  },
  saveUser(){
    const {
      imgSrc,
      phone,
      nickname,
      _id
    } = this.data
    let data
    if(_id){
      console.log(_id)
      data={
        type: 'update',
        imgSrc,
        _id,
        phone,
        nickname,
        updateTime: new Date()
      }
    }else{
      data={
        type: 'create',
        imgSrc,
        phone,
        nickname,
        createTime: new Date()
      }
    }
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'User',
        data: data
      }
    }).then((res) => {
      console.log(res)
      if (res.result.success) {
        const User = {
          _id: _id?_id:res.result.data._id,
          imgSrc,
          phone,
          nickname
        }
        app.globalData.User = User
        
        wx.setStorageSync('User', User)
        let pages = getCurrentPages(); // 当前页面
        let beforePage = pages[pages.length - 2]; // 上一页
        //调用上一页的生命周期函数
        beforePage.unpdateUser()
        this.setData({
          ...User,
        })
        //   wx.navigateBack({
        //     success:res => {
        //       beforePage.unpdateUser();//周期函数或者函数名
        //     }
        // })
        wx.showToast({
          title: '成功',
          duration: 1000,
          icon: 'success',
        })
      }
      // this.setData({
      //   powerList
      // });
      wx.hideLoading();
    }).catch((e) => {
      console.log(e);
      wx.showToast({
        title: e.errMsg,
        duration: 1000,
        icon: 'none',
      })
      wx.hideLoading()
      // this.setData({
      //   showUploadTip: true
      // });
    });
  },
  updateUser() {
    const {
      imgSrc,
      phone,
      nickname
    } = this.data
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'User',
        data: data
      }
    }).then((res) => {
      console.log(res)
      if (res.result.success) {
        // this.setData({
        //   haveCreateCollection: true
        // });
        const data = res.result.data

        wx.showToast({
          title: '成功',
          duration: 1000,
          icon: 'success',
        })
      }
      // this.setData({
      //   powerList
      // });
      wx.hideLoading();
    }).catch((e) => {
      console.log(e);
      wx.showToast({
        title: e.errMsg,
        duration: 1000,
        icon: 'none',
      })
      wx.hideLoading()
      // this.setData({
      //   showUploadTip: true
      // });
    });
  },
  createUser() {
    const {
      imgSrc,
      phone,
      nickname
    } = this.data
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'User',
        data: {
          type: 'create',
          imgSrc,
          phone,
          nickname,
          createTime: new Date()
        }
      }
    }).then((res) => {
      console.log(res)
      if (res.result.success) {
        // this.setData({
        //   haveCreateCollection: true
        // });
        const data = res.result.data
        const User = {
          _id: res.result.data._id,
          imgSrc,
          phone,
          nickname
        }
        app.globalData.User = User
        wx.setStorageSync('User', User)
        console.log(wx.setStorageSync('User', User))
        let pages = getCurrentPages(); // 当前页面
        let beforePage = pages[pages.length - 2]; // 上一页
        //调用上一页的生命周期函数
        beforePage.unpdateUser()
        //   wx.navigateBack({
        //     success:res => {
        //       beforePage.unpdateUser();//周期函数或者函数名
        //     }
        // })
        wx.showToast({
          title: '成功',
          duration: 1000,
          icon: 'success',
        })
      }
      // this.setData({
      //   powerList
      // });
      wx.hideLoading();
    }).catch((e) => {
      console.log(e);
      wx.showToast({
        title: e.errMsg,
        duration: 1000,
        icon: 'none',
      })
      wx.hideLoading()
      // this.setData({
      //   showUploadTip: true
      // });
    });
  }


})