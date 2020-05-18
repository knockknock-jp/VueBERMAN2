var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', (req, res)=> {
    res.sendFile(__dirname + '/index.html');
});

app.get('/og-image.png', (req, res)=> {
    res.sendFile(__dirname + '/og-image.png');
});

app.get('/main.js', (req, res)=> {
    res.sendFile(__dirname + '/main.js');
});

app.get('/main.min.js', (req, res)=> {
    res.sendFile(__dirname + '/main.min.js');
});

app.get('/assets/field.json', (req, res)=> {
    res.sendFile(__dirname + '/assets/field.json');
});

app.get('/assets/field.png', (req, res)=> {
    res.sendFile(__dirname + '/assets/field.png');
});

app.get('/assets/player000.json', (req, res)=> {
    res.sendFile(__dirname + '/assets/player000.json');
});

app.get('/assets/player000.png', (req, res)=> {
    res.sendFile(__dirname + '/assets/player000.png');
});

app.get('/assets/player001.json', (req, res)=> {
    res.sendFile(__dirname + '/assets/player001.json');
});

app.get('/assets/player001.png', (req, res)=> {
    res.sendFile(__dirname + '/assets/player001.png');
});

app.get('/assets/player002.json', (req, res)=> {
    res.sendFile(__dirname + '/assets/player002.json');
});

app.get('/assets/player002.png', (req, res)=> {
    res.sendFile(__dirname + '/assets/player002.png');
});

app.get('/assets/enemy.png', (req, res)=> {
    res.sendFile(__dirname + '/assets/enemy.png');
});

app.get('/assets/enemy.json', (req, res)=> {
    res.sendFile(__dirname + '/assets/enemy.json');
});

app.get('/assets/enemy2.png', (req, res)=> {
    res.sendFile(__dirname + '/assets/enemy2.png');
});

app.get('/assets/enemy2.json', (req, res)=> {
    res.sendFile(__dirname + '/assets/enemy2.json');
});

app.get('/assets/enemy3.png', (req, res)=> {
    res.sendFile(__dirname + '/assets/enemy3.png');
});

app.get('/assets/enemy3.json', (req, res)=> {
    res.sendFile(__dirname + '/assets/enemy3.json');
});

app.get('/assets/exit.png', (req, res)=> {
    res.sendFile(__dirname + '/assets/exit.png');
});

app.get('/assets/enemy_sprite.png', (req, res)=> {
    res.sendFile(__dirname + '/assets/enemy_sprite.png');
});

app.get('/assets/enemy2_sprite.png', (req, res)=> {
    res.sendFile(__dirname + '/assets/enemy2_sprite.png');
});

app.get('/assets/enemy3_sprite.png', (req, res)=> {
    res.sendFile(__dirname + '/assets/enemy3_sprite.png');
});

app.get('/assets/icon-up.png', (req, res)=> {
    res.sendFile(__dirname + '/assets/icon-up.png');
});

app.get('/assets/icon-down.png', (req, res)=> {
    res.sendFile(__dirname + '/assets/icon-down.png');
});

app.get('/assets/icon-left.png', (req, res)=> {
    res.sendFile(__dirname + '/assets/icon-left.png');
});

app.get('/assets/icon-right.png', (req, res)=> {
    res.sendFile(__dirname + '/assets/icon-right.png');
});

app.get('/assets/bomb.png', (req, res)=> {
    res.sendFile(__dirname + '/assets/bomb.png');
});

/* ---------- 定数 ---------- */

const BOMB_STANDBY_TIME = 3; // 爆弾待機時間
const BOMB_EXPLOSION_TIME = 1; // 爆発持続時間
const BOMB_DELAY_TIME = 100; // 誘爆時の遅延
// 爆弾カウント
const BOMB_COUNT_BLANK = 0; // 空
const BOMB_COUNT_STANDBY = 1; // 爆弾スタンバイ
const BOMB_COUNT_PROPAGATION = 2; // 爆発伝播（一回だけ実行）
const BOMB_COUNT_EXPLOSION = 3; // 爆爆
const BOMB_COUNT_COMPLETE = 4; // 爆爆完了
// セルタイプ
const CELL_TYPE_FIXED = 0; // 壊せない壁
const CELL_TYPE_FREE = 1; // 通路
const CELL_TYPE_BLOCK = 2; // ブロック（壊せる壁）
const CELL_TYPE_BLOCK_BROKEN = 3; // ブロック（壊れた状態）
const CELL_TYPE_BOMB = 4; // 爆弾設置
const CELL_TYPE_EXPLOSION_B = 5; // 爆弾爆発
const CELL_TYPE_EXPLOSION_T = 6; // 爆弾爆発
const CELL_TYPE_EXPLOSION_L = 7; // 爆弾爆発
const CELL_TYPE_EXPLOSION_R = 8; // 爆弾爆発
const CELL_TYPE_EXPLOSION_LR = 9; // 爆弾爆発
const CELL_TYPE_EXPLOSION_TB = 10; // 爆弾爆発
const CELL_TYPE_EXPLOSION_TR = 11; // 爆弾爆発
const CELL_TYPE_EXPLOSION_TL = 12; // 爆弾爆発
const CELL_TYPE_EXPLOSION_BL = 13; // 爆弾爆発
const CELL_TYPE_EXPLOSION_BR = 14; // 爆弾爆発
const CELL_TYPE_EXPLOSION_BLR = 15; // 爆弾爆発
const CELL_TYPE_EXPLOSION_TBR = 16; // 爆弾爆発
const CELL_TYPE_EXPLOSION_TLR = 17; // 爆弾爆発
const CELL_TYPE_EXPLOSION_TBL = 18; // 爆弾爆発
const CELL_TYPE_EXPLOSION_TBLR = 19; // 爆弾爆発
const CELL_TYPE_ITEM_EXPLOSION_POWER = 20; // アイテム（火力）
const CELL_TYPE_ITEM_MOVE_SPEED = 21; // アイテム（移動速度）
const CELL_TYPE_ITEM_BOMB_POSSESSIONS = 22; // アイテム（爆弾所有数）
// 向き
const DIRECTION_UP = 'up';
const DIRECTION_RIGHT = 'right';
const DIRECTION_DOWN = 'down';
const DIRECTION_LEFT = 'left';
const DIRECTION_ARR = [DIRECTION_UP, DIRECTION_RIGHT, DIRECTION_DOWN, DIRECTION_LEFT];
// 加算ポイント
const ADD_POINT_ITEM = 10;
const ADD_POINT_BLOCK = 1;
const ADD_POINT_ENEMY = 30;
const ADD_POINT_EXIT = 100;
//
const ITEM_TYPES = [
    CELL_TYPE_ITEM_EXPLOSION_POWER,
    CELL_TYPE_ITEM_MOVE_SPEED,
    CELL_TYPE_ITEM_BOMB_POSSESSIONS,
];
const ITEM_APPEARANCE_PROBABILITY = 0.2; // アイテム出現率
// const ENEMY_APPEARANCE_PROBABILITY = 0.05; // 敵出現率
// const BLOCK_APPEARANCE_PROBABILITY = 0.2; // 壊せる壁出現率
// const GAME_MAP_ROW = 11; // 行
// const GAME_MAP_COL = 11 ; // 列
const GAME_MAP_ROW = 35; // 行
const GAME_MAP_COL = 35; // 列
// プレイログタイプ
const PLAY_LOG_TYPE_NORMAL = 0; // 通常
const PLAY_LOG_TYPE_EMPHASIS = 1; // 強調
const PLAY_LOG_TYPE_ATTENTION = 2; // 注意
// 敵タイプ
const ENEMY_TYPE_001 = 0;
const ENEMY_TYPE_002 = 1;
const ENEMY_TYPE_003 = 2;
const ENEMY_TYPES = [ENEMY_TYPE_001, ENEMY_TYPE_002, ENEMY_TYPE_003];
// ステージ
const STAGE_01 = 0;
const STAGE_02 = 1;
const STAGE_03 = 2;
const STAGES = [STAGE_01, STAGE_02, STAGE_03];

