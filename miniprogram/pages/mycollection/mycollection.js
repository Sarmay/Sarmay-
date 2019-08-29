// pages/mycollection/mycollection.js
import Toast from 'vant-weapp/toast/toast';
import Dialog from 'vant-weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickname:'',
    avatar:'',
    hasLogin:false,
    open_id:'',
    mycollection:[],
    activeName: '1'
  },
  onClickLeft() {
    // 在C页面内 navigateBack，将返回A页面
    wx.navigateBack({
      delta: 1
    })
  },
  onClickRight() {
    wx.reLaunch({
      url: '../athoyw/athoyw'
    });
  },
  //删除
  deleteCollection(e) {
    Dialog.alert({
      title: 'ەسكەرتۋ',
      message: 'ساقتاعان ەسىمىڭىزدى وشىرەسىزبە؟',
      confirmButtonText: 'ءوشىرۋ',
      showCancelButton: true,
      cancelButtonText: 'قالدىرۋ'
    }).then(() => {
      Toast.loading({
        mask: true,
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0,
        message: 'وشىرىلۋدە ...'
      });
      let ids = e.target.dataset.nameid;
      let than = this;
      const db = wx.cloud.database()
      db.collection('colected').doc(ids).remove()
        .then(res => {
          Dialog.close();
          Toast.success('ءوشىرىلدى');
          than.getMycollection();
          }).catch (console.error)
    }).catch(() => {
      Dialog.close();
    });
  },

  onCollectionChange(event){
    this.setData({
      activeName: event.detail
    });
  },

  getMycollection() {
    Toast.loading({
      mask: true,
      forbidClick: true,
      loadingType: 'spinner',
      duration: 0,
      message: 'جاڭالانۋدا ...'
    });
    let than = this;
    const db = wx.cloud.database()
    db.collection('colected').where({
      _openid: this.data.open_id,
      colected: true
    }).orderBy('creatTime', 'desc').get().then(res => {
  
      than.setData({
        mycollection: res.data
      });
      Toast.clear();
      //Toast.success('ءوشىرىلدى');
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
      let detailInfo = wx.getStorageSync('MyInfo');
      if (detailInfo.isLogin) {
        this.setData({
          nickname: detailInfo.nickName,
          avatar: detailInfo.imgurl,
          hasLogin: true,
          open_id: detailInfo.openid
        });
        this.getMycollection();
      } else {
        wx.setStorageSync('MyInfo', {});
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
      title: 'بالاعا ات قويۋ سەستاماسى',
      path: '/pages/athoyw/athoyw',
      //imageUrl: '/images/btshare.jpg'
    }
  }
  
})