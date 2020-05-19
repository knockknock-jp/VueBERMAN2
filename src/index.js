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
    // START_STAGE,
    SET_POINT,
    SET_BOMBS_MAP,
} from './mutation-types';
import * as PIXI from 'pixi.js';
import {
    CHARACTER_TYPE_000,
    CHARACTER_TYPE_001,
    CHARACTER_TYPE_002,
    ENEMY_TYPE_001,
    ENEMY_TYPE_002,
    ENEMY_TYPE_003,
} from "./const";
// import {
//     GAME_MAP_COL,
//     GAME_MAP_ROW,
// } from "./const";

Vue.config.productionTip = false;
Vue.use(Vuex);

window.textures = [];

// テクスチャ 読み込み
const loadTexture = (type)=> {
    return new Promise((resolve)=> {
        const loader = new PIXI.Loader();
        switch(type) {
            case 'field':
                loader.add('field', './assets/field.json').once('complete', ()=>{
                    const textures = [];
                    let i, max;
                    for (i = 0, max = 22; i <= max; i = i + 1) {
                        textures.push(PIXI.Texture.from(`cell-type-${i}`));
                    }
                    textures.push(PIXI.Texture.from(`cell-type-4-1`)); // 爆弾アニメーション
                    textures.push(PIXI.Texture.from(`cell-type-4-2`)); // 爆弾アニメーション
                    textures.push(PIXI.Texture.from(`cell-type-4-3`)); // 爆弾アニメーション
                    textures.push(PIXI.Texture.from(`cell-type-3-1`)); // ブロック爆破アニメーション
                    textures.push(PIXI.Texture.from(`cell-type-3-2`)); // ブロック爆破アニメーション
                    textures.push(PIXI.Texture.from(`cell-type-3-3`)); // ブロック爆破アニメーション
                    textures.push(PIXI.Texture.from(`cell-type-5-1`)); // 爆破アニメーション
                    textures.push(PIXI.Texture.from(`cell-type-5-2`)); // 爆破アニメーション
                    textures.push(PIXI.Texture.from(`cell-type-6-1`)); // 爆破アニメーション
                    textures.push(PIXI.Texture.from(`cell-type-6-2`)); // 爆破アニメーション
                    textures.push(PIXI.Texture.from(`cell-type-7-1`)); // 爆破アニメーション
                    textures.push(PIXI.Texture.from(`cell-type-7-2`)); // 爆破アニメーション
                    textures.push(PIXI.Texture.from(`cell-type-8-1`)); // 爆破アニメーション
                    textures.push(PIXI.Texture.from(`cell-type-8-2`)); // 爆破アニメーション
                    textures.push(PIXI.Texture.from(`cell-type-9-1`)); // 爆破アニメーション
                    textures.push(PIXI.Texture.from(`cell-type-9-2`)); // 爆破アニメーション
                    textures.push(PIXI.Texture.from(`cell-type-10-1`)); // 爆破アニメーション
                    textures.push(PIXI.Texture.from(`cell-type-10-2`)); // 爆破アニメーション
                    textures.push(PIXI.Texture.from(`cell-type-11-1`)); // 爆破アニメーション
                    textures.push(PIXI.Texture.from(`cell-type-11-2`)); // 爆破アニメーション
                    textures.push(PIXI.Texture.from(`cell-type-12-1`)); // 爆破アニメーション
                    textures.push(PIXI.Texture.from(`cell-type-12-2`)); // 爆破アニメーション
                    textures.push(PIXI.Texture.from(`cell-type-13-1`)); // 爆破アニメーション
                    textures.push(PIXI.Texture.from(`cell-type-13-2`)); // 爆破アニメーション
                    textures.push(PIXI.Texture.from(`cell-type-14-1`)); // 爆破アニメーション
                    textures.push(PIXI.Texture.from(`cell-type-14-2`)); // 爆破アニメーション
                    textures.push(PIXI.Texture.from(`cell-type-15-1`)); // 爆破アニメーション
                    textures.push(PIXI.Texture.from(`cell-type-15-2`)); // 爆破アニメーション
                    textures.push(PIXI.Texture.from(`cell-type-16-1`)); // 爆破アニメーション
                    textures.push(PIXI.Texture.from(`cell-type-16-2`)); // 爆破アニメーション
                    textures.push(PIXI.Texture.from(`cell-type-17-1`)); // 爆破アニメーション
                    textures.push(PIXI.Texture.from(`cell-type-17-2`)); // 爆破アニメーション
                    textures.push(PIXI.Texture.from(`cell-type-18-1`)); // 爆破アニメーション
                    textures.push(PIXI.Texture.from(`cell-type-18-2`)); // 爆破アニメーション
                    textures.push(PIXI.Texture.from(`cell-type-19-1`)); // 爆破アニメーション
                    textures.push(PIXI.Texture.from(`cell-type-19-2`)); // 爆破アニメーション
                    window.textures.push({
                        type: 'field',
                        textures: textures,
                    });
                    resolve();
                });
                break;
            case CHARACTER_TYPE_000:
                loader.add('sprite2', './assets/player000.json').once('complete', ()=>{
                    const textures = [];
                    let i, max;
                    for (i = 0, max = 3; i <= max; i = i + 1) {
                        textures.push(PIXI.Texture.from(`player000-down-${i}`));
                    }
                    for (i = 0, max = 3; i <= max; i = i + 1) {
                        textures.push(PIXI.Texture.from(`player000-up-${i}`));
                    }
                    for (i = 0, max = 3; i <= max; i = i + 1) {
                        textures.push(PIXI.Texture.from(`player000-left-${i}`));
                    }
                    for (i = 0, max = 3; i <= max; i = i + 1) {
                        textures.push(PIXI.Texture.from(`player000-right-${i}`));
                    }
                    textures.push(PIXI.Texture.from(`player000-death`));
                    window.textures.push({
                        type: type,
                        textures: textures,
                    });
                    resolve();
                });
                break;
            case CHARACTER_TYPE_001:
                loader.add('sprite3', './assets/player001.json').once('complete', ()=>{
                    const textures = [];
                    let i, max;
                    for (i = 0, max = 3; i <= max; i = i + 1) {
                        textures.push(PIXI.Texture.from(`player001-down-${i}`));
                    }
                    for (i = 0, max = 3; i <= max; i = i + 1) {
                        textures.push(PIXI.Texture.from(`player001-up-${i}`));
                    }
                    for (i = 0, max = 3; i <= max; i = i + 1) {
                        textures.push(PIXI.Texture.from(`player001-left-${i}`));
                    }
                    for (i = 0, max = 3; i <= max; i = i + 1) {
                        textures.push(PIXI.Texture.from(`player001-right-${i}`));
                    }
                    textures.push(PIXI.Texture.from(`player001-death`));
                    window.textures.push({
                        type: type,
                        textures: textures,
                    });
                    resolve();
                });
                break;
            case CHARACTER_TYPE_002:
                loader.add('sprite4', './assets/player002.json').once('complete', ()=>{
                    const textures = [];
                    let i, max;
                    for (i = 0, max = 3; i <= max; i = i + 1) {
                        textures.push(PIXI.Texture.from(`player002-down-${i}`));
                    }
                    for (i = 0, max = 3; i <= max; i = i + 1) {
                        textures.push(PIXI.Texture.from(`player002-up-${i}`));
                    }
                    for (i = 0, max = 3; i <= max; i = i + 1) {
                        textures.push(PIXI.Texture.from(`player002-left-${i}`));
                    }
                    for (i = 0, max = 3; i <= max; i = i + 1) {
                        textures.push(PIXI.Texture.from(`player002-right-${i}`));
                    }
                    textures.push(PIXI.Texture.from(`player002-death`));
                    window.textures.push({
                        type: type,
                        textures: textures,
                    });
                    resolve();
                });
                break;
            case ENEMY_TYPE_001:
                loader.add('sprite5', './assets/enemy.json').once('complete', ()=>{
                    const textures = [];
                    textures.push(PIXI.Texture.from('enemy-left-0'));
                    textures.push(PIXI.Texture.from('enemy-left-1'));
                    textures.push(PIXI.Texture.from('enemy-left-2'));
                    textures.push(PIXI.Texture.from('enemy-left-3'));
                    textures.push(PIXI.Texture.from('enemy-right-0'));
                    textures.push(PIXI.Texture.from('enemy-right-1'));
                    textures.push(PIXI.Texture.from('enemy-right-2'));
                    textures.push(PIXI.Texture.from('enemy-right-3'));
                    textures.push(PIXI.Texture.from('enemy-death'));
                    window.textures.push({
                        type: type,
                        textures: textures,
                    });
                    resolve();
                });
                break;
            case ENEMY_TYPE_002:
                loader.add('sprite6', './assets/enemy2.json').once('complete', ()=>{
                    const textures = [];
                    textures.push(PIXI.Texture.from('enemy2-left-0'));
                    textures.push(PIXI.Texture.from('enemy2-left-1'));
                    textures.push(PIXI.Texture.from('enemy2-left-2'));
                    textures.push(PIXI.Texture.from('enemy2-left-3'));
                    textures.push(PIXI.Texture.from('enemy2-right-0'));
                    textures.push(PIXI.Texture.from('enemy2-right-1'));
                    textures.push(PIXI.Texture.from('enemy2-right-2'));
                    textures.push(PIXI.Texture.from('enemy2-right-3'));
                    textures.push(PIXI.Texture.from('enemy2-death'));
                    window.textures.push({
                        type: type,
                        textures: textures,
                    });
                    resolve();
                });
                break;
            case ENEMY_TYPE_003:
                loader.add('sprite7', './assets/enemy3.json').once('complete', ()=>{
                    const textures = [];
                    textures.push(PIXI.Texture.from('enemy3-left-0'));
                    textures.push(PIXI.Texture.from('enemy3-left-1'));
                    textures.push(PIXI.Texture.from('enemy3-left-2'));
                    textures.push(PIXI.Texture.from('enemy3-left-3'));
                    textures.push(PIXI.Texture.from('enemy3-right-0'));
                    textures.push(PIXI.Texture.from('enemy3-right-1'));
                    textures.push(PIXI.Texture.from('enemy3-right-2'));
                    textures.push(PIXI.Texture.from('enemy3-right-3'));
                    textures.push(PIXI.Texture.from('enemy3-death'));
                    window.textures.push({
                        type: type,
                        textures: textures,
                    });
                    resolve();
                });
                break;
        }
        loader.load();
    });
}

