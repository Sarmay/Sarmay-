// pages/sarmay/sarmay.js
let rewardedVideoAd = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    show: false,
    url: ''
  },
  onClickLeft() {
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.createRewardedVideoAd) {
      // 加载激励视频广告
      rewardedVideoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-c53d2c640b6943f6'
      })
      //加载成功
      rewardedVideoAd.onLoad(() => {
        console.log('视频广告加载成功')
      })
      //捕捉错误
      rewardedVideoAd.onError((err) => {
        console.log('onError event emit', err)
      })
      // 监听关闭
      rewardedVideoAd.onClose(res => {
        // 用户点击了【关闭广告】按钮
        if (res && res.isEnded) {
          // 正常播放结束，可以下发游戏奖励
          let url = options.url;
          //console.log(options)
          this.setData({
            show: true,
            url: url
          });
        } else {
          // 播放中途退出，不下发游戏奖励
          this.setData({
            loading: false
          })
        }
      })
    }
    // 在合适的位置打开广告
    if (rewardedVideoAd) {
      rewardedVideoAd.show().catch(err => {
        // 失败重试
        rewardedVideoAd.load()
          .then(() => rewardedVideoAd.show())
      })
    }

    //rewardedVideoAd.destroy();
  },

  loadad(){
    if (rewardedVideoAd) {
      rewardedVideoAd.show().catch(err => {
        // 失败重试
        rewardedVideoAd.load()
          .then(() => rewardedVideoAd.show())
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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
      title: 'Sarmay科技IT',
      path: '/pages/athoyw/athoyw',
      imageUrl: '/images/btshare.jpg'
    }
  }
})