// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const MAX_LIMIT = 100
const wxContext = cloud.getWXContext()
const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate

// 云函数入口函数

exports.main = async (event, context) => {
  const {
    type,
    kebiao_id,
    yuyue_count,
    createTime,
  } = event.data
  const {
    OPENID
  } = cloud.getWXContext()
  const admin_openid = 'o2Xer4jdphCbl0VCj0X3QWK0Y0A4'
  

  if (type == 'add') {
    console.log(kebiao_id,yuyue_count)
    //创建order
    //创建时间，用户opened,kebiao_id,订单状态state 0 1 -1,预约时间yuyueTime
    // yuyue_count.indexOf(OPENID)
    const orderData={
      kebiao_id,
      OPENID,
      // yuyueTime,
      state:0,
      createTime:new Date().getTime()
    }
    await db.collection('order').add({
      data:orderData
    })
    const kebiaoList= await db.collection('kebiao').aggregate().lookup({
      from: 'teacher',
      localField: 'teacher_id',
      foreignField: '_id',
      as: 'teacherInfo',
    }).match({
      _id: kebiao_id,
    }).end()
    const kebiao=kebiaoList.list[0]
    console.log(kebiao)
    const result = await cloud.openapi.subscribeMessage.send({
    touser: OPENID,
    // page: "pages/worksheet/worksheet?_id=" + tasks[m]._id,
    lang: 'zh_CN',
    data: {
      'thing5': {
        "value": kebiao['name_title']
      },
      'thing6': {
        "value": '青青舞蹈室'
      },
      'thing8': {
        "value": '预约时间'+kebiao['year']+'年'+kebiao['month']+'月'+kebiao['day']+'日 ' +kebiao['startTime']
      },
      'name10': {
        "value": kebiao['teacherInfo'][0]['teacher_name']
      },
      'character_string15': {
        "value": new Date().getTime()
      },
      // {{thing5.DATA}}
      // 商家名称
      // {{thing6.DATA}}
      // 温馨提示
      // {{thing8.DATA}}
      // 预约老师
      // {{name10.DATA}}
      // 预约编号
      // {{character_string15.DATA}}
    },
    miniprogram_state: 'developer',
    templateId: 'F7ajuHC3waSw91_dN8HXcuuNLCjRcTfdESdb605okPc',
  })
  //管理员的提示信息


  // return result
      return  {
        type:'add',
        // data: result,
        success: true
      };
    //给kebiao添加对应的openID已表示记录
    
    // new_kebiao_data.map(item=>{
    //   item['teacher_id']=teacher_id,
    //   item['createTime']=createTime,
    //   item['OPENID']=OPENID
    // })
    // try {
    //   for(let i=0;i<new_kebiao_data.length;i++){
    //     console.log(new_kebiao_data[i])
    //       await db.collection('kebiao').add({
    //             data: new_kebiao_data[i]
    //           })
    //   }
    //   return  {
    //     type:'add',
    //     // data: result,
    //     success: true
    //   };
    // } catch (e) {
    //   console.log(e)
    //   return {
    //     type: '课表插入数据库错误',
    //     data: null,
    //     success: false
    //   };
    // }
 
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
    try {
      let kebiao_ids
      await db.collection('order').where({OPENID}).get().then(async res => {
          console.log(res)
         kebiao_ids=res.data.map(item=>{
            return item.kebiao_id
          })
          console.log(kebiao_ids)
      })
      console.log(kebiao_ids)
      const result= await db.collection('kebiao').aggregate().lookup({
        from: 'teacher',
        localField: 'teacher_id',
        foreignField: '_id',
        as: 'teacherInfo',
      }).match({
              _id: _.in(kebiao_ids)
              // _id: _.in(["f28436a263d7a4a3011f006d790d53e4", "4f1d421c63d7a4a3011a345c39e66ecf", "0ac4213c63d7a4a3011cbc97312456bc"])
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
  //     const date = new Date()
  //     const nowtime = (date.getHours()+8) * 100 + date.getMinutes()
  //     var timeform = ''
  //     console.log(nowtime)
  //     // 800 940  1200 1400 1540 1615 1750 1900 2040  
  //     if ( nowtime <= 940) {
  //        timeform = date.getDay() * 100 + 1
  //     } else if (nowtime <= 1200) {
  //        timeform = date.getDay() * 100 + 3
  //     } else if (nowtime <= 1540) {
  //        timeform = date.getDay() * 100 + 5
  //     } else if (nowtime <= 1750) {
  //        timeform = date.getDay() * 100 + 7
  //     } else if ( nowtime <= 2040) {
  //        timeform = date.getDay() * 100 + 9
  //     } else {
  //        timeform = date.getDay() * 100 + 11
  //     }

  //   console.log(timeform)
  //   // 先取出集合记录总数
  //   const countResult = await db.collection('work_sheet').count()
  //   console.log(countResult)
  //   const total = countResult.total
  //   // 计算需分几次取
  //   const batchTimes = Math.ceil(total / 100)
  //   // 承载所有读操作的 promise 的数组
  //   let tasks = []
  //   for (let i = 0; i < batchTimes; i++) {
  //     await db.collection('work_sheet').field({
  //       title: true,
  //       work_time: true,
  //     }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get().then(res => {
  //       console.log(res)
  //       tasks.push(...res.data)
  //     })
  //   }
  //   console.log(tasks)
  //  for(let m=0;m<tasks.length;m++){
  //   const content= tasks[m].work_time[timeform]
  //   if (content) {
  //     console.log(content.length)
  //     for (let i = 0; i < content.length; i++) {
  //       console.log(content[i].num)
  //       await db.collection('userinfo').where({
  //         studentnumber: content[i].num
  //       }).get().then(async res => {
  //         // console.log("++++++++++")
  //         console.log(res)
  //         const {
  //           _openid,
  //           _id
  //         } = res.data[0]
  //      if(_openid){
  //       //  console.log(_openid)
  //       //  console.log(_id)
  //       // console.log(tasks[m].title)
  //        try {
  //         const result = await cloud.openapi.subscribeMessage.send({
  //           touser: _openid,
  //           page: "pages/worksheet/worksheet?_id=" + tasks[m]._id,
  //           lang: 'zh_CN',
  //           data: {
  //             thing9:{
  //               "value": tasks[m].title
  //           },
  //             phrase1: {
  //               "value": '值班提醒'
  //           }, 
  //           },
  //           // miniprogram_state: 'developer',
  //           templateId: 'egvXpiy3NzFFfbQFCbWQ-D28zBLUtQVbkG6lkmIBubk',
  //         })
  //         return result
  //        } catch (e) {
  //          console.log(e)
  //        }

  //      }
  //       }).catch(e=>{
  //         console.log(e)
  //       })
  //     }
  //   }
  //  }

  // 等待所有


}