cc.Class({
    extends: cc.Component,

    properties: {
        label_num:cc.Label,
    },

    onLoad () {
        this.timeNum = 5
        this.label_num.string = this.timeNum
        this.schedule(function(){
            this.timeNum--
            this.label_num.string = this.timeNum
            if (this.timeNum == 0) {
                this.goToGame()
            }
        },1)
    },
    goToGame:function () {
        // 跳转到666的canvas
        cc.director.loadScene("666");
    },

    update (dt) {},
});
