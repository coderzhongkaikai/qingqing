//excel云函数文件
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
//引入node-xlsx npm包文件，注意在新环境下需要npm install node-xlsx
var xlsx = require('node-xlsx');
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  console.log(context)
  const {
    type,
    new_kebiao_data,
    teacher_id,
    createTime,
  } = event.data
  const {
    OPENID
  } = cloud.getWXContext()
  if (type == 'add') {
    const result={
      new_kebiao_data,
      teacher_id,
      createTime,
    }
    return  {
      type:'add',
      data: result,
      success: true
    };
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
  function addfile(i) {
    db.collection("books").add({
      data: {
        title: files[0].data[i][0],
        jiesi: files[0].data[i][1],
        laiyuan: files[0].data[i][2],
        yujing: files[0].data[i][3],
        zaoju: files[0].data[i][4],
      }
    }).then(res => {
      i++
      if (i == files[0].data.length) {
        //循环结束删除上传的文件不占用云存储
        cloud.deleteFile({
          fileList: [fileID],
          success(res) {
            return console.log(res, '删除文件')
          },
        })
      } else {
        addfile(i)
      }
    })
  }
  //课程解析函数，将excel数据转化成数组对象 
  function files_data_parse(excel_data) {
    const data = excel_data[0]['data']
    const data_result = []
    //第一行是行头需要跳过。
    for (let i = 1; i < data.length; i++) {
      let item = {}
      item['teacher_id'] = data[i][0]
      item['type'] = data[i][1]
      item['name_title'] = data[i][2]
      item['year'] = data[i][3]
      item['month'] = data[i][4]
      item['day'] = data[i][5]
      item['time'] = data[i][6]
      item['yuyue_count'] = [7]
      data_result.push(item)
    }
    return data_result
  }
  //  addfile(1)


}