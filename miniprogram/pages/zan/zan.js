// pages/zan/zan.js
import Toast from 'vant-weapp/toast/toast';
import Dialog from 'vant-weapp/dialog/dialog';
import Notify from 'vant-weapp/notify/notify';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickname: 'قولداعان اسىل جان',
    avatar: '../../images/default_avatar.png',
    open_id: '',
    money: 1,
    goodmanList: []
  },
  onClickLeft() {
    wx.navigateBack({
      delta: 1
    })
  },
  //生成时间戳
  tradeNo () {
    const now = new Date()
    const year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    let hour = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    String(month).length < 2 ? (month = Number("0" + month)) : month;
    String(day).length < 2 ? (day = Number("0" + day)) : day;
    String(hour).length < 2 ? (hour = Number("0" + hour)) : hour;
    String(minutes).length < 2 ? (minutes = Number("0" + minutes)) : minutes;
    String(seconds).length < 2 ? (seconds = Number("0" + seconds)) : seconds;
    const yyyyMMddHHmmss = `${year}${month}${day}${hour}${minutes}${seconds}`;
    return yyyyMMddHHmmss + '_' + Math.random().toString(36).substr(2, 9);
  },

  //赞赏按钮
  givegood (option) {
    this.setData({ money: option.target.dataset.mony});
    let mon = option.target.dataset.mony * 100;
    let that = this;
    wx.cloud.callFunction({
      name: "pay",
      data: {
        orderid: that.tradeNo(),
        money: mon
      },
      success(res) {
        //console.log("提交成功", res.result)
        that.pay(res.result);
      },
      fail(res) {
        //console.log("提交失败", res)
      }
    })
  },

  //实现小程序支付
  pay(payData) {
    let than = this;
    //官方标准的支付方法
    wx.requestPayment({
      timeStamp: payData.timeStamp,
      nonceStr: payData.nonceStr,
      package: payData.package, //统一下单接口返回的 prepay_id 格式如：prepay_id=***
      signType: 'MD5',
      paySign: payData.paySign, //签名
      success(res) {
       // console.log("支付成功", res)
        Toast.success('ءساتتى بولدى');
        Notify({
          text: 'ءبىزدى قولداعانىڭىزعا كوپ راحىمەت',
          duration: 10000,
          selector: '#custom-selector',
          backgroundColor: '#1989fa'
        });
        const db = wx.cloud.database()
        db.collection('give_money').where({
          _openid: than.data.open_id // 填入当前用户 openid
        }).get({
          success: function (res) {
            console.log(res)
            if (res.data.length > 0) {
              let havemoney = res.data[0].money;
              let myid = res.data[0]._id;
              let newmoney = Number(havemoney) + Number(than.data.money);
              db.collection('give_money').doc(myid).update({
                data: {
                  name: than.data.nickname,
                  image: than.data.avatar,
                  money: newmoney,
                  due: new Date()
                },
                success: function (res) {
                  //console.log(res);
                  than.getAllGoodMan();
                },
                fail: console.error
              });
            } else {
              db.collection('give_money').add({
                data: {
                  name: than.data.nickname,
                  image: than.data.avatar,
                  money: Number(than.data.money),
                  due: new Date()
                },
                success: function (res) {
                  //console.log(res)
                  than.getAllGoodMan();
                },
                fail: console.error
              });
            }
          }
        });
      },
      fail(res) {
        //console.log("支付失败", res)
        Toast.fail('ءساتسىز بولدى');
        Notify({
          text: 'ءبىزدى قولداۋىڭىز ءساتسىز بولدى',
          duration: 10000,
          selector: '#custom-selector',
          backgroundColor: '#1989fa'
        });
      }
    })

  },

  getUserDetailInfo() {
    let detailInfo = wx.getStorageSync('MyInfo');
    if (detailInfo.isLogin) {
      this.setData({
        nickname: detailInfo.nickName,
        avatar: detailInfo.imgurl,
        open_id: detailInfo.openid
      });
    } else {
      wx.setStorageSync('MyInfo', {});
    }
  },

  getAllGoodMan() {
    Toast.loading({
      mask: true,
      forbidClick: true,
      loadingType: 'spinner',
      duration: 0,
      message: 'اشىلۋدا ...'
    });
    let than = this;
    const db = wx.cloud.database()
    db.collection('give_money').orderBy('due', 'desc').get().then(res => {
     //console.log(res.data)
      than.setData({
        goodmanList: res.data
      });
      Toast.clear();
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserDetailInfo();
    this.getAllGoodMan();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: 'بالاعا ات قويۋ سەستاماسى',
      path: '/pages/athoyw/athoyw',
      imageUrl: '/images/btshare.jpg'
    }
  }
})