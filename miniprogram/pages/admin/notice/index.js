// pages/admin/notice/index.js
const util = require('../../util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sheet_show:false,
    columns: ['杭州', '宁波', '温州', '嘉兴', '湖州'],
  },
  onSheetClose(){
    this.setData({
    sheet_show:false,
    })
  },
  open_sheet(){
    this.setData({
      sheet_show:true,
      })
  },
  onConfirm(e){
    console.log(e)
    const {index,value}=e.detail
    this.setData({
      select_value:value,
      sheet_show:false,
      select_id:this.data.ActivatyInfo_list[index]._id
    })

  },
  noticeUpdate(){
    const {select_id,notice}=this.data
    console.log(select_id,notice)
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'otherSet',
        data:{
          type:'notice',
          _id:select_id,
          createTime:new Date(),
          content:notice
        }
      }
    }).then((res) => {
      console.log(res)
      if (res.result.success) {
        // this.setData({
        //   haveCreateCollection: true
        // });
        const data=res.result.data
        this.setData({
          // type:'publish',
        })
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
        title:e.errMsg,
        duration: 1000,
        icon: 'none',
      })
      wx.hideLoading()
      // this.setData({
      //   showUploadTip: true
      // });
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.showLoading({
      title: '请等待...',
    })
    wx.cloud.database().collection('activityInfo').orderBy('createTime','desc')
    .get()
    .then(res => {
      const data=res.data
      //根据活动列表得到对应的数据响应到前端
      wx.cloud.database().collection('notice').orderBy('createTime','desc').limit(1)
      .get()
      .then(res => {
      const select_value=data.find(item=>(item._id==res.data[0].activityID))
      console.log(select_value)
        this.setData({
          notice:res.data[0].content,
          // select_value:select_value.title+' '+util.formatTime(select_value.createTime)
        })
        // console.log('数据库获取数据成功' , res)
        wx.hideLoading()
      })
      //保存获取到的所以活动列表
      this.setData({
        ActivatyInfo_list:res.data,
        columns:res.data.map(item=>item.title+' '+util.formatTime(item.createTime))
      })
      console.log('数据库获取数据成功' , res)
    })
    .catch(err =>{
      wx.hideLoading()
      wx.showToast({
        title: '获取失败',
        icon:'none'
      })
      console.log('数据库获取数据失败' , err)
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