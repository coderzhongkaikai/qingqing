为什么excel的时间格式是这样：把时间粒度确定成最小，减小使用时候数据获取时的歧义。保证数据的准确

遇到的困难：
1.在获取详细页面的时候，刚开始是点击进入跳转后发送请求。修改成在发送前已经有了详细数据再跳转
2.在修改保存信息的时候，数据动态更新问题。最初只是通过修改页面数据时候保存的响应数据。修改成在每次修改信息后，立刻重新获取数据保证数据的准确性，且用户也察觉不到。
3.在设置时间格式的时候最初是Date格式，解析（年月日查询，当日上午下午区别）容易出错。修改成时间戳的格式。通过时间戳来对比获取相应数据。用时间戳的时候后端和前端的时区不一致造成的错误给自己造成一定的困扰。
4.设计课表的数据格式，要保证和老师数据表之间的耦合，且解析的时候能够被解析保证数据的准确性。特别是时间，确保程序通过日期查询的时候能够准确查询。

5.数据查找一般在服务端，数据过滤除了基本的过滤比如：类型选择，时间等。一般都是在前端进行。