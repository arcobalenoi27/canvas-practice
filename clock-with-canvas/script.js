var canvas = document.getElementById('clcok');
var context = canvas.getContext('2d');
var width = canvas.width;
var height = canvas.height;
var radius = width / 2;
// 比例關係為: 200/width = 10 / x  ; x為時鐘圓框的寬度, 我們用此關係來算比例, 可用於縮放時鐘
var scale =  width / 200;
var frameColor = '#5882FA';
var textColor = '#000';
var hourHandColor = '#2F0B3A';
var minuteHandColor = '#2F0B3A';
var secondHandColor = '#fe0000';
var hourDotColor = '#5882FA';
var minuteDotColor ='#ccc';
var dotColor = '#81BEF7';

function drawBackground() {
    context.save();
    context.translate(radius , radius);
    context.beginPath();//每畫一次/條線(路徑)都需要call這個function一次
    context.strokeStyle = frameColor;
    context.lineWidth = 10 * scale;
    context.arc(0, 0, radius - context.lineWidth /2 , 0, 2 * Math.PI, false);//定義要畫的東西的形狀 arc是用來畫弧線/曲線(圓或部分圓)
    context.stroke();//把定義好的形狀畫出來


    var hours = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2];
    context.font = 18 * scale + 'px Arial';//設定劃出來的文字Style
    context.fillStyle = textColor;
    context.textAlign = 'center'; //讓劃出的文字左右對齊
    context.textBaseline = 'middle'; //讓劃出來的文字上下對齊
    hours.forEach(function(value, index) {
        context.beginPath();
        var rad = 2 * Math.PI / 12 * index;
        var x =  Math.cos(rad) * (radius - 30 * scale );
        var y =  Math.sin(rad) * (radius - 30 * scale );

        context.fillText(value, x, y);
    });

    for(let i=0; i<60;i++) {
        var rad = 2 * Math.PI / 60 * i;
        var x =  Math.cos(rad) * (radius - 18 * scale);
        var y =  Math.sin(rad) * (radius - 18 * scale);
        context.beginPath();
        context.arc(x, y, 2 * scale, 0, 2 * Math.PI, false);
        if(i % 5 === 0) {
            context.fillStyle = hourDotColor; //整數旁的點為黑點
        }
        else {
            context.fillStyle = minuteDotColor; //非整數旁的點為灰點
        }
        context.fill();
    }
}

function drawHour(hour, minute) {
    context.save();//保存還沒有轉角度的畫布
    context.beginPath();
    //時針也會反映目前幾點的分鐘數所造成的弧度 算法是2 pi (360 degs)/12hrs/60min * 經過的分鐘數, 算出來就是經過1分鐘對時針角度的影響
    var minRad = 2 * Math.PI /12 /60 * minute;
    var rad = 2 * Math.PI / 12 * hour + minRad; //時針 + 分針的弧度
    context.rotate(rad);
    context.lineWidth = 6 * scale;
    context.lineCap = 'round';
    context.moveTo(0, 10);
    context.lineTo(0, - radius / 2);
    context.strokeStyle = hourHandColor;
    context.stroke();
    context.restore();//還原(讀取)到畫布旋轉之前的狀態
}

function drawMinute(minute) {
    context.save();
    context.beginPath();
    var rad = 2 * Math.PI /  60 * minute;
    context.rotate(rad);
    context.lineWidth = 3 * scale;
    context.lineCap = 'round';
    context.moveTo(0, 10);
    context.lineTo(0, - radius + 30 * scale);
    context.strokeStyle = minuteHandColor;
    context.stroke();
    context.restore();
}

function drawSecond(second) {
    context.save();
    context.beginPath();
    context.fillStyle = secondHandColor;
    var rad = 2 * Math.PI / 60 * second;
    context.rotate(rad);
    //畫一個秒針的圖形範圍/秒針的形狀
    context.moveTo(-2 * scale, 20 * scale);
    context.lineTo(2 * scale, 20 * scale);
    context.lineTo(1, - radius + 18 * scale); //記得秒針要指到點 所以長度要設定成跟畫小點的半徑一樣長
    context.lineTo(-1, -radius + 18 * scale);

    context.fill();
    context.restore();
}

function drawDot() {
    context.beginPath();
    context.fillStyle = dotColor;//時針, 分針, 秒針上的固定紐
    context.arc(0, 0, 3 * scale, 0, 2 * Math.PI, false);
    context.fill();
}






function drawNow() {
    context.clearRect(0, 0, width, height);//每秒清除一次畫布, 不然會因為每秒更新, 秒針會重複顯示
    var now = new Date();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    drawBackground();
    drawHour(hour, minute);
    drawMinute(minute);
    drawSecond(second);
    drawDot();
    context.restore();//將原點還原到外圍方框左上角
}

setInterval(drawNow, 1000);