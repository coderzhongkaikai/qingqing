// component/calendar/calendar.js
const week_title = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
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
    weeks: [],
    days: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onDisplay() {
      console.log('onDisplay')
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
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    },
    onConfirm(event) {
      console.log(event)
      let date=event.detail
      let selectDay = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
      };
      this.setData({
        show: false,
        date: this.formatDate(date),
        selectDay:selectDay
      });
     
      this.getNearly7Day(date)
    },
    //返回当日
    back_now(){
      this.init_calendar()
    },
    // 一天被点击时
    selectChange(e) {
      const year = e.currentTarget.dataset.year;
      const month = e.currentTarget.dataset.month;
      const day = e.currentTarget.dataset.day;
      const selectDay = {
        year: year,
        month: month,
        day: day,
      };
      if (
        (this.data.selectDay.year !== year ||
          this.data.selectDay.month !== month)
      ) {
        console.log(day)
      //同年同月 day不一样就替换day
        this.setData(
          {
            ['selectDay.day']: day,
          },
          // () => {
          //   this.triggerEventSelectDay();
          // }
        );

      } else if (this.data.selectDay.day !== day) {
        console.log(day)

        //item.day不一样就替换整个selectDay
        this.setData({
            selectDay: selectDay,
          },
          // () => {
          //   this.triggerEventSelectDay();
          // }
        );
      }
    },
    getNearly7Day(date = new Date()) {
      // var date = new Date()
      this.data.weeks = week_title
      let days = []
      let ItemDays = []
      for (let i = 0; i <= 24 * 6; i += 24) {
        //今天加上前6天
        let dateItem = new Date(date.getTime() + i * 60 * 60 * 1000) //使用当天时间戳减去以前的时间毫秒（小时*分*秒*毫秒）
        // let y = dateItem.getFullYear() //获取年份
        // let m = dateItem.getMonth() + 1 //获取月份js月份从0开始，需要+1
        let d = dateItem.getDate() //获取日期
        // m = addDate0(m) //给为单数的月份补零
        // d = addDate0(d) //给为单数的日期补零
        // let valueItem = y + '-' + m + '-' + d //组合
        days.push(d) //添加至数组

        let ItemDay = {
          year: dateItem.getFullYear(),
          month: dateItem.getMonth() + 1,
          day: dateItem.getDate(),
        };
        ItemDays.push(ItemDay) //添加至数组
      }
      let d_week = date.getDay() //获取今天(第一天)是周几
      let weeks = this.data.weeks
      this.setData({
        days: days,
        ItemDays: ItemDays,
        weeks: weeks.slice(d_week - 1, weeks.length).concat(weeks.slice(0, d_week - 1))
      })
      console.log(days)
      console.log(this.data.weeks)


      // return days
    },
    init_calendar() {

      let now = this.data.defaultTime ?
        new Date(this.data.defaultTime) :
        new Date();
      let selectDay = {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
      };
      this.setData({
        nowDay: selectDay,
        selectDay: selectDay
      });
      // selectDay


      this.getNearly7Day(now)
    },
    //给日期加0
    addDate0(time) {
      if (time.toString().length == 1) {
        time = '0' + time.toString()
      }
      return time
    }
  },
  lifetimes: {
    // 加载事件
    ready() {
      this.init_calendar()
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