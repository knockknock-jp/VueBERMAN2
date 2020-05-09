<template>
    <div>
        <template v-if="user">
            <div class="container">
                <template v-if="0 < user.point">
                    <div class="box-lank">{{lank}}<span>/ {{usersLength}}</span></div>
                </template>
                <div class="box-icon">
                    <CharacterIcon v-bind:type="user.type" />
                </div>
                <div class="box-comment">
                    <template v-if="isEditing">
                        <textarea class="textarea" maxlength="40" cols="20" rows="4" v-model="inputMessage"></textarea>
                    </template>
                    <template v-else>
                        <template v-if="comment">
                            <span>{{comment}}</span>
                        </template>
                        <template v-else>
                            <span>...</span>
                        </template>
                    </template>
                    <a class="link-create" v-on:click.prevent="editMessage()">Create</a>
                </div>
                <div class="box-point">{{user.point}}<span>pt</span></div>
                <div class="box-name">{{user.name}}</div>
                <div class="box-logout">
                    <input class="common__input-submit" type="button" value="LOGOUT" v-on:click="logout()" />
                </div>
            </div>
        </template>
    </div>
</template>

<script>
    import {LOGOUT, PLAY_GAME, PAUSE_GAME, SEND_COMMENT} from '../../mutation-types';
    import CharacterIcon from '../character-icon/CharacterIcon'

    export default {
        name: 'Status',
        components: {
            CharacterIcon,
        },
        data: function () {
            return {
                inputMessage: null,
                isEditing: false,
            }
        },
        methods: {
            logout: function() {
                this.$store.commit(LOGOUT);
            },
            editMessage: function() {
                if (this.isEditing) {
                    this.isEditing = false;
                    this.$store.commit(SEND_COMMENT, {
                        message: this.inputMessage
                    });
                    this.$store.commit(PLAY_GAME);
                } else {
                    this.isEditing = true;
                    this.inputMessage = this.comment;
                    this.$store.commit(PAUSE_GAME);
                }
            },
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
                    if (this.$store.state.users[i].uid === this.$store.state.uid) {
                        return arr.indexOf(Number(this.$store.state.users[i].point)) + 1;
                    }
                }
                return null;
            },
            user: function() {
                let i, max;
                for (i = 0, max = this.$store.state.users.length; i < max; i = i + 1) {
                    if (this.$store.state.users[i].uid === this.$store.state.uid) {
                        return this.$store.state.users[i];
                    }
                }
                return null;
            },
            comment: function() {
                if (this.user && this.user.comments && this.user.comments[0] && this.user.comments[0].message) {
                    return this.user.comments[0].message || null;
                }
                return null;
            },
            usersLength: function() {
                return this.$store.state.users.length
            },
        },
    }
</script>

<style scoped lang="scss">
    .container {
        width: 200px;
        height: 200px;
        border-radius: 10px;
        background-color: rgba(0, 0, 0, 0.7);
    }
    .box-lank {
        position: absolute;
        top: -30px;
        left: 0;
        width: 100px;
        font-size: 25px;
        font-weight: 900;
        color: #ff6600;
        text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
        & > span {
            display: inline-block;
            margin-left: 5px;
            font-size: 10px;
            color: #fff;
        }
    }
    .box-icon {
        position: absolute;
        top: 10px;
        left: 0;
        width: 100px;
        height: 100px;
    }
    .box-comment {
        position: absolute;
        top: -20px;
        left: 90px;
        width: 150px;
        border-radius: 15px;
        box-sizing: border-box;
        padding: 10px;
        background-color: #fff;
        & > span {
            position: relative;
            z-index: 1;
            display: block;
            font-size: 10px;
            line-height: 1.5em;
            word-break: break-all;
        }
        &:after {
            display: block;
            position: absolute;
            top: 70%;
            left: -15px;
            transform: translateY(-50%);
            content: '';
            width: 20px;
            height: 20px;
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
            background-image: url('./bg.png');
        }
    }
    .box-point {
        position: absolute;
        bottom: 90px;
        left: 90px;
        width: 100px;
        font-size: 20px;
        font-weight: 900;
        color: #ff6600;
        & > span {
            display: inline-block;
            margin-left: 5px;
            font-size: 10px;
            font-weight: 400;
            color: #fff;
        }
    }
    .box-name {
        position: absolute;
        top: 120px;
        left: 10px;
        width: 180px;
        text-align: center;
        word-break: break-all;
        color: #fff;
        font-size: 12px;
        line-height: 1.2em;
        letter-spacing: 0;
    }
    .box-logout {
        position: absolute;
        bottom: 10px;
        left: 10px;
        width: 180px;
    }
    .link-create {
        position: absolute;
        z-index: 1;
        bottom: -10px;
        right: -10px;
        overflow: hidden;
        display: block;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        text-indent: -9999px;
        text-align: left;
        background-color: #ccc;
        background-size: 20px 20px;
        background-position: center;
        background-repeat: no-repeat;
        background-image: url('./create-24px.svg');
        &:hover {
            background-color: #a00000;
        }
    }
    .textarea {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding: 5px;
        border: solid 1px #ccc;
        border-radius: 5px;
        line-height: 1.5em;
        font-size: 10px;
        resize: none;
        background-color: #fff;
        &:focus {
            outline: none;
            background-color: #ccc;
        }
    }
</style>
