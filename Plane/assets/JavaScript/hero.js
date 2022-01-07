cc.Class({
    extends: cc.Component,

    properties: {
        
    },


    onLoad () {
        this.init()
    },

    onCollisionEnter: function (other, self) {
        if (self.tag == 5 && this.isDie == false) { //5为本机
            // 碰撞后执行死亡函数
            this.isDie = true
            // 死亡后
            game.bulletType = 3
            this.die()
        }
    },
    init:function () {
        this.node.active = true
        this.isDie = false
        // 开始执行正常动画
        this.normal()
    },
    normal:function () {
        var anim = this.getComponent(cc.Animation);
        anim.play('heroNormal')
    },
    die:function () {
        var anim = this.getComponent(cc.Animation);
        anim.play('heroDie')
        anim.over = function () {
            this.node.active = false
            game.gameEnd()
        }.bind(this)
        
    },

    update (dt) {},
});
