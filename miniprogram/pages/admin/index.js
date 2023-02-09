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
  //页面跳转
  jumpActivatyPage() {
    // console.log('sfadfsaf')
    wx.navigateTo({
      url: `/pages/activityInfo/index?type=${"edit"}`,
    });
  },
  showActivaty(){
    wx.showLoading({
      title: '加载中...',
    })
    wx.cloud.database().collection('activityInfo').orderBy('createTime','desc')
    .get()
    .then(res => {
      // console.log(Ttime.formatTime(res.data[0].createTime,'Y/M/D h:m:s'))
      this.setData({
        ActivatyInfo_list:res.data,
        sheet_show:true,
        sheet_type:'activaty',
        sheet_title:'活动列表'
      })
      wx.hideLoading()
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
  showTeacher(){
    wx.showLoading({
      title: '加载中...',
    })
    wx.cloud.database().collection('teacher').orderBy('createTime','desc')
    .get()
    .then(res => {
      // console.log(Ttime.formatTime(res.data[0].createTime,'Y/M/D h:m:s'))
      this.setData({
        teacher_list:res.data,
        sheet_show:true,
        sheet_type:'teacher',
        sheet_title:'老师列表'
      })
      console.log('数据库获取数据成功' , res)
  
      wx.hideLoading()
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
  showOrder(){
    wx.showLoading({
      title: '加载中...',
    })
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'order',
        data:{
          type:'getlist_admin',
        }
      }
    }).then((res) => {
      console.log(res)
      if (res.result.success) {
        const  yuyue_list=res.result.data.list
        const yuyue_ing=[]
        const yuyue_ed=[]
        let _now=new Date().getTime()
        yuyue_list.forEach(item=>{
          console.log(item)
          //是否这个老师有课
          if(item.kebiao.length>0){
            const timestamp=item['kebiao'][0]['timestamp']
            if(timestamp>_now){
              yuyue_ing.push(item)
            }else{
              yuyue_ed.push(item)
            }
          }
         
        })

        this.setData({
          // yuyue_list:res.result.data.list,
          yuyue_ing,
          yuyue_ed,
          sheet_show:true,
          sheet_type:'order',
          sheet_title:'预约列表'
        })

        wx.hideLoading()
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
  go_Activaty(e){
    const {item}=e.currentTarget.dataset
    console.log(item)
    wx.showLoading({
      title: '请稍等...',
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
      wx.showToast({
        title:e.errMsg,
        duration: 1000,
        icon: 'none',
      })
      wx.hideLoading()
    });
  },
  del_activaty(e){
    console.log(e)
    wx.showModal({
      title: '删除确认',
      content: '请您确认将删除所选内容',
      complete: (res) => {
        if (res.cancel) {
          
        }
        if (res.confirm) {
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
        }
      }
    })

  },
  go_teacherInfo(e){
    const _id=e.currentTarget.dataset.teacher_id
    wx.showLoading({
      title: '请稍等...',
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
        wx.showToast({
          title:e.errMsg,
          duration: 1000,
          icon: 'none',
        })
        wx.hideLoading()
      });
  },
  del_teacher(e){
    console.log(e)
    const {index,teacher_id}=e.currentTarget.dataset
    wx.showModal({
      title: '删除确认',
      content: '请您确认将删除所选内容',
      complete: (res) => {
        if (res.cancel) {
          
        }
    
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'quickstartFunctions',
            data: {
              type: 'teacher',
              data:{
                type:'delItem',
                _id:teacher_id
              }
            }
          }).then((res) => {
            console.log(res)
            if (res.result.success) {
              this.data.teacher_list.splice([index], 1)
              this.setData({
                teacher_list:this.data.teacher_list
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
          // const {item,index}=e.currentTarget.dataset
          // wx.showToast({
          //   title: '还没做',
          //   icon:'none'
          // })
          // console.log(item)
        }
      }
    })
  },
  onSheetClose(){
    this.setData({
      sheet_type:'',
      ActivatyInfo_list:[],//
      teacher_list:[],//清楚数据，解决数据响应有卡顿问题
      sheet_show:false
    })
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