// pages/store/inventory/inventory.js

var app = getApp()

Page({
  /**
   * 组件的属性列表
   */
  properties: {

  },



  /**
   * 组件的初始数据
   */
  data: {
    array: [],
    typearray: [
      {
        id: 1,
        name: '货架'
      }, {
        id: 2,
        name: '仓库'
      }],
    index: 0,
    keyword: "",
    typeindex: 0,
    scancode: "",
    chosen: '',
    InventoryNo: '',
    InventoryProductType:'',
    InventoryTypeName: '',
    Remark: '',
    WarehouseName: '',
    WarehouseId: '',
    InventoryName: '',
    GoodsId: '',
    BarCode:'',
    InventoryType: '',
    OrganizationId: '',
    ActualStock: ''

  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   var that = this;
   wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        that.setData({
          WarehouseName: res.data.ApiStoreName
        }) 
      }
    });




    app.apirequest('Inventory/GetInventory', {}, function (res) {
      if (res.data.Status == 0) {
        that.setData({
          InventoryNo: res.data.Data.InventoryNo,
          InventoryTypeName: res.data.Data.InventoryTypeName,
          InventoryProductType: res.data.Data.InventoryProductType,
          InventoryType: res.data.Data.InventoryType,
          InventoryNo: res.data.Data.InventoryNo,
          Remark: res.data.Data.Remark == null ? '' : res.data.Data.Remark
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
   * 下拉改变值事件
   */
  bindPickerChange: function (e) {
    var that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      index: e.detail.value
    });
    that.UpProInfo();
  },

  /**
   * 下拉改变值事件
   */
  bindTypePickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      typeindex: e.detail.value
    })
  },


  addInventory: function (e) {
    var that = this;
    if (that.data.GoodsId == ""){
      wx.showToast({
        title: "请选择盘点商品",
        icon: 'none',
        duration: 2000
      })
    } else if (that.data.ActualStock == ""){
      wx.showToast({
        title: "请填写本次盘点数量",
        icon: 'none',
        duration: 2000
      })
    }
    else{
      var intstock = that.data.ActualStock;  
      that.data.ActualStock="";
      if (intstock.split(".")[0] == "00" && intstock.split(".").length == 2){
        intstock = '-0.' + intstock.split(".")[1]
      } else if (intstock.split(".")[0].substring(0, 1) == "0" && intstock.split(".")[0].length > 1 && intstock.split(".").length == 2){
        intstock = '-' + intstock.split(".")[0]+'.' + intstock.split(".")[1]
      }
      if (intstock.substring(0, 1) == "0" && intstock.indexOf(".") < 0 ){
        intstock = '-' + intstock
      }

      app.apirequest('Inventory/SetInventoryDetails', { "InventoryNo": that.data.InventoryNo, "InventoryName": that.data.InventoryName, InventoryType: that.data.InventoryType, "GoodsId": that.data.GoodsId, "ActualStock": intstock , "Type": that.data.typearray[that.data.typeindex].id }, function (res) {
        if (res.data.Status == 0) {
          // that.UpProInfo();

          that.setData({
            scancode: that.data.BarCode
          });
          
          that.GetPro();
          wx.showToast({
            title: res.data.Error,
            icon: 'succeed',
            duration: 1000
          })
        } else if (res.data.Status == -2) {
          wx.showModal({
            title: '提示',
            content: res.data.Error,
            concelText: '取消提交',
            confirmText: '确认提交',
            success: function (res) {
              if (res.confirm) {
                app.apirequest('Inventory/SetInventoryRealTimeDetails', { "InventoryNo": that.data.InventoryNo, "InventoryName": that.data.InventoryName, InventoryType: that.data.InventoryType, "GoodsId": that.data.GoodsId, "ActualStock": intstock, "Type": that.data.typearray[that.data.typeindex].id }, function (res) {
                  if (res.data.Status == 0) {
                    that.setData({
                      scancode: that.data.BarCode
                    });
                    that.GetPro();
                    wx.showToast({
                      title: res.data.Error,
                      icon: 'succeed',
                      duration: 1000
                    })
                  } else {
                    wx.showToast({
                      title: res.data.Error,
                      icon: 'none',
                      duration: 2000
                    })
                  }
                })
              } else {
                that.setData({
                  ActualStock: intstock
                });
              }

            }
          })
        } else {
          wx.showToast({
            title: res.data.Error,
            icon: 'none',
            duration: 2000
          })
        }
      })
  }},

  /**
   * 扫一扫
   */
  bindScanPro: function (e) {
    wx.scanCode({
      success: (res) => {
        this.setData({
          scancode: res.result
        });
        this.GetPro();
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
    if (e.detail.value != this.data.keyword){
      this.setData({
        scancode: e.detail.value,
        keyword: e.detail.value
      });
      this.GetPro();
    }
  },
  //文本改变事件
  changeEditCode: function (e) {
    e.detail.value = e.detail.value.trim()
    if (e.detail.value != this.data.keyword) {
      this.setData({
        scancode: e.detail.value,
        keyword: e.detail.value
      });
      this.GetPro();
    }
  },
  //盘点数量
  bindInputActualStock: function (e) {
    this.setData({
      ActualStock: e.detail.value
    });
  },

  /**
   * 获取产品信息
   */
  GetPro: function () {
    var that = this;
    if (that.data.scancode != "") {
      app.apirequest('Product/GetProductDtoList', { "Name": that.data.scancode }, function (res) {
        if (res.data.Status == 0) {
          that.setData({
            index: 0,
            array: res.data.Data
          })
          that.UpProInfo();
        } else {
          wx.showToast({
            title: res.data.Error,
            icon: 'none',
            duration: 2000
          })
        }

      })
    }

  },

  /**
   * 更新产品信息
   */
  UpProInfo: function () {
    var that = this;
    that.setData({
      No: that.data.array[that.data.index].No,
      InventoryName: that.data.array[that.data.index].Name,
      GoodsId: that.data.array[that.data.index].Id,
      Spec: that.data.array[that.data.index].Spec,
      Stock: that.data.array[that.data.index].Stock,
      BarCode: that.data.array[that.data.index].BarCode,
      Price: that.data.array[that.data.index].Price,
      ActualStock:""
      })

    app.apirequest('Inventory/GetDetailsProduct', { "InventoryNo": that.data.InventoryNo, "GoodsId": that.data.GoodsId }, function (res) {
      if (res.data.Status == 0) {
        that.setData({
          ShelfStock: res.data.Data.ShelfStock,
          DepotStock: res.data.Data.DepotStock,
          AllStock: res.data.Data.AllStock
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
   * 组件的方法列表
   */
  methods: {

  },
  bindMonitorKeyboard: function (e) {
    // var that = this;
    // if (e.detail.value === '0') {
    //   that.setData({
    //     ActualStock: '-',
    //   })
    // }
  }
})
