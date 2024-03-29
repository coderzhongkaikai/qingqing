// pages/index/index.js
const app = getApp()
var Ttime = require('../../util.js');
const dance_type=['韩舞' ,'街舞', '爵士舞','芭蕾舞', '钢管舞']
const dance_type_img=['hanwu.jpeg','jiewu.jpeg','jueshi.jpeg','balei.jpeg','gangguan.jpeg']
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dance_type,
    dance_type_img,
    ActivatyInfo_list:[],
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
  //申请获取地理位置
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
  // click_active(e){
  //   console.log(e)
  //   const item=e.currentTarget.dataset.item
  //   wx.navigateTo({
  //     url: `/pages/activityInfo/index?_id=${item._id}`,
  //   });
  // },
  top_go_activity(e){
    const _id=e.currentTarget.dataset.activity_id
    wx.showLoading({
      title: '加载中...'
    })
    wx.cloud.database().collection('activityInfo').doc(_id).get().then(res=>{
      console.log(res)
      const jumpData=res.data
      wx.navigateTo({
        url: `/pages/activityInfo/index?jumpData=${JSON.stringify(jumpData)}`,
      });
      wx.hideLoading()
    }).catch(e=>{
      console.log('activity_id查不到，说明活动已经被删除')
      console.log(e)
    })
  },
  go_activity(e){
    console.log(e)
    const {item}=e.currentTarget.dataset
    wx.showLoading({
      title: '加载中...'
    })
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'activityInfo',
        data:{
          type:'getItem',
          _id:item._id
        }
      }
    }).then((res) => {
      console.log(res)
      if (res.result.success) {
        const jumpData=res.result.data.data
        wx.navigateTo({
          url: `/pages/activityInfo/index?jumpData=${JSON.stringify(jumpData)}`,
        });
        // const {_id,fileList,title,watch,content,beizhu}=_item
        // this.setData({
        //   fileList:fileList,
        //   title:title,
        //   beizhu:beizhu,
        //   content:content,
        //   item:_item
        // })
      }
      wx.hideLoading();
    }).catch((e) => {
      console.log(e);
      wx.hideLoading()
      wx.showToast({
        title:e.errMsg,
        duration: 1000,
        icon: 'none',
      }) 
    });
    // wx.navigateTo({
    //   url: `/pages/activityInfo/index?_id=${e.currentTarget.dataset.activityid}`,
    // });
  },
    //这里是直接根据老师数据表记录的_id跳转
  go_teacherInfo(e){
    console.log(e)
    const _id=e.currentTarget.dataset.item._id
    wx.showLoading({
      title: '加载中...'
    })
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
          const jumpData=res.result.data
          wx.navigateTo({
            url: `/pages/teacherInfo/index?jumpData=${JSON.stringify(jumpData)}`,
          });
        }
        wx.hideLoading();
      }).catch((e) => {
        console.log(e);
        wx.hideLoading()
        wx.showToast({
          title:e.errMsg,
          duration: 1000,
          icon: 'none',
        }) 
      });
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
    wx.cloud.database().collection('activityInfo').orderBy('createTime','desc')
    .get()
    .then(res => {
      // console.log(Ttime.formatTime(res.data[0].createTime,'Y/M/D h:m:s'))
      this.setData({
        ActivatyInfo_list:res.data
      })
      console.log('数据库获取数据成功' , res)
    })
    .catch(err =>{
      console.log('数据库获取数据失败' , err)
    })
    wx.cloud.database().collection('teacher').orderBy('createTime','desc')
    .get()
    .then(res => {
      // console.log(Ttime.formatTime(res.data[0].createTime,'Y/M/D h:m:s'))
      this.setData({
        teacher_list:res.data
      })
      console.log('数据库获取数据成功' , res)
    })
    .catch(err =>{
      console.log('数据库获取数据失败' , err)
    })
    wx.cloud.database().collection('notice').orderBy('createTime','desc').limit(1)
    .get()
    .then(res => {
      this.setData({
        notice:res.data[0].content,
        activityID:res.data[0].activityID 
        // n:res.data[0]
      })
      console.log('数据库获取数据成功' , res)
    })

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