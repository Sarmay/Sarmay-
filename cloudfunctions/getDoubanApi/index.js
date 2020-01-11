// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

//引入request-promise用于做网络请求
let rp = require('request-promise');

// 云函数入口函数
exports.main = async (event, context) => {
  return await rp(event.url)
    .then(function (res) {
      return res
    })
    .catch(function (err) {
      return '失败'
    });
}