const app = getApp()

const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'


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
    wx.onThemeChange((result) => {
      this.setData({
        theme: result.theme
      })
    })
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    console.log(e)
    this.setData({
      avatarUrl,
    })
  },

  uploadImg() {
    wx.showLoading({
      title: '',
    });
    // 让用户选择一张图片
  // 将图片上传至云存储空间
  wx.cloud.uploadFile({
    // 指定上传到的云路径
    cloudPath: 'my-photo.png',
    // 指定要上传的文件的小程序临时文件路径
    filePath: chooseResult.tempFilePaths[0],
    config: {
      env: this.data.envId
    }
  }).then(res => {
    console.log('上传成功', res);
    this.setData({
      haveGetImgSrc: true,
      imgSrc: res.fileID
    });
    wx.hideLoading();
  }).catch((e) => {
    console.log(e);
    wx.hideLoading();
  });
  },

  clearImgSrc() {
    this.setData({
      haveGetImgSrc: false,
      imgSrc: ''
    });
  }

  
})
