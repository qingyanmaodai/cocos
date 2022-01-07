
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad () {

    },

    onCollisionEnter: function (other, self) {
    // self在这个子弹的脚本里面相当于子弹，other跟哪个碰撞就是哪个 tag 1为子弹 2为敌机1 3为敌机2 4为敌机3
    if (self.tag == 1) {
        // 子弹碰撞了就回收
        game.onBulletKilled(self.node)
    }
    if (other.tag == 2) {
        // 获取这个脚本 只用other获取不了这个方法
        let js = other.node.getComponent('enemy_1')
        if (js && js.isDie == false) {
            js.Hit()
        }
    }else if(other.tag == 3){
        let js = other.node.getComponent('enemy_2')
        if (js && js.isDie == false) {
            // 当他isDie为true就不执行击中的方法了
            js.hit()
        }
    }else if(other.tag == 4){
        let js = other.node.getComponent('enemy_3')
        if (js && js.isDie == false) {
            // 当他isDie为true就不执行击中的方法了
            js.hit()
        }
    }
    console.log('撞到了');
    },

    update (dt) {
        // 该变量为1的时候才移动
        if (game.bulletType == 1) {
            this.node.y = this.node.y + 8
        }
        // 子弹超出范围自动删除
        if (this.node.y >= 568) {
            game.onBulletKilled(this.node)
        }
    },
});
