
cc.Class({
    extends: cc.Component,

    properties: {
        
    },


    onLoad () {
        this.init()
    },

    init:function () {
        // 三号机8点血
        this.hp = 8
        // 三号机更慢
        this.speed = 100+ Math.random() * 50
        this.isDie = false
        // 播放正常动作
        this.normal()
    },

    normal:function () {
        var anim = this.getComponent(cc.Animation);
        anim.play('enemyNormal_3')
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
        anim.play('enemyHit_3')


    },
    die:function () {
        var anim = this.getComponent(cc.Animation);
        anim.over = function () {
            // 在动画后面加关键帧函数over执行回收
            game.onEnemyKilled(this.node,3)
            game.addScore(500)
        }
        anim.play('enemyBoom_3')
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
        // 由于三号机比较大，y轴要到-715才回收
        if (this.node.y <= -715) {
        // 敌机2传参数2
           game.onEnemyKilled(this.node,3)     
        }
    },
});
