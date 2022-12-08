// index.js
const app = getApp()
Page({
  click_dance_type(e){
    console.log(e)
    const index=e.currentTarget.dataset.index
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
  data: {
    click_dance_index:0,
    dance_type: ['网红舞', '芭蕾舞', '拉丁舞','民族舞' ,'街舞', '爵士舞'],
    popHeight: app.globalData.popHeight,
    date: '',
    show: false,
    spotMap: {
      y2022m5d9: 'deep-spot',
      y2022m5d10: 'spot',
      y2022m6d10: 'spot',
      y2022m7d10: 'spot',
      y2022m8d10: 'spot',
      y2022m10d1: 'spot',
      y2023m5d10: 'spot',
    },
    disabledDate({
      day,
      month,
      year
    }) {
      // 例子，今天之后的日期不能被选中
      const now = new Date();
      const date = new Date(year, month - 1, day);
      return date > now;
    },
    // 需要改变日期时所使用的字段
    changeTime: '',
    // 存储已经获取过的日期
    dateListMap: [],
    //******以上是日历控件数据 */
    showUploadTip: false,
    powerList: [{
      title: '云函数',
      tip: '安全、免鉴权运行业务代码',
      showItem: false,
      item: [{
          title: '获取OpenId',
          page: 'getOpenId'
        },
        //  {
        //   title: '微信支付'
        // },
        {
          title: '生成小程序码',
          page: 'getMiniProgramCode'
        },
        // {
        //   title: '发送订阅消息',
        // }
      ]
    }, {
      title: '数据库',
      tip: '安全稳定的文档型数据库',
      showItem: false,
      item: [{
        title: '创建集合',
        page: 'createCollection'
      }, {
        title: '更新记录',
        page: 'updateRecord'
      }, {
        title: '查询记录',
        page: 'selectRecord'
      }, {
        title: '聚合操作',
        page: 'sumRecord'
      }]
    }, {
      title: '云存储',
      tip: '自带CDN加速文件存储',
      showItem: false,
      item: [{
        title: '上传文件',
        page: 'uploadFile'
      }]
    }, {
      title: '云托管',
      tip: '不限语言的全托管容器服务',
      showItem: false,
      item: [{
        title: '部署服务',
        page: 'deployService'
      }]
    }],

    haveCreateCollection: false,


    //设置标记点
    markers: [{
      iconPath: "/images/ljx.png",
      id: 4,
      latitude: 31.938841,
      longitude: 118.799698,
      width: 30,
      height: 30
    }],
    //当前定位位置
    latitude: '',
    longitude: '',
  },
  onLoad() {
    //获取当前位置
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        console.log(res)
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
      }
    })
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
  selectDay({
    detail
  }) {
    console.log(detail, 'selectDay detail');
  },
  changetime() {
    this.setData({
      changeTime: '2022/1/1',
    });
  },
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
  onClickPowerInfo(e) {
    const index = e.currentTarget.dataset.index;
    const powerList = this.data.powerList;
    powerList[index].showItem = !powerList[index].showItem;
    if (powerList[index].title === '数据库' && !this.data.haveCreateCollection) {
      this.onClickDatabase(powerList);
    } else {
      this.setData({
        powerList
      });
    }
  },

  onChangeShowEnvChoose() {
    wx.showActionSheet({
      itemList: this.data.envList.map(i => i.alias),
      success: (res) => {
        this.onChangeSelectedEnv(res.tapIndex);
      },
      fail(res) {
        console.log(res.errMsg);
      }
    });
  },

  onChangeSelectedEnv(index) {
    if (this.data.selectedEnv.envId === this.data.envList[index].envId) {
      return;
    }
    const powerList = this.data.powerList;
    powerList.forEach(i => {
      i.showItem = false;
    });
    this.setData({
      selectedEnv: this.data.envList[index],
      powerList,
      haveCreateCollection: false
    });
  },

  jumpPage(e) {
    wx.navigateTo({
      url: `/pages/${e.currentTarget.dataset.page}/index?envId=${this.data.selectedEnv.envId}`,
    });
  },

  onClickDatabase(powerList) {
    wx.showLoading({
      title: '',
    });
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      config: {
        env: this.data.selectedEnv.envId
      },
      data: {
        type: 'createCollection'
      }
    }).then((resp) => {
      if (resp.result.success) {
        this.setData({
          haveCreateCollection: true
        });
      }
      this.setData({
        powerList
      });
      wx.hideLoading();
    }).catch((e) => {
      console.log(e);
      this.setData({
        showUploadTip: true
      });
      wx.hideLoading();
    });
  }
});