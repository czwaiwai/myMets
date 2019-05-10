// 配置反向代理
module.exports = {
  proxyList: {
    port: 8081,
    list: [
      // {
      //   api: '/ets',
      //   url: 'http://172.31.118.201:8091/ets'
      // },
      {
        api: '/NetApp',
        url: 'http://172.31.118.205:8066/NetApp'
        // url: 'http://172.31.118.49:8090/NetApp'
        // url: 'http://111.28.138.90:8088/NetApp'
        // url: 'http://47.106.34.60:8885/NetApp'
      },
      {
        api: '/ets-energy',
        url: 'http://172.31.118.49/ets-energy'
      },
      // {
        // api: '/roc',
        // url: 'http://172.31.118.201:8082/roc'
        // url: 'http://39.108.209.97:35002/roc'
        
        // url: 'http://172.31.118.23:35006/adapter/ets/open'
        // http://172.31.118.23:35006/adapter/ets/open'
      // }
    ]
  }
};
