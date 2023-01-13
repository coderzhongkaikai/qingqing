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
    avarList,fileList,tagList,teacher_name,jianjie,createTime,type
  }=event.data
  const {OPENID}=cloud.getWXContext()
  try {

    if (type == "create") {
      // await db.createCollection('activityInfo');
      // console.log(fileList)
 
      const result= await db.collection('teacher').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          avarList,fileList,tagList,teacher_name,jianjie,
          createTime:createTime,
          OPENID:OPENID
        }
      });
      return {
        type:'create',
        data:result,
        success: true
      };
      console.log(result)
    }else if(type == "update"){
      const result= await db.collection('teacher').doc(_id)
      .update({
        data:{
          avarList,fileList,tagList,teacher_name,jianjie,
        }
      })
      return {
        type:'update',
        data:result,
        success: true
      };
    }
  } catch (e) {
    // 这里catch到的是该collection已经存在，从业务逻辑上来说是运行成功的，所以catch返回success给前端，避免工具在前端抛出异常
    return {
      success: true,
      data: 'create teacher success'
    };
  }
};