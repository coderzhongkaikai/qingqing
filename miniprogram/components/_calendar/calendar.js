// component/calendar/calendar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    spotMap: {
      //标点的日期
      type: Object,
      value: {},
    },
    defaultTime: {
      //标记的日期，默认为今日 注意：传入格式推荐为'2022/1/2'或'2022/01/02', 其他格式在ios系统上可能出现问题
      type: String,
      value: '',
    },
    title: {
      //标题
      type: String,
      value: '',
    },
    goNow: {
      // 是否有快速回到今天的功能
      type: Boolean,
      value: true,
    },
    defaultOpen: {
      // 是否是打开状态
      type: Boolean,
      value: false,
    },
    showShrink: {
      // 是否显示收缩展开功能
      type: Boolean,
      value: true,
    },
    disabledDate: {
      // 指定不可用日期
      type: Function,
      value: undefined,
    },
    changeTime: {
      // 要改变的日期
      type: String,
      value: '',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    date: '',
    show: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onDisplay() {
      this.setData({ show: true });
    },
    onClose() {
      this.setData({ show: false });
    },
    formatDate(date) {
      date = new Date(date);
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    },
    onConfirm(event) {
      console.log(event)
      this.setData({
        show: false,
        date: this.formatDate(event.detail),
      });
    },
 
  },
  lifetimes: {
    // 加载事件
    ready() {
      let now = this.data.defaultTime
        ? new Date(this.data.defaultTime)
        : new Date();
      let selectDay = {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
      };
      this.setData({
        nowDay: {
          year: now.getFullYear(),
          month: now.getMonth() + 1,
          day: now.getDate(),
        },
      });
     
    },
  },
  observers: {
    // 重新设置打开状态
    defaultOpen(value) {
      this.setData({
        open: value,
      });
    },
    // 切换日期
    changeTime(value) {
      // 检测切换日期
      if (!value) return;
      this.witchDate(new Date(value));
    },
  },
});
