<template>
    <div class="container">
        <div class="box">
            <Playground/>
        </div>
        <div class="box2">
            <Status/>
        </div>
        <div class="box3">
            <UsersInfo/>
        </div>
        <template v-if="!login">
            <Login/>
        </template>
    </div>
</template>

<script>
    import Login from './components/login/Login';
    import Playground from './components/playground/Playground';
    import UsersInfo from './components/UsersInfo';
    import Status from './components/status/Status';

    export default {
        name: 'App',
        components: {
            Playground,
            UsersInfo,
            Status,
            Login,
        },
        computed: {
            login: function() {
                if (this.$store.state.uid) {
                    return true;
                }
                return false;
            }
        },
    }
</script>

<style lang="scss">
    @import 'reset-css';
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;900&display=swap');
    html {
        width: 100%;
        height: 100%;
    }
    body {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden;
        font-family: 'Noto Sans JP', sans-serif;
        font-size: 16px;
        letter-spacing: 0.1em;
    }
    .common__input-text {
        display: block;
        width: 100%;
        height: 30px;
        line-height: 30px;
        padding: 0 10px;
        box-sizing: border-box;
        border: solid 1px #333;
        border-radius: 5px;
        color: #fff;
        background-color: #000;
        &:focus {
            border: solid 1px #333;
            background-color: #333;
            outline: none;
        }
        &.focus {
            border: solid 1px #333;
            background-color: #333;
        }
    }
    .common__input-submit {
        display: block;
        width: 100%;
        height: 30px;
        line-height: 30px;
        padding: 0 10px;
        font-size: 12px;
        letter-spacing: 0.1em;
        color: #fff;
        cursor: pointer;
        border: none;
        border-radius: 5px;
        background-color: #a00000;
        &:hover {
            color: #000;
        }
        &:disabled {
            pointer-events: none;
            cursor: default;
            opacity: 0.3;
        }
        &--large {
            font-weight: 900;
            font-size: 20px;
            height: 50px;
            line-height: 50px;
        }
    }
</style>
<style scoped lang="scss">
    .container {
        position: relative;
        width: 100%;
        height: 100%;
    }
    .box {
        width: 100%;
        height: 100%;
    }
    .box2 {
        position: absolute;
        bottom: 10px;
        left: 10px;
        width: 200px;
        height: 200px;
    }
    .box3 {
        position: absolute;
        bottom: 10px;
        left: 220px;
        width: calc(100% - 230px);
        height: 200px;
    }
</style>
