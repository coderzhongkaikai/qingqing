const getOpenId = require('./getOpenId/index');
// const getMiniProgramCode = require('./getMiniProgramCode/index');
// const createCollection = require('./createCollection/index');
// const selectRecord = require('./selectRecord/index');
// const updateRecord = require('./updateRecord/index');
// const sumRecord = require('./sumRecord/index');
const activityInfo = require('./activityInfo/index');
const kebiao= require('./kebiao/index');
const teacher=require('./teacher/index');
const otherSet=require('./otherSet/index');
const User=require('./User/index');
const order=require('./order/index')
// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'order':
    return await order.main(event, context);
    case 'User':
      return await User.main(event, context);
    case 'otherSet':
      return await otherSet.main(event, context);
    case 'teacher':
      return await teacher.main(event, context);
    case 'kebiao':
      return await kebiao.main(event, context);
    case 'activityInfo':
      return await activityInfo.main(event, context);
    case 'getOpenId':
      return await getOpenId.main(event, context);
    // case 'getMiniProgramCode':
    //   return await getMiniProgramCode.main(event, context);
    // case 'createCollection':
    //   return await createCollection.main(event, context);
    // case 'selectRecord':
    //   return await selectRecord.main(event, context);
    // case 'updateRecord':
    //   return await updateRecord.main(event, context);
    // case 'sumRecord':
    //   return await sumRecord.main(event, context);
  }
};
