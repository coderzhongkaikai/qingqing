// components/haibao.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imgUrl: {
      //标点的日期
      type: Object,
      value: {},
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    imageHeight: 0,
    imageWidth: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    loadSuccess(e){
      console.log(e)
      const { detail: {width, height} } = e
      this.setData({
      imageWidth: width,
      imageHeight:height
      })
      },
      showImg(e){
        console.log(e)
        wx.previewImage({
          urls: [this.data.imgUrl.url],
          current:'',
          success:function(res){},
          fail:function(res){},
          complete:function(res){}
        })
      }
  },
  lifetimes: {
    // 加载事件
    ready() {
      console.log(this.data)
    },
  },
})
