// pages/index/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    popHeight: app.globalData.popHeight,
    active: 0,
    icon: {
      normal: 'https://img.yzcdn.cn/vant/user-inactive.png',
      active: 'https://img.yzcdn.cn/vant/user-active.png',
    },
    //轮播参数
    imgList: ['https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01a7ef60ee58ca11013eaf70d52916.jpg%402o.jpg&refer=http%3A%2F%2Fimg.zcool.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1671179006&t=ebe89cefd524d8c2604261923abce46b', 'https://img0.baidu.com/it/u=2197096872,945961842&fm=253&fmt=auto&app=138&f=JPEG?w=667&h=500', 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fi2.hdslb.com%2Fbfs%2Farchive%2Fb10c00764f189e24dc89ab41664560e17508d57a.jpg&refer=http%3A%2F%2Fi2.hdslb.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1671179028&t=1c1ac60a72e0eea727bcea0963526f94'],
    autoplay: true, //是否自动切换
    interval: 3000, //自动切换时间间隔,3s
    duration: 1000, //  滑动动画时长1s
    swiperCurrent: '',
  },

  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },

  onChange(event) {
    this.setData({
      active: event.detail
    });
  },
  navigate() {
    ////使用微信内置地图查看标记点位置，并进行导航
    console.log('导航')
    wx.openLocation({
      latitude: 32.274105,
      longitude: 118.310713,
      name: '青青的舞蹈室',
      address: '一个临时地址的详细说明'
      // latitude: this.data.markers[0].latitude, //要去的纬度-地址
      // longitude: this.data.markers[0].longitude, //要去的经度-地址
    })
  },
  call(phone) {
    console.log(phone.target.dataset.phone)
    wx.makePhoneCall({
      phoneNumber: phone.target.dataset.phone,
      success() {
        console.log('拨打成功')
      },
      fail() {
        console.log('拨打失败')
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(app)


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
    this.getTabBar().init();
    // this.setData({
    //   popHeight: app.globalData.popHeight
    // })
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