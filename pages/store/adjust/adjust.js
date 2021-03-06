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
    regtype: [],
    regtypeindex: 0,
    adjusttype: [],
    adjusttypeindex: 0,
    remark: "",
    keyword: "",
    scancode: "",
    GoodsId: '',
    BarCode: '',
    Name: '',
    Spec: '',
    Stock: '',
    No: '',
    Price: '',
    CostPrice: '',
    RequestPrice: '',
    TotalPrice: '',
    StorageQuantity: '',
    popGoodsId: '',
    popGoodsName: '',
    popNum: '',
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
    that.GetInitData();
    that.GetSupplier();
  },


  /**
   * 获取门店
   */
  GetInitData: function () {
    var that = this;
    app.apirequest('Adjust/GetInitData', {}, function (res) {
      if (res.data.Status == 0) {
        that.setData({
          regtypeindex: 0,
          regtype: res.data.Data.AdjustType,
          adjusttypeindex: 0,
          adjusttype: res.data.Data.Type
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
   * 获取调整原因
   */
  GetRegtype: function () {
    var that = this;
    app.apirequest('Common/SearchResult', { "comType": 's_AdjustType', "reservoirAreaId": 0 }, function (res) {
      if (res.data.Status == 0) {
        that.setData({
          supplierindex: 0,
          supplier: res.data.Data
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
      app.apirequest('Product/GetProductDtoList', { "Name": that.data.scancode, "ReservoirAreaId": this.data.shop[this.data.shopindex].Id }, function (res) {
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
      Stock: that.data.array[that.data.index].Stock,
      BarCode: that.data.array[that.data.index].BarCode,
      Price: that.data.array[that.data.index].Price,
      CostPrice: that.data.array[that.data.index].CostPrice,
      RequestPrice: that.data.array[that.data.index].RequestPrice,
      CostPrice: that.data.array[that.data.index].CostPrice,
      StorageQuantity: "",
      popRemark: "",
      TotalPrice: ""
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
        shopindex: e.detail.value
      })
    }
  },
  /**
   * 下拉改变值事件
   */
  bindRegtypePickerChange: function (e) {
      this.setData({
        regtypeindex: e.detail.value
      })
  },
  /**
   * 下拉改变值事件
   */
  bindAdjusttypePickerChange: function (e) {
      this.setData({
        adjusttypeindex: e.detail.value
      })
  },

  //入库数量
  bindInputStorageQuantity: function (e) {
    this.setData({
      StorageQuantity: e.detail.value,
      TotalPrice: parseFloat(e.detail.value * this.data.CostPrice).toFixed(2)
    });
  },
  //入库单价
  bindInputDeliveryPrice: function (e) {
    this.setData({
      CostPrice: e.detail.value,
      TotalPrice: parseFloat(e.detail.value * this.data.StorageQuantity).toFixed(2)
    });
  },
  //入库总价
  bindInputTotalPrice: function (e) {
    this.setData({
      TotalPrice: e.detail.value,
      CostPrice: e.detail.value / this.data.StorageQuantity
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
    } else if (that.data.CostPrice == "") {
      wx.showToast({
        title: "请填写本次入库单价",
        icon: 'none',
        duration: 2000
      })
    }
    else {
      var lists = that.data.list;

      for (var i = 0; i < lists.length; i++) {
        if (lists[i].AdjustObjectId == that.data.array[that.data.index].Id) {
          wx.showToast({
            title: "该商品已添加，请单击列表编辑",
            icon: 'none',
            duration: 2000
          })
          return false;
        }
      }

      var model = {
        "AdjustObjectId": that.data.array[that.data.index].Id,
        "AdjustObjectName": that.data.array[that.data.index].Name,
        "Spec": that.data.array[that.data.index].Spec,
        "CostPrice": that.data.CostPrice,
        "AdjustObjectCount": that.data.StorageQuantity,
        "Remark": that.data.popRemark,
        "SumPrice": ((that.data.CostPrice * that.data.StorageQuantity * 100) / 100).toFixed(2)
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
        if (that.data.list[i].AdjustObjectId == currentStatu.goodsno) {
          that.setData(
            {
              popGoodsId: that.data.list[i].AdjustObjectId,
              popGoodsName: that.data.list[i].AdjustObjectName,
              popNum: that.data.list[i].AdjustObjectCount,
              popPrice: that.data.list[i].CostPrice,
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
            if (lists[i].AdjustObjectId == currentStatu.goodsno) {
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
        if (lists[i].AdjustObjectId == that.data.popGoodsId) {
          lists[i].AdjustObjectCount = that.data.popNum;
          lists[i].CostPrice = that.data.popPrice;
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
      app.apirequest('Adjust/Save', { "WarehouseId": that.data.shop[that.data.shopindex].Id, "WarehouseName": that.data.shop[that.data.shopindex].Word, "AdjustType": that.data.adjusttype[that.data.adjusttypeindex].Id, "Type": that.data.regtype[that.data.regtypeindex].Id, "Remark": that.data.remark, "AjdList": that.data.list }, function (res) {
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