/* ---------- 変数 ---------- */

// ユーザー情報
let users = [];
// ゲームマップ
let map = null;
// 爆弾マップ
let bombsMap = null;
// 敵情報
let enemies = null;
// プレイログ
let playLog = [{
    date: new Date().getTime(),
    uid: null,
    name: null,
    message: 'サーバが再起動されました。',
    type: PLAY_LOG_TYPE_ATTENTION,
}];
// ステージレベル（0-2）
let stage = 0;
// let stage = 1;
// let stage = 2;
// 出口
let exit = null;
// ポイント
let points = [];

/* ---------- アクション ---------- */

// ステージ開始
setStage(stage);

let count = 0;
setInterval(()=> {
    // 設置済爆弾の監視
    let i, max;
    for (i = 0, max = bombsMap.length; i < max; i = i + 1) {
        let j, max2;
        for (j = 0, max2 = bombsMap[i].length; j < max2; j = j + 1) {
            if (bombsMap[i][j].count < BOMB_COUNT_STANDBY) continue;

            // 爆発完了
            if (BOMB_COUNT_COMPLETE <= bombsMap[i][j].count) {
                bombsMap[i][j] = {
                    uid: null,
                    power: null,
                    count: BOMB_COUNT_BLANK,
                }
                // セルの種類設定（通路）
                map[i][j] = CELL_TYPE_FREE;
            }

            // 爆発
            else if (BOMB_COUNT_EXPLOSION <= bombsMap[i][j].count) {
                bombsMap[i][j].count += 0.1 / BOMB_EXPLOSION_TIME;
            }

            // 爆発伝播（一回だけ実行）
            else if (BOMB_COUNT_PROPAGATION <= bombsMap[i][j].count) {
                bombsMap[i][j].count = BOMB_COUNT_EXPLOSION;
                // セルの種類設定（爆弾爆発）
                map[i][j] = CELL_TYPE_EXPLOSION_TBLR;
                // 爆発伝播
                setExplosion(i, j, bombsMap[i][j].power, bombsMap[i][j].uid);
            }

            // 爆弾スタンバイ
            else if (BOMB_COUNT_STANDBY <= bombsMap[i][j].count) {
                bombsMap[i][j].count += 0.1 / BOMB_STANDBY_TIME;
                // セルの種類設定（爆弾設置）
                map[i][j] = CELL_TYPE_BOMB;
            }

        }
    }
    // マップ更新
    io.emit('map', map);

    for (i = 0, max = enemies.length; i < max; i = i + 1) {
        const enemy = enemies[i];
        if (!enemy.death) {
            // 敵移動
            moveEnemy(enemy);
        }
    }
    // 敵更新
    io.emit('enemies', enemies);

    // 爆弾マップ更新
    io.emit('bombsMap', bombsMap);

    // 敵が0になったら扉を出現
    if (enemies.length <= 0) {
        if (!exit) {
            // 出口を出現させる
            exit = (()=> {
                let flg = true;
                while (flg) {
                    let y = Math.floor(Math.random() * GAME_MAP_ROW);
                    let x = Math.floor(Math.random() * GAME_MAP_COL);
                    if (map[y][x] === CELL_TYPE_FREE) {
                        return {
                            y: y,
                            x: x,
                        }
                    }
                }
            })();
            io.emit('exit', exit);

            // プレイログ送信
            playLog.unshift({
                date: new Date().getTime(),
                uid: null,
                name: null,
                message: '敵をすべて撃破しました。出現した出口に向かってください。一番はじめに出口たどり着くと、100point GET !',
                type: PLAY_LOG_TYPE_EMPHASIS,
            });
            io.emit('playLog', playLog);

        } else {
            // 出口に到着確認
            let i, max;
            for (i = 0, max = users.length; i < max; i = i + 1) {
                const user = users[i];
                if (exit.y === user.state.currentPositionY && exit.x === user.state.currentPositionX) {

                    // ポイント加算
                    addPoint(user.uid, ADD_POINT_EXIT, exit.y, exit.x);

                    // プレイログ送信
                    playLog.unshift({
                        date: new Date().getTime(),
                        uid: user.uid,
                        name: user.name,
                        message: '出口に一番はじめに到着しました。' + ADD_POINT_EXIT + 'point GET !',
                        type: PLAY_LOG_TYPE_NORMAL,
                    });
                    playLog.unshift({
                        date: new Date().getTime(),
                        uid: null,
                        name: null,
                        message: 'ステージ' + (stage + 1) + 'クリア！',
                        type: PLAY_LOG_TYPE_ATTENTION,
                    });
                    io.emit('playLog', playLog);

                    // ステージ設定
                    let nextStage = stage + 1;
                    if (STAGES.length <= nextStage) nextStage = STAGES[0];
                    setStage(nextStage);

                }

            }

        }
    }

    count += 1;
}, 1000 / 10);

