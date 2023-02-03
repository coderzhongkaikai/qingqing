// app.js
App({
  onLaunch: function () {
    this.globalData = {
      User:null
    };
    
    const res = wx.getSystemInfoSync()
    //初始化获取User，如果本地没有缓存，则需要访问云服务器获取用户信息
    //访问云服务器获取用户信息  还没做
 
    const { screenHeight, safeArea: { bottom } } = res
    console.log('resHeight',res);
    if (screenHeight && bottom){
      let safeBottom = screenHeight - bottom
      console.log(safeBottom)
      console.log(this.globalData)
      //解决自定义底部tab-bar遮住下面的内容
      this.globalData['popHeight']=48 + safeBottom
      // this.setData({
      //   height: 48 + safeBottom
      // })
    }

    //云服务初始化
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'cloud1-3gej1ilob17d9b86',
        traceUser: true,
      });
    }


    if(wx.getStorageSync('User')){
      this.globalData.User=wx.getStorageSync('User') || null
    }else{
      wx.showLoading({
        title: '用户获取中...',
      })
      wx.cloud.callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'User',
          data: {
            type:'getItem'
          }
        }
      }).then((res) => {
        console.log(res)
        if (res.result.success) {
          // this.setData({
          //   haveCreateCollection: true
          // });
          const userInfo = res.result.data.data[0]
          this.globalData.User=userInfo
          wx.setStorageSync('User', userInfo)
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

  }
});
