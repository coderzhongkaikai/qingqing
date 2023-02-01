// index.js
const app = getApp()
const dance_type=['韩舞' ,'街舞', '爵士舞','芭蕾舞', '钢管舞']
const dance_type_img=['hanwu.jpeg','jiewu.jpeg','jueshi.jpeg','balei.jpeg','gangguan.jpeg']
Page({
  click_dance_type(e){
    console.log(e)
    const index=e.currentTarget.dataset.index
    const selectData={
      dance_type:this.data.dance_type[index],
      timestamp:this.data.selectDayTimestamp
  }
  this.get_kebiao_list(selectData)
    this.setData({
      click_dance_index:index
    })
  },
  showPopup() {
    this.setData({
      show: true
    });
  },
  onDisplay() {
    this.setData({
      show: true
    });
  },
  onClose() {
    this.setData({
      show: false
    });
  },
  formatDate(date) {
    date = new Date(date);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  },
  onConfirm(event) {
    this.setData({
      show: false,
      date: this.formatDate(event.detail),
    });
  },
  get_kebiao_list(selectData){
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'kebiao',
        data:{
          type:'getlist',
          selectData:selectData
          // _id:_id
        }
      }
    }).then((res) => {
      console.log(res)
      if (res.result.success) {
        this.setData({
          kebiao_list:res.result.data.list
        })
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
  yuyue(data){
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'order',
        data:{
          type:'add',
          ...data
          // _id:_id
        }
      }
    }).then((res) => {
      console.log(res)
      if (res.result.success) {
        wx.showToast({
          title: '您已成功预约',
          icon: 'success',
          duration: 2000,
        });
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
  //这里是根据课表记录的teacher_id跳转
  go_teacherInfo(e){
    console.log(e)
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
  SubscribeMessage: function (e) {
    console.log(e)
    const OPENID=app.globalData.User.OPENID
    wx.requestSubscribeMessage({
      // 传入订阅消息的模板id，模板 id 可在小程序管理后台申请
      tmplIds: ['F7ajuHC3waSw91_dN8HXcuuNLCjRcTfdESdb605okPc'],
      success:(res)=>{
        console.log(res)
        // 申请订阅成功
        if (res['F7ajuHC3waSw91_dN8HXcuuNLCjRcTfdESdb605okPc'] === 'accept') {
          if(OPENID){
        // 这里将订阅的课程信息调用云函数存入云开发数据
          wx.showToast({
            title: '订阅成功',
            icon: 'success',
            duration: 2000,
          });
          const {
            kebiao_id,
            kebiao_index
          }=e.currentTarget.dataset
          console.log(this.data.kebiao_list)
          const yuyue_count=this.data.kebiao_list[kebiao_index]['yuyue_count']
          const idx=yuyue_count.indexOf(OPENID)
          //yuyue_cont是否存在OPENID存在则踢出，不存在则添加
          if(idx>-1){
            wx.showToast({
              title: '请不要重复预约',
              icon: 'success',
              duration: 2000,
            });
            // yuyue_count.splice(idx,1)
            // this.yuyue({yuyue_count,kebiao_id})
          }else{
            yuyue_count.push(OPENID)
            this.yuyue({yuyue_count,kebiao_id})

          }
        
          }else{
            wx.showToast({
              title: '请先注册信息',
              icon: 'none',
              duration: 2000,
            });

          }
      
        }
      }
    })

  },
  data: {
    click_dance_index:0,
    dance_type: dance_type,
    popHeight: app.globalData.popHeight,
    date: '',
    show: false,
    // spotMap: {
    //   y2022m5d9: 'deep-spot',
    //   y2022m5d10: 'spot',
    //   y2022m6d10: 'spot',
    //   y2022m7d10: 'spot',
    //   y2022m8d10: 'spot',
    //   y2022m10d1: 'spot',
    //   y2023m5d10: 'spot',
    // },
    // disabledDate({
    //   day,
    //   month,
    //   year
    // }) {
    //   // 例子，今天之后的日期不能被选中
    //   const now = new Date();
    //   const date = new Date(year, month - 1, day);
    //   return date > now;
    // },
    // 需要改变日期时所使用的字段
    // changeTime: '',
    // 存储已经获取过的日期
    // dateListMap: [],
    //******以上是日历控件数据 */
    // showUploadTip: false,
  
    // //设置标记点
    // markers: [{
    //   iconPath: "/images/ljx.png",
    //   id: 4,
    //   latitude: 31.938841,
    //   longitude: 118.799698,
    //   width: 30,
    //   height: 30
    // }],
    // //当前定位位置
    // latitude: '',
    // longitude: '',
  },
  onLoad() {
    //获取当前位置
    // wx.getLocation({
    //   type: 'gcj02',
    //   success: (res) => {
    //     console.log(res)
    //     this.setData({
    //       latitude: res.latitude,
    //       longitude: res.longitude
    //     })
    //   }
    // })
    // new Date().getTime()-1675279800000 
    this.data.selectDayTimestamp=new Date().getTime()
    const selectData={
      dance_type:this.data.dance_type[this.data.click_dance_index],
      timestamp:this.data.selectDayTimestamp
    }
    this.get_kebiao_list(selectData)

  },
    /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getTabBar().init();
  },
  // 获取日期数据，通常用来请求后台接口获取数据
  getDateList({
    detail
  }) {
    // 检查是否已经获取过该月的数据
    if (this.filterGetList(detail)) {
      // 获取数据
      console.log(detail, '获取数据');
    }
  },
  // 过滤重复月份请求的方法
  filterGetList({
    setYear,
    setMonth
  }) {
    const dateListMap = new Set(this.data.dateListMap);
    const key = `y${setYear}m${setMonth}`;
    if (dateListMap.has(key)) {
      return false;
    }
    dateListMap.add(key);
    this.setData({
      dateListMap: [...dateListMap],
    });
    return true;
  },
  // 日期改变的回调
  selectDay({detail}) {
    let {
      year,month,day
    }=detail
    let dayStr=year+'/'+month+'/'+day
    this.data.selectDayTimestamp=new Date(dayStr).getTime()
    const selectData={
      dance_type:this.data.dance_type[this.data.click_dance_index],
      timestamp:this.data.selectDayTimestamp
    }
    this.get_kebiao_list(selectData)
    console.log(detail, 'selectDay detail');
  },
  // changetime() {
  //   this.setData({
  //     changeTime: '2022/1/1',
  //   });
  // },
  onGetPhoneNumber(e) {
    var that = this;
    wx.login({
      success(res) {
        if (res.code) {
          console.log('步骤2获检查用户登录状态，获取用户电话号码！', res)
          wx.request({
            url: '这里写自己的获取授权的服务器地址',
            data: {
              code: res.code
            },
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              console.log("步骤三获取授权码，获取授权openid，session_key", res);
              var userphone = res.data.data;
              wx.setStorageSync('userphoneKey', userphone);
              //解密手机号
              var msg = e.detail.errMsg;
              var sessionID = wx.getStorageSync("userphoneKey").session_key;
              var encryptedData = e.detail.encryptedData;
              var iv = e.detail.iv;
              if (msg == 'getPhoneNumber:ok') { //这里表示获取授权成功
                wx.checkSession({
                  success: function () {
                    //这里进行请求服务端解密手机号
                    that.deciyption(sessionID, encryptedData, iv);
                  },
                  fail: function () {
                    // that.userlogin()
                  }
                })
              }

            },
            fail: function (res) {
              console.log("fail", res);
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  // onClickPowerInfo(e) {
  //   const index = e.currentTarget.dataset.index;
  //   const powerList = this.data.powerList;
  //   powerList[index].showItem = !powerList[index].showItem;
  //   if (powerList[index].title === '数据库' && !this.data.haveCreateCollection) {
  //     this.onClickDatabase(powerList);
  //   } else {
  //     this.setData({
  //       powerList
  //     });
  //   }
  // },

  // onChangeShowEnvChoose() {
  //   wx.showActionSheet({
  //     itemList: this.data.envList.map(i => i.alias),
  //     success: (res) => {
  //       this.onChangeSelectedEnv(res.tapIndex);
  //     },
  //     fail(res) {
  //       console.log(res.errMsg);
  //     }
  //   });
  // },

  // onChangeSelectedEnv(index) {
  //   if (this.data.selectedEnv.envId === this.data.envList[index].envId) {
  //     return;
  //   }
  //   const powerList = this.data.powerList;
  //   powerList.forEach(i => {
  //     i.showItem = false;
  //   });
  //   this.setData({
  //     selectedEnv: this.data.envList[index],
  //     powerList,
  //     haveCreateCollection: false
  //   });
  // },

  jumpPage(e) {
    wx.navigateTo({
      url: `/pages/${e.currentTarget.dataset.page}/index?envId=${this.data.selectedEnv.envId}`,
    });
  },

  // onClickDatabase(powerList) {
  //   wx.showLoading({
  //     title: '',
  //   });
  //   wx.cloud.callFunction({
  //     name: 'quickstartFunctions',
  //     config: {
  //       env: this.data.selectedEnv.envId
  //     },
  //     data: {
  //       type: 'createCollection'
  //     }
  //   }).then((resp) => {
  //     if (resp.result.success) {
  //       this.setData({
  //         haveCreateCollection: true
  //       });
  //     }
  //     this.setData({
  //       powerList
  //     });
  //     wx.hideLoading();
  //   }).catch((e) => {
  //     console.log(e);
  //     this.setData({
  //       showUploadTip: true
  //     });
  //     wx.hideLoading();
  //   });
  // }
});