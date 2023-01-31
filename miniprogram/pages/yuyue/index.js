// pages/yuyue/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'order',
        data:{
          type:'getlist',
          // ...data
          // _id:_id
        }
      }
    }).then((res) => {
      console.log(res)
      if (res.result.success) {
        // this.setData({
        //   kebiao_list:res.result.data.list
        // })
        // const _item=res.result.data.data
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
      wx.showToast({
        title:e.errMsg,
        duration: 1000,
        icon: 'none',
      })
      wx.hideLoading()
    });
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