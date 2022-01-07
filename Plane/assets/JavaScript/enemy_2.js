
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad () {
        this.init()
    },

    init:function () {
        // 二号机5点血
        this.hp = 5
        this.isDie = false
        // 二号机稍微慢点
        this.speed = 150+ Math.random() * 100
        // 播放正常动作
        this.normal()
    },
    normal:function () {
        var anim = this.getComponent(cc.Animation);
        anim.play('enemyNormal_2')
    },
    hit:function () {
        cc.log(this.hp)
        this.hp--
        if (this.hp <= 0) {
            this.isDie = true
            this.die()
            // 执行完不执行击中的动作了
            return
        }
        var anim = this.getComponent(cc.Animation);
        anim.over = function () {
            // 在动画后面加关键帧函数over执行原来飞行的动作
            this.normal()
        }.bind(this) //this指向问题，绑定下this
        anim.play('enemyHit_2')


    },
    die:function () {
        var anim = this.getComponent(cc.Animation);
        anim.over = function () {
            // 在动画后面加关键帧函数over执行回收
            game.onEnemyKilled(this.node,2)
            game.addScore(300)
        }
        anim.play('enemyBoom_2')
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
        // 敌机2传参数2
           game.onEnemyKilled(this.node,2)     
        }
    },
});
