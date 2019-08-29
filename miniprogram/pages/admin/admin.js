import Toast from 'vant-weapp/toast/toast';
import Dialog from 'vant-weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    mean: '',
    sex: 'Male',
    checked: true,
    title: '',
    decs: '',
    image: '',
    url: '',
    isbanner: true,
    ischeck: true,
    active: 0,
    questurl: '',
    searchList: [],
    nofound: false,
    activeName: '1',
    searchName: '',
    isSearch: false,
    show: false,
    radio: 'Male',
    editNameValue: '',
    editNameMean: '',
    nameid: '',
    actions: [{
      text: 'ءوشىرۋ',
      type: 'primary',
    }],
    comment: [],
    currentPage: 0, // 当前第几页,0代表第一页 
    pageSize: 20, //每页显示多少数据
    loadMore: false, //"上拉加载"的变量，默认false，隐藏  
    loadAll: false, //“没有数据”的变量，默认false，隐藏 
  },
  //单选
  onRadioChange(event) {
    this.setData({
      radio: event.detail
    });
  },

  onRadioClick(event) {
    const { name } = event.currentTarget.dataset;
    this.setData({
      radio: name
    });
  },
  onEditNameChange(e){
console.log(e.detail)
this.setData({
  editNameValue: e.detail
})
  },
  onEditMeanChange(e) {
    console.log(e.detail)
    this.setData({
      editNameMean: e.detail
    })
  },
  onConfirm(event) {
    let nameid = this.data.nameid;  
    let than = this;
    wx.cloud.database().collection('my_name').doc(nameid).update({
      data: {
        name: than.data.editNameValue,
        mean: than.data.editNameMean,
        sex: than.data.radio
      }
    })
      .then(res => {
        console.log(res)
        than.getSearchData();
      })
      .catch(console.error)
  },

  onClose() {
    this.setData({ close: false });
  },
  edit(e) {
    console.log("显示",e.target.dataset.nameid)
    let than = this;
    this.setData({
      show: true,
      nameid: e.target.dataset.nameid
    })

    wx.cloud.database().collection('my_name').doc(e.target.dataset.nameid).get().then(res => {
      console.log(res.data)
      than.setData({
        radio: res.data.sex,
        editNameValue: res.data.name,
        editNameMean: res.data.mean
      })
    })
  },
  delet(e) {
    let than = this;
    wx.cloud.database().collection('my_name').doc(e.target.dataset.nameid).remove()
      .then(res => {
        wx.showToast({
          title: '删除成功',
        });
        than.getSearchData();
      })
      .catch(console.error)
  },
  //展示框点击
  onnameChange(event) {
    this.setData({
      activeName: event.detail
    });
  },
  //搜索框输入值
  onMySearch(event) {
    let serchname = event.detail;
    this.setData({
      searchName: serchname.trim(),
      searchList: [],
      nofound: false,
    });
    if (this.data.searchName.length == 0) {
      this.setData({
        isSearch: false,
        nofound: false,
        searchList: []
      });
    } else {
      this.getSearchData();
    }
  },
  //搜索处理  
  getSearchData() {
    let that = this;
    this.setData({
      isSearch: true,
      searchList: []
    });
    //云数据的请求
    wx.cloud.database().collection("my_name").where({
      name: {
        $regex: '^' + that.data.searchName + '.*$',
        $options: 'i'
      }
    }).orderBy('name', 'asc').get().then(res => {

        if (res.data.length == 0) {
          that.setData({
            nofound: true
          });
        }

        Toast.clear();
        if (res.data && res.data.length > 0) {
          //把新请求到的数据添加到dataList里  
          let list = that.data.searchList.concat(res.data)
          that.setData({
            searchList: list
          });
        }
      }).catch(err => {
        Toast.clear();
        console.log("请求失败", err);
      })
  },
  //爬虫地址
  onGetUrChange(event) {
    // event.detail 为当前输入的值
    //console.log(event.detail);
    this.setData({
      questurl: event.detail
    })
  },
  //爬虫
  onGetBtnChange(event) {
    if (this.data.questurl == ''){
      wx.showToast({
        title: '请输入获取的地址',
        icon: 'info'
      })
    }else{
    //console.log(event.detail);
    var than = this;
    wx.request({
      url: 'https://www.sarmay.com/Small_Program_Specific/Crawl_Wechat_Articles.php', //仅为示例，并非真实的接口地址
      data: {
        url: than.data.questurl
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'GET',
      success(res) {
        console.log(res.data)
        let title = res.data.title;
        let desc = res.data.digest;
        let image = res.data.cover;
        let url = than.data.questurl;
        than.setData({
          title: title,
          decs: desc,
          image: image,
          url: url
        })
      }
    });
    }
  },
  //标签
  onTabChange(event) {
    if (event.detail.index + 1 == 4){
      this.getDeletData();
    }
  },
  //获取更多
  getmoreDelet(){
    this.getDeletData();
  },
  //获取删除数据
  getDeletData() {
    Toast.loading({
      mask: true,
      forbidClick: true,
      loadingType: 'spinner',
      duration: 0,
      message: 'اشىلۋدا ...'
    });
    let that = this;
    let currentPage = this.data.currentPage; // 当前第几页,0代表第一页 
    let pageSize = this.data.pageSize; //每页显示多少数据 
    //第一次加载数据
    if (currentPage == 1) {
      this.setData({
        loadMore: true, //把"上拉加载"的变量设为true，显示  
        loadAll: false //把“没有数据”设为false，隐藏  
      })
    }
    //云数据的请求
    wx.cloud.database().collection("comment")
      .orderBy('creatTime', 'asc').skip(currentPage * pageSize) //从第几个数据开始
      .limit(pageSize)
      .get({
        success(res) {
          Toast.clear();
          if (res.data && res.data.length > 0) {
            that.setData({
              currentPage: currentPage + 1
            });
            //把新请求到的数据添加到dataList里  
            let list = that.data.comment.concat(res.data)
            that.setData({
              comment: list, //获取数据数组    
              loadMore: false //把"上拉加载"的变量设为false，显示  
            });
            if (res.data.length < pageSize) {
              that.setData({
                loadMore: false, //隐藏加载中。。
                loadAll: true //所有数据都加载完了
              });
            }
          } else {
            that.setData({
              loadAll: true, //把“没有数据”设为true，显示  
              loadMore: false //把"上拉加载"的变量设为false，隐藏  
            });
          }
        },
        fail(res) {
          Toast.clear();
          console.log("请求失败", res)
          that.setData({
            loadAll: false,
            loadMore: false
          });
        }
      })
  },
  //删除评论
  onAction(e) {
    let than = this;
    let thisid = e.target.dataset.gid;
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

      wx.cloud.callFunction({
        name: 'delet',
        data: {
          id: thisid.trim()
        }
      }).then(res => {
          Dialog.close();
          Toast.success('ءوشىرىلدى');
        than.setData({
          comment: [], //获取数据数组
          currentPage: 0, // 当前第几页,0代表第一页 
          pageSize: 20, //每页显示多少数据
          loadMore: false, //"上拉加载"的变量，默认false，隐藏  
          loadAll: false //“没有数据”的变量，默认false，隐藏     
        });
        than.getDeletData();
        })
        .catch(console.error)
    }).catch(() => {
      Dialog.close();
    });
  },
  //名字输入框
  onNameChange(event) {
    this.setData({
      name: event.detail
    })
  },
  //含义输入框
  onMeanChange(event) {
    this.setData({
      mean: event.detail
    })
  },
