<template>
</template>

<script>
    import {
        // CELL_SIZE,
        // CELL_TYPE_FIXED,
        CELL_TYPE_FREE,
        // CELL_TYPE_BLOCK,
        // CELL_TYPE_BLOCK_BROKEN,
        CELL_TYPE_BOMB,
        CELL_TYPE_EXPLOSION_B,
        CELL_TYPE_EXPLOSION_T,
        CELL_TYPE_EXPLOSION_L,
        CELL_TYPE_EXPLOSION_R,
        CELL_TYPE_EXPLOSION_LR,
        CELL_TYPE_EXPLOSION_TB,
        CELL_TYPE_EXPLOSION_TR,
        CELL_TYPE_EXPLOSION_TL,
        CELL_TYPE_EXPLOSION_BL,
        CELL_TYPE_EXPLOSION_BR,
        CELL_TYPE_EXPLOSION_BLR,
        CELL_TYPE_EXPLOSION_TBR,
        CELL_TYPE_EXPLOSION_TLR,
        CELL_TYPE_EXPLOSION_TBL,
        CELL_TYPE_EXPLOSION_TBLR,
        CELL_TYPE_ITEM_EXPLOSION_POWER,
        CELL_TYPE_ITEM_MOVE_SPEED,
        CELL_TYPE_ITEM_BOMB_POSSESSIONS,
        DIRECTION_UP,
        DIRECTION_RIGHT,
        DIRECTION_DOWN,
        DIRECTION_LEFT,
        ITEM_BOMB_POSSESSIONS_STEP_UP_POINT,
        ITEM_EXPLOSION_POWER_STEP_UP_POINT,
        ITEM_MOVE_SPEED_STEP_UP_POINT,
        MAX_MOVE_SPEED,
        PLAYER_INITIAL_MOVE_SPEED,
        PLAYER_INITIAL_EXPLOSION_POWER,
        PLAYER_INITIAL_BOMB_POSSESSIONS,
        PLAYER_INITIAL_INVINCIBLY_TIME,
        GAME_MAP_COL,
        GAME_MAP_ROW,
        BOMB_COUNT_STANDBY,
        BOMB_COUNT_PROPAGATION,
    } from '../../const'
    import {
        SEND_USER_STATE,
        SEND_MAP_STATE,
    } from "../../mutation-types";

    export default {
        name: 'Logic',
        data () {
            return {
                playerState: {
                    displayPositionX: 1, // 表示位置
                    displayPositionY: 1, // 表示位置
                    currentPositionY: 1, // 現在位置
                    currentPositionX: 1, // 現在位置
                    movingDirectionArr: [],
                    lastMovingDirection: 'down',
                    moveSpeed: PLAYER_INITIAL_MOVE_SPEED, // 移動速度
                    explosionPower: PLAYER_INITIAL_EXPLOSION_POWER, // 爆発威力
                    bombPossessions: PLAYER_INITIAL_BOMB_POSSESSIONS, // 爆弾所有数
                    death: false,
                    invincibly: false, // 無敵
                },
            }
        },
        created() {
            setInterval(()=> {
                if (!this.map || !this.uid) return;
                // プレーヤー移動
                this.movePlayer();
            }, 1000 / 10);

        },
        beforeMount() {
            // KEY UPイベント
            document.addEventListener('keydown', (event)=> {
                if (!this.playGame) return;
                const directionKeyDownHandler = (direction)=> {
                    if (0 <= this.playerState.movingDirectionArr.join(',').indexOf(direction)) return;
                    this.playerState.movingDirectionArr = this.playerState.movingDirectionArr.filter((item)=> {
                        return item !== direction;
                    });
                    this.playerState.movingDirectionArr.push(direction);
                    this.playerState.lastMovingDirection = direction;
                };
                switch(event.code) {
                    case 'ArrowUp':
                        directionKeyDownHandler(DIRECTION_UP);
                        break;
                    case 'KeyW':
                        directionKeyDownHandler(DIRECTION_UP);
                        break;
                    case 'ArrowDown':
                        directionKeyDownHandler(DIRECTION_DOWN);
                        break;
                    case 'KeyS':
                        directionKeyDownHandler(DIRECTION_DOWN);
                        break;
                    case 'ArrowRight':
                        directionKeyDownHandler(DIRECTION_RIGHT);
                        break;
                    case 'KeyD':
                        directionKeyDownHandler(DIRECTION_RIGHT);
                        break;
                    case 'ArrowLeft':
                        directionKeyDownHandler(DIRECTION_LEFT);
                        break;
                    case 'KeyA':
                        directionKeyDownHandler(DIRECTION_LEFT);
                        break;
                }
            });
            // KEY DOWNイベント
            document.addEventListener('keyup', (event)=> {
                if (!this.playGame) return;
                const directionKeyUpHandler = (direction)=> {
                    this.playerState.movingDirectionArr = this.playerState.movingDirectionArr.filter((item)=> {
                        return item !== direction;
                    });
                };
                switch(event.code) {
                    case 'ArrowUp':
                        directionKeyUpHandler(DIRECTION_UP);
                        break;
                    case 'KeyW':
                        directionKeyUpHandler(DIRECTION_UP);
                        break;
                    case 'ArrowDown':
                        directionKeyUpHandler(DIRECTION_DOWN);
                        break;
                    case 'KeyS':
                        directionKeyUpHandler(DIRECTION_DOWN);
                        break;
                    case 'ArrowRight':
                        directionKeyUpHandler(DIRECTION_RIGHT);
                        break;
                    case 'KeyD':
                        directionKeyUpHandler(DIRECTION_RIGHT);
                        break;
                    case 'ArrowLeft':
                        directionKeyUpHandler(DIRECTION_LEFT);
                        break;
                    case 'KeyA':
                        directionKeyUpHandler(DIRECTION_LEFT);
                        break;
                    case 'Space':
                        // 爆弾設置
                        this.setBomb();
                        break;
                    case 'Enter':
                        // 爆弾設置
                        this.setBomb();
                        break;
                }
            });
        },
        methods: {

            // 方向設定（コントローラーから）
            setDirection: function(direction) {
                if (!this.playGame) return;
                if (direction) {
                    if (0 <= this.playerState.movingDirectionArr.join(',').indexOf(direction)) return;
                    this.playerState.movingDirectionArr = this.playerState.movingDirectionArr.filter((item)=> {
                        return item !== direction;
                    });
                    this.playerState.movingDirectionArr.push(direction);
                    this.playerState.lastMovingDirection = direction;
                } else {
                    this.playerState.movingDirectionArr = [];
                }
            },

            // プレーヤー移動
            movePlayer: function() {
                if (this.playerState.death) return;

                // 現在の位置
                const currentPositionX = Math.round(this.playerState.displayPositionX);
                const currentPositionY = Math.round(this.playerState.displayPositionY);
                const currentCellType = this.getCellType(currentPositionY, currentPositionX);

                // 爆発によりプレーヤー死亡
                if (this.getIsExplosionCell(currentCellType)) {
                    // 無敵状態
                    if (!this.playerState.invincibly) {
                        // プレーヤー死亡
                        this.deathPlayer();
                        return;
                    }
                }

                // 敵に接触によりプレーヤー死亡
                let i, max;
                for (i = 0, max = this.enemies.length; i < max; i = i + 1) {
                    const enemy = this.enemies[i];
                    if (!this.playerState.invincibly && !enemy.death && enemy.currentPositionY === currentPositionY && enemy.currentPositionX === currentPositionX) {
                        // プレーヤー死亡
                        this.deathPlayer();
                        return;
                    }
                }

                // プレーヤー移動方向がUPの時
                if (this.movingDirection() === DIRECTION_UP) {
                    // 移動距離を足した後の次の表示位置
                    const nextDisplayPositionY = this.playerState.displayPositionY - this.playerState.moveSpeed;
                    // 移動距離を足した後の次の立ち位置
                    const nextPositionY = Math.round(nextDisplayPositionY);
                    // 「移動距離を足した後の次の立ち位置」が移動可能なセルだった場合
                    if (this.getIsMoveEnabledCell(this.getCellType(nextPositionY, currentPositionX)) || currentCellType === CELL_TYPE_BOMB) {
                        // 進行方向の次のセルが移動不可能なセルの場合、現在の位置に止める
                        if (!this.getIsMoveEnabledCell(this.getCellType(currentPositionY - 1, currentPositionX)) && nextDisplayPositionY < currentPositionY) {
                            this.playerState.displayPositionY = currentPositionY;
                        }
                        // 「移動距離を足した後の次の表示位置」を適応
                        else {
                            this.playerState.displayPositionY = nextDisplayPositionY;
                        }
                    }
                    // 進行方向以外の表示位置を補正
                    if (this.getIsMoveEnabledCell(this.getCellType(currentPositionY - 1, currentPositionX))) {
                        this.playerState.displayPositionX = currentPositionX;
                    }
                }
                // プレーヤー移動方向がDOWNの時
                else if (this.movingDirection() === DIRECTION_DOWN) {
                    // 移動距離を足した後の次の表示位置
                    const nextDisplayPositionY = this.playerState.displayPositionY + this.playerState.moveSpeed;
                    // 移動距離を足した後の次の立ち位置
                    const nextPositionY = Math.round(nextDisplayPositionY);
                    // 「移動距離を足した後の次の立ち位置」が移動可能なセルだった場合
                    if (this.getIsMoveEnabledCell(this.getCellType(nextPositionY, currentPositionX)) || currentCellType === CELL_TYPE_BOMB) {
                        // 進行方向の次のセルが移動不可能なセルの場合、現在の位置に止める
                        if (!this.getIsMoveEnabledCell(this.getCellType(currentPositionY + 1, currentPositionX)) && currentPositionY < nextDisplayPositionY) {
                            this.playerState.displayPositionY = currentPositionY;
                        }
                        // 「移動距離を足した後の次の表示位置」を適応
                        else {
                            this.playerState.displayPositionY = nextDisplayPositionY;
                        }
                    }
                    // 進行方向以外の表示位置を補正
                    if (this.getIsMoveEnabledCell(this.getCellType(currentPositionY + 1, currentPositionX))) {
                        this.playerState.displayPositionX = currentPositionX;
                    }
                }
                // プレーヤー移動方向がLEFTの時
                else if (this.movingDirection() === DIRECTION_LEFT) {
                    // 移動距離を足した後の次の表示位置
                    const nextDisplayPositionX = this.playerState.displayPositionX - this.playerState.moveSpeed;
                    // 移動距離を足した後の次の立ち位置
                    const nextPositionX = Math.round(nextDisplayPositionX);
                    // 「移動距離を足した後の次の立ち位置」が移動可能なセルだった場合
                    if (this.getIsMoveEnabledCell(this.getCellType(currentPositionY, nextPositionX)) || currentCellType === CELL_TYPE_BOMB) {
                        // 進行方向の次のセルが移動不可能なセルの場合、現在の位置に止める
                        if (!this.getIsMoveEnabledCell(this.getCellType(currentPositionY, currentPositionX - 1)) && nextDisplayPositionX < currentPositionX) {
                            this.playerState.displayPositionX = currentPositionX;
                        }
                        // 「移動距離を足した後の次の表示位置」を適応
                        else {
                            this.playerState.displayPositionX = nextDisplayPositionX;
                        }
                    }
                    // 進行方向以外の表示位置を補正
                    if (this.getIsMoveEnabledCell(this.getCellType(currentPositionY, currentPositionX - 1))) {
                        this.playerState.displayPositionY = currentPositionY;
                    }
                }
                // プレーヤー移動方向がRIGHTの時
                else if (this.movingDirection() === DIRECTION_RIGHT) {
                    // 移動距離を足した後の次の表示位置
                    const nextDisplayPositionX = this.playerState.displayPositionX + this.playerState.moveSpeed;
                    // 移動距離を足した後の次の立ち位置
                    const nextPositionX = Math.round(nextDisplayPositionX);
                    // 「移動距離を足した後の次の立ち位置」が移動可能なセルだった場合
                    if (this.getIsMoveEnabledCell(this.getCellType(currentPositionY, nextPositionX)) || currentCellType === CELL_TYPE_BOMB) {
                        // 進行方向の次のセルが移動不可能なセルの場合、現在の位置に止める
                        if (!this.getIsMoveEnabledCell(this.getCellType(currentPositionY, currentPositionX + 1)) && currentPositionX < nextDisplayPositionX) {
                            this.playerState.displayPositionX = currentPositionX;
                        }
                        // 「移動距離を足した後の次の表示位置」を適応
                        else {
                            this.playerState.displayPositionX = nextDisplayPositionX;
                        }
                    }
                    // 進行方向以外の表示位置を補正
                    if (this.getIsMoveEnabledCell(this.getCellType(currentPositionY, currentPositionX + 1))) {
                        this.playerState.displayPositionY = currentPositionY;
                    }
                }

                // 現在位置が変わった時のみ実行
                if (this.playerState.currentPositionX !== currentPositionX || this.playerState.currentPositionY !== currentPositionY) {
                    this.playerState.currentPositionX = currentPositionX;
                    this.playerState.currentPositionY = currentPositionY;

                    // // ゲーム終了後、出口に到着したかどうか？
                    // if (this.gameIsCompleted) {
                    //     if (this.exitPositionX === currentPositionX && this.exitPositionY === currentPositionY) {
                    //         this.clearCount = this.time();
                    //         this.scene = SCENE_GAME_CLEAR;
                    //     }
                    // }

                    // アイテム取得
                    if (currentCellType === CELL_TYPE_ITEM_BOMB_POSSESSIONS) {
                        // console.log('爆弾所有数増加');
                        // 爆弾所有数増加
                        this.playerState.bombPossessions += ITEM_BOMB_POSSESSIONS_STEP_UP_POINT;
                        // セルの種類設定（通路）
                        this.setCellType(currentPositionY, currentPositionX, CELL_TYPE_FREE);
                    } else if (currentCellType === CELL_TYPE_ITEM_MOVE_SPEED) {
                        // console.log('移動速度アップ');
                        // 移動速度アップ
                        const speed = this.playerState.moveSpeed + ITEM_MOVE_SPEED_STEP_UP_POINT;
                        if (MAX_MOVE_SPEED < speed) {
                            this.playerState.moveSpeed = MAX_MOVE_SPEED;
                        } else {
                            this.playerState.moveSpeed = speed;
                        }
                        // セルの種類設定（通路）
                        this.setCellType(currentPositionY, currentPositionX, CELL_TYPE_FREE);
                    } else if (currentCellType === CELL_TYPE_ITEM_EXPLOSION_POWER) {
                        // console.log('火力強化');
                        // 火力強化
                        this.playerState.explosionPower += ITEM_EXPLOSION_POWER_STEP_UP_POINT;
                        // セルの種類設定（通路）
                        this.setCellType(currentPositionY, currentPositionX, CELL_TYPE_FREE);
                    }

                }
            },

            // プレーヤー死亡
            deathPlayer: function() {
                this.playerState.death = true;

                // アイテム放出
                setTimeout(()=> {
                    let items = [];
                    // 爆弾所有アイテム
                    let bombPossessions = Math.floor((this.playerState.bombPossessions - PLAYER_INITIAL_BOMB_POSSESSIONS) / ITEM_BOMB_POSSESSIONS_STEP_UP_POINT);
                    let i, max;
                    for (i = 0, max = bombPossessions; i < max; i = i + 1) {
                        items.push(CELL_TYPE_ITEM_BOMB_POSSESSIONS);
                    }
                    // 火力アイテム
                    let explosionPower = Math.floor((this.playerState.explosionPower - PLAYER_INITIAL_EXPLOSION_POWER) / ITEM_EXPLOSION_POWER_STEP_UP_POINT);
                    for (i = 0, max = explosionPower; i < max; i = i + 1) {
                        items.push(CELL_TYPE_ITEM_EXPLOSION_POWER);
                    }
                    // 速度アイテム
                    let moveSpeed = Math.floor(((this.playerState.moveSpeed * 1000) - (PLAYER_INITIAL_MOVE_SPEED * 1000)) / (ITEM_MOVE_SPEED_STEP_UP_POINT * 1000));
                    for (i = 0, max = moveSpeed; i < max; i = i + 1) {
                        items.push(CELL_TYPE_ITEM_MOVE_SPEED);
                    }
                    items = (([...array])=> {
                        for (let i = array.length - 1; i >= 0; i--) {
                            const j = Math.floor(Math.random() * (i + 1));
                            [array[i], array[j]] = [array[j], array[i]];
                        }
                        return array;
                    })(items);

                    let count = 1;
                    while(1 <= items.length) {
                        for (i = -count, max = count; i <= max; i = i + 1) {
                            let j, max2;
                            for (j = -count, max2 = count; j <= max2; j = j + 1) {
                                if ((i === -count || i === count) || (j === -count || j === count)) {
                                    if (!items || items.length <= 0) break;
                                    const y = this.playerState.currentPositionY + i;
                                    const x = this.playerState.currentPositionX + j;
                                    if (this.map[y] && this.map[y][x]) {
                                        if (this.map[y][x] === CELL_TYPE_FREE) {
                                            this.setCellType(y, x, items[0], this.uid);
                                            items.shift();
                                        }
                                    }
                                }
                            }
                        }
                        count += 1;
                    }
                }, 3000);

                // プレーヤー初期化
                setTimeout(()=> {
                    this.initializedPlayer();
                }, 3000);

            },

            // プレーヤー初期化
            initializedPlayer: function(y, x, saveItem) {
                if (y && x) {
                    this.playerState.displayPositionX = x;
                    this.playerState.currentPositionX = x;
                    this.playerState.displayPositionY = y;
                    this.playerState.currentPositionY = y;
                } else {
                    // 左
                    if (this.playerState.currentPositionX < GAME_MAP_COL / 2) {
                        this.playerState.displayPositionX = 1;
                        this.playerState.currentPositionX = 1;
                    }
                    // 右
                    else {
                        this.playerState.displayPositionX = GAME_MAP_COL - 2;
                        this.playerState.currentPositionX = GAME_MAP_COL - 2;
                    }
                    // 上
                    if (this.playerState.currentPositionY < GAME_MAP_ROW / 2) {
                        this.playerState.displayPositionY = 1;
                        this.playerState.currentPositionY = 1;
                    }
                    // 下
                    else {
                        this.playerState.displayPositionY = GAME_MAP_ROW - 2;
                        this.playerState.currentPositionY = GAME_MAP_ROW - 2;
                    }
                }
                if (!saveItem) {
                    this.playerState.moveSpeed = PLAYER_INITIAL_MOVE_SPEED;
                    this.playerState.explosionPower = PLAYER_INITIAL_EXPLOSION_POWER;
                    this.playerState.bombPossessions = PLAYER_INITIAL_BOMB_POSSESSIONS;
                }
                this.playerState.lastMovingDirection = DIRECTION_DOWN;
                this.playerState.movingDirectionArr = [];

                // 死亡解除
                this.playerState.death = false;

                // 無敵設定
                this.playerState.invincibly = true;
                setTimeout(()=> {
                    // 無敵解除
                    this.playerState.invincibly = false;
                }, PLAYER_INITIAL_INVINCIBLY_TIME);

            },

            // 爆弾設置
            setBomb: function() {
                if (!this.playGame) return;
                // 爆弾設置数取得
                const setBombCount = (()=> {
                    let count = 0;
                    let i, max;
                    for (i = 0, max = this.bombsMap.length; i < max; i = i + 1) {
                        let j, max2;
                        for (j = 0, max2 = this.bombsMap[i].length; j < max2; j = j + 1) {
                            if (BOMB_COUNT_STANDBY <= this.bombsMap[i][j].count && this.bombsMap[i][j].count < BOMB_COUNT_PROPAGATION && this.bombsMap[i][j].uid === this.uid) {
                                count += 1;
                            }
                        }
                    }
                    console.log(this.bombsMap);
                    console.log(this.uid);
                    return count;
                })();
                // const setBombCount = (()=> {
                //     let count = 0;
                //     let i, max;
                //     for (i = 0, max = this.map.length; i < max; i = i + 1) {
                //         let j, max2;
                //         for (j = 0, max2 = this.map[i].length; j < max2; j = j + 1) {
                //             if (this.map[i][j] === CELL_TYPE_BOMB) {
                //                 count += 1;
                //             }
                //         }
                //     }
                //     return count;
                // })();

                // セルの種類設定
                if (setBombCount < this.playerState.bombPossessions) {
                    const currentCellType = this.getCellType(this.playerState.currentPositionY, this.playerState.currentPositionX);
                    if (currentCellType === CELL_TYPE_FREE) {
                        // セルの種類設定
                        this.setCellType(this.playerState.currentPositionY, this.playerState.currentPositionX, CELL_TYPE_BOMB);
                    }
                }
            },

            // セルの種類設定
            setCellType: function(y, x, type) {
                // console.log(y, x, type);
                // マップの状態送信
                this.$store.commit(SEND_MAP_STATE, {
                    y: y,
                    x: x,
                    type: type,
                    uid: this.uid,
                })
            },

            // セルの種類取得
            getCellType: function(y, x) {
                return this.$store.state.map[y][x];
            },

            // 爆発セルか否か
            getIsExplosionCell: function(cellType) {
                if (
                    cellType === CELL_TYPE_EXPLOSION_B ||
                    cellType === CELL_TYPE_EXPLOSION_T ||
                    cellType === CELL_TYPE_EXPLOSION_L ||
                    cellType === CELL_TYPE_EXPLOSION_R ||
                    cellType === CELL_TYPE_EXPLOSION_LR ||
                    cellType === CELL_TYPE_EXPLOSION_TB ||
                    cellType === CELL_TYPE_EXPLOSION_TR ||
                    cellType === CELL_TYPE_EXPLOSION_TL ||
                    cellType === CELL_TYPE_EXPLOSION_BL ||
                    cellType === CELL_TYPE_EXPLOSION_BR ||
                    cellType === CELL_TYPE_EXPLOSION_BLR ||
                    cellType === CELL_TYPE_EXPLOSION_TBR ||
                    cellType === CELL_TYPE_EXPLOSION_TLR ||
                    cellType === CELL_TYPE_EXPLOSION_TBL ||
                    cellType === CELL_TYPE_EXPLOSION_TBLR
                ) {
                    return true;
                } else {
                    return false;
                }
            },

            // 移動可能なセルか否か
            getIsMoveEnabledCell: function(cellType) {
                if (this.getIsExplosionCell(cellType)) {
                    return true;
                } else {
                    switch (cellType) {
                        case CELL_TYPE_FREE:
                            return true;
                        case CELL_TYPE_ITEM_BOMB_POSSESSIONS:
                            return true;
                        case CELL_TYPE_ITEM_EXPLOSION_POWER:
                            return true;
                        case CELL_TYPE_ITEM_MOVE_SPEED:
                            return true;
                    }
                    return false;
                }
            },

            // 移動方向
            movingDirection: function() {
                if (!this.playerState.movingDirectionArr || this.playerState.movingDirectionArr.length < 1) return null;
                return this.playerState.movingDirectionArr[this.playerState.movingDirectionArr.length - 1];
            },

        },
        computed: {
            login: function() {
                return this.$store.state.login;
            },
            playGame: function() {
                return this.$store.state.playGame;
            },
            uid: function() {
                return this.$store.state.uid;
            },
            map: function() {
                return this.$store.state.map;
            },
            bombsMap: function() {
                return this.$store.state.bombsMap;
            },
            users: function() {
                return this.$store.state.users;
            },
            enemies: function() {
                return this.$store.state.enemies;
            },
            stage: function() {
                return this.$store.state.stage;
            }
        },
        watch: {
            login: function(val) {
                if (val) {
                    // console.log('ログイン');
                    // プレーヤー初期化
                    const arr = [
                        {
                            x: 1,
                            y: 1,
                        },
                        {
                            x: 1,
                            y: GAME_MAP_ROW -  2,
                        },
                        {
                            x: GAME_MAP_COL - 2,
                            y: 1,
                        },
                        {
                            x: GAME_MAP_COL - 2,
                            y: GAME_MAP_ROW -  2,
                        },
                    ];
                    const position = arr[Math.floor(Math.random() * arr.length)];
                    // プレーヤー初期化
                    // this.initializedPlayer(1, 1);
                    this.initializedPlayer(position.y, position.x);
                } else {
                    // console.log('ログアウト');
                }
            },
            playerState: {
                handler: function (val, oldVal) {
                    // ユーザーの状態送信
                    this.$store.commit(SEND_USER_STATE, {
                        state: val,
                    })
                },
                deep: true,
            },
            stage: function(val) {
                // プレーヤー初期化（位置は現在一から四隅を判定して、アイテムは保持したままで）
                this.initializedPlayer(null, null, true);
            },
        },
    }
</script>

<style scoped>

</style>
