<template>
    <div class="container">
        <div class="box">
            <Playground/>
        </div>
        <div class="box2">
            <Status/>
        </div>
        <div class="box3">
            <PlayLog/>
        </div>
        <div class="box4">
            <UsersInfo/>
        </div>
        <template v-if="!login">
            <div class="box5">
                <Login/>
            </div>
        </template>
    </div>
</template>

<script>
    import Login from './components/login/Login';
    import Playground from './components/playground/Playground';
    import UsersInfo from './components/UsersInfo';
    import Status from './components/status/Status';
    import PlayLog from './components/play-log/PlayLog';

    export default {
        name: 'App',
        components: {
            Playground,
            UsersInfo,
            Status,
            Login,
            PlayLog,
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
        background-color: #000;
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
        position: absolute;
        top: 0;
        left: 0;
        overflow: hidden;
        width: 100%;
        height: calc(100% - 200px);
    }
    .box2 {
        z-index: 2;
        position: absolute;
        bottom: 10px;
        left: 10px;
        width: 180px;
        height: 180px;
    }
    .box3 {
        z-index: 1;
        position: absolute;
        bottom: 120px;
        left: 310px;
        width: calc(100% - 320px);
        height: 70px;
    }
    .box4 {
        position: absolute;
        bottom: 10px;
        left: 310px;
        width: calc(100% - 320px);
        height: 180px;
    }
    .box5 {
        z-index: 3;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    @media screen and (max-width: 896px) {
        .box {
            height: calc(100% - 150px);
        }
        .box2 {
            height: 130px;
            width: calc(100% - 20px);
        }
        .box3 {
            display: none;
        }
        .box4 {
            display: none;
        }
        .box5 {
            position: absolute;
        }
    }
</style>
