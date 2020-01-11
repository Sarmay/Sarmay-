const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
exports.main = async (event, context) => {
  let table = event.table;
  let id = event.id;
  try {
    return await db.collection(table).where({
      _id: id
    }).remove()
  } catch (e) {
    console.error(e)
  }
}