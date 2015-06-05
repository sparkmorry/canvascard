var jQuploadBtn = $("#j-upload-btn");
var jQgenerateBtn = $("#j-generate-btn");
var jQcontent = $("#j-content");
var jQtextCount = $("#j-count");
var jQuploadInput = $("#j-upload-input");
var jQbbt = $("#j-bbt");
var jQenerater = $("#j-generater");

jQpicPreview = $("#j-pre-pic");

jQuploadBtn.bind('click', function(){
	jQuploadInput.click();
});

var count=0;
jQcontent.bind('keyup', function(){
	count = jQcontent.val().length;
	if(count>0){
		jQtextCount.text(count+"字");
		if(count>150 || count<70){
			jQtextCount.css({'color':'red'})
		}else{
			jQtextCount.css({'color':'black'})
		}
	}else if(count == 0){
		jQtextCount.text('');
	}
});

CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
	if(w<2 * r) r = w / 2;
	if(h< 2 * r) r = h / 2;
	this.beginPath();
	this.moveTo(x+r, y);
	this.arcTo(x+w, y, x+w, y+h, r);
	this.arcTo(x+w, y+h, x, y+h, r);
	this.arcTo(x, y+h, x, y, r);
	this.arcTo(x, y, x+w, y, r);
	// this.arcTo(x+r, y);
	this.closePath();
	return this;
}
function writeTextOnCanvas(ctx, lh, rw, left, start, text){
	var lineheight = lh;
	var text = text;

	function getTrueLength(str){//获取字符串的真实长度（字节长度）
		var len = str.length, truelen = 0;
		for(var x = 0; x < len; x++){
			if(str.charCodeAt(x) > 128){
				truelen += 2;
			}else{
				truelen += 1;
			}
		}
		return truelen;
	}
	function cutString(str, leng){//按字节长度截取字符串，返回substr截取位置
		var len = str.length, tlen = len, nlen = 0;
		for(var x = 0; x < len; x++){
			if(str.charCodeAt(x) > 128){
				if(nlen + 2 < leng){
					nlen += 2;
				}else{
					tlen = x;
					break;
				}
			}else{
				if(nlen + 1 < leng){
					nlen += 1;
				}else{
					tlen = x;
					break;
				}
			}
		}
		return tlen;
	}
	for(var i = 1; getTrueLength(text) > 0; i++){
		var tl = cutString(text, rw);
		var tl1 = cutString(text, rw-2);
		if(i==1){
			ctx.fillText(text.substr(0, tl1).replace(/^\s+|\s+$/, ""), left+40, i * lineheight + start);
		}else{
			ctx.fillText(text.substr(0, tl).replace(/^\s+|\s+$/, ""), left, i * lineheight + start);
		}
		text = text.substr(tl);
	}
}
var m1, file;
function readFile(){
    file = jQuploadInput.get(0).files[0];
    if(!/image\/\w+/.test(file.type)){
        alert("请上传图片类型的文件~");
        return false;
    }
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(e){
    	jQuploadBtn.css({'background': 'url('+this.result+') no-repeat center', 
    		'background-size': '200px'});
        m1 = new Image();
        m1.src = this.result;
        jQuploadBtn.text('');
    }
}

jQuploadInput.bind('change',readFile)

var theCanvas = document.getElementById("j-canvas");
var context = theCanvas.getContext("2d");
var jQcard = $("#j-card");
function draw(image){
	var windowW = $(window).width();
	if(windowW<600){
		theCanvas.width = 640;
		theCanvas.height = 983;
		jQcard.css({'width': windowW-20, 'height': 983*(windowW-20)/640.0, 'margin-left': '10px'});
		
		//绘制
		context.fillStyle="#fff";
		context.fillRect(0,0,640,983);
		// 绘制图像
		context.fillStyle="#feebed";
		context.roundRect(40, 10, 550, 550, 30).fill(); //x, y, w, h, r
		context.drawImage(image, 60, 25, 510, 510);
		//绘制背景
		var bg = new Image();
	    bg.src = "static/images/bg.png";
		context.drawImage(bg, 0, 433, 640, 550);
		//绘制文字
		var content = jQcontent.val();
		context.font="24px Microsoft JhengHei, Apple LiGothic Medium, STHeiti, SimHei";
		context.fillStyle="#000";
		writeTextOnCanvas(context, 50, 46, 45, 550,  content);		
		var dt = theCanvas.toDataURL("image/jpeg", 0.9);

		$.post("/upload", {
			imgData : dt
		}, function(ret){
			jQcard.attr('src', $.parseJSON(ret).url);
		})

	}else{
		// pc
		theCanvas.width=1000;
		theCanvas.style.width = 600;
		theCanvas.height = 1536;
		theCanvas.style.height = 922;  //1229
		theCanvas.style.marginLeft = 100;

		//绘制
		context.fillStyle="#fff";
		context.fillRect(0,0,1000,1536);
		// 绘制图像
		context.fillStyle="#feebed";
		context.roundRect(70, 20, 860, 860, 35).fill();
		context.drawImage(image, 105, 55, 790, 790);
		//绘制背景
		var bg = new Image();
	    bg.src = "static/images/bg.png";
		context.drawImage(bg, 0, 600, 1000, 881);
		//绘制文字
		var content = jQcontent.val();
		context.font="36px Microsoft JhengHei, Apple LiGothic Medium, STHeiti, SimHei";
		context.fillStyle="#000";
		writeTextOnCanvas(context, 60, 46, 80, 900, content);

		var dt = theCanvas.toDataURL("image/jpeg", 0.9);
		jQcard.attr('src', dt);
	}

}


jQgenerateBtn.bind('click', function(){
    var file = jQuploadInput.get(0).files[0];
    if(count ==0){
		alert("你还没有输入告白内容哦！")
	// }else if(count<65) {
	// 	alert("告白长一些才更有心意呢！")
    }else if(count>155) {
		alert("字太多啦，贺卡写不下啦！")
	}else if(!file){
		alert("你们的回忆照片怎么能少~");
	}else{
		readFile();
		draw(m1);
        jQenerater.hide();
        jQbbt.show();
	};

});


$("#j-save").bind('click', function(){
	this.href = jQcard.attr("src")
    this.download = 'bbt.jpeg';
})

$("#j-restart").bind('click', function(){
	window.location.reload();
});

$('#j-regenerate').bind('click', function(){
	window.location.reload();
});