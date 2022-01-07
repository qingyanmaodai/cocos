
cc.Class({
    extends: cc.Component,

    properties: {
        
    },


    onLoad () {
        this.init()
    },

    init:function () {
        this.isDie = false
        // 设置随机速度
        this.speed = 200 + Math.random() * 150
        var anim = this.getComponent(cc.Animation);
        anim.play('enemyNormal_1')
    },

    Hit:function () {
        this.isDie = true
        var anim = this.getComponent(cc.Animation);
        // 执行函数并执行爆炸动画
        anim.play('enemyBoom_1')
        // 在动画后面加关键帧函数over执行回收敌机对象
        anim.over = function () {
            game.onEnemyKilled(this.node,1)
            game.addScore(100)
        }
    },


    update (dt) {
        if (this.isDie) {
            // 如果死了就不向下移动
            return
        }
        // 敌机向下移动,为1类型的时候才动
        if (game.bulletType == 1) {
            this.node.y = this.node.y - this.speed * dt
        }
        
        // 如果到达底下回收敌机对象
        if (this.node.y <= -654) {
        // 敌机1传参数1
           game.onEnemyKilled(this.node,1)     
        }
    },
});
