// pages/store/main.js
var app = getApp()
const domain = require('../../../config').domain

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // background: ['../../../image/pic/lxnlogin.jpg', '../../../image/pic/lxncxy.jpg', '../../../image/pic/lxnpl.jpg'],
    background: [],
    indicatorDots: true,
    vertical: true,
    autoplay: true,
    interval: 2500,
    duration: 1000,
    moduleslist: [],
    menulist: [{
      name: "数据中心",
      modules: [{
          name: '查询',
          url: '../product/product',
          icon: 'icon-sousuo'
        },
        {
          name: '调价',
          url: '../changeprice/changeprice',
          icon: 'icon-yijianfankui'
        },
        {
          name: '调拨',
          url: '../../store/allocate/allocate',
          icon: 'icon-shouhuodizhi'
        }, {
          name: '入库',
          url: '../../store/receiving/receiving',
          icon: 'icon-gouwuche'
        }, {
          name: '采购追踪',
          url: '../../company/purchase/purchase',
          icon: 'icon-wodedingdan'
        }
      ]
    }, {
      name: "IT人员",
      modules: []
    }, {
      name: "采购人员",
      modules: [{
          name: '查询',
          url: '../product/product',
          icon: 'icon-sousuo'
        },
        {
          name: '调价',
          url: '../changeprice/changeprice',
          icon: 'icon-yijianfankui'
        },
        {
          name: '调拨',
          url: '../../store/allocate/allocate',
          icon: 'icon-shouhuodizhi'
        }, {
          name: '入库',
          url: '../../store/receiving/receiving',
          icon: 'icon-gouwuche'
        }, {
          name: '采购追踪',
          url: '../../store/purchase/purchase',
          icon: 'icon-wodedingdan'
        }, {
          name: '支付',
          url: '../../company/pay/pay',
          icon: 'icon-wodedingdan'
        }, {
          name: '新增商品',
          url: '../../company/goods/goods',
          icon: 'icon-wodedingdan'
        }
      ],
    }, {
      name: "大仓人员",
      modules: [{
          name: '查询',
          url: '../product/product',
          icon: 'icon-sousuo'
        },
        {
          name: '调拨',
          url: '../../store/allocate/allocate',
          icon: 'icon-shouhuodizhi'
        }, {
          name: '采购追踪',
          url: '../../company/purchase/purchase',
          icon: 'icon-wodedingdan'
        },{
          name: '盘点',
          url: '../inventory/inventory',
          icon: 'icon-huo'
        }, {
          name: '入库',
          url: '../../store/receiving/receiving',
          icon: 'icon-gouwuche'
        }
      ],
    }, {
      name: "门店人员",
      modules: [{
          name: '查询',
          url: '../product/product',
          icon: 'icon-sousuo'
        },
        {
          name: '调拨',
          url: '../../store/allocate/allocate',
          icon: 'icon-shouhuodizhi'
        }, {
          name: '入库',
          url: '../../store/receiving/receiving',
          icon: 'icon-gouwuche'
        },
        {
          name: '调价',
          url: '../changeprice/changeprice',
          icon: 'icon-yijianfankui'
        },
        {
          name: '库存调整',
          url: '../adjust/adjust',
          icon: 'icon-lajixiang'
        },
        {
          name: '销售日报',
          url: '../salechart/salechart',
          icon: 'icon-wodedingdan'
        }, 
        // {
        //   name: '销售',
        //   url: 'redirect?title=redirect',
        //   icon: 'icon-wodedingdan'
        // }, 
        {
          name: '盘点',
          url: '../inventory/inventory',
          icon: 'icon-huo'
        }
      ],
    }, {
      name: "门店收银",
      modules: [{
          name: '入库',
          url: '../../store/receiving/receiving',
          icon: 'icon-gouwuche'
        },
        {
          name: '盘点',
          url: '../inventory/inventory',
          icon: 'icon-huo'
        }
      ],
    }]
  },

  changeIndicatorDots: function(e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function(e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function(e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function(e) {
    this.setData({
      duration: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.apirequest('Banner/GetAppletBanner', { "Type": 3 }, function (res) {
      if (res.data.Status == 0) {
        let arr = new  Array();
        for (var i = 0; i < res.data.Data.length; i++) {
          arr.push(domain + res.data.Data[i].ImgPath);
        }
        that.setData({
          background: arr
        })
      } else {
        wx.showToast({
          title: res.data.Error,
          icon: 'none',
          duration: 2000
        })
      }
    });

    var modules = [];
    var moduless = [];

    wx.getStorage({
      key: 'userinfo',
      success: function(res) {
        if (res.data.lasttime === undefined || res.data.lasttime === null || new Date(res.data.lasttime) < new Date('2018/8/29')) {
          wx.reLaunch({
            url: '../../../pages/store/login/login' //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
          })
        } else {

          /**
           * 用户权限
           */
          var RoleList = res.data.ApiRoleName.split(",");
          for (var i = 0; i < RoleList.length; i++) {
            for (var j = 0; j < that.data.menulist.length; j++) {
              if (RoleList[i] == that.data.menulist[j].name) {
                modules = modules.concat(that.data.menulist[j].modules)
                // modules = Object.assign(modules, that.data.menulist[j].modules);

              }
            }
          }
          var hash = {};
          modules = modules.reduce(function(item, next) {
            hash[next.name] ? '' : hash[next.name] = true && item.push(next);
            return item
          }, [])



          that.setData({
            moduleslist: modules
          })
        }


      },
      fail: function(res) {
        wx.reLaunch({
          url: '../../../pages/store/login/login' //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
        })
      }
    });
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