// pages/mean/mean.js
import Toast from 'vant-weapp/toast/toast';
import Dialog from 'vant-weapp/dialog/dialog';
import { $wuxNotification } from 'wux-weapp'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    sex: '',
    mean: '', 
    evaluate:'',
    nameid:-1,
    iscolected: false,
    comment: [],
    username: '',
    userimg:'',
    open_id:'',
    hasLogin: false,
    actions: [{
      text: 'ءوشىرۋ',
      type: 'primary',
    }],
    myfocou: false
  },
//上方提示
  showNotificationPromise() {
    const hide = $wuxNotification().show({
      image: 'http://cdn.skyvow.cn/logo.png',
      title: 'سارماي تەحىنيكاسى',
      text: 'باعابەرۋ ورنى بوس بولسا بولمايدى',
      data: {
        message: '!'
      },
      duration: 3000,
    })
    hide.then(res => {
      this.setData({
        myfocou: true
      })
    })
  },
  //删除评论
  onAction(e) {
    let thisid = e.target.dataset.gid;
    let id = this.data.nameid;
    Dialog.alert({
      title: 'ەسكەرتۋ',
      message: 'جازعان كوزقاراسىڭىزدى وشىرەسىزبە ؟',
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
      wx.cloud.database().collection('comment').doc(thisid).remove()
        .then(res => {
          Dialog.close();
          Toast.success('ءوشىرىلدى');
          this.getAllCommen(id);
        })
        .catch(console.error)
    }).catch(() => {
      Dialog.close();
    });
  },

  //收藏
  colected() {

    let detailInfo = wx.getStorageSync('MyInfo');

    if (detailInfo.isLogin) {
      //插入数据
      let iscolected = !this.data.iscolected;
      this.setData({
        iscolected
      });

      if (iscolected) {
        Toast.success('ساقتالدى');
      } else {
        Toast.success('ءوشىرىلدى');
      }

      //查询数据
      const db = wx.cloud.database();
      let than = this;
      db.collection('colected').where({
        nameid: than.data.nameid
      }).get({
        success: function (res) {
          if (than.data.sex == 'Male'){
            var mysex = 'ەر';
          }else{
            var mysex = 'ايەل';
          }
          if (res.data.length == 0) {
            db.collection("colected").add({
              data: {
                name: than.data.name,
                sex: mysex,
                mean: than.data.mean,
                nameid: than.data.nameid,
                colected: iscolected,
                creatTime: than.getNowFormatDate()
              }
            }).then().catch(err => {
              console.log(err)
            });
          } else {
            let dataid = res.data[0]._id;
            db.collection('colected').doc(dataid).update({
              data: {
                colected: iscolected
              }
            }).then().catch(err => {
              console.log(err)
            });

          }
        }
      })
    } else {
      wx.setStorageSync('MyInfo', {});
      Dialog.alert({
        title: 'ەسكەرتۋ',
        message: 'تىركەلمەسەڭىز ەسىمدى ساقتاي المايسىز',
        confirmButtonText: 'جارايدى',
        showCancelButton: true,
        cancelButtonText: 'قالدىرۋ'
      }).then(() => {
        // on close
        wx.navigateTo({
          url: `../login/login`,
        });
      }).catch(() => {
        Dialog.close();
      });
    }
  },

  //评论
  onEvaluateChange(event) {
    this.setData({
      evaluate: event.detail
    });
  },

  //提交按钮
  submit: function(){
    let than = this;
    let id = this.data.nameid;
    let detailInfo = wx.getStorageSync('MyInfo');

    if (detailInfo.isLogin) {

      let evaluate = this.data.evaluate;


      if (!evaluate) {
        than.showNotificationPromise();
        //Toast('باعابەرۋ ورنى بوس بولسا بولمايدى');
        //Toast.success('باعابەرۋ ورنى بوس بولسا بولمايدى');

      } else {
        Toast.loading({
          mask: true,
          forbidClick: true,
          loadingType: 'spinner',
          duration: 0,
          message: 'جولدانۋدا ...'
        });

        //插入数据
        wx.cloud.database().collection("comment").add({
          data: {
            open_id: this.data.open_id,
            nameid: this.data.nameid,
            content: this.data.evaluate,
            username: this.data.username,
            userimg: this.data.userimg,
            creatTime: this.getNowFormatDate()
          }
        }).then(res => {
          than.setData({
            evaluate: ''
          });
          Toast.clear();
          Toast.success('ءساتتى بولدى');
          this.getAllCommen(id);
        }).catch(err => {

          Toast.clear();
          Toast.fail('قاتەلىك تۋىلدى');
          console.log(err)
        });
      }

    } else {
   wx.setStorageSync('MyInfo', {});
      Dialog.alert({
        title: 'ەسكەرتۋ',
        message: 'تىركەلمەسەڭىز كوزقاراس بىلدىرە المايسىز',
        confirmButtonText: 'جارايدى',
        showCancelButton: true,
        cancelButtonText: 'قالدىرۋ'
      }).then(() => {
        // on close
        wx.navigateTo({
          url: `../login/login`,
        });
      }).catch(() => {
        Dialog.close();
      });
    }
  },

  //获取当前时间,返回时间格式：2018-09-16 15:43:36
  getNowFormatDate: function () {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
      " " + date.getHours() + seperator2 + date.getMinutes() +
      seperator2 + date.getSeconds();
    return currentdate;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

//获取数据
    let id = options.nameid;
    this.setData({
      nameid: id
    });
    this.getNameMean(id);

    //判断是否登录

    let detailInfo = wx.getStorageSync('MyInfo');

    if (detailInfo.isLogin) {
      this.setData({
        username: detailInfo.nickName,
        userimg: detailInfo.imgurl,
        hasLogin: true,
        open_id: detailInfo.openid
      });
      //查询数据
      const db = wx.cloud.database();
      let than = this;
      db.collection('colected').where({
        nameid: this.data.nameid
      }).get({
        success: function (res) {
          let iscol = res.data[0].colected;
          if (res.data.length == 0) {
            console.log(res)
            this.setData({
              iscolected: iscol
            });
          } else {
            than.setData({
              iscolected: iscol
            });
          }
        }
      })
    } else {
    
      this.setData({
        iscolected: false
      });
    }

    this.getAllCommen(id);

  },

  getAllCommen: function (id){

    wx.cloud.database().collection("comment").where({
      nameid: id
    }).orderBy('creatTime', 'desc').get().then(res => {
      this.setData({
        comment: res.data,
      });
    }).catch(err => {
      //console.log(err)
    });

    //结束
  },

  getNameMean: function(id){
    Toast.loading({
      mask: true,
      forbidClick: true,
      loadingType: 'spinner',
      duration: 0,
      message: 'اشىلۋدا ...'
    });
    wx.cloud.database().collection("my_name").where({
       _id:id
    }).get().then(res => {
      this.setData({
        name: res.data[0].name, 
        sex: res.data[0].sex,
        mean: res.data[0].mean
      });
      Toast.clear();
      }).catch(err => {
        Toast.clear();
        console.log(err)
      });
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

  onClickLeft() {
    wx.navigateBack({
      delta: 2
    })
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
      path: `../mean/mean?nameid=${event.target.dataset.nameid}`,
      //imageUrl: '/images/btshare.jpg'
    }
  }
})