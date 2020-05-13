import Vue from 'vue';
import Vuex from 'vuex';
import App from './App';

import 'es6-promise/auto';
import io from 'socket.io-client';
import {
    SET_USERS,
    SET_MAP,
    SET_ENEMIES,
    LOGIN,
    LOGOUT,
    SEND_COMMENT,
    SEND_USER_STATE,
    SEND_MAP_STATE,
    PLAY_GAME,
    PAUSE_GAME,
    SET_PLAY_LOG,
    SET_EXIT,
    CHANGE_STAGE,
    START_STAGE,
} from './mutation-types';

Vue.config.productionTip = false;
Vue.use(Vuex);

(()=> {

    // FPS表示
    const stats = (()=> {
        const stats = new Stats();
        stats.showPanel(0);
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        document.body.appendChild(stats.domElement);
        return stats;
    })();
    setInterval(()=> {
        stats.update();
    }, 1000 / 60);

    const socket = io();

    // ユーザー情報
    socket.on('users', (users)=>{
        // console.log('socket: users', users);
        // ユーザー情報設定
        store.commit(SET_USERS, {
            users: users,
        });
    });

    // ゲームマップ情報
    socket.on('map', (map)=>{
        // console.log('socket: map', map);
        // ゲームマップ設定
        store.commit(SET_MAP, {
            map: map,
        });
    });

    // 敵情報
    socket.on('enemies', (enemies)=>{
        // console.log('socket: enemies', enemies);
        // 敵設定
        store.commit(SET_ENEMIES, {
            enemies: enemies,
        });
    });

    // プレイログ設定
    socket.on('playLog', (playLog)=>{
        // console.log('socket: playLog', playLog);
        // プレイログ設定
        store.commit(SET_PLAY_LOG, {
            playLog: playLog,
        });
    });

    // 出口設定
    socket.on('exit', (exit)=>{
        // console.log('socket: exit', exit);
        // 出口設定
        store.commit(SET_EXIT, {
            exit: exit,
        });
    });

    // ステージ設定
    socket.on('stage', (stage)=>{
        // console.log('socket: stage', stage);
        // ステージ変更
        store.commit(CHANGE_STAGE, {
            stage: stage,
        });
    });

    const store = new Vuex.Store({
        state: {
            login: false,
            playGame: false, // プレーヤー操作可能
            uid: null,
            users: [],
            map: null,
            enemies: [],
            playLog: [],
            exit: null,
            stage: 0,
            // playLog: [{
            //     uid: 'uid',
            //     date: '2020/01/01',
            //     message: 'ログインしました',
            // }],
        },
        mutations: {

            // ユーザー情報設定
            [SET_USERS] (state, payload) {
                // console.log(SET_USERS, state, payload);
                state.users = payload.users;
            },

            // ゲームマップ設定
            [SET_MAP] (state, payload) {
                // console.log(SET_MAP, state, payload);
                state.map = payload.map;
            },

            // 敵設定
            [SET_ENEMIES] (state, payload) {
                // console.log(SET_ENEMIES, state, payload);
                state.enemies = payload.enemies;
            },

            // ログイン
            [LOGIN] (state, payload) {
                // console.log(LOGIN, state, payload);
                state.login = true;
                const uid = Math.random().toString(36).slice(-8);
                state.uid = uid;
                // ユーザー追加
                socket.emit('addUser', {
                    uid: uid,
                    name: payload.name,
                    type: payload.type,
                    comments: [],
                    point: 0,
                    state: {
                        displayPositionX: 1, // 表示位置
                        displayPositionY: 1, // 表示位置
                        currentPositionY: 1, // 現在位置
                        currentPositionX: 1, // 現在位置
                        movingDirectionArr: [],
                        lastMovingDirection: 'down',
                        moveSpeed: 0.2, // 移動速度
                        explosionPower: 1, // 爆発威力
                        bombPossessions: 1, // 爆弾所有数
                        death: false,
                    },
                });
            },

            // ログアウト
            [LOGOUT] (state, payload) {
                // console.log(LOGOUT, state, payload);
                state.login = false;
                // ユーザー削除
                socket.emit('removeUser', state.uid);
                state.uid = null;
            },

            // コメント送信
            [SEND_COMMENT] (state, payload) {
                // console.log(SEND_COMMENT, state, payload);
                // コメント送信
                socket.emit('sendComment', {
                    uid: state.uid,
                    date: new Date().getTime(),
                    message: payload.message,
                })
            },

            // ユーザーの状態送信
            [SEND_USER_STATE] (state, payload) {
                // console.log(SEND_USER_STATE, state, payload);
                // ユーザーの状態送信
                socket.emit('sendUserState', {
                    uid: state.uid,
                    state: payload.state,
                })
            },

            // マップの状態送信
            [SEND_MAP_STATE] (state, payload) {
                // console.log(SEND_MAP_STATE, state, payload);
                // マップの状態送信
                socket.emit('sendMapState', {
                    y: payload.y,
                    x: payload.x,
                    type: payload.type,
                    uid: payload.uid,
                })
            },

            // ゲーム開始
            [PLAY_GAME] (state, payload) {
                // console.log(PLAY_GAME, state, payload);
                state.playGame = true;
            },

            // ゲーム停止
            [PAUSE_GAME] (state, payload) {
                // console.log(PAUSE_GAME, state, payload);
                state.playGame = false;
            },

            // プレイログ設定
            [SET_PLAY_LOG] (state, payload) {
                // console.log(SET_PLAY_LOG, state, payload);
                state.playLog = payload.playLog;
            },

            // 出口設定
            [SET_EXIT] (state, payload) {
                // console.log(SET_EXIT, state, payload);
                state.exit = payload.exit;
            },

            // ステージ変更
            [CHANGE_STAGE] (state, payload) {
                // console.log(CHANGE_STAGE, state, payload);
                state.stage = payload.stage;
            },

        }
    });
    new Vue({
        el: '#app',
        store,
        components: { App },
        template: '<app/>',
    });

})()
