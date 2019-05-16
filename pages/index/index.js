//index.js
//获取应用实例
const app = getApp();
var bmap = require('../../lib/bmap-wx.js');
Page({
  data: {
    weather:{},
    today:'',
    city:'',
    inputCity:''
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  searchWeather: function (cityName) {
    var self = this;
    wx.request({
      url: 'http://wthrcdn.etouch.cn/weather_mini?city=' + cityName,
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.data.status == 1002) {
          wx.showModal({
            title: '提示',
            content: '输入的城市名称有误，请重新输入！',
            showCancel: false,
            success: function (res) {
              self.setData({ inputCity: '' });
            }
          })
        } else {
          var weather = res.data.data;

          for (var i = 0; i < weather.forecast.length; i++) {
            var d = weather.forecast[i].date;
            weather.forecast[i].date = ' ' + d.replace('星期', ' 星期');
          }
          self.setData({
            city: cityName,
            weather: weather,
            inputCity: ''
          })
        }
      }
    })
  },

  onLoad: function () {
    var that = this;
    // 新建百度地图对象 
    var BMap = new bmap.BMapWX({
      ak: 'pXkSb15dY7Zw6NbnstMaOcGzGeMpWN3U'
    });
    var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {
      var weatherData = data.currentWeather[0];
      var city = weatherData.currentCity;
      var today = weatherData.date;
      today = today.substring(0,9);
      city = city.replace('市','');
      that.searchWeather(city);
      that.setData({
        city: city,
        today: today,
      });
    }
    // 发起weather请求 
    BMap.weather({
      fail: fail,
      success: success
    }); 
  },

  inputing:function(e){
    this.setData({
      inputCity:e.detail.value,
    });
  },

  bindSearch:function(){
    this.searchWeather(this.data.inputCity);
  },

  getUserInfo: function(e) {

  }
})
