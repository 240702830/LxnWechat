// pages/store/allocate/allocate.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    array: [],
    index: 0,
    shop: [],
    shopindex: 0,
    supplier: [],
    supplierlist: [],
    supplierindex: 0,
    supkey: "",
    remark: "",
    keyword: "",
    scancode: "",
    GoodsId: '',
    BarCode: '',
    Name: '',
    Spec: '',
    ReceiptPriceType: '',
    Stock: '',
    No: '',
    Price: '',
    CostPrice: '',
    RequestPrice: '',
    DeliveryPrice: '',
    TotalPrice: '',
    StorageQuantity: '',
    popGoodsId: '',
    popGoodsName: '',
    popNum: '',
    popReceiptPriceType: '',
    popPrice: '',
    popRemark: '',
    showModalStatus: false,
    issubmit: false,
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.GetShop();
    that.GetSupplier();
  },


  /**
   * 获取门店
   */
  GetShop: function () {
    var that = this;
    app.apirequest('Common/SearchResult', { "comType": "reservoirArea" }, function (res) {
      if (res.data.Status == 0) {
        that.setData({
          shopindex: 0,
          shop: res.data.Data
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
    if (e.detail.value != this.data.keyword) {
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
  /**
   * 获取产品信息
   */
  GetPro: function () {
    var that = this;
    if (that.data.scancode != "") {
      app.apirequest('Product/GetProductDtoList', { "Name": that.data.scancode, "ReservoirAreaId": this.data.shop[this.data.shopindex].Id, "Supplier": this.data.supplier[this.data.supplierindex].Id, "Index":7 }, function (res) {
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
      Name: that.data.array[that.data.index].Name,
      GoodsId: that.data.array[that.data.index].Id,
      Spec: that.data.array[that.data.index].Spec,
      ReceiptPriceType: that.data.array[that.data.index].ReceiptPriceType,
      Stock: that.data.array[that.data.index].Stock,
      BarCode: that.data.array[that.data.index].BarCode,
      Price: that.data.array[that.data.index].Price,
      CostPrice: that.data.array[that.data.index].CostPrice,
      RequestPrice: that.data.array[that.data.index].RequestPrice,
      DeliveryPrice: that.data.array[that.data.index].CostPrice,
      StorageQuantity: "",
      TotalPrice: ""
    })
  },
  /**
   * 清空产品信息
   */
  EmptyProInfo: function () {
    var that = this;
    that.setData({
      No: "",
      Name: "",
      GoodsId: "",
      Spec: "",
      ReceiptPriceType: "",
      Stock: "",
      BarCode: "",
      Price: "",
      CostPrice: "",
      RequestPrice: "",
      DeliveryPrice: "",
      ReceiptPriceType: "",
      StorageQuantity: "",
      TotalPrice: "",
      array: null
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
  bindStoragePickerChange: function (e) {
    if (this.data.list.length > 0) {
      wx.showToast({
        title: "存在入库明细，无法修改入库供应商",
        icon: 'none',
        duration: 3000
      })
    } else {
      this.setData({
        supplierindex: e.detail.value
      })
      this.EmptyProInfo()
    }
  },
  /**
   * 下拉改变值事件
   */
  bindShopPickerChange: function (e) {
    if (this.data.list.length > 0) {
      wx.showToast({
        title: "存在入库明细，无法修改门店",
        icon: 'none',
        duration: 3000
      })
    } else {
      this.setData({
        shopindex: e.detail.value
      })
    }
  },
  //模糊搜索供应商
  bindInputSupKey: function(e) {
    this.setData({
      supkey: e.detail.value
    })

    if (this.data.list.length > 0) {
      wx.showToast({
        title: "存在入库明细，无法修改供应商",
        icon: 'none',
        duration: 3000
      })
    } else {
      var obj = new Array;
      for (var i = 0; i < this.data.supplierlist.length; i++) {
        if (this.data.supplierlist[i].Word.indexOf(this.data.supkey) != -1) {
          obj = obj.concat(this.data.supplierlist[i]);
        }
      }
      this.setData({
        supplier: obj
      })
      this.EmptyProInfo()

    }
  },
  //入库数量
  bindInputStorageQuantity: function (e) {
    this.setData({
      StorageQuantity: e.detail.value,
      TotalPrice: parseFloat(e.detail.value * this.data.DeliveryPrice).toFixed(2)
    });
  },
  //入库单价
  bindInputDeliveryPrice: function (e) {
    this.setData({
      DeliveryPrice: e.detail.value,
      TotalPrice: parseFloat(e.detail.value * this.data.StorageQuantity).toFixed(2)
    });
  },
  //入库总价
  bindInputTotalPrice: function (e) {
    this.setData({
      TotalPrice: e.detail.value,
      DeliveryPrice: e.detail.value / this.data.StorageQuantity
    });
  },
  /**
   * 添加明细
   */
  addDetail: function (e) {
    var that = this;
    if (that.data.GoodsId == "") {
      wx.showToast({
        title: "请选择入库商品",
        icon: 'none',
        duration: 2000
      })
    } else if (that.data.StorageQuantity == "") {
      wx.showToast({
        title: "请填写本次入库数量",
        icon: 'none',
        duration: 2000
      })
    } else if (that.data.DeliveryPrice == "") {
      wx.showToast({
        title: "请填写本次入库单价",
        icon: 'none',
        duration: 2000
      })
    }
    else {
      var lists = that.data.list;

      for (var i = 0; i < lists.length; i++) {
        if (lists[i].GoodsNo == that.data.array[that.data.index].Id) {
          wx.showToast({
            title: "该商品已添加，请单击列表编辑",
            icon: 'none',
            duration: 2000
          })
          return false;
        }
      }

      var model = {
        "GoodsNo": that.data.array[that.data.index].Id,
        "GoodsName": that.data.array[that.data.index].Name,
        "Spec": that.data.array[that.data.index].Spec,
        "ReceiptPriceType": that.data.array[that.data.index].ReceiptPriceType,
        "UnitTypeId": 0,
        "StoragePrice": that.data.DeliveryPrice,
        "Quantity": that.data.StorageQuantity,
        "Remark": "",
        "SumPrice": ((that.data.DeliveryPrice * that.data.StorageQuantity * 100) / 100).toFixed(2)
      }
      lists.unshift(model)
      this.setData({
        list: lists
      })
    }
  },

  // 模态框
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset;
    this.util(currentStatu)
  },

  util: function (currentStatu) {
    ///修改
    var that = this;
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200, //动画时长 
      timingFunction: "linear", //线性 
      delay: 0 //0则不延迟 
    });

    // 第2步：这个动画实例赋给当前的动画实例 
    that.animation = animation;

    // 第3步：执行第一组动画 
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存 
    that.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画 
    setTimeout(function () {
      // 执行第二组动画 
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
      that.setData({
        animationData: animation
      })

      //关闭 
      if (currentStatu.statu == "close") {
        that.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(that), 200)

    // 显示 
    if (currentStatu.statu == "open") {
      for (var i = 0; i < that.data.list.length; i++) {
        if (that.data.list[i].GoodsNo == currentStatu.goodsno) {
          that.setData(
            {
              popGoodsId: that.data.list[i].GoodsNo,
              popGoodsName: that.data.list[i].GoodsName,
              popNum: that.data.list[i].Quantity,
              popReceiptPriceType: that.data.list[i].ReceiptPriceType,
              popPrice: that.data.list[i].StoragePrice,
              popRemark: that.data.list[i].Remark,
              showModalStatus: true
            }
          );
        }
      }
    }
  },


  actionDetailTap: function (e) {
    var that = this;
    var currentStatu = e.currentTarget.dataset;
    wx.showActionSheet({
      itemList: ['修改', '删除'],
      success: function (e) {
        if (e.tapIndex === 1) {
          ///删除
          let lists = that.data.list;
          for (var i = 0; i < lists.length; i++) {
            if (lists[i].GoodsNo == currentStatu.goodsno) {
              lists.splice(i, 1)
              that.setData({
                list: lists
              })
            }
          }
        } else {
          that.util(currentStatu)
        }
      }
    })
  },
  /**
   * 保存修改的数据
   */
  powerOk: function (e) {
    console.log(e);
    var that = this;
    that.powerDrawer(e);
    if (that.data.popNum == "") {
      wx.showToast({
        title: "请填写本次入库数量",
        icon: 'none',
        duration: 2000
      })
    } else if (that.data.popPrice == "") {
      wx.showToast({
        title: "请填写本次入库单价",
        icon: 'none',
        duration: 2000
      })
    } else {
      console.log(that.data.popGoodsId);
      // /修改
      let lists = that.data.list;
      for (var i = 0; i < lists.length; i++) {
        if (lists[i].GoodsNo == that.data.popGoodsId) {
          lists[i].Quantity = that.data.popNum;
          lists[i].StoragePrice = that.data.popPrice;
          lists[i].Remark = that.data.popRemark;
          lists[i].SumPrice = ((that.data.popNum * that.data.popPrice * 100) / 100).toFixed(2);
        }
      }
      that.setData({
        list: lists
      })
      console.log(that.data.list);

    }
  },

  /**
   * 修改数量
   */
  bindpopNum: function (e) {
    this.setData({
      popNum: e.detail.value
    })
  },
  /**
   * 修改金额
   */
  bindpopPrice: function (e) {
    this.setData({
      popPrice: e.detail.value
    })
  },
  /**
   * 修改备注
   */
  bindpopRemark: function (e) {
    this.setData({
      popRemark: e.detail.value
    })
  },
  /**
   * 修改备注
   */
  bindRemark: function (e) {
    this.setData({
      remark: e.detail.value
    })
  },

  /**
   * 下拉改变值事件
   */
  bindIntoPickerChange: function (e) {
    this.setData({
      supplierindex: e.detail.value
    })
  },

  /**
   * 新增入库单
   */
  addAllocate: function (e) {
    let that = this;
    if (!that.data.issubmit) {
      that.setData({
        issubmit: true
      });
      app.apirequest('PurchaseStorage/Save', { "WarehouseId": that.data.shop[that.data.shopindex].Id, "PurchaseId": that.data.supplier[that.data.supplierindex].Id, "Remark": that.data.remark, "psdList": that.data.list }, function (res) {
        if (res.data.Status == 0) {
          wx.showToast({
            title: res.data.Error,
            icon: 'succeed',
            duration: 2000
          });
          that.setData({
            issubmit: false
          })
        } else {
          wx.showToast({
            title: res.data.Error,
            icon: 'none',
            duration: 6000
          });
          that.setData({
            issubmit: false
          })
        }
      })

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

  }
})