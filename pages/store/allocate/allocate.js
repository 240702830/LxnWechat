// pages/store/allocate/allocate.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list : [],
    array: [],
    index: 0,
    outarray: [],
    outindex: 0,
    intoarray: [],
    intoindex: 0,
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
    DeliveryPrice: '',
    OutQuantity: '',

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
    that.GetOutWarehouse();
    that.GetIntoWarehouse();
  },


  /**
   * 获取调出仓库
   */
  GetOutWarehouse: function () {
    var that = this;
    app.apirequest('Common/SearchResult', { "comType": "reservoirArea" }, function (res) {
        if (res.data.Status == 0) {
          that.setData({
            outindex: 0,
            outarray: res.data.Data
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
   * 获取调入仓库
   */
  GetIntoWarehouse: function () {
    var that = this;
    app.apirequest('Common/SearchResult', { "comType": 'reservoirArea', "reservoirAreaId":-2 }, function (res) {
        if (res.data.Status == 0) {
          that.setData({
            intoindex: 0,
            intoarray: res.data.Data
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
      app.apirequest('Product/GetProductDtoList', { "Name": that.data.scancode, "ReservoirAreaId": this.data.outarray[this.data.outindex].Id}, function (res) {
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
      DeliveryPrice: that.data.array[that.data.index].CostPrice,
      OutQuantity:""
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
  bindOutPickerChange: function (e) {
    if (this.data.list.length>0){
      wx.showToast({
        title: "存在调拨明细，无法修改调出门店",
        icon: 'none',
        duration: 3000
      })
    }else{
      this.setData({
        outindex: e.detail.value
      })
    }

  },

  //调拨数量
  bindInputOutQuantity: function (e) {
    this.setData({
      OutQuantity: e.detail.value
    });
  },
  //调拨单价
  bindInputDeliveryPrice: function (e) {
    this.setData({
      DeliveryPrice: e.detail.value
    });
  },
  /**
   * 添加明细
   */
  addDetail: function (e) {
    var that = this;
    if (that.data.GoodsId == "") {
      wx.showToast({
        title: "请选择调拨商品",
        icon: 'none',
        duration: 2000
      })
    } else if (that.data.OutQuantity == "") {
      wx.showToast({
        title: "请填写本次调拨数量",
        icon: 'none',
        duration: 2000
      })
    } else if (that.data.DeliveryPrice == "") {
      wx.showToast({
        title: "请填写本次调拨单价",
        icon: 'none',
        duration: 2000
      })
    }
    else {
      var lists = that.data.list;

      for (var i = 0; i < lists.length; i++) {
        if (lists[i].ArticleId == that.data.array[that.data.index].Id) {
          wx.showToast({
            title: "该商品已添加，请单击列表编辑",
            icon: 'none',
            duration: 2000
          })
          return false;
        }
      }

      var model = {
        "ArticleId": that.data.array[that.data.index].Id,
          "Name": that.data.array[that.data.index].Name,
          "Spec": that.data.array[that.data.index].Spec,
          "UnitTypeId": 0,
          "DispatchType": 3,
          "RequestPrice": that.data.DeliveryPrice,
          "OutQuantity": that.data.OutQuantity,
          "Remark": "",
          "Total": ((that.data.DeliveryPrice * that.data.OutQuantity * 100) / 100).toFixed(4)
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
        if (that.data.list[i].ArticleId == currentStatu.goodsno) {
          that.setData(
            {
              popGoodsId: that.data.list[i].ArticleId,
              popGoodsName: that.data.list[i].Name,
              popNum: that.data.list[i].OutQuantity,
              popPrice: that.data.list[i].RequestPrice,
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
            if (lists[i].ArticleId == currentStatu.goodsno) {
              lists.splice(i,1)
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
        title: "请填写本次调拨数量",
        icon: 'none',
        duration: 2000
      })
    } else if (that.data.popPrice == "") {
      wx.showToast({
        title: "请填写本次调拨单价",
        icon: 'none',
        duration: 2000
      })
    } else {
      console.log(that.data.popGoodsId);
      // /修改
      let lists = that.data.list;
      for (var i = 0; i < lists.length; i++) {
        if (lists[i].ArticleId == that.data.popGoodsId) {
          lists[i].OutQuantity = that.data.popNum;
          lists[i].RequestPrice = that.data.popPrice;
          lists[i].Remark = that.data.popRemark;
          lists[i].Total = ((that.data.popNum * that.data.popPrice * 100) / 100).toFixed(4);
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
      intoindex: e.detail.value
    })
  },

  /**
   * 新增调拨单
   */
  addAllocate: function (e) {
    let that  = this;
    if (!that.data.issubmit){
      that.setData({
        issubmit: true
      });
      app.apirequest('Allocate/Save', { "OutReservoirAreaId": that.data.outarray[that.data.outindex].Id, "GetReservoirAreaId": that.data.intoarray[that.data.intoindex].Id, "DetailType": 3, "OutRemark": that.data.remark, "DsdList": that.data.list }, function (res) {
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