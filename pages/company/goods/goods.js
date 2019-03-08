// pages/company/goods/goods.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    supkey: "",
    classifykey: "",
    scancode: "",
    classify: [],
    sclassifylist: [],
    classifyindex: 0,
    style: [],
    stylelist: [],
    styleindex: 0,
    supplier: [],
    supplierlist: [],
    supplierindex: 0,
    issubmit: false,
    allcheckbox: true,
    
  },


  /**
   * 下拉改变值事件
   */
  bindSupplierPickerChange: function (e) {
    this.setData({
      supplierindex: e.detail.value
    })
  },


  /**
   * 下拉改变值事件
   */
  bindStylePickerChange: function (e) {
    this.setData({
      styleindex: e.detail.value
    })
  },

  /**
   * 下拉改变值事件
   */
  bindClassifyPickerChange: function (e) {
    this.setData({
      classifyindex: e.detail.value
    })
  },


  /**
   * 修改No
   */
  bindInputNo: function (e) {
    this.setData({
      No: e.detail.value
    })
  },
  /**
   * 修改名称
   */
  bindInputName: function (e) {
    this.setData({
      Name: e.detail.value
    })
  },
  /**
   * 修改金额
   */
  bindInputPrice: function (e) {
    this.setData({
      Price: e.detail.value
    })
  },
  /**
   * 修改售价
   */
  bindInputSalePrice: function (e) {
    this.setData({
      SalePrice: e.detail.value
    })
  },

  /**
   * 修改规格
   */
  bindInputSpec: function (e) {
    this.setData({
      Spec: e.detail.value
    })
  },
  /**
   * 修改保质期
   */
  bindInputGuaranteePeriod: function (e) {
    this.setData({
      GuaranteePeriod: e.detail.value
    })
  },

  /**
   * 扫一扫
   */
  bindScanPro: function (e) {
    wx.scanCode({
      success: (res) => {
        this.setData({
          scancode: res.result
        });
      },
      fail: (res) => {
        wx.showToast({
          title: '失败',
          icon: 'none',
          duration: 2000
        })
      },
    })
  },
  //编辑搜索条码
  bindEditCode: function (e) {
    e.detail.value = e.detail.value.trim()
    if (e.detail.value != this.data.keyword) {
      this.setData({
        scancode: e.detail.value
      });
    }
  },

  /**
   * 获取商品分类
   */
  GetLastGoodsClassify: function() {
    var that = this;
    app.apirequest('Product/GetLastGoodsClassify', {}, function (res) {
      if (res.data.Status == 0) {
        that.setData({
          classifyindex: 0,
          classify: res.data.Data,
          classifylist: res.data.Data
        })
      } else {
        wx.showToast({
          title: res.data.Error,
          icon: 'none',
          duration: 2000
        })
      }

    })
  },

  /**
   * 获取称重计重方式
   */
  GetStyle: function () {
    var that = this;
    app.apirequest('Product/GetProductStyle', {}, function (res) {
      if (res.data.Status == 0) {
        that.setData({
          styleindex: 0,
          style: res.data.Data,
          stylelist: res.data.Data
        })
      } else {
        wx.showToast({
          title: res.data.Error,
          icon: 'none',
          duration: 2000
        })
      }

    })
  },

  /**
   * 获取供应商
   */
  GetSupplier: function () {
    var that = this;
    app.apirequest('Common/SearchResult', { "comType": 'purchase', "reservoirAreaId": 0 }, function (res) {
      if (res.data.Status == 0) {
        that.setData({
          supplierindex: 0,
          supplier: res.data.Data,
          supplierlist: res.data.Data
        })
      } else {
        wx.showToast({
          title: res.data.Error,
          icon: 'none',
          duration: 2000
        })
      }

    })
  },
  //模糊搜索供应商
  bindInputSupKey: function (e) {
    this.setData({
      supkey: e.detail.value
    })
      var obj = new Array;
      for (var i = 0; i < this.data.supplierlist.length; i++) {
        if (this.data.supplierlist[i].Word.indexOf(this.data.supkey) != -1) {
          obj = obj.concat(this.data.supplierlist[i]);
        }
      }
    if (obj.length > 0){
      this.setData({
        supplier: obj,
        supplierindex: 0
      })
    }
     

  },

  //模糊搜索分类
  bindInputClassifyKey: function (e) {
    this.setData({
      classifykey: e.detail.value
    })
      var obj = new Array;
    for (var i = 0; i < this.data.classifylist.length; i++) {
      if (this.data.classifylist[i].ClassName.indexOf(this.data.classifykey) != -1) {
        obj = obj.concat(this.data.classifylist[i]);
        }
      }

    if (obj.length > 0) {
      this.setData({
        classify: obj,
        classifyindex: 0
      })
    }

      
  },
  checkboxChange(e) {
    this.setData({
      allcheckbox: e.detail.value.length > 0 ? true : false
    })
  },

  /**
   * 新增商品
   */
  addgoods: function (e) {
    let that = this;

    if (that.data.No == "") {
      wx.showToast({
        title: "请输入商品编码",
        icon: 'none',
        duration: 2000
      })
    } else if (that.data.Name == "") {
      wx.showToast({
        title: "请输入商品名称",
        icon: 'none',
        duration: 2000
      })
    } else if (that.data.SalePrice == "") {
      wx.showToast({
        title: "请输入售价",
        icon: 'none',
        duration: 2000
      })
    } else if (that.data.Price == "") {
      wx.showToast({
        title: "请输入进价",
        icon: 'none',
        duration: 2000
      })
    } else if (that.data.scancode == "") {
      wx.showToast({
        title: "请输入商品条码",
        icon: 'none',
        duration: 2000
      })
    } else if (that.data.Spec == "") {
      wx.showToast({
        title: "请输入商品单位",
        icon: 'none',
        duration: 2000
      })
    } else if (that.data.GuaranteePeriod == "") {
      wx.showToast({
        title: "请输入商品保质期",
        icon: 'none',
        duration: 2000
      })
    }else{
      if (!that.data.issubmit) {
        that.setData({
          issubmit: true
        });

        var jsSupObj = {};
        jsSupObj.SupplierId = that.data.supplier[that.data.supplierindex].Id;
        jsSupObj.IsDefault = true;
        var jsCodeObj = {};
        jsCodeObj.BarCode = that.data.scancode;

        app.apirequest('Product/InsertProduct', {
          "No": that.data.No, "Name": that.data.Name, "Price": that.data.Price, "SalePrice": that.data.SalePrice,
          "Spec": that.data.Spec, "GuaranteePeriod": that.data.GuaranteePeriod, "Style": that.data.style[that.data.styleindex].Value, "ResultIs": that.data.allcheckbox, 
          "Category": that.data.classify[that.data.classifyindex].Id, "SupplierList": '[' + JSON.stringify(jsSupObj) + ']', "BarCode": '[' + JSON.stringify(jsCodeObj) + ']'
        }, function (res) {
          if (res.data.Status == 0) {
            wx.showToast({
              title: res.data.Message,
              icon: 'succeed',
              duration: 2000
            });

            that.setData({
              issubmit: false,
              No: parseInt(that.data.No) + 1,
              Name: ""
            })
            if (that.data.style[that.data.styleindex].TextBack != "69码") {
              that.setData({
                scancode: parseInt(that.data.scancode) + 1,
              })
            }else{
              that.setData({
                scancode: "",
              })
            }
          } else {
            wx.showToast({
              title: res.data.Message,
              icon: 'none',
              duration: 6000
            });

            that.setData({
              issubmit: false
            })
          }
        })

      }
    }

   
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.GetSupplier();
    that.GetStyle();
    that.GetLastGoodsClassify();
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

  }
})