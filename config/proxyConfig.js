// 配置反向代理
module.exports = {
  proxyList: {
    port: 8081,
    list: [
      {
        api: '/ets',
        url: 'http://172.31.118.201:8091/ets'
      },
      {
        api: '/NetApp',
        url: 'http://172.31.118.205:8066/NetApp'
      },
      {
        api: '/open',
        url: 'http://172.31.118.23:35006/roc/open'
        // url: 'http://172.31.118.23:35006/adapter/ets/open'
        // http://172.31.118.23:35006/adapter/ets/open'
      }
    ]
  }
};
