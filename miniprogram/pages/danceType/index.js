// pages/danceType/index.js
const dance_type = ['韩舞', '街舞', '爵士舞', '芭蕾舞', '钢管舞']
const dance_type_img = ['hanwu.jpeg', 'jiewu.jpeg', 'jueshi.jpeg', 'balei.jpeg', 'gangguan.jpeg']
const dance_desc = [
  '一般韩国的流行舞统称为韩舞（K-POPDANCE），也会被称为K-POP或MV流行舞。',
  '来自美国纽约的嘻哈舞蹈。舞姿自由灵动，张扬青春个性。',
  '爵士舞（Jazz Dance），爵士舞是一种充满活力与创造性的个人即兴表演。',
  '芭蕾舞是一种欧洲古典舞蹈，孕育于意大利文艺复兴时期，十七世纪后半叶开始在法国发展流行并逐渐职业化，在不断革新中风靡世界。',
  '钢管舞（Pole dance），是利用钢管为道具，综合爵士舞、现代舞、民族舞、芭蕾舞、瑜伽、肚皮舞、拉丁舞等各种不同风格舞种，又集合杂技、艺术体操、健身类别的运动而衍生出来的新型舞蹈。'
]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dance_type_img,
    dance_type,
    dance_desc
  },
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
    wx.cloud.database().collection('teacher').orderBy('createTime', 'desc')
      .get()
      .then(res => {
        // console.log(Ttime.formatTime(res.data[0].createTime,'Y/M/D h:m:s'))
        const teacher_list = res.data
        const teacher_type_map = new Map()
        teacher_list.forEach(item => {
          for (let i = 0; i < item['tagList'].length; i++) {
            const teacher_type=item['tagList'][i]
            if (teacher_type_map.has(teacher_type)) {
              const temp_datas=teacher_type_map.get(teacher_type)
              temp_datas.push(item)
              teacher_type_map.set(teacher_type, temp_datas)
            }else{
              teacher_type_map.set(teacher_type, [item])
            }
          }
        })
        let teacher_type_list=Object.fromEntries(teacher_type_map);
        console.log(teacher_type_list)
        this.setData({
          teacher_list: res.data,
          teacher_type_list
        })
        console.log('数据库获取数据成功', res)
      })
      .catch(err => {
        console.log('数据库获取数据失败', err)
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