// pages/news/news.js
import Toast from 'vant-weapp/toast/toast';
import Dialog from 'vant-weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 'news',
    bannerdata: [],
    newsdata: [],
    jumpur: ''
  },

  //媒体按钮
  clickmedia(e) {
    let url = e.target.dataset.newsurl;
    wx.navigateTo({
      url: `../sarmay/sarmay?url=${url}`,
    })
  },
  getBannerData() {
    Toast.loading({
      mask: true,
      forbidClick: true,
      loadingType: 'spinner',
      duration: 0,
      message: 'جاڭالانۋدا ...'
    });
    let than = this;
    const db = wx.cloud.database()
    db.collection('News').where({
      isbanner: true
    }).orderBy('_id', 'desc').get().then(res => {
      than.setData({
        bannerdata: res.data
      });
      Toast.clear();
      //console.log(than.data.bannerdata)
      //Toast.success('ءوشىرىلدى');
    });
    db.collection('News').orderBy('_id', 'desc').get().then(res => {
      than.setData({
        newsdata: res.data
      });
      Toast.clear();
      //console.log(than.data.bannerdata)
      //Toast.success('ءوشىرىلدى');
    });
  },
  //按下方按钮
  onFootTabChange(event) {
    console.log(event.detail);
    if (event.detail == 'home') {
      wx.reLaunch({
        url: '../athoyw/athoyw'
      })
    }
    if (event.detail == 'mine') {
      wx.reLaunch({
        url: '../profile/profile'
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getBannerData();
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