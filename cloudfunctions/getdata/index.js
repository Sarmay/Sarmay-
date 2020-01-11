const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
exports.main = async (event, context) => {
  let table = event.table;
  return await db.collection(table).orderBy('cid', 'asc').get();
}