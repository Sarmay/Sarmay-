var app = getApp() //全局APP
Page({
  data: {
  },
  onClickLeft() {
    wx.navigateBack({
      delta: 1
    })
  },
  //页面加载处理
  onLoad: function () {

  },
  handleRefuse() {
    wx.showToast({
      title: 'تىركەلمەدىڭىز',
      icon: 'none',
      duration: 1000
    })
    setTimeout(() => {
      wx.navigateBack(-1)
    }, 1000)
  },
  getUserInfo: function (e) {
    var page = this
    if (e.detail.errMsg == 'getUserInfo:fail auth deny') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权',
        success: function (res) { }
      })
    } else {
      //获取用户openid
      wx.cloud.callFunction({
        name: 'login',
        complete: res => {

          wx.reLaunch({
            url: `../profile/profile`
          });
    
          //开始储存
          let name = e.detail.userInfo.nickName;
          let imgurl = e.detail.userInfo.avatarUrl;
          let open_id = res.result.openid;
          console.log(open_id)
          let myInfo = { "nickName": name, "imgurl": imgurl, "openid": open_id, "isLogin": true };
          wx.setStorage({
            key: 'MyInfo',
            data: myInfo,
          });
          //结束
        }
      })
    }
  },
  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function () {
    return {
      title: 'بالاعا ات قويۋ سەستاماسى',
      path: '/pages/athoyw/athoyw',
      //imageUrl: '/images/btshare.jpg'
    }
  }

})
