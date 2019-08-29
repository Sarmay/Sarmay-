const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
  let { id } = event
  try {
    return await db.collection('comment').where({
      _id: id
    }).remove()
  } catch (e) {
    console.error(e)
  }
}