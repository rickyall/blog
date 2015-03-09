

var oP =$('.demop');                //存放所有内容

oP.each(function(){
	this.innerHTML=this.innerHTML.substr(0,200)
})