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
		if(count>140){
			jQtextCount.css({'color':'red'})
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
function writeTextOnCanvas(ctx, lh, rw, text){
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
		if(i==1){
			ctx.fillText(text.substr(0, tl).replace(/^\s+|\s+$/, ""), 80, i * lineheight + 730);
		}else{
			ctx.fillText(text.substr(0, tl).replace(/^\s+|\s+$/, ""), 40, i * lineheight + 730);
		}
		text = text.substr(tl);
	}
}
var m1;
function readFile(){
    var file = jQuploadInput.get(0).files[0];
    if(!/image\/\w+/.test(file.type)){
        alert("请确保文件为图像类型");
        return false;
    }
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(e){
    	jQuploadBtn.css({'background-image': 'url('+this.result+')', 
    		'background-size': '150px 150px'});
        m1 = new Image();
        m1.src = this.result;
    }
}

jQuploadInput.bind('change',readFile)

var theCanvas = document.getElementById("j-canvas");
var context = theCanvas.getContext("2d");
function draw(image){
	theCanvas.width=800;
	theCanvas.style.width = 400;
	theCanvas.height = 1300;
	theCanvas.style.height = 650;
	theCanvas.style.margin = "auto";

	context.fillStyle="#fff";
	context.rect(0,0,800,1300);
	// 绘制图像
	context.fillStyle="#feebed";
	context.roundRect(40, 20, 660, 660, 30).fill();
	context.drawImage(image, 70, 50, 600, 600);
	//绘制背景
	var bg = new Image();
    bg.src = "static/images/bg.png";
	context.drawImage(bg, 0, 530, 800, 712);
	//绘制文字
	var content = jQcontent.val();
	context.font="36px Georgia";
	context.fillStyle="#000";
	writeTextOnCanvas(context, 40, 45, content);
}


jQgenerateBtn.bind('click', function(){
    var file = jQuploadInput.get(0).files[0];
    if(count ==0){
		alert("请输入告白内容")
    }else if(count>140) {
		alert("输入的文字过长")
	}else if(!file){
		alert("请上传图片")
	}else{
		readFile();
		draw(m1);
        jQenerater.hide();
        jQbbt.show();
	};

});
