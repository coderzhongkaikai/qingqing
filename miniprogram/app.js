// app.js
App({
  onLaunch: function () {
    this.globalData = {
      User:null
    };
    
    const res = wx.getSystemInfoSync()
    this.globalData.User=wx.getStorageSync('User') || null
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

  }
});
