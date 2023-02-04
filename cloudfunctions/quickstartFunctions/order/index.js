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
    teacher_id,
    yuyue_count,
    createTime,
  } = event.data
  const {
    OPENID
  } = cloud.getWXContext()
  const admin_openid = 'o2Xer4jdphCbl0VCj0X3QWK0Y0A4'


  if (type == 'add') {
    console.log(kebiao_id, yuyue_count)
    //创建order
    //创建时间，用户opened,kebiao_id,订单状态state 0 1 -1,预约时间yuyueTime
    // yuyue_count.indexOf(OPENID)
    const orderData = {
      kebiao_id,
      teacher_id,
      OPENID,
      // yuyueTime,
      state: 0,
      createTime: new Date().getTime()
    }
    await db.collection('order').add({
      data: orderData
    })
    await db.collection('kebiao').doc(kebiao_id)
      .update({
        data: {
          yuyue_count
        }
      })

    const kebiaoList = await db.collection('kebiao').aggregate().lookup({
      from: 'teacher',
      localField: 'teacher_id',
      foreignField: '_id',
      as: 'teacherInfo',
    }).match({
      _id: kebiao_id,
    }).end()
    const kebiao = kebiaoList.list[0]
    const userInfo=await db.collection('User').where({OPENID:OPENID}).get().then(res=>{
      console.log(res)
      return res.data[0]
    })
    console.log(kebiao)
    await cloud.openapi.subscribeMessage.send({
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
          "value": '预约时间' + kebiao['year'] + '年' + kebiao['month'] + '月' + kebiao['day'] + '日 ' + kebiao['startTime']
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
    //管理员的提示信息,
    await cloud.openapi.subscribeMessage.send({
      touser: OPENID,//admin_openid 替换成管理员
      // page: "pages/worksheet/worksheet?_id=" + tasks[m]._id,
      lang: 'zh_CN',
      data: {
        'name5': { // 预约人
          "value": '新学员预约'
        },
        'thing6': {//预约事项
          "value":  kebiao['teacherInfo'][0]['teacher_name']+'  '+kebiao['name_title']
        },
        'time10': {//预约时间
          "value":  kebiao['year'] + '年' + kebiao['month'] + '月' + kebiao['day'] + '日 ' + kebiao['startTime']
        },
        'phone_number18': {// 联系方式
          "value": userInfo['phone']
        },
        // 'character_string15': {
        //   "value": new Date().getTime()
        // },
        // 预约人
        // {{name5.DATA}}
        // 预约事项
        // {{thing6.DATA}}
        // 预约时间
        // {{time10.DATA}}
        // 联系方式
        // {{phone_number18.DATA}}
      },
      miniprogram_state: 'developer',
      templateId: '_GSz5hSJgyB9ZuE_UuVnHGijWnbzbH2qnfnExKsPAJg',
    })

    // return result
    return {
      type: 'add',
      // data: result,
      success: true
    };
  } else if (type == 'del') {
    try {
      // for (let i = 0; i < del_kebiao_id.length; i++) {
        console.log(kebiao_id)
        // let _id = del_kebiao_id[i]
        // await db.collection('order').where({kebiao_id}).remove()
        await db.collection('order').where({kebiao_id}).update({
          data: {
            state:-1
          }
        })

        await db.collection('kebiao').doc(kebiao_id).update({
          data: {
            yuyue_count 
          }
        })
        const kebiaoList = await db.collection('kebiao').aggregate().lookup({
          from: 'teacher',
          localField: 'teacher_id',
          foreignField: '_id',
          as: 'teacherInfo',
        }).match({
          _id: kebiao_id,
        }).end()
        const kebiao = kebiaoList.list[0]
        const userInfo=await db.collection('User').where({OPENID:OPENID}).get().then(res=>{
          console.log(res)
          return res.data[0]
        })
    //管理员的提示信息,
    await cloud.openapi.subscribeMessage.send({
      touser: OPENID,//admin_openid 替换成管理员
      // page: "pages/worksheet/worksheet?_id=" + tasks[m]._id,
      lang: 'zh_CN',
      data: {
        'name5': { // 预约人
          "value": '*取消预约'
          // "value": userInfo['OPENID']+'*取消预约'    太长了报错
        },
        'thing6': {//预约事项
          "value":  kebiao['teacherInfo'][0]['teacher_name']+'  '+kebiao['name_title']
        },
        'time10': {//预约时间
          "value":kebiao['year'] + '年' + kebiao['month'] + '月' + kebiao['day'] + '日 ' + kebiao['startTime']
        },
        'phone_number18': {// 联系方式
          "value": userInfo['phone']
        },
        // 预约人
        // {{name5.DATA}}
        // 预约事项
        // {{thing6.DATA}}
        // 预约时间
        // {{time10.DATA}}
        // 联系方式
        // {{phone_number18.DATA}}
      },
      miniprogram_state: 'developer',
      templateId: '_GSz5hSJgyB9ZuE_UuVnHGijWnbzbH2qnfnExKsPAJg',
    })
        //发送取消信息给管理员
      return {
        type: 'del',
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
  } else if (type == 'getlist') {
    try {
      let db_selectData
      if(OPENID==admin_openid){
        //是管理员查看全部
        db_selectData={}
      }else{
        //非管理员查看自己且状态存在
        db_selectData={
          OPENID,
          state:0
        }
      }
      let kebiao_ids
      await db.collection('order').where(db_selectData).get().then(async res => {
        console.log(res)
        kebiao_ids = res.data.map(item => {
          return item.kebiao_id
        })
        console.log(kebiao_ids)
      })
      console.log(kebiao_ids)

      const result = await db.collection('kebiao').aggregate().lookup({
          from: 'teacher',
          localField: 'teacher_id',
          foreignField: '_id',
          as: 'teacherInfo',
        }).match({
          _id: _.in(kebiao_ids)
          // _id: _.in(["f28436a263d7a4a3011f006d790d53e4", "4f1d421c63d7a4a3011a345c39e66ecf", "0ac4213c63d7a4a3011cbc97312456bc"])
        })
        .sort({
          timestamp:1
        })
        .end()
      return {
        type: 'getlist',
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

  } else if(type=='getlist_admin'){

   const result=await db.collection('order').aggregate().lookup({
      from: 'kebiao',
      localField: 'kebiao_id',
      foreignField: '_id',
      as: 'kebiao',
    })
    .lookup({
      from: 'teacher',
      localField: 'teacher_id',
      foreignField: '_id',
      as: 'teacherInfo',
    })
    .lookup({
      from: 'User',
      localField: 'OPENID',
      foreignField: 'OPENID',
      as: 'userInfo',
    })
    .end()

    return {
      type: 'getlist_admin',
      data: result,
      success: true
    };
  }else {
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
 


}