// コンテンツ開始
const startContent = ()=> {

    // FPS表示
    // const stats = (()=> {
    //     const stats = new Stats();
    //     stats.showPanel(0);
    //     stats.domElement.style.position = 'absolute';
    //     stats.domElement.style.left = '0px';
    //     stats.domElement.style.top = '0px';
    //     document.body.appendChild(stats.domElement);
    //     return stats;
    // })();
    // setInterval(()=> {
    //     stats.update();
    // }, 1000 / 60);

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

    // ゲームマップ情報
    socket.on('bombsMap', (bombsMap)=>{
        // console.log('socket: bombsMap', bombsMap);
        // 爆弾マップ設定
        store.commit(SET_BOMBS_MAP, {
            bombsMap: bombsMap,
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

    // ポイント設定
    socket.on('points', (points)=>{
        // console.log('socket: points', points);
        // ポイント設定
        store.commit(SET_POINT, {
            points: points,
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
            points: [],
            bombsMap: null,
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

            // 爆弾マップ設定
            [SET_BOMBS_MAP] (state, payload) {
                // console.log(SET_BOMBS_MAP, state, payload);
                state.bombsMap = payload.bombsMap;
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

            // ポイント設定
            [SET_POINT] (state, payload) {
                // console.log(SET_POINT, state, payload);
                state.points = payload.points;
            },

        }
    });
    new Vue({
        el: '#app',
        store,
        components: { App },
        template: '<app/>',
    });

}

(()=> {
    const arr = [
        'field',
        CHARACTER_TYPE_000,
        CHARACTER_TYPE_001,
        CHARACTER_TYPE_002,
        ENEMY_TYPE_001,
        ENEMY_TYPE_002,
        ENEMY_TYPE_003
    ];
    let loaded = 0;
    let i, max;
    for (i = 0, max = arr.length; i < max; i = i + 1) {
        loadTexture(arr[i]).then(() => {
            if (arr.length - 1 <= loaded) {
                startContent();
            } else {
                loaded += 1;
            }
        });
    }
})()
