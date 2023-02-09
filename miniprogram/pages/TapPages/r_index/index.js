// pages/TapPages/r_index/index.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    popHeight: app.globalData.popHeight,
    // list: ["list0", "list1", "list2", "list3", "list4", "list5", "list11", "list12", "list13", "list14", "list15", "list25", "list26", "list27", "list28", "list29", "list30"],
    toView: '',
    jump_index:0
  },
  //更新用户信息，能保证在修改用户信息后能够及时更新
  updateUser:function(){
    console.log(app.globalData.User)
    const {User}=app.globalData
    console.log(wx.getStorageSync('User'))
    if(User){
      this.setData({
        User:User
      })
    }else{
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
          const data=res.result.data.data[0]
          console.log(data)
          const User = {
            _id: data._id,
            imgSrc:data.imgSrc,
            phone:data.phone,
            nickname:data.nickname
          }
          app.globalData.User = User
          wx.setStorageSync('User', User)
          this.setData({
            User:User
          })
        }
     
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

  },
  jump:function(e){
    let type = e.currentTarget.dataset.type;
    let jump_index=this.data.jump_index
    if(type=='up'){
      if(jump_index==0){  
        wx.showToast({
          title: '上面没有',
          icon:'none'
        })

      }else{
        jump_index--
        this.setData({
          jump_index:jump_index
        })
      this.jumpTo()
      }
    
    }else{
      //长度提示
      jump_index++
      this.setData({
        jump_index:jump_index
      })
      this.jumpTo()
    }
  },
  jumpTo: function () {
    console.log('list'+this.data.jump_index)
    // 获取标签元素上自定义的 data-opt 属性的值
    this.setData({
      toView: 'list'+this.data.jump_index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.updateUser()
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