// 爆発設定
function setExplosion(y, x, power, uid) {
    const explosion = (direction)=> {
        let i, max;
        for (i = 1, max = power + 1; i < max; i = i + 1) {
            let tagY, tagX;
            if (direction === 'right') {
                tagY = y;
                tagX = x + i;
            } else if (direction === 'left') {
                tagY = y;
                tagX = x - i;
            } else if (direction === 'top') {
                tagY = y - i;
                tagX = x;
            } else if (direction === 'bottom') {
                tagY = y + i;
                tagX = x;
            } else {
                tagY = y;
                tagX = x;
            }
            const type = map[tagY][tagX];

            // 対象セルが「壊せない壁」の時
            if (type === CELL_TYPE_FIXED || type === CELL_TYPE_BLOCK_BROKEN) {
                // 伝播を止める
                break;
            }

            // 対象セルが「ブロック（壊せる壁）」の時
            else if (type === CELL_TYPE_BLOCK) {
                // セルの種類設定（ブロック（壊れた状態））
                map[tagY][tagX] = CELL_TYPE_BLOCK_BROKEN;
                // ポイント加算
                addPoint(uid, ADD_POINT_BLOCK, tagY, tagX);
                setTimeout(()=> {
                    // アイテムを出現させる
                    if (Math.random() <= ITEM_APPEARANCE_PROBABILITY) {
                        map[tagY][tagX] = ITEM_TYPES[Math.floor(Math.random() * ITEM_TYPES.length)] || CELL_TYPE_FREE;
                    }
                    // セルの種類設定（通路）
                    else {
                        map[tagY][tagX] = CELL_TYPE_FREE;
                    }
                }, BOMB_EXPLOSION_TIME * 1000);
                // 伝播を止める
                break;
            }

            // 対象のセルが「爆弾設置」の時
            else if (type === CELL_TYPE_BOMB) {
                // 爆発設定
                setTimeout(()=> {
                    // 爆弾カウント設定
                    bombsMap[tagY][tagX].count = BOMB_COUNT_EXPLOSION;
                    // セルの種類設定（爆弾爆発）
                    map[tagY][tagX] = CELL_TYPE_EXPLOSION_TBLR;
                    // 爆発設定
                    setExplosion(tagY, tagX, bombsMap[tagY][tagX].power, bombsMap[tagY][tagX].uid);
                }, BOMB_DELAY_TIME);
            }

            // 対象のセルがアイテムの時
            else if (
                type === CELL_TYPE_ITEM_MOVE_SPEED ||
                type === CELL_TYPE_ITEM_EXPLOSION_POWER ||
                type === CELL_TYPE_ITEM_BOMB_POSSESSIONS
            ) {
                // 爆弾カウント設定
                bombsMap[tagY][tagX].count = BOMB_COUNT_EXPLOSION;
                bombsMap[tagY][tagX].uid = uid;
                // セルの種類設定（爆弾爆発）
                map[tagY][tagX] = CELL_TYPE_EXPLOSION_B;
                // ポイント加算
                addPoint(uid, ADD_POINT_ITEM, tagY, tagX);
            }

            // 対象のセルが「通路」の時
            else if (type === CELL_TYPE_FREE) {
                // 爆弾カウント設定
                bombsMap[tagY][tagX].count = BOMB_COUNT_EXPLOSION;
                bombsMap[tagY][tagX].uid = uid;
                // セルの種類設定（爆弾爆発）
                map[tagY][tagX] = CELL_TYPE_EXPLOSION_B;
            }

        }
    }
    explosion('right');
    explosion('left');
    explosion('top');
    explosion('bottom');

    // 爆発の整形
    const isExplosionType = (type)=> {
        if (
            type === CELL_TYPE_EXPLOSION_B ||
            type === CELL_TYPE_EXPLOSION_T ||
            type === CELL_TYPE_EXPLOSION_L ||
            type === CELL_TYPE_EXPLOSION_R ||
            type === CELL_TYPE_EXPLOSION_LR ||
            type === CELL_TYPE_EXPLOSION_TB ||
            type === CELL_TYPE_EXPLOSION_TR ||
            type === CELL_TYPE_EXPLOSION_TL ||
            type === CELL_TYPE_EXPLOSION_BL ||
            type === CELL_TYPE_EXPLOSION_BR ||
            type === CELL_TYPE_EXPLOSION_BLR ||
            type === CELL_TYPE_EXPLOSION_TBR ||
            type === CELL_TYPE_EXPLOSION_TLR ||
            type === CELL_TYPE_EXPLOSION_TBL ||
            type === CELL_TYPE_EXPLOSION_TBLR ||
            type === CELL_TYPE_BLOCK_BROKEN
        ) {
            return true;
        }
        return false;
    };
    let i, max;
    for (i = 1, max = map.length - 1; i < max; i = i + 1) {
        let j, max2;
        for (j = 1, max2 = map[i].length - 1; j < max2; j = j + 1) {
            if (!isExplosionType(map[i][j])) continue;
            if (map[i][j] === CELL_TYPE_BLOCK_BROKEN) continue;
            if (map[i][j] === CELL_TYPE_EXPLOSION_TBLR) continue;
            if (
                isExplosionType(map[i - 1][j]) && // 上
                isExplosionType(map[i][j + 1]) && // 右
                isExplosionType(map[i + 1][j]) && // 下
                isExplosionType(map[i][j - 1]) // 左
            ) {
                map[i][j] = CELL_TYPE_EXPLOSION_TBLR;
            }
            else if (
                !isExplosionType(map[i - 1][j]) && // 上
                isExplosionType(map[i][j + 1]) && // 右
                isExplosionType(map[i + 1][j]) && // 下
                isExplosionType(map[i][j - 1]) // 左
            ) {
                map[i][j] = CELL_TYPE_EXPLOSION_BLR;
            }
            else if (
                isExplosionType(map[i - 1][j]) && // 上
                !isExplosionType(map[i][j + 1]) && // 右
                isExplosionType(map[i + 1][j]) && // 下
                isExplosionType(map[i][j - 1]) // 左
            ) {
                map[i][j] = CELL_TYPE_EXPLOSION_TBL;
            }
            else if (
                isExplosionType(map[i - 1][j]) && // 上
                isExplosionType(map[i][j + 1]) && // 右
                !isExplosionType(map[i + 1][j]) && // 下
                isExplosionType(map[i][j - 1]) // 左
            ) {
                map[i][j] = CELL_TYPE_EXPLOSION_TLR;
            }
            else if (
                isExplosionType(map[i - 1][j]) && // 上
                isExplosionType(map[i][j + 1]) && // 右
                isExplosionType(map[i + 1][j]) && // 下
                !isExplosionType(map[i][j - 1]) // 左
            ) {
                map[i][j] = CELL_TYPE_EXPLOSION_TBR;
            }
            else if (
                !isExplosionType(map[i - 1][j]) && // 上
                !isExplosionType(map[i][j + 1]) && // 右
                isExplosionType(map[i + 1][j]) && // 下
                isExplosionType(map[i][j - 1]) // 左
            ) {
                map[i][j] = CELL_TYPE_EXPLOSION_BL;
            }
            else if (
                !isExplosionType(map[i - 1][j]) && // 上
                isExplosionType(map[i][j + 1]) && // 右
                !isExplosionType(map[i + 1][j]) && // 下
                isExplosionType(map[i][j - 1]) // 左
            ) {
                map[i][j] = CELL_TYPE_EXPLOSION_LR;
            }
            else if (
                !isExplosionType(map[i - 1][j]) && // 上
                isExplosionType(map[i][j + 1]) && // 右
                isExplosionType(map[i + 1][j]) && // 下
                !isExplosionType(map[i][j - 1]) // 左
            ) {
                map[i][j] = CELL_TYPE_EXPLOSION_BR;
            }
            else if (
                isExplosionType(map[i - 1][j]) && // 上
                !isExplosionType(map[i][j + 1]) && // 右
                !isExplosionType(map[i + 1][j]) && // 下
                isExplosionType(map[i][j - 1]) // 左
            ) {
                map[i][j] = CELL_TYPE_EXPLOSION_TL;
            }
            else if (
                isExplosionType(map[i - 1][j]) && // 上
                !isExplosionType(map[i][j + 1]) && // 右
                isExplosionType(map[i + 1][j]) && // 下
                !isExplosionType(map[i][j - 1]) // 左
            ) {
                map[i][j] = CELL_TYPE_EXPLOSION_TB;
            }
            else if (
                isExplosionType(map[i - 1][j]) && // 上
                isExplosionType(map[i][j + 1]) && // 右
                !isExplosionType(map[i + 1][j]) && // 下
                !isExplosionType(map[i][j - 1]) // 左
            ) {
                map[i][j] = CELL_TYPE_EXPLOSION_TR;
            }
            else if (
                !isExplosionType(map[i - 1][j]) && // 上
                !isExplosionType(map[i][j + 1]) && // 右
                !isExplosionType(map[i + 1][j]) && // 下
                isExplosionType(map[i][j - 1]) // 左
            ) {
                map[i][j] = CELL_TYPE_EXPLOSION_L;
            }
            else if (
                !isExplosionType(map[i - 1][j]) && // 上
                !isExplosionType(map[i][j + 1]) && // 右
                isExplosionType(map[i + 1][j]) && // 下
                !isExplosionType(map[i][j - 1]) // 左
            ) {
                map[i][j] = CELL_TYPE_EXPLOSION_B;
            }
            else if (
                !isExplosionType(map[i - 1][j]) && // 上
                isExplosionType(map[i][j + 1]) && // 右
                !isExplosionType(map[i + 1][j]) && // 下
                !isExplosionType(map[i][j - 1]) // 左
            ) {
                map[i][j] = CELL_TYPE_EXPLOSION_R;
            }
            else if (
                isExplosionType(map[i - 1][j]) && // 上
                !isExplosionType(map[i][j + 1]) && // 右
                !isExplosionType(map[i + 1][j]) && // 下
                !isExplosionType(map[i][j - 1]) // 左
            ) {
                map[i][j] = CELL_TYPE_EXPLOSION_T;
            }
        }
    }

};

