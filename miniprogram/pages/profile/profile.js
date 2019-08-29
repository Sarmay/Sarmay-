import Toast from 'vant-weapp/toast/toast';
import Dialog from 'vant-weapp/dialog/dialog';

Page({

  data: {
    nickname: '',
    avatar: '../../images/default_avatar.png',
    hasLogin: false,
    open_id: '',
    active: 'mine',
    isAdmin: false

  },
  //赞赏
  zanshang() {
    if (this.data.hasLogin) {
      wx.navigateTo({
        url: '../zan/zan',
      })
    } else {
      Dialog.alert({
        title: 'ەسكەرتۋ',
        message: 'تىركەلمەسەڭىز قولداي المايسىز',
        confirmButtonText: 'تىركەلۋ',
        showCancelButton: true,
        cancelButtonText: 'قالدىرۋ'
      }).then(() => {
        Dialog.close();
        wx.navigateTo({
          url: `../login/login`,
        });
      }).catch(() => {
        Dialog.close();
      });
    }
  },
  //关于
  about() {
    wx.navigateTo({
      url: '../about/about',
    })
  },
  //管理员
  admins() {
    wx.navigateTo({
      url: '../admin/admin',
    })
  },

  //客服
  handleContact(e) {
    console.log(e.path)
    console.log(e.query)
  },

  //我的评论
  browsingHistory() {
    if (this.data.hasLogin) {
      wx.navigateTo({
        url: '../mymessage/mymessage',
      })
    } else {
      Dialog.alert({
        title: 'ەسكەرتۋ',
        message: 'تىركەلمەدىڭىز،تىركەلەسىز بە؟',
        confirmButtonText: 'تىركەلۋ',
        showCancelButton: true,
        cancelButtonText: 'قالدىرۋ'
      }).then(() => {
        Dialog.close();
        wx.navigateTo({
          url: `../login/login`,
        });
      }).catch(() => {
        Dialog.close();
      });
    }
  },
  //我的收藏
  attention() {
    if(this.data.hasLogin){
      wx.navigateTo({
        url: '../mycollection/mycollection',
      })
    }else{
      Dialog.alert({
        title: 'ەسكەرتۋ',
        message: 'تىركەلمەدىڭىز،تىركەلەسىز بە؟',
        confirmButtonText: 'تىركەلۋ',
        showCancelButton: true,
        cancelButtonText: 'قالدىرۋ'
      }).then(() => {
        Dialog.close();
        wx.navigateTo({
          url: `../login/login`,
        });
      }).catch(() => {
        Dialog.close();
      });
    }
  },
//退出登录
  logout() {
    if(this.data.hasLogin == true){
    Dialog.alert({
      title: 'ەسكەرتۋ',
      message: 'ساقتاي المايسىز،كوزقاراس بىلدىرە المايسىز،شەگىنەسىزبە؟',
      confirmButtonText: 'شەگىنەمىن',
      showCancelButton: true,
      cancelButtonText: 'قالدىرۋ'
    }).then(() => {
      Dialog.close();
      let than = this;
      wx.removeStorage({
        key: 'MyInfo',
        success(res) {
          than.setData({
            hasLogin: false,
            isAdmin: false
          });
        }
      });
    }).catch(() => {
      Dialog.close();
    });
    }
  },
  //按下方按钮
  onFootTabChange(event) {
    console.log(event.detail);
    if (event.detail == 'home') {
      wx.reLaunch({
        url: '../athoyw/athoyw'
      })
    }
    if (event.detail == 'news') {
      wx.reLaunch({
        url: '../news/news'
      })
    }
  },

  getUserDetailInfo() {
    let detailInfo = wx.getStorageSync('MyInfo');
    if (detailInfo.isLogin) {
      this.setData({
        nickname: detailInfo.nickName,
        avatar: detailInfo.imgurl,
        hasLogin: true,
        open_id: detailInfo.openid
      });
    } else {
      wx.setStorageSync('MyInfo', {});
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserDetailInfo();
    let me = this.data.open_id;
    if (me == 'otMea5bj_eQRY_18i2qa7p8hapSg') {
      this.setData({
        isAdmin: true
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return {
      title: 'بالاعا ات قويۋ سەستاماسى',
      path: '/pages/athoyw/athoyw',
      imageUrl: '/images/btshare.jpg'
    }
  }
})