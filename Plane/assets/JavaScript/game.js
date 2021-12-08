

cc.Class({
    extends: cc.Component,
    // 声明node，使cocos不同组件关联起来可以用于js
    properties: {
        bg_1:cc.Node,
        bg_2:cc.Node,
        gameReady:cc.Node,
        gamePlaying:cc.Node,
        gamePause:cc.Node,
        hero:cc.Node,
    },

    // 加载界面，用js将bg1的y轴设置0，bg2在bg1上方
    onLoad () {
        this.isBgMove = false
        this.bg_1.y = 0
        this.bg_2.y = this.bg_1.y + this.bg_1.height
        this.setTouch()
        this.gameReady.active = true
        this.gamePlaying.active = false
        this.gamePause.active = false
    },
    // 添加触摸事件并让加载时执行此函数，this.node相当于整个画布
    setTouch:function() {
        // 当手指触点落在目标节点区域内时
        this.node.on("touchstart", function (event) {
            // console.log("touchstart");
          }, this);
        // 当手指在屏幕上移动时
        this.node.on("touchmove", function (event) {
            // console.log("touchmove");
            // 声明两个变量，第一个是获取当前飞机的坐标，第二个距离上一次移动的的xy值
            var pos_hero = this.hero.getPosition()
            var pos_move = event.getDelta()
            //设置飞机的坐标为这次获取的坐标加上上一次移动的坐标为本次移动的坐标
            this.hero.setPosition(cc.Vec2(pos_hero.x + pos_move.x,pos_hero.y + pos_move.y))
            // console.log(pos_move);
          }, this);
        // 当手指在目标节点区域内离开屏幕时，准备界面隐藏，游戏界面呈现
        this.node.on("touchend", function (event) {
            // console.log("touchend");
            this.gameReady.active = false;
            this.gamePlaying.active = true;
            this.isBgMove = true
          }, this);
    },
    // 设置不同按钮，传参进去看为哪个执行哪个
    clickBtn:function(sender,str){
        if (str == "pause") {
            this.gamePause.active = true
        }else if(str == "continue"){
            this.gamePause.active = false
        }else if(str == "replay"){
            this.gamePause.active = false
        }else if(str == "backHome"){
            this.gamePause.active = false
            this.gameReady.active = true
            this.gamePlaying.active = false
        }
    },
    // 设置一个函数用于背景一直循环，两个背景bg在上面，一起向下移动，bg1移动到一定值（bg1的高度）返回bg2上方，bg2同理
    setBg:function(){
        this.bg_1.y = this.bg_1.y - 2
        this.bg_2.y = this.bg_2.y - 2
        if (this.bg_1.y <= -this.bg_1.height) {
            this.bg_1.y =this.bg_2.y + this.bg_1.height
        }
        if (this.bg_2.y <= -this.bg_1.height) {
            this.bg_2.y =this.bg_1.y + this.bg_1.height
        }
    },
    // 一直刷新的函数，dt为1/fps 两帧之间的时间间隔 单位是秒
    update (dt) {
        if (this.isBgMove) {
            this.setBg()
        }
        
    },
});
