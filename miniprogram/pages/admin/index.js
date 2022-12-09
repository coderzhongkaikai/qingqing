// pages/admin/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeName: '1',
    sheet_show:false,
    
    show: {
      primary: true,
      success: true,
    },
  },
  onTagClose(event){
    this.setData({
      [`show.${event.target.id}`]: false,
    });
  },
  onCollapseChange(event) {
    console.log(event)
    this.setData({
      activeName: event.detail,
    });
  },
  jumpActivatyPage() {
    console.log('sfadfsaf')
    wx.navigateTo({
      url: `/pages/activityInfo/index?type=${"edit"}`,
    });
  },
  delActivaty(){
    wx.cloud.database().collection('activityInfo').orderBy('createTime','desc')
    .get()
    .then(res => {
      // console.log(Ttime.formatTime(res.data[0].createTime,'Y/M/D h:m:s'))
      this.setData({
        ActivatyInfo_list:res.data,
        sheet_show:true,
        sheet_type:'Activaty',
        sheet_title:'删除活动'
      })
      console.log('数据库获取数据成功' , res)
    })
    .catch(err =>{
      console.log('数据库获取数据失败' , err)
    })

  },
  onSheetClose(){
    this.setData({
      sheet_show:false
    })
  },
  onTagDel(e){
    console.log(e)
    const {item,index}=e.currentTarget.dataset
    wx.showLoading({
      title: '加载中...',
    })
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'activityInfo',
        data:{
          type:'delItem',
          _id:item._id
        }
      }
    }).then((res) => {
      console.log(res)
      if (res.result.success) {
        this.data.ActivatyInfo_list.splice([index], 1)
        console.log(this.data.ActivatyInfo_list)
        this.setData({
          ActivatyInfo_list:this.data.ActivatyInfo_list
        })
        wx.showToast({
          title: '成功',
          duration: 1000,
          icon: 'success',
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
  edit_shouye(){
    // otherSet
    wx.navigateTo({
      url: './notice/index',
    });
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