// ポイント加算
function addPoint(uid, point, y, x) {
    let i, max;
    for (i = 0, max = users.length; i < max; i = i + 1) {
        if (uid === users[i].uid) {
            users[i].point += point;
        }
    }
    io.emit('users', users);
    //
    points.unshift({
        x: x,
        y: y,
        value: point,
    })
    io.emit('points', points);
}

// 敵移動
function moveEnemy(enemy) {

    // 配列シャッフル
    const shuffle = ([...array]) => {
        for (let i = array.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // セルタイプが進めるセルかどうか
    const moveEnabledCellType = (type, exceptType)=> {
        if (exceptType && exceptType === type) {
            return true;
        }
        if (
            type === CELL_TYPE_FREE ||
            type === CELL_TYPE_EXPLOSION_B ||
            type === CELL_TYPE_EXPLOSION_T ||
            type === CELL_TYPE_EXPLOSION_L  ||
            type === CELL_TYPE_EXPLOSION_R  ||
            type === CELL_TYPE_EXPLOSION_LR ||
            type === CELL_TYPE_EXPLOSION_TB ||
            type === CELL_TYPE_EXPLOSION_TR ||
            type === CELL_TYPE_EXPLOSION_TL ||
            type === CELL_TYPE_EXPLOSION_BL ||
            type === CELL_TYPE_EXPLOSION_BR ||
            type === CELL_TYPE_EXPLOSION_BLR ||
            type === CELL_TYPE_EXPLOSION_TBR ||
            type === CELL_TYPE_EXPLOSION_TLR ||
            type === CELL_TYPE_EXPLOSION_TBL ||
            type === CELL_TYPE_EXPLOSION_TBLR ||
            type === CELL_TYPE_ITEM_EXPLOSION_POWER ||
            type === CELL_TYPE_ITEM_MOVE_SPEED ||
            type === CELL_TYPE_ITEM_BOMB_POSSESSIONS
        ) {
            return true;
        } else {
            return false;
        }
    }

    // 次の進める方向をランダムに抽出
    const getNextMoveEnabledDirection = (y, x, directionArr, exceptType)=> {
        if (!directionArr) return null;
        directionArr = shuffle(directionArr);
        let i, max;
        for (i = 0, max = directionArr.length; i < max; i = i + 1) {
            const direction = directionArr[i];
            if (direction === DIRECTION_RIGHT) {
                if (moveEnabledCellType(map[y][x + 1], exceptType)) {
                    return DIRECTION_RIGHT;
                }
            } else if (direction === DIRECTION_LEFT) {
                if (moveEnabledCellType(map[y][x - 1], exceptType)) {
                    return DIRECTION_LEFT;
                }
            } else if (direction === DIRECTION_UP) {
                if (moveEnabledCellType(map[y - 1][x], exceptType)) {
                    return DIRECTION_UP;
                }
            } else if (direction === DIRECTION_DOWN) {
                if (moveEnabledCellType(map[y + 1][x], exceptType)) {
                    return DIRECTION_DOWN;
                }
            }
        }
        return null;
    }

    // 敵タイプ001
    // 中位のスピードで基本は進行方向に進む、突き当たったら方向を変える。例外的に25%の割合で横道を選択する。
    if (enemy.type === ENEMY_TYPE_001) {
        if (0 === count % enemy.speed) {
            // 上に進んでいる時
            if (enemy.direction === DIRECTION_UP) {
                // 例外的に移動方向を変更
                if (Math.random() <= 0.25) {
                    enemy.direction = getNextMoveEnabledDirection(enemy.currentPositionY, enemy.currentPositionX, [DIRECTION_RIGHT, DIRECTION_LEFT]) || DIRECTION_UP;
                    moveEnemy(enemy);
                }
                // 進める時
                else if (moveEnabledCellType(map[enemy.currentPositionY - 1][enemy.currentPositionX])) {
                    enemy.currentPositionY -= 1;
                }
                // 突き当たった時
                else {
                    enemy.direction = getNextMoveEnabledDirection(enemy.currentPositionY, enemy.currentPositionX, [DIRECTION_RIGHT, DIRECTION_DOWN, DIRECTION_LEFT]);
                    moveEnemy(enemy);
                }
            }
            // 下に進んでいる時
            else if (enemy.direction === DIRECTION_DOWN) {
                // 例外的に移動方向を変更
                if (Math.random() <= 0.25) {
                    enemy.direction = getNextMoveEnabledDirection(enemy.currentPositionY, enemy.currentPositionX, [DIRECTION_RIGHT, DIRECTION_LEFT]) || DIRECTION_DOWN;
                    moveEnemy(enemy);
                }
                // 進める時
                else if (moveEnabledCellType(map[enemy.currentPositionY + 1][enemy.currentPositionX])) {
                    enemy.currentPositionY += 1;
                }
                // 突き当たった時
                else {
                    enemy.direction = getNextMoveEnabledDirection(enemy.currentPositionY, enemy.currentPositionX, [DIRECTION_UP, DIRECTION_RIGHT, DIRECTION_LEFT]);
                    moveEnemy(enemy);
                }
            }
            // 左に進んでいる時
            else if (enemy.direction === DIRECTION_LEFT) {
                // 例外的に移動方向を変更
                if (Math.random() <= 0.25) {
                    enemy.direction = getNextMoveEnabledDirection(enemy.currentPositionY, enemy.currentPositionX, [DIRECTION_UP, DIRECTION_DOWN]) || DIRECTION_LEFT;
                    moveEnemy(enemy);
                }
                // 進める時
                else if (moveEnabledCellType(map[enemy.currentPositionY][enemy.currentPositionX - 1])) {
                    enemy.currentPositionX -= 1;
                }
                // 突き当たった時
                else {
                    enemy.direction = getNextMoveEnabledDirection(enemy.currentPositionY, enemy.currentPositionX, [DIRECTION_UP, DIRECTION_RIGHT, DIRECTION_DOWN]);
                    moveEnemy(enemy);
                }
            }
            // 右に進んでいる時
            else if (enemy.direction === DIRECTION_RIGHT) {
                // 例外的に移動方向を変更
                if (Math.random() <= 0.25) {
                    enemy.direction = getNextMoveEnabledDirection(enemy.currentPositionY, enemy.currentPositionX, [DIRECTION_UP, DIRECTION_DOWN]) || DIRECTION_RIGHT;
                    moveEnemy(enemy);
                }
                // 進める時
                else if (moveEnabledCellType(map[enemy.currentPositionY][enemy.currentPositionX + 1])) {
                    enemy.currentPositionX += 1;
                }
                // 突き当たった時
                else {
                    enemy.direction = getNextMoveEnabledDirection(enemy.currentPositionY, enemy.currentPositionX, [DIRECTION_UP, DIRECTION_DOWN, DIRECTION_LEFT]);
                    moveEnemy(enemy);
                }
            } else {
                enemy.direction = getNextMoveEnabledDirection(enemy.currentPositionY, enemy.currentPositionX, [DIRECTION_UP, DIRECTION_DOWN, DIRECTION_LEFT, DIRECTION_RIGHT]);
            }
        }
    }
    // 敵タイプ002
    // 速いスピードで進行方向に進む、突き当たったら方向を変える。
    else if (enemy.type === ENEMY_TYPE_002) {
        if (0 === count % enemy.speed) {
            // 上に進んでいる時
            if (enemy.direction === DIRECTION_UP) {
                // 進める時
                if (moveEnabledCellType(map[enemy.currentPositionY - 1][enemy.currentPositionX])) {
                    enemy.currentPositionY -= 1;
                }
                // 突き当たった時
                else {
                    enemy.direction = getNextMoveEnabledDirection(enemy.currentPositionY, enemy.currentPositionX, [DIRECTION_RIGHT, DIRECTION_DOWN, DIRECTION_LEFT]);
                    moveEnemy(enemy);
                }
            }
            // 下に進んでいる時
            else if (enemy.direction === DIRECTION_DOWN) {
                // 進める時
                if (moveEnabledCellType(map[enemy.currentPositionY + 1][enemy.currentPositionX])) {
                    enemy.currentPositionY += 1;
                }
                // 突き当たった時
                else {
                    enemy.direction = getNextMoveEnabledDirection(enemy.currentPositionY, enemy.currentPositionX, [DIRECTION_UP, DIRECTION_RIGHT, DIRECTION_LEFT]);
                    moveEnemy(enemy);
                }
            }
            // 左に進んでいる時
            else if (enemy.direction === DIRECTION_LEFT) {
                // 進める時
                if (moveEnabledCellType(map[enemy.currentPositionY][enemy.currentPositionX - 1])) {
                    enemy.currentPositionX -= 1;
                }
                // 突き当たった時
                else {
                    enemy.direction = getNextMoveEnabledDirection(enemy.currentPositionY, enemy.currentPositionX, [DIRECTION_UP, DIRECTION_RIGHT, DIRECTION_DOWN]);
                    moveEnemy(enemy);
                }
            }
            // 右に進んでいる時
            else if (enemy.direction === DIRECTION_RIGHT) {
                // 進める時
                if (moveEnabledCellType(map[enemy.currentPositionY][enemy.currentPositionX + 1])) {
                    enemy.currentPositionX += 1;
                }
                // 突き当たった時
                else {
                    enemy.direction = getNextMoveEnabledDirection(enemy.currentPositionY, enemy.currentPositionX, [DIRECTION_UP, DIRECTION_DOWN, DIRECTION_LEFT]);
                    moveEnemy(enemy);
                }
            } else {
                enemy.direction = getNextMoveEnabledDirection(enemy.currentPositionY, enemy.currentPositionX, [DIRECTION_UP, DIRECTION_DOWN, DIRECTION_LEFT, DIRECTION_RIGHT]);
            }
        }
    }
    // 敵タイプ003
    // おそいのスピードで進行方向か横道に進み、ブロックも通り抜ける。
    else if (enemy.type === ENEMY_TYPE_003) {
        if (0 === count % enemy.speed) {
            // 上に進んでいる時
            if (enemy.direction === DIRECTION_UP) {
                enemy.direction = getNextMoveEnabledDirection(enemy.currentPositionY, enemy.currentPositionX, [DIRECTION_UP, DIRECTION_LEFT, DIRECTION_RIGHT], CELL_TYPE_BLOCK);
                if (enemy.direction === DIRECTION_UP) {
                    enemy.currentPositionY -= 1;
                }
                else if (enemy.direction === DIRECTION_LEFT) {
                    enemy.currentPositionX -= 1;
                }
                else if (enemy.direction === DIRECTION_RIGHT) {
                    enemy.currentPositionX += 1;
                }
                else {
                    moveEnemy(enemy);
                }
            }
            // 下に進んでいる時
            else if (enemy.direction === DIRECTION_DOWN) {
                enemy.direction = getNextMoveEnabledDirection(enemy.currentPositionY, enemy.currentPositionX, [DIRECTION_DOWN, DIRECTION_LEFT, DIRECTION_RIGHT], CELL_TYPE_BLOCK);
                if (enemy.direction === DIRECTION_DOWN) {
                    enemy.currentPositionY += 1;
                }
                else if (enemy.direction === DIRECTION_LEFT) {
                    enemy.currentPositionX -= 1;
                }
                else if (enemy.direction === DIRECTION_RIGHT) {
                    enemy.currentPositionX += 1;
                }
                else {
                    moveEnemy(enemy);
                }
            }
            // 左に進んでいる時
            else if (enemy.direction === DIRECTION_LEFT) {
                enemy.direction = getNextMoveEnabledDirection(enemy.currentPositionY, enemy.currentPositionX, [DIRECTION_LEFT, DIRECTION_UP, DIRECTION_DOWN], CELL_TYPE_BLOCK);
                if (enemy.direction === DIRECTION_LEFT) {
                    enemy.currentPositionX -= 1;
                }
                else if (enemy.direction === DIRECTION_UP) {
                    enemy.currentPositionY -= 1;
                }
                else if (enemy.direction === DIRECTION_DOWN) {
                    enemy.currentPositionY += 1;
                }
                else {
                    moveEnemy(enemy);
                }
            }
            // 右に進んでいる時
            else if (enemy.direction === DIRECTION_RIGHT) {
                enemy.direction = getNextMoveEnabledDirection(enemy.currentPositionY, enemy.currentPositionX, [DIRECTION_RIGHT, DIRECTION_UP, DIRECTION_DOWN], CELL_TYPE_BLOCK);
                if (enemy.direction === DIRECTION_RIGHT) {
                    enemy.currentPositionX += 1;
                }
                else if (enemy.direction === DIRECTION_UP) {
                    enemy.currentPositionY -= 1;
                }
                else if (enemy.direction === DIRECTION_DOWN) {
                    enemy.currentPositionY += 1;
                }
                else {
                    moveEnemy(enemy);
                }
            }
            // 突き当たったら
            else {
                enemy.direction = getNextMoveEnabledDirection(enemy.currentPositionY, enemy.currentPositionX, [DIRECTION_UP, DIRECTION_DOWN, DIRECTION_LEFT, DIRECTION_RIGHT], CELL_TYPE_BLOCK);
            }
        }
    }

    // 敵が爆発に接触している時
    const bomb = bombsMap[enemy.currentPositionY][enemy.currentPositionX];
    if (BOMB_COUNT_PROPAGATION <= bomb.count && bomb.count < BOMB_COUNT_COMPLETE) {
        enemy.death = true;

        // ポイント加算
        addPoint(bomb.uid, ADD_POINT_ENEMY, enemy.currentPositionY, enemy.currentPositionX);

        // プレイログ送信
        const name = ((uid)=> {
            let i, max;
            for (i = 0, max = users.length; i < max; i = i + 1) {
                if (users[i].uid === uid) {
                    return users[i].name;
                }
            }
            return null;
        })(bomb.uid);
        if (name) {
            playLog.unshift({
                date: new Date().getTime(),
                uid: bomb.uid,
                name: name,
                message: '敵を撃破しました。' + ADD_POINT_ENEMY + 'point GET !',
                type: PLAY_LOG_TYPE_NORMAL,
            });
            io.emit('playLog', playLog);
        }

        // 敵情報を削除
        ((eid)=> {
            setTimeout(()=> {
                let arr = [];
                let i, max;
                for (i = 0, max = enemies.length; i < max; i = i + 1) {
                    const item = enemies[i];
                    if (eid !== enemies[i].eid) {
                        arr.push(enemies[i]);
                    }
                }
                enemies = arr;
            }, 1000);
        })(enemy.eid);
    }

}

// ステージ設定
function setStage(nextStage) {

    // ステージ設定
    stage = nextStage;
    io.emit('stage', stage);

    // ゲームマップ
    map = ((row, col)=> {
        let arr = [];
        let i, max;
        for (i = 0, max = row; i < max; i = i + 1) {
            let arr2 = [];
            let j, max2;
            for (j = 0, max2 = col; j < max2; j = j + 1) {
                if (i === 0 || i === row - 1 || j === 0 || j === col - 1 || ((i % 2) === 0 && (j % 2) === 0)) {
                // if (i === 0 || i === row - 1 || j === 0 || j === col - 1) {
                    arr2.push(CELL_TYPE_FIXED);
                } else {

                    // デバッグ用
                    if (false) {
                    // if (true) {
                        if (Math.random() <= 0.01) {
                            // arr2.push(CELL_TYPE_FREE);
                            arr2.push(CELL_TYPE_BLOCK);
                        } else if (Math.random() <= 0.01) {
                            arr2.push(CELL_TYPE_ITEM_EXPLOSION_POWER);
                        } else if (Math.random() <= 0.01) {
                            arr2.push(CELL_TYPE_ITEM_MOVE_SPEED);
                        } else if (Math.random() <= 0.01) {
                            arr2.push(CELL_TYPE_ITEM_BOMB_POSSESSIONS);
                        } else {
                            arr2.push(CELL_TYPE_FREE);
                        }
                        continue;
                    }
                    // /デバッグ用

                    // 左上
                    if (i === 1 && (j === 1 || j === 2) || (i === 2 && j === 1)) {
                        arr2.push(CELL_TYPE_FREE);
                    }
                    // 左下
                    else if ((i === row - 2 && j === 1) || (i === row - 2 && j === 2) || (i === row - 3 && j === 1)) {
                        arr2.push(CELL_TYPE_FREE);
                    }
                    // 右上
                    else if ((i === 1 && j === col - 2) || (i === 1 && j === col - 3) || (i === 2 && j === col - 2)) {
                        arr2.push(CELL_TYPE_FREE);
                    }
                    // 右下
                    else if ((i === row - 2 && j === col - 2) || (i === row - 2 && j === col - 3) || (i === row - 3 && j === col - 2)) {
                        arr2.push(CELL_TYPE_FREE);
                    }
                    else {
                        // if (Math.random() <= BLOCK_APPEARANCE_PROBABILITY) {
                        switch (stage) {
                            case STAGE_01:
                                if (Math.random() <= 0.2) {
                                    // ブロック
                                    arr2.push(CELL_TYPE_BLOCK);
                                } else {
                                    // 通路
                                    arr2.push(CELL_TYPE_FREE);
                                }
                                break;
                            case STAGE_02:
                                if (Math.random() <= 0.25) {
                                    // ブロック
                                    arr2.push(CELL_TYPE_BLOCK);
                                } else {
                                    // 通路
                                    arr2.push(CELL_TYPE_FREE);
                                }
                                break;
                            case STAGE_03:
                                if (Math.random() <= 0.3) {
                                    // ブロック
                                    arr2.push(CELL_TYPE_BLOCK);
                                } else {
                                    // 通路
                                    arr2.push(CELL_TYPE_FREE);
                                }
                                break;
                        }
                    }
                }
            }
            arr.push(arr2);
        }
        return arr;
    })(GAME_MAP_ROW, GAME_MAP_COL);
    io.emit('map', map);

    // 爆弾マップ
    bombsMap = ((row, col)=> {
        let arr = [];
        let i, max;
        for (i = 0, max = row; i < max; i = i + 1) {
            let arr2 = [];
            let j, max2;
            for (j = 0, max2 = col; j < max2; j = j + 1) {
                arr2.push({
                    uid: null,
                    power: null,
                    count: BOMB_COUNT_BLANK,
                });
            }
            arr.push(arr2);
        }
        return arr;
    })(GAME_MAP_ROW, GAME_MAP_COL);

    // 敵情報
    enemies = (()=> {
        let arr = [];
        let i, max;
        for (i = 0, max = map.length; i < max; i = i + 1) {
            let j, max2;
            for (j = 0, max2 = map[i].length; j < max2; j = j + 1) {
                if (map[i][j] === CELL_TYPE_FREE) {

                    // デバッグ用
                    if (false) {
                    // if (true) {
                        if (Math.random() <= 0.001) {
                            arr.push({
                                eid: Math.random().toString(36).slice(-8),
                                type: ENEMY_TYPE_001,
                                death: false,
                                currentPositionY: i,
                                currentPositionX: j,
                                direction: DIRECTION_ARR[Math.floor(Math.random() * DIRECTION_ARR.length)],
                                speed: 5,
                            })
                        } else if (Math.random() <= 0.001) {
                            arr.push({
                                eid: Math.random().toString(36).slice(-8),
                                type: ENEMY_TYPE_002,
                                death: false,
                                currentPositionY: i,
                                currentPositionX: j,
                                direction: DIRECTION_ARR[Math.floor(Math.random() * DIRECTION_ARR.length)],
                                speed: 2,
                            })
                        } else if (Math.random() <= 0.001) {
                            arr.push({
                                eid: Math.random().toString(36).slice(-8),
                                type: ENEMY_TYPE_003,
                                death: false,
                                currentPositionY: i,
                                currentPositionX: j,
                                direction: DIRECTION_ARR[Math.floor(Math.random() * DIRECTION_ARR.length)],
                                speed: 10,
                            })
                        }
                        continue;
                    }
                    // /デバッグ用

                    switch (stage) {
                        case STAGE_01:
                            // if (Math.random() <= ENEMY_APPEARANCE_PROBABILITY) {
                            if (Math.random() <= 0.03) {
                                arr.push({
                                    eid: Math.random().toString(36).slice(-8),
                                    type: ENEMY_TYPE_001,
                                    death: false,
                                    currentPositionY: i,
                                    currentPositionX: j,
                                    direction: DIRECTION_ARR[Math.floor(Math.random() * DIRECTION_ARR.length)],
                                    speed: 5,
                                })
                            }
                            break;
                        case STAGE_02:
                            // if (Math.random() <= ENEMY_APPEARANCE_PROBABILITY) {
                            if (Math.random() <= 0.05) {
                                if (0.7 <= Math.random()) {
                                    arr.push({
                                        eid: Math.random().toString(36).slice(-8),
                                        type: ENEMY_TYPE_003,
                                        death: false,
                                        currentPositionY: i,
                                        currentPositionX: j,
                                        direction: DIRECTION_ARR[Math.floor(Math.random() * DIRECTION_ARR.length)],
                                        speed: 10,
                                    })
                                } else {
                                    arr.push({
                                        eid: Math.random().toString(36).slice(-8),
                                        type: ENEMY_TYPE_001,
                                        death: false,
                                        currentPositionY: i,
                                        currentPositionX: j,
                                        direction: DIRECTION_ARR[Math.floor(Math.random() * DIRECTION_ARR.length)],
                                        speed: 5,
                                    })
                                }
                            }
                            break;
                        case STAGE_03:
                            // if (Math.random() <= ENEMY_APPEARANCE_PROBABILITY) {
                            if (Math.random() <= 0.05) {
                                if (0.8 <= Math.random()) {
                                    arr.push({
                                        eid: Math.random().toString(36).slice(-8),
                                        type: ENEMY_TYPE_002,
                                        death: false,
                                        currentPositionY: i,
                                        currentPositionX: j,
                                        direction: DIRECTION_ARR[Math.floor(Math.random() * DIRECTION_ARR.length)],
                                        speed: 2,
                                    })
                                } else if (0.6 <= Math.random()) {
                                    arr.push({
                                        eid: Math.random().toString(36).slice(-8),
                                        type: ENEMY_TYPE_003,
                                        death: false,
                                        currentPositionY: i,
                                        currentPositionX: j,
                                        direction: DIRECTION_ARR[Math.floor(Math.random() * DIRECTION_ARR.length)],
                                        speed: 10,
                                    })
                                } else {
                                    arr.push({
                                        eid: Math.random().toString(36).slice(-8),
                                        type: ENEMY_TYPE_001,
                                        death: false,
                                        currentPositionY: i,
                                        currentPositionX: j,
                                        direction: DIRECTION_ARR[Math.floor(Math.random() * DIRECTION_ARR.length)],
                                        speed: 5,
                                    })
                                }
                            }
                            break;
                    }
                }
            }
        }
        return arr;
    })();
    io.emit('enemies', enemies);

    // 出口除去
    exit = null;
    io.emit('exit', exit);

    // プレイログ送信
    playLog.unshift({
        date: new Date().getTime(),
        uid: null,
        name: null,
        message: 'ステージ' + (stage + 1) + 'スタート！',
        type: PLAY_LOG_TYPE_ATTENTION,
    });
    io.emit('playLog', playLog);

}

/* ---------- ユーザー接続時 ---------- */

io.on('connection', (socket)=> {

    io.emit('users', users);
    io.emit('playLog', playLog);
    io.emit('map', map);
    io.emit('enemies', enemies);
    io.emit('exit', exit);

    // ユーザー追加
    socket.on('addUser', (user)=> {
        user.sid = socket.id;
        users.unshift(user);
        io.emit('users', users);

        // プレイログ送信
        playLog.unshift({
            date: new Date().getTime(),
            uid: user.uid,
            name: user.name,
            message: 'ログインしました。',
            type: PLAY_LOG_TYPE_EMPHASIS,
        });
        io.emit('playLog', playLog);

    });

    // ユーザー削除
    socket.on('removeUser', (uid)=> {
        let name = null;
        let arr = [];
        let i, max;
        for (i = 0, max = users.length; i < max; i = i + 1) {
            if (users[i].uid !== uid) {
                arr.push(users[i]);
            } else {
                name = users[i].name;
            }
        }
        users = arr;
        io.emit('users', users);

        // プレイログ送信
        if (name) {
            playLog.unshift({
                date: new Date().getTime(),
                uid: uid,
                name: name,
                message: 'ログアウトしました。',
                type: PLAY_LOG_TYPE_EMPHASIS,
            });
            io.emit('playLog', playLog);
        }

    });

    // ユーザーコメント送信
    socket.on('sendComment', (comment)=> {
        let i, max;
        for (i = 0, max = users.length; i < max; i = i + 1) {
            if (users[i].uid === comment.uid) {
                // 同じコメントは除去
                if (users[i].comments && users[i].comments[0] && users[i].comments[0].message === comment.message) return;

                users[i].comments.unshift({
                    date: comment.date,
                    message: comment.message,
                });

                if (comment.message && comment.message !== '') {
                    // プレイログ送信
                    playLog.unshift({
                        date: new Date().getTime(),
                        uid: users[i].uid,
                        name: ((uid)=> {
                            let i, max;
                            for (i = 0, max = users.length; i < max; i = i + 1) {
                                if (users[i].uid === uid) {
                                    return users[i].name;
                                }
                            }
                            return null;
                        })(users[i].uid),
                        message: comment.message,
                        type: PLAY_LOG_TYPE_NORMAL,
                    });
                    io.emit('playLog', playLog);
                }

            }
        }
        io.emit('users', users);
    });

    // ユーザーの状態送信
    socket.on('sendUserState', (e)=> {
        let arr = [];
        let i, max;
        for (i = 0, max = users.length; i < max; i = i + 1) {
            if (users[i].uid === e.uid) {
                users[i].state = e.state;
            }
        }
        io.emit('users', users);
    });

    // マップの状態送信
    socket.on('sendMapState', (e)=> {
        if (e.x === null || e.y === null || e.type === null) return;
        if (map && map[e.y] && map[e.y][e.x]) {
            // 爆弾設置
            if (e.type === CELL_TYPE_BOMB) {
                bombsMap[e.y][e.x] = {
                    uid: e.uid,
                    power: (()=> {
                        let i, max;
                        for (i = 0, max = users.length; i < max; i = i + 1) {
                            if (e.uid === users[i].uid) {
                                return users[i].state.explosionPower;
                            }
                        }
                        return 1;
                    })(),
                    count: BOMB_COUNT_STANDBY,
                }
            } else {
                map[e.y][e.x] = e.type;
            }
            // io.emit('map', map);
        }
    });

    // 接続解除
    socket.on('disconnect', (e)=> {
        let name = null;
        let uid = null;

        let arr = [];
        let i, max;
        for (i = 0, max = users.length; i < max; i = i + 1) {
            if (users[i].sid !== socket.id) {
                arr.push(users[i]);
            } else {
                name = users[i].name;
                uid = users[i].uid;
            }
        }
        users = arr;
        io.emit('users', users);

        if (name && uid) {
            // プレイログ送信
            playLog.unshift({
                date: new Date().getTime(),
                uid: uid,
                name: name,
                message: 'ログアウトしました。',
                type: PLAY_LOG_TYPE_EMPHASIS,
            });
            io.emit('playLog', playLog);
        }

    });

});

http.listen(port, ()=> {
    console.log('listening on *:' + port);
});
