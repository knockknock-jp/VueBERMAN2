var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', (req, res)=> {
    res.sendFile(__dirname + '/index.html');
});

app.get('/main.js', (req, res)=> {
    res.sendFile(__dirname + '/main.js');
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
// 加算ポイント
const ADD_POINT_ITEM = 10;
const ADD_POINT_BLOCK = 1;
//
const ITEM_TYPES = [
    CELL_TYPE_ITEM_EXPLOSION_POWER,
    CELL_TYPE_ITEM_MOVE_SPEED,
    CELL_TYPE_ITEM_BOMB_POSSESSIONS,
];
const ITEM_APPEARANCE_PROBABILITY = 0.3; // アイテム出現率
const GAME_MAP_ROW = 51; // 行
const GAME_MAP_COL = 51; // 列

// ユーザー情報
let users = [];

// ゲームマップ
let map = ((row, col)=> {
    let arr = [];
    let i, max;
    for (i = 0, max = row; i < max; i = i + 1) {
        let arr2 = [];
        let j, max2;
        for (j = 0, max2 = col; j < max2; j = j + 1) {
            if (i === 0 || i === row - 1 || j === 0 || j === col - 1 || ((i % 2) === 0 && (j % 2) === 0)) {
                arr2.push(0);
            } else {
                // 左上
                if (i === 1 && (j === 1 || j === 2) || (i === 2 && j === 1)) {
                    arr2.push(1);
                }
                // 左下
                else if ((i === row - 2 && j === 1) || (i === row - 2 && j === 2) || (i === row - 3 && j === 1)) {
                    arr2.push(1);
                }
                // 右上
                else if ((i === 1 && j === col - 2) || (i === 1 && j === col - 3) || (i === 2 && j === col - 2)) {
                    arr2.push(1);
                }
                // 右下
                else if ((i === row - 2 && j === col - 2) || (i === row - 2 && j === col - 3) || (i === row - 3 && j === col - 2)) {
                    arr2.push(1);
                }
                else {
                    if (Math.random() <= 0.4) {
                        // ブロック
                        arr2.push(2);
                    } else {
                        // 通路
                        arr2.push(1);
                    }
                }
            }
        }
        arr.push(arr2);
    }
    return arr;
})(GAME_MAP_ROW, GAME_MAP_COL);

// 爆弾マップ
let bombsMap = ((row, col)=> {
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

// マップ更新
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
                addPoint(uid, ADD_POINT_BLOCK);
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
                // セルの種類設定（爆弾爆発）
                map[tagY][tagX] = CELL_TYPE_EXPLOSION_B;
                // ポイント加算
                addPoint(uid, ADD_POINT_ITEM);
            }

            // 対象のセルが「通路」の時
            else if (type === CELL_TYPE_FREE) {
                // 爆弾カウント設定
                bombsMap[tagY][tagX].count = BOMB_COUNT_EXPLOSION;
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
function addPoint(uid, point) {
    let i, max;
    for (i = 0, max = users.length; i < max; i = i + 1) {
        if (uid === users[i].uid) {
            users[i].point += point;
        }
    }
    io.emit('users', users);
}

io.on('connection', (socket)=> {

    io.emit('users', users);
    io.emit('map', map);

    // ユーザー追加
    socket.on('addUser', (user)=> {
        user.sid = socket.id;
        users.unshift(user);
        io.emit('users', users);
    });

    // ユーザー削除
    socket.on('removeUser', (uid)=> {
        let arr = [];
        let i, max;
        for (i = 0, max = users.length; i < max; i = i + 1) {
            if (users[i].uid !== uid) {
                arr.push(users[i])
            }
        }
        users = arr;
        io.emit('users', users);
    });

    // ユーザーコメント送信
    socket.on('sendComment', (comment)=> {
        let i, max;
        for (i = 0, max = users.length; i < max; i = i + 1) {
            if (users[i].uid === comment.uid) {
                users[i].comments.unshift({
                    date: comment.date,
                    message: comment.message,
                });
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
        let arr = [];
        let i, max;
        for (i = 0, max = users.length; i < max; i = i + 1) {
            if (users[i].sid !== socket.id) {
                arr.push(users[i])
            }
        }
        users = arr;
        io.emit('users', users);
    });

});

http.listen(port, ()=> {
    console.log('listening on *:' + port);
});
