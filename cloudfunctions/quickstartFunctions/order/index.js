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
    new_kebiao_data,
    teacher_id,
    createTime,
    del_kebiao_id
  } = event.data
  const {
    OPENID
  } = cloud.getWXContext()
  const admin_openid = 'o2Xer4jdphCbl0VCj0X3QWK0Y0A4'
  const result = await cloud.openapi.subscribeMessage.send({
    touser: admin_openid,
    // page: "pages/worksheet/worksheet?_id=" + tasks[m]._id,
    lang: 'zh_CN',
    data: {
      'thing5': {
        "value": "tasks[m].title"
      },
      'thing6': {
        "value": '值sdfsdfsd醒'
      },
      'thing8': {
        "value": '值班提醒'
      },
      'name10': {
        "value": '值班提醒'
      },
      'character_string15': {
        "value": 'sdfafasfafdsafasfasdfasdf'
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
  return result
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