//性别开关
  onChange(event) {
    // 需要手动对 checked 状态进行更新
    if (event.detail == true){
      let sex = 'Male';
      this.setData({ checked: event.detail, sex: sex });
    }else{
      let sex = 'Famale';
      this.setData({ checked: event.detail, sex: sex });
    }
    console.log(event.detail)
  },
  //标题输入框
  onTitleChange(event) {
    this.setData({
      title: event.detail
    })
  },
  //简介输入框
  onDecsChange(event) {
    this.setData({
      decs: event.detail
    })
  },
  //图片输入框
  onImageChange(event) {
    this.setData({
      image: event.detail
    })
  },
  //链接输入框
  onUrlChange(event) {
    this.setData({
      url: event.detail
    })
  },
  //轮播图开关
  onIscheckChange(event) {
    // 需要手动对 checked 状态进行更新
    if (event.detail == false) {
      let banner = false;
      this.setData({ ischeck: event.detail, isbanner: banner });
    } else {
      let banner = true;
      this.setData({ ischeck: event.detail, isbanner: banner });
    }
  },
  //添加新名字按钮
  sub() {
    let than = this;
    let name = this.data.name;
    let sex = this.data.sex;
    let mean = this.data.mean;
    const db = wx.cloud.database();
    if (name.trim() == ''){
      wx.showToast({
        title: '请输入名字'
      })
    }else{
      if (mean.trim() == '') {
        wx.showToast({
          title: '请输入意思',
        })
      }else{
        const db = wx.cloud.database()
        db.collection('my_name').where({
          name: name.trim() // 填入当前用户 openid
        }).get().then(res => {
          if (res.data.length<1){
            db.collection('my_name').add({
          // data 字段表示需新增的 JSON 数据
          data: {
            name: name.trim(),
            sex: sex,
            mean: mean
          }
        })
          .then(res => {
            wx.showToast({
              title: '添加成功！',
            })
            than.setData({
              name: '',
              mean: ''
            })
          })
          .catch(err => {
            wx.showToast({
              title: '失败',
            })
          })

          }else{
            wx.showToast({
              title: '这名字已存在',
            })
          }
        })
        
      }
    }
  },
  //添加广告按钮
  add() {
    var than = this;
    let title = this.data.title;
    let decs = this.data.decs;
    let image = this.data.image;
    let url = this.data.url;
    let banner = this.data.isbanner;
    const db = wx.cloud.database();
    if (title.trim() == '') {
      wx.showToast({
        title: '请输入标题'
      })
    } else {
      if (decs.trim() == '') {
        wx.showToast({
          title: '请输入简介'
        })
      } else {
        if (image.trim() == '') {
          wx.showToast({
            title: '请输入图片'
          })
        } else {
          if (url.trim() == '') {
            wx.showToast({
              title: '请输入链接'
            })
          } else {
            db.collection('News').add({
              // data 字段表示需新增的 JSON 数据
              data: {
                title: title.trim(),
                decs: decs.trim(),
                image: image.trim(),
                url: url.trim(),
                isbanner: banner
              }
            })
              .then(res => {
                than.setData({
                  title: '',
                  decs: '',
                  image: '',
                  url: '',
                  questurl: ''
                })
                wx.showToast({
                  title: '添加成功！',
                })
              })
              .catch(err => {
                wx.showToast({
                  title: '失败',
                })
              })
           }
         }
      }
      
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
      imageUrl: '/images/btshare.jpg'
    }
  }
})