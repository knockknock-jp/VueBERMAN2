<template>
    <div class="wrapper">
        <section class="container">
            <h1 class="heading">
                <span>Vue<span>O</span>BERMAN 2</span>
            </h1>
            <div class="box">
                <dl class="list-dl2">
                    <dt>Move Up</dt>
                    <dd><span>ArrowUp</span> or <span>W</span></dd>
                </dl>
                <dl class="list-dl2">
                    <dt>Move Down</dt>
                    <dd><span>ArrowDown</span> or <span>S</span></dd>
                </dl>
                <dl class="list-dl2">
                    <dt>Move Left</dt>
                    <dd><span>ArrowLeft</span> or <span>A</span></dd>
                </dl>
                <dl class="list-dl2">
                    <dt>Move Right</dt>
                    <dd><span>ArrowRight</span> or <span>D</span></dd>
                </dl>
                <dl class="list-dl2">
                    <dt>Set Bomb</dt>
                    <dd><span>Shift</span> or <span>Enter</span></dd>
                </dl>
            </div>
            <div class="box">
                <form v-on:submit.prevent="submit">
                    <dl class="list-dl">
                        <dt>Type</dt>
                        <dd>
                            <template v-for="(type, i) in charaTypes">
                                <input class="input-radio" v-bind:id="'label' + i" type="radio" v-bind:value="type" v-model="charaType" />
                                <label class="label" v-bind:for="'label' + i">
                                    <CharacterIcon v-bind:type="type"/>
                                </label>
                            </template>
                        </dd>
                    </dl>
                    <dl class="list-dl">
                        <dt>Name</dt>
                        <dd><input class="common__input-text" type="text" maxlength="10" v-model="charaName" v-bind:class="charaName ? 'focus' : ''" ref="inputTextName" placeholder="" /></dd>
                    </dl>
                    <div class="box">
                        <input class="common__input-submit common__input-submit--large" type="submit" value="LOGIN" v-bind:disabled="!charaName || !charaType ? true : false" />
                    </div>
                </form>
            </div>
        </section>
    </div>
</template>

<script>
    import {LOGIN, PLAY_GAME} from '../../mutation-types';
    import { CHARACTER_TYPES } from '../../const'
    import CharacterIcon from '../character-icon/CharacterIcon'

    export default {
        name: 'Login',
        components: {
            CharacterIcon,
        },
        data: function () {
            return {
                charaType: CHARACTER_TYPES[0],
                // charaName: 'test',
                charaName: null,
                charaTypes: CHARACTER_TYPES,
            }
        },
        mounted() {
            this.$refs.inputTextName.focus();
        },
        methods: {
            submit: function() {
                if (!this.charaName || !this.charaName) return;
                this.$store.commit(LOGIN, {
                    name: this.charaName,
                    type: this.charaType
                })
                setTimeout(()=> {
                    this.$store.commit(PLAY_GAME);
                }, 100);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .wrapper {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
    }
    .container {
        position: absolute;
        top: calc(50% - 100px);
        left: 50%;
        transform: translate(-50%, -50%);
        box-sizing: border-box;
        padding: 40px;
        width: 100%;
        max-width: 600px;
        /*border-radius: 10px;*/
        background-color: #000;
    }
    .heading {
        display: block;
        padding: 20px;
        border-radius: 5px;
        text-align: center;
        background-color: #333;
        & > span {
            display: inline-block;
            padding: 0 10px;
            font-size: 40px;
            font-weight: 900;
            line-height: 1em;
            color: #fc0;
            font-style: italic;
            background: -webkit-linear-gradient(90deg, #f00, #fc0, #f00);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            & > span {
                position: relative;
                margin-right: -5px;
                top: 5px;
                overflow: hidden;
                text-align: left;
                text-indent: -999px;
                width: 40px;
                height: 40px;
                display: inline-block;
                background-size: contain;
                background-position: center;
                background-repeat: no-repeat;
                background-image: url('./bomb.png');
            }
        }
    }
    .box {
        margin-top: 20px;
    }
    .list-dl {
        display: table;
        margin-top: 20px;
        width: 100%;
        > dt {
            display: table-cell;
            vertical-align: top;
            text-align: right;
            padding-right: 10px;
            width: 50px;
            font-size: 10px;
            color: #999;
        }
        > dd {
            display: table-cell;
        }
    }
    .list-dl2 {
        margin: 5px auto 0 auto;
        width: 300px;
        display: table;
        > dt {
            padding-right: 5px;
            display: table-cell;
            width: 40%;
            text-align: right;
            font-size: 10px;
            color: #999;
        }
        > dd {
            padding-left: 5px;
            display: table-cell;
            width: 60%;
            text-align: left;
            font-size: 10px;
            color: #999;
            & > span {
                display: inline-block;
                height: 20px;
                line-height: 20px;
                padding: 0 10px;
                border-radius: 5px;
                color: #000;
                background-color: #ccc;
            }
        }
    }
    .label {
        display: inline-block;
        margin-right: 10px;
        padding: 10px;
        border: solid 1px #333;
        border-radius: 5px;
        width: 50px;
        height: 50px;
        cursor: pointer;
        &:hover {
            background-color: #333;
        }
    }
    .input-radio {
        display: none;
        &:checked + .label {
            background-color: #333;
        }
    }
    @media screen and (max-width: 896px) {
        .wrapper {
            background: #000;
        }
        .container {
            top: 50%;
            padding: 20px;
            max-width: 100%;
        }
        .heading {
            padding: 20px;
            & > span {
                font-size: 30px;
                & > span {
                    width: 30px;
                    height: 30px;
                }
            }
        }
        .list-dl2 {
            display: none;
        }
    }
</style>
