//云开发实现支付
const cloud = require('wx-server-sdk')
cloud.init()

//1，引入支付的三方依赖
const tenpay = require('tenpay');
//2，配置支付信息
const config = {
  appid: 'wx87dd7ce41ec6fcf5',
  mchid: '1518332771',
  partnerKey: 'sarmay115453e97507ef794cf7b0519d',
  notify_url: 'https://mp.weixin.qq.com/',
  spbill_create_ip: '127.0.0.1' //这里填这个就可以
};

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let {
    orderid,
    money
  } = event;
  //3，初始化支付
  const api = tenpay.init(config);

  let result = await api.getPayParams({
    out_trade_no: orderid,
    body: '赞赏Sarmay科技',
    total_fee: money, //订单金额(分),
    openid: wxContext.OPENID //付款用户的openid
  });
  return result;
}