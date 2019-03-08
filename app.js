//app.js

const apihost = require('config').apihost

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  },


  // 自定义接口请求ajax
  apirequest: function (url, postData, doSuccess, doFail, doComplete) {
    var info=  wx.getStorageSync('userinfo');
    if (info == null || info == ''){
      wx.reLaunch({
        url: '/pages/store/login/login'  //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
      })
      return
    }else{

      postData = Object.assign(info, postData);
      wx.request({
        url: apihost + url,
        data: postData,
        method: 'POST',
        success: function (res) {
          if (typeof doSuccess == "function") {
            res.data.Data = JSON.parse(res.data.Data);
            doSuccess(res);
          }
        },
        fail: function () {
          if (typeof doFail == "function") {
            doFail();
          }
        },
        complete: function () {
          if (typeof doComplete == "function") {
            doComplete();
          }
        }
      });
    }
  },

  // 自定义分页请求ajax
  pagerequest: function (url, page, deed, postData, doSuccess, doFail, doComplete) {
    var info = wx.getStorageSync('userinfo');
    if (info == null || info == '') {
      wx.reLaunch({
        url: '/pages/store/login/login'  //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
      })
      return
    } else {


      var pageinfo = wx.getStorageSync(page);
      if (pageinfo == null || pageinfo == ''){
        wx.setStorage({
          key: page,
          data: {
            start: 0,
            length: 10,
          }
        });
        this.pagerequest(url, page, deed, postData, doSuccess, doFail, doComplete);
      }else{
        if (deed == "next") {
          pageinfo.start = pageinfo.start + pageinfo.length;
        } else if (deed == "up") {
          pageinfo.start = pageinfo.start < pageinfo.length ? 0 : (pageinfo.start - pageinfo.length);
        } else if (deed == "init") {
          pageinfo.start = 0;
        } else if (deed == "refresh") {
        }
        postData = Object.assign(pageinfo, info, postData);

        wx.request({
          url: apihost + url,
          data: postData,
          method: 'POST',
          success: function (res) {
            if (typeof doSuccess == "function") {
              res.data.Data = JSON.parse(res.data.Data);
              doSuccess(res);
            }
          },
          fail: function () {
            if (typeof doFail == "function") {
              doFail();
            }
          },
          complete: function () {
            if (typeof doComplete == "function") {
              doComplete();
            }
          }
        });
      }
     
      
    }
  },
  // 自定义接口请求ajax
  apirequestcool: function (url, postData, doSuccess, doFail, doComplete) {
    debugger;
      wx.request({
        url: apihost + url,
        data: postData,
        method: 'POST',
        success: function (res) {
          if (typeof doSuccess == "function") {
            res.data.Data = JSON.parse(res.data.Data);
            doSuccess(res);
          }
        },
        fail: function () {
          if (typeof doFail == "function") {
            doFail();
          }
        },
        complete: function () {
          if (typeof doComplete == "function") {
            doComplete();
          }
        }
      });
  },

})