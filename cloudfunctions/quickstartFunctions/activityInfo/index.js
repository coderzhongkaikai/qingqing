const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 创建集合云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  console.log(context)
  const  {
    fileList,beizhu,title,createTime,watch,type,content,_id
  }=event.data
  const {OPENID}=cloud.getWXContext()
  try {

    if (type == "create") {
      // await db.createCollection('activityInfo');
      // console.log(fileList)
      const result= await db.collection('activityInfo').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          fileList:fileList,
          beizhu:beizhu,
          title:title,
          content:content,
          createTime:createTime,
          watch:watch,
          OPENID:OPENID
        }
      });
      console.log(result)
      return {
        type:'create',
        data:result,
        success: true
      };
    }else if(type == "update"){
      const result= await db.collection('activityInfo').doc(_id)
      .update({
        data:{
          fileList,beizhu,title,content
        }
      })
      return {
        type:'update',
        data:result,
        success: true
      };
    }else if(type=='getItem'){
      const result= await db.collection('activityInfo').doc(_id).get()
      db.collection('activityInfo').doc(_id).update({
        data:{
          watch:result.data.watch+1
        }
      })
      return {
        type:'getItem',
        data:result,
        success: true
      };
    }else if(type=='delItem'){
      const result= await db.collection('activityInfo').doc(_id).remove()
      return {
        type:'delItem',
        data:result,
        success: true
      };
    }
    // 创建集合
    // await db.createCollection('sales');
    // await db.collection('activityInfo').add({
    //   // data 字段表示需新增的 JSON 数据
    //   data: {
    //     region: '华东',
    //     city: '上海',
    //     sales: 11
    //   }
    // });
    

  
  } catch (e) {
    // 这里catch到的是该collection已经存在，从业务逻辑上来说是运行成功的，所以catch返回success给前端，避免工具在前端抛出异常
    return {
      success: true,
      data: 'create collection success'
    };
  }
};