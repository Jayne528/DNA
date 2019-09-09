
window.onload = function() {

    //環境變數
    var updateFPS = 30;
    var showMouse = true;
    var time = 0;
    var bgcolor = "black";

    //控制
    var controls = {
        freq: 0.02, //頻率
        amp: 30, //振幅
        noise:30,  //雜訊

    }

    var gui = new dat.GUI();
    gui.add(controls, "freq", 0, 1).step(0.01).onChange(function(value) {

    });

    gui.add(controls, "amp", 0, 30).step(0.01).onChange(function(value) {

    });
    gui.add(controls, "noise", 0, 150).step(0.01).onChange(function(value) {

    });
    //--------------vec2 向量------------------

    class Vec2 {
        constructor(x, y){
            this.x = x;
            this.y = y;
        }

        set(x, y) {
            this.x = x;
            this.y = y;
        }
        
        move(x, y) {
            this.x += x;
            this.y += y;
        }

        add(v) {
            return new Vec2(this.x + v.x, this.y + v.y)
        }
        sub(v) {
            return new Vec2(this.x - v.x, this.y - v.y)
        }
        mul(s) {
            return new Vec2(this.x*s, this.y*s)
        }

        //新的向量長度
        set length(nv) {
            var temp = this.unit.mul(nv); //this.unit.mul(nv) 是1
            this.set(temp.x, this.y);
        }

        get length() {
            return Math.sqrt(this.x*this.x + this.y*this.y);
        }

        clone() {
            return new Vec2(this.x, this.y);
        }
        //轉成字串
        toString() {
            // return "("+this.x+","+this.y+")";
            return `(${this.x}, ${this.y})`;
        }
        //比較
        equal(){
            return this.x == v.x && this.y == v.y;
        }

        get angle() {
            return Math.atan2(this.y, this.x);
        }

        get unit() {
            return this.mul(1/this.length);
        }


    }
//------------------------------------------------------------
    var canvas = document.getElementById("canvas");
    var cx = canvas.getContext("2d");
   
    //設定畫圓
    cx.circle = function(v, r) {
        this.arc(v.x, v.y, r, 0, Math.PI*2);
    }
    //設定畫線
    cx.line = function (v1, v2) {
        this.moveTo(v1.x, v1.y);
        this.lineTo(v2.x, v2.y);

    }

    // canvas的設定
    function initCanvas() {
 
        ww = canvas.width = window.innerWidth;
        wh = canvas.height =window.innerHeight;
    }
    initCanvas();


    //邏輯的初始化
    function init() {

    }

    //遊戲邏輯的更新
    function update() {

        time++;
    }

    //畫面更新
    function draw() {

        //清空背景
        cx.fillStyle = bgcolor;
        cx.fillRect(0, 0, ww, wh);

        //----在這繪製--------------------------------

        // 畫sin波
        cx.beginPath();
        for(var i = 0; i<ww; i++) {

            var deg = i * controls.freq + time/20;
            var noise = controls.amp * Math.random();
            var wave = controls.amp * Math.sin(deg);
            cx.lineTo(i, wave + noise + wh/2);
            // cx.lineTo(i, noise + wh/2);
        }
        cx.lineWidth = 2;
        cx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        cx.stroke();

        //畫DNA
        cx.beginPath();
        for(var i = 0; i<wh; i++) {
            var deg = i * controls.freq + time/20;
            cx.lineTo(controls.amp * Math.sin(deg)+ww/2, i );
        }

        cx.strokeStyle = "white";
        cx.stroke();

        //鏡像sin波 -1
        cx.beginPath();
        for(var i = 0; i<wh; i++) {
            var deg = i * controls.freq + time/20;
            cx.lineTo(-controls.amp * Math.sin(deg)+ww/2, i );
        }

        cx.strokeStyle = "white";
        cx.stroke();


        // DNA 橫線
        cx.lineWidth = 2;
        for (var i = 0; i< wh; i+=15) {

            var deg = i * controls.freq + time/20;
            var amp = controls.amp*Math.sin(deg);
            var x1 = ww/2 + amp;
            var x2 = ww/2 - amp;
            cx.beginPath();
            cx.moveTo(x1, i);
            cx.lineTo(x2, i);
            cx.stroke();

            cx.beginPath();
            cx.arc(x1, i, Math.sin(i + time/10)*2+5, 0, Math.PI*2);
            cx.arc(x2, i, 3, 0, Math.PI*2);
            cx.fillStyle = "rgb("+ i/4+","+i/2+","+"50"+i/1.5+")";
            cx.fill();

        }





        //----------------------------------------

        //滑鼠
        cx.fillStyle = "red";
        cx.beginPath();
        cx.circle(mousePos,3);
        cx.fill();

        //滑鼠線
        cx.save();
            cx.beginPath();
            cx.translate(mousePos.x, mousePos.y);
              
                cx.strokeStyle = "red";
                var len = 20;
                cx.line(new Vec2(-len, 0), new Vec2(len, 0));

                cx.fillText (mousePos, 10, -10);
                cx.rotate(Math.PI/2);
                cx.line(new Vec2(-len, 0), new Vec2(len, 0));
                cx.stroke();

        cx.restore();




        requestAnimationFrame(draw)
    }

    //頁面載完依序呼叫
    function loaded() {

        initCanvas();
        init();
        requestAnimationFrame(draw);
        setInterval(update, 1000/updateFPS);
    }

    // window.addEventListener('load', loaded);
    //頁面縮放
    window.addEventListener('resize', initCanvas);


    //滑鼠 事件更新
    var mousePos = new Vec2(0, 0);
    var mousePosDown = new Vec2(0, 0);
    var mousePosUP = new Vec2(0, 0);

    window.addEventListener("mousemove",mousemove);
    window.addEventListener("mouseup",mouseup);
    window.addEventListener("mousedown",mousedown);

    function mousemove(evt) {
        // mousePos.set(evt.offsetX, evt.offsetY);
        mousePos.set(evt.x, evt.y);
        

    }
    function mouseup(evt) {
        // mousePos.set(evt.offsetX, evt.offsetY);
        mousePos.set(evt.x, evt.y);
        mousePosUP = mousePos.clone();
        
    }
    function mousedown(evt) {
        // mousePos.set(evt.offsetX, evt.offsetY);
        mousePos.set(evt.x, evt.y);
        mousePosDown = mousePos.clone();
    }

    loaded();
}
