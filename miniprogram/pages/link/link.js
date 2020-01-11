// pages/link/link.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    url: '',
    isOukai: 3
  },
  quit: function(){
    // 在页面中定义激励视频广告
    let videoAd = null
    // 在页面onLoad回调事件中创建激励视频广告实例
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-97ec54caae4922cb'
      })
      videoAd.onLoad(() => { })
      videoAd.onError((err) => { })
      videoAd.onClose((res) => { 
        // 用户点击了【关闭广告】按钮
        if (res && res.isEnded) {
          // 正常播放结束，可以下发游戏奖励
          this.setData({
            isOukai: 1
          })
        } else {
          // 播放中途退出，不下发游戏奖励
          this.setData({
            isOukai: 2
          })
        }
      })
    }

    // 用户触发广告后，显示激励视频广告
    if (videoAd) {
      videoAd.show().catch(() => {
        // 失败重试
        videoAd.load()
          .then(() => videoAd.show())
          .catch(err => {
            console.log('激励视频 广告显示失败')
          })
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let lid = options.lid;
    const db = wx.cloud.database();
    db.collection('list').where({
      _id: lid
    }).get().then(res => {
      console.log(res.data[0].url);
      this.setData({
        url: res.data[0].url
      });
    });

    // 在页面中定义激励视频广告
    let videoAd = null

    // 在页面onLoad回调事件中创建激励视频广告实例
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-99703698405f38b3'
      })
      videoAd.onLoad(() => { })
      videoAd.onError((err) => { })
      videoAd.onClose((res) => {
        // 用户点击了【关闭广告】按钮
        if (res && res.isEnded) {
          // 正常播放结束，可以下发游戏奖励
          this.setData({
            isOukai: 1
          })
        } else {
          // 播放中途退出，不下发游戏奖励
          this.setData({
            isOukai: 2
          })
        }
      })
    }

    // 用户触发广告后，显示激励视频广告
    if (videoAd) {
      videoAd.show().catch(() => {
        // 失败重试
        videoAd.load()
          .then(() => videoAd.show())
          .catch(err => {
            console.log('激励视频 广告显示失败')
          })
      })
    }

  }

})