var qn=require('qn');
var config=require('../../config.js');

var client=qn.create({

	accessKey:config.qn_access.accessKey,
	secretKey:config.qn_access.secretKey,
	bucket:config.qn_access.bucket,
	domain:config.qn_access.domain
})


client.uploadFile(filepath,{key:'qn/lib/client.js'},function(err,result){

	{
		hash:'',
		key:'qn/lib/client.js',
		url:'http://rickyall.qiniudn.com/qn/lib/client.js',
		

	}
})