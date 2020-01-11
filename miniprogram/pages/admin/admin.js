// pages/admin/admin.js
//oEgRa5PG4Gi94G8UOYs-CpwsBDfU
import Toast from 'vant-weapp/toast/toast';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    scrollLeft: 0,
    tabNav: [
      'تەلە-فيلىم قوسۋ',
      'كينو ايدارشاسىن قوسۋ', 
      'اڭگىمە قوسۋ',
      'اڭگىمە ايدارشاسىن قوسۋ',
      'تەلە-فيلىم ءوشىرۋ',
      'كينو ايدارشاسىن ءوشىرۋ',
      'اڭگىمە ءوشىرۋ',
      'اڭگىمە ايدارشاسىن ءوشىرۋ'
      ],
    url: '',//请求地址
    index: null,
    index2: null,
    picker: [],
    storyPicker: [],
    cid: '',
    title: '',
    image: '',
    isBanner: false,
    modalName: null,
    modalcontent: '',
    newcid: '',
    deletVideoList: [],
    deletVideoColumn: [],
    deletStoryList: [],
    deletStoryColumn: [],
    loadVideColumnAll: false //加载更多栏目
  },
  //隐藏提示框
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  clearAll(){
    this.setData({
      url:"",
      index: null,
      index2: null,
      cid: '',
      title: '',
      image: '',
      isBanner: false
    });
  },
  //删除故事栏目
  deletStoryColumn(e) {
    let that = this;
    let myid = e.target.dataset.id;
    wx.cloud.callFunction({
      name: 'remove',
      data: {
        table: 'readcolumn',
        id: myid
      }, success: function (res) {
        console.log(res);
        that.getDeletStoryColumn();
        Toast.success('删除成功');
      }, fail: function (res) {
        console.log(res)
      }
    });
  },
  //删除故事列表
  deletStoryList(e) {
    let that = this;
    let myid = e.target.dataset.id;
    wx.cloud.callFunction({
      name: 'remove',
      data: {
        table: 'readlist',
        id: myid
      }, success: function (res) {
        console.log(res);
        that.getDeletStoryList();
        Toast.success('删除成功');      
      }, fail: function (res) {
        console.log(res)
      }
    });
  },
  //删除电影栏目
  deletVideoColumn(e) {
    let that = this;
    let myid = e.target.dataset.id;
    wx.cloud.callFunction({
      name: 'remove',
      data: {
        table: 'column',
        id: myid
      }, success: function (res) {
        console.log(res);
        that.getDeletVideoColumn();
        Toast.success('删除成功');
      }, fail: function (res) {
        console.log(res)
      }
    });
  },
  //删除电影列表
  deletVideoList(e) {
    let that = this;
    let myid = e.target.dataset.id;
    wx.cloud.callFunction({
      name: 'remove',
      data: {
        table: 'list',
        id: myid
      }, success: function (res) {
        console.log(res);
        that.getDeletVideoList();
        Toast.success('删除成功');
      }, fail: function (res) {
        console.log(res)
      }
    });
  },
  //添加故事栏目
  submitStoryColumn(e){
    let that = this;
    let nid;
    wx.cloud.database().collection('readcolumn').orderBy('cid', 'desc').get().then(res => {
      if (res.data.length == 0) {
        nid = 1;
      } else {
        nid = Number(res.data[0].cid + 1);
      }

      wx.cloud.database().collection('readcolumn').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          cid: nid,
          cimg: that.data.image,
          cname: that.data.title,
          time: new Date()
        }
      })
        .then(res => {
          console.log(res);
          Toast.success('添加成功');
          that.clearAll();
        })
        .catch(console.error);

    });
  },
  //添加故事
  submitStoryMsg(e) {
    if (this.data.url === '') {
      this.setData({
        modalName: e.currentTarget.dataset.target,
        modalcontent: 'جالعانىمى'
      });
    } else if (this.data.cid === '') {
      this.setData({
        modalName: e.currentTarget.dataset.target,
        modalcontent: 'ايدارشا'
      });
    } else if (this.data.title === '') {
      this.setData({
        modalName: e.currentTarget.dataset.target,
        modalcontent: 'تاقىرىبى'
      });
    } else if (this.data.image === '') {
      this.setData({
        modalName: e.currentTarget.dataset.target,
        modalcontent: 'راسىمىنىڭ جالعانىمى'
      });
    } else {
      let that = this;
      wx.cloud.database().collection('readlist').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          cid: that.data.cid,
          cimg: that.data.image,
          cname: that.data.title,
          time: new Date(),
          url: that.data.url,
        }
      })
        .then(res => {
          console.log(res);
          Toast.success('添加成功');
          that.clearAll();
        })
        .catch(console.error);
      //end    
    }
  },
  //新建电视剧栏目
  submitColumn(e) {
      let that=this;
      let nid;
      wx.cloud.database().collection('column').orderBy('cid', 'desc').get().then(res => {
        //console.log(res.data)
        if (res.data.length == 0){
          nid = 1;
        }else{
          nid = Number(res.data[0].cid + 1);
        }
        

        wx.cloud.database().collection('column').add({
          // data 字段表示需新增的 JSON 数据
          data: {
            cid: nid,
            cimg: that.data.image,
            cname: that.data.title,
            time: new Date(),
            isBanner: that.data.isBanner
          }
        })
          .then(res => {
            console.log(res);
            Toast.success('添加成功');
            that.clearAll();
          })
          .catch(console.error);

      });
  },
  //提交添加列表信息
  submitMsg(e) {
    if(this.data.url === ''){
      this.setData({
        modalName: e.currentTarget.dataset.target,
        modalcontent: 'جالعانىمى'
      });
    } else if (this.data.cid === ''){
      this.setData({
        modalName: e.currentTarget.dataset.target,
        modalcontent: 'ايدارشا'
      });
    } else if (this.data.title === ''){
      this.setData({
        modalName: e.currentTarget.dataset.target,
        modalcontent: 'تاقىرىبى'
      });
    } else if (this.data.image === ''){
      this.setData({
        modalName: e.currentTarget.dataset.target,
        modalcontent: 'راسىمىنىڭ جالعانىمى'
      });
    }else{
      let that=this;
        wx.cloud.database().collection('list').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          cid: that.data.cid,
          cimg: that.data.image,
          cname: that.data.title,
          time: new Date(),
          url: that.data.url,
        }
      })
        .then(res => {
          console.log(res);
          Toast.success('添加成功');
          that.clearAll();
        })
        .catch(console.error);
        //end    
    }
  },
  //输入获取的url
  inputUrl(e) {
    //console.log(e.detail.value);
    this.setData({
      url: e.detail.value
    });
  },
  //输入获取的url
  inputTitle(e) {
    //console.log(e.detail.value);
    this.setData({
      title: e.detail.value
    });
  },
  //输入获取的url
  inputImg(e) {
    console.log(e.detail.value);
    this.setData({
      image: e.detail.value
    });
  },
  //标签更改
  tabSelect(e) {
    let pid = e.currentTarget.dataset.id;
    console.log(pid);
    //添加kino列表
    if (pid == 1) {
      this.getVideoColumn();
    }
    //添加angeme模块
    if(pid==2){
      this.getStoryColumn();
    }
    //获取kino列表
    if (pid == 4) {
      this.getDeletVideoList();
    }
    //获取kino栏目
    if (pid == 5) {
      this.getDeletVideoColumn();
    }
    //获取angeme列表
    if (pid == 6) {
      this.getDeletStoryList();
    }
    //获取angeme栏目
    if (pid == 7) {
      this.getDeletStoryColumn();
    }
  
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    });
    this.clearAll();
  },
  //栏目kino选择器
  PickerKinoChange(e) {
    //获取kino栏目
    wx.cloud.callFunction({
      name: 'getalldata',
      data: {
        table: 'column'
      }
    }).then(res => {
      let id = res.result.data[Number(e.detail.value)].cid;
      console.log("当前Kino-CID：",id)
      this.setData({
        index: e.detail.value,
        cid: String(id)
      });
    });
  },
  //栏目kino选择器
  PickerStoryChange(e) {
    //获取kino栏目
    wx.cloud.callFunction({
      name: 'getalldata',
      data: {
        table: 'readcolumn'
      }
    }).then(res => {
      let id = res.result.data[Number(e.detail.value)].cid;
      console.log("当前Story-CID：", id)
      this.setData({
        index2: e.detail.value,
        cid: String(id)
      });
    });
  },
  //轮播图开关
  BannerChange(e) {
    console.log('是否轮播图',e.detail.value);
    this.setData({
      isBanner: e.detail.value
    });
  },
  //获取地址
  getMsg(e){
    if (this.data.url === '') {
      this.setData({
        modalName: e.currentTarget.dataset.target,
        modalcontent: 'جالعانىمى'
      });
    } else {
      //console.log(event.detail);
      var than = this;
      wx.request({
        url: 'https://www.sarmay.com/Small_Program_Specific/Crawl_Wechat_Articles.php',
        data: {
          url: than.data.url
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'GET',
        success(res) {
          Toast.success('获取成功');
          console.log(res.data)
          let title = res.data.title;
          let image = res.data.cover;
          than.setData({
            title: title,
            image: image
          });
        }
      });
    }
  },
  getVideoColumn(){
    //获取kino栏目
    wx.cloud.callFunction({
      name: 'getalldata',
      data: {
        table: 'column'
      }
    }).then(res => {
      console.log(res.result.data);
      if (res.result.errMsg == 0) {
        this.setData({
          picker: []
        });
      } else {
        this.setData({
          picker: res.result.data
        });
      }
      }).catch(err => {
        console.log(err)
      });
  },
  getStoryColumn(){
    //获取angeme栏目
    wx.cloud.callFunction({
      name: 'getalldata',
      data: {
        table: 'readcolumn'
      }
    }).then(res => {
      console.log(res.result.data);
      if (res.result.errMsg == 0) {
        this.setData({
          storyPicker: []
        });
      } else {
        this.setData({
          storyPicker: res.result.data
        });
      }
      }).catch(err => {
        console.log(err)
      });
  },
  getDeletVideoList(){
    //获取kino列表
    wx.cloud.callFunction({
      name: 'getalldata',
      data: {
        table: 'list'
      }
    }).then(res => {
      console.log(res.result.data);
      if (res.result.errMsg == 0) {
        this.setData({
          deletVideoList: []
        });
      } else {
        this.setData({
          deletVideoList: res.result.data
        });
      }
      }).catch(err => {
        console.log(err)
      });
  },
  getDeletVideoColumn() {
    //获取kino列表
    wx.cloud.callFunction({
      name: 'getalldata',
      data: {
        table: 'column'
      }
    }).then(res => {
      console.log(res.result.data);
      if (res.result.errMsg == 0) {
        this.setData({
          deletVideoColumn: []
        });
      } else {
        this.setData({
          deletVideoColumn: res.result.data
        });
      }

      }).catch(err => {
        console.log(err)
      });
  },
  getDeletStoryList(){
    //获取angeme列表
    wx.cloud.callFunction({
      name: 'getalldata',
      data: {
        table: 'readlist'
      }
    }).then(res => {
      console.log(res);
      if (res.result.errMsg==0){
        this.setData({
          deletStoryList: []
        });
      }else{
        this.setData({
          deletStoryList: res.result.data
        });
      }
      }).catch(err => {
        console.log(err)
      });
  },
  getDeletStoryColumn() {
    //获取angeme栏目
    wx.cloud.callFunction({
      name: 'getalldata',
      data: {
        table: 'readcolumn'
      }
    }).then(res => {
      console.log(res.result.data);
      if (res.result.errMsg == 0) {
        this.setData({
          deletStoryColumn: []
        });
      } else {
        this.setData({
          deletStoryColumn: res.result.data
        });
      }

      }).catch(err => {
        console.log(err)
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVideoColumn();
  },

})