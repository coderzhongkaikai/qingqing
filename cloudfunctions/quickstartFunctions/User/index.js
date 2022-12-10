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
    updateTime,createTime,type,imgSrc,nickname,phone,_id
  }=event.data
  const {OPENID}=cloud.getWXContext()
  try {

    if (type == "create") {
      // await db.createCollection('activityInfo');
      // console.log(fileList)
      const result= await db.collection('User').add({
        // data 字段表示需新增的 JSON 数据
        data: {
        imgSrc,nickname,phone,
          createTime:createTime,
          updateTime:createTime,
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
      const result= await db.collection('User').doc(_id)
      .update({
        data:{
          imgSrc,nickname,phone,
          updateTime:updateTime,
        }
      })
      console.log(res)
      return {
        type:'update',
        data:result,
        success: true
      };
    }else if(type=='getItem'){
      const result= await db.collection('User').where({OPENID}).get()
      return {
        type:'getItem',
        data:result,
        success: true
      };
    } 

  
  } catch (e) {
    // 这里catch到的是该collection已经存在，从业务逻辑上来说是运行成功的，所以catch返回success给前端，避免工具在前端抛出异常
    return {
      success: true,
      data: 'create collection success'
    };
  }
};