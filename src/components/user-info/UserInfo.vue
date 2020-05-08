<template>
    <div class="container2" v-bind:class="current ? 'current' : ''">
        <template v-if="comment">
            <div class="box-comment">
                {{comment}}
            </div>
        </template>
        <div class="box-icon">
            <CharacterIcon v-bind:type="userInfo.type" />
        </div>
        <template v-if="0 < userInfo.point">
            <div class="box-lank"><span>LANK</span>{{lank}}</div>
        </template>
        <div class="box-point">{{userInfo.point}}<span>pt</span></div>
        <div class="box-name">
            {{userInfo.name}}
        </div>
    </div>
</template>

<script>
    import CharacterIcon from '../character-icon/CharacterIcon'

    export default {
        name: 'UserInfo',
        components: {
            CharacterIcon,
        },
        props: {
            uid: null,
        },
        computed: {
            lank: function() {
                let arr = [];
                let i, max;
                for (i = 0, max = this.$store.state.users.length; i < max; i = i + 1) {
                    arr.push(Number(this.$store.state.users[i].point));
                }
                arr.filter(function (x, i, self) {
                    return self.indexOf(x) === i;
                });
                arr.sort((a, b)=> {
                    return (b < a ? -1 : 1);
                });
                for (i = 0, max = this.$store.state.users.length; i < max; i = i + 1) {
                    if (this.$store.state.users[i].uid === this.uid) {
                        return arr.indexOf(Number(this.$store.state.users[i].point)) + 1;
                    }
                }
                return null;
            },
            userInfo: function() {
                let i, max;
                for (i = 0, max = this.$store.state.users.length; i < max; i = i + 1) {
                    if (this.$store.state.users[i].uid === this.uid) {
                        return this.$store.state.users[i];
                    }
                }
                return null;
            },
            comment: function() {
                if (this.userInfo && this.userInfo.comments && this.userInfo.comments[0] && this.userInfo.comments[0].message) {
                    return this.userInfo.comments[0].message || null;
                }
                return null;
            },
            current: function() {
                let i, max;
                for (i = 0, max = this.$store.state.users.length; i < max; i = i + 1) {
                    if (this.$store.state.uid === this.uid) {
                        return true;
                    }
                }
                return false;
            },
        }
    }
</script>

<style scoped lang="scss">
    .container2 {
        position: relative;
        width: 100%;
        height: 100%;
        border-radius: 10px;
        box-sizing: border-box;
        background-color: rgba(0, 0, 0, 0.7);
        &.current {
        }
    }
    .box-comment {
        position: absolute;
        bottom: 105px;
        left: 0;
        border-radius: 10px;
        width: 100px;
        box-sizing: border-box;
        padding: 5px;
        font-size: 10px;
        letter-spacing: 0;
        line-height: 1.2em;
        word-break: break-all;
        color: #000;
        background-color: rgba(255, 255, 255, 0.7);
        &:after {
            display: block;
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            content: '';
            width: 10px;
            height: 10px;
            opacity: 0.7;
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
            background-image: url('./bg.png');
        }
    }
    .box-icon {
        position: absolute;
        top: 5px;
        left: 5px;
        width: 50px;
        height: 50px;
    }
    .box-lank {
        position: absolute;
        top: 20px;
        left: 50px;
        width: 50px;
        font-size: 12px;
        font-weight: 900;
        letter-spacing: 0;
        color: #ff6600;
        & > span {
            display: inline-block;
            margin-right: 2px;
            font-size: 10px;
            font-weight: 400;
            color: #fff;
        }
    }
    .box-point {
        position: absolute;
        top: 35px;
        left: 50px;
        width: 50px;
        font-size: 12px;
        font-weight: 900;
        letter-spacing: 0;
        color: #ff6600;
        & > span {
            display: inline-block;
            margin-left: 2px;
            font-size: 10px;
            font-weight: 400;
            color: #fff;
        }
    }
    .box-name {
        position: absolute;
        top: 60px;
        left: 0;
        width: 100%;
        box-sizing: border-box;
        padding: 0 5px;
        font-size: 10px;
        line-height: 1.2em;
        letter-spacing: 0;
        text-align: center;
        word-break: break-all;
        color: #fff;
    }
</style>
