//excel云函数文件
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
//引入node-xlsx文件
var xlsx = require('node-xlsx');
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

  //  let fileID = event.fileID
   let {fileID}=event.data
    //1,通过fileID下载云存储里的excel文件
    const res = await cloud.downloadFile({
        fileID: fileID,
    })
    console.log('下载的文件',res);
    const file_xlsx = res.fileContent
    //2,解析excel文件里的数据
    var files = xlsx.parse(file_xlsx); //获取到已经解析的对象数组（下面我会出返回的代码结构，以及我的excel文件内容）
   console.log('获得内容表格数组',files); //files[0].data里面就是我们的内容数组（以上直接复制即可）
   
  
  //下面就是我通过将这个数组files[0].data使用回调函数进行循环一行一行内容添加到云数据库中
  //可以先用随便定义一个变量  arr=files[0].data,我懒得改了就做操作了。 
    function addfile(i){
        db.collection("books").add({
            data:{
             title:files[0].data[i][0],
             jiesi:files[0].data[i][1],
             laiyuan:files[0].data[i][2],
             yujing:files[0].data[i][3],
             zaoju:files[0].data[i][4],
         
            }
            }).then(res=>{
                i++
                if(i==files[0].data.length){
                //循环结束删除上传的文件不占用云存储
                    cloud.deleteFile({
                        fileList:[fileID],
                        success(res){
                            return  console.log(res,'删除文件')
                        },
                      })    
                }else{
                    addfile(i)
                }
            })
   }
  //  addfile(1)
   

}
