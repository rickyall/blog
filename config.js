var path=require('path');




var config= { 
  cookieSecret: 'myblog', 
  db: 'blog', 
  host: 'localhost',
  port: 27017,




  //七牛的access信息，用于上传文件
  qn_access: {
    accessKey: 'ksXEjACA6JMe7DfUTlIQEhko3cNliF9rZjVXBCcU',
    secretKey: 'UpoFZM9zCjaQE9iUargmeY2J3JhFfjlV6IkR_I2Q',
    bucket: 'rickyall',
    domain: 'http://{bucket}.qiniudn.com'
  },
  

  //文件上传配置

  upload: {
    path: path.join(__dirname, 'public/upload/'),
    url: '/public/upload/'
  }
}; 



















module.exports = config;