//excel云函数文件
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
//引入node-xlsx npm包文件，注意在新环境下需要npm install node-xlsx
var xlsx = require('node-xlsx');
const db = cloud.database()
const _ = db.command     //引用指令
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  console.log(context)
  const {
    type,
    new_kebiao_data,
    teacher_id,
    createTime,
    selectData,
    del_kebiao_id
  } = event.data
  const {
    OPENID
  } = cloud.getWXContext()
  if (type == 'add') {
    new_kebiao_data.map(item=>{
      item['teacher_id']=teacher_id,
      item['createTime']=createTime,
      item['OPENID']=OPENID
    })
    try {
      for(let i=0;i<new_kebiao_data.length;i++){
        console.log(new_kebiao_data[i])
          await db.collection('kebiao').add({
                data: new_kebiao_data[i]
              })
      }
      return  {
        type:'add',
        // data: result,
        success: true
      };
    } catch (e) {
      console.log(e)
      return {
        type: '课表插入数据库错误',
        data: null,
        success: false
      };
    }
 
  }else if(type == 'del'){
    try {
      for(let i=0;i<del_kebiao_id.length;i++){
        console.log(del_kebiao_id[i])
        let _id=del_kebiao_id[i]
        await db.collection('kebiao').doc(_id).remove()
      }
      return  {
        type:'del',
        // data: result,
        success: true
      };
    } catch (e) {
      console.log(e)
      return {
        type: '课表删除数据库错误',
        data: null,
        success: false
      };
    }
  }else if (type == 'getlist') {
    console.log(selectData)
    const {dance_type, timestamp,year,month,day}=selectData
    console.log(dance_type)
    console.log(timestamp)
    // new Date(1675510200000).getDate()
    //new Date(1675510200000).getMonth()  +1
    //new Date().getFullYear()
    //因为根据timestamp，服务器和客户端的时区不一样，导致可能有错，所以年月日也通过客户端传送
    // let year=new Date(timestamp).getFullYear()
    // let month=new Date(timestamp).getMonth()  +1
    // let day=new Date(timestamp).getDate()

    console.log(year)
    console.log(month)
    console.log(day)

    try {
      const result= await db.collection('kebiao').aggregate().lookup({
            from: 'teacher',
            localField: 'teacher_id',
            foreignField: '_id',
            as: 'teacherInfo',
          }).match({
            year:year,
            month:month,
            day:day,
            timestamp: _.gte(timestamp),
            type: dance_type,
          }).end()
      return  {
        type:'getlist',
        data: result,
        success: true
      };
    } catch (e) {
      console.log(e)
      return {
        type: '错误',
        data: null,
        success: false
      };
    }
 
  } else {
    try {
      let {
        fileID
      } = event.data
      //1,通过fileID下载云存储里的excel文件
      const res = await cloud.downloadFile({
        fileID: fileID,
      })
      console.log('下载的文件', res);
      const file_xlsx = res.fileContent
      //2,解析excel文件里的数据
      var files = xlsx.parse(file_xlsx); //获取到已经解析的对象数组（下面我会出返回的代码结构，以及我的excel文件内容）
      console.log('获得内容表格数组', files); //files[0].data里面就是我们的内容数组（以上直接复制即可）
      result = files_data_parse(files)
      return {
        // type:'u',
        data: result,
        success: true
      };
    } catch (e) {
      return {
        type: '课表解析错误',
        data: null,
        success: false
      };
    }
  }



  //下面就是我通过将这个数组files[0].data使用回调函数进行循环一行一行内容添加到云数据库中
  //可以先用随便定义一个变量  arr=files[0].data,我懒得改了就做操作了。 
  
  //课程解析函数，将excel数据转化成数组对象 
  function files_data_parse(excel_data) {
    const data = excel_data[0]['data']
    const data_result = []
    console.log(data)
    //第一行是行头需要跳过。
    for (let i = 1; i < data.length; i++) {
      let item = {}
      item['teacher_id'] = data[i][0]?data[i][0]:''
      item['type_id'] = data[i][1]?data[i][1]:''
      item['type'] = data[i][2]?data[i][2]:''
      item['name_title'] = data[i][3]?data[i][3]:''
      item['detail']=data[i][4]?data[i][4]:''
      item['year'] = data[i][5]?data[i][5]:''
      item['month'] = data[i][6]?data[i][6]:''
      item['day'] = data[i][7]?data[i][7]:''
      item['startTime'] =  data[i][8]?data[i][8]:''
      item['endTime'] = data[i][9]?data[i][9]:''
      item['yuyue_count'] = []//存放预约用户的id
      //new Date('2018/08/09 10:10').getTime()
      let timestamp=item['year']+'/'+item['month']+'/'+item['day']+' '+item['startTime']
      item['timestamp']=new Date(timestamp).getTime()
      data_result.push(item)
    }
    return data_result
  }

}