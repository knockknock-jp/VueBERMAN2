import Vue from 'vue';
import Vuex from 'vuex';
import App from './App';

import 'es6-promise/auto';
import io from 'socket.io-client';
import {
    SET_USERS,
    SET_MAP,
    LOGIN,
    LOGOUT,
    SEND_COMMENT,
    SEND_USER_STATE,
    SEND_MAP_STATE,
    PLAY_GAME,
    PAUSE_GAME,
} from './mutation-types';

Vue.config.productionTip = false;
Vue.use(Vuex);

(()=> {

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

    const store = new Vuex.Store({
        state: {
            login: false,
            playGame: false, // プレーヤー操作可能
            uid: null,
            users: [],
            map: null,
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

        }
    });
    new Vue({
        el: '#app',
        store,
        components: { App },
        template: '<app/>',
    });

})()
