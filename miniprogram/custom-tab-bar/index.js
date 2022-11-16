// pages/custom-tab-bar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
		active: 0,
		list: [
			{
				url: '/pages/TapPages/index/index'
			},
			{
				url:  '/pages/TapPages/center_index/index'
      },
      {
				url:'/pages/TapPages/r_index/index'
			}
		]
  },

  /**
   * 组件的方法列表
   */
  methods: {
		onChange(event) {
      console.log(event.detail)
			this.setData({ active: event.detail });
			wx.switchTab({
				url: this.data.list[event.detail].url
			});
		},

		init() {
      console.log('init')
      const page = getCurrentPages().pop();
      console.log(page.route)
      console.log(this.data.list)
      console.log(this.data.list.findIndex(item => item.url === `/${page.route}`))
			this.setData({
				active: this.data.list.findIndex(item => item.url === `/${page.route}`)
			});
		}
  }
})
