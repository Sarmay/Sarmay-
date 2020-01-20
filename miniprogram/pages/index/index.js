// miniprogram/pages/index/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: '',
    slider: [{
        picUrl: '/images/banner1.jpg'
      },
      {
        picUrl: '/images/banner2.jpg'
      },
      {
        picUrl: '/images/banner3.jpg'
      },
      {
        picUrl: '/images/banner4.jpg'
      }
    ],

    navBarHeight: app.globalData.navHeight,
    windowHeight: "",
    windowWidth: "",
    swiperCurrent: 0,
    autoplay: true,
    interval: 5000,
    duration: 500,
    windowWidth: wx.getSystemInfoSync().windowWidth
  },
  //////
  swiperClick(e) {
    this.setData({
      swiperCurrent: e.currentTarget.dataset.i
    })
    //console.log(e.currentTarget.dataset.i)
  },
  swiperChange: function(e) {
    //console.log(e.detail.current)
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  /**
   * 点击分类
   */
  onArticalCarClick(event) {
    wx.showToast({
      title: `${event.detail}`,
      icon: 'none'
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})