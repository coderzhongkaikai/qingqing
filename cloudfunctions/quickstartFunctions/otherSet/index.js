const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 创建集合云函数入口函数
exports.main = async (event, context) => {
  const  {
      type,content,_id,createTime
  }=event.data
  const {OPENID}=cloud.getWXContext()
  try {

    if (type == "notice") {
      const result= await db.collection('notice').add({
        data: {
          activityID:_id,
          content:content,
          createTime:createTime,
          OPENID:OPENID
        }
      });
      console.log(result)
      return {
        type:'notice',
        data:result,
        success: true
      };
    }else if(type == ""){
  
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