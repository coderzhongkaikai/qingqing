// pages/yuyue/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeName: '1',
    yuyue_ing:[],
    yuyue_ed:[]
  },
  cancelBtn(e){
    const OPENID=app.globalData.User.OPENID
    wx.showModal({
      title: '取消确认',
      content: '确认将取消预约这节课',
      complete: (res) => {
        if (res.cancel) {
          
        }
    
        if (res.confirm) {
          const {
            kebiao_id,
            yuyue_index
          }=e.currentTarget.dataset
          // console.log(this.data.yuyue_list)
          // console.log(e.currentTarget.dataset)
          const yuyue_count=this.data.yuyue_ing[yuyue_index]['yuyue_count']
          const idx=yuyue_count.indexOf(OPENID)
          //yuyue_cont是否存在OPENID存在则踢出，不存在则添加
          if(idx>-1){
            console.log('取消')
            yuyue_count.splice(idx,1)
            this.del_yuyue({yuyue_count,kebiao_id,yuyue_index})
          }else{
            // yuyue_count.push(OPENID)
            // this.yuyue({yuyue_count,kebiao_id})

          }
        }
      }
    })
  },
  del_yuyue(data){
    console.log(data)
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'order',
        data:{
          type:'del',
          ...data
        }
      }
    }).then((res) => {
      console.log(res)
      if (res.result.success) {
        wx.showToast({
          title: '成功取消',
          icon: 'success',
          duration: 2000,
        });
        this.data.yuyue_ing.splice(data.yuyue_index,1)
        this.setData({
          yuyue_ing:this.data.yuyue_ing
        })
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
  onCollapseChange(event) {
    console.log(event)
    this.setData({
      activeName: event.detail,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.showLoading({
      title: '加载中...',
    })
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
      const  yuyue_list=res.result.data.list
      
      const yuyue_ing=[]
      const yuyue_ed=[]
      let _now=new Date().getTime()
      yuyue_list.forEach(item=>{
        console.log(item)
        if(item.timestamp>_now){
          yuyue_ing.push(item)
        }else{
          yuyue_ed.push(item)
        }
      })

      if (res.result.success) {
        this.setData({
          yuyue_list:res.result.data.list,
          yuyue_ing,
          yuyue_ed
        })

        wx.hideLoading()
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