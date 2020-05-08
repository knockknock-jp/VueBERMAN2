<template>
    <div class="container">
        <div ref="view"></div>
        <Logic/>
    </div>
</template>

<script>
    import * as PIXI from 'pixi.js';
    import Logic from './Logic';
    import {
        CHARACTER_TYPE_000,
        CHARACTER_TYPE_001,
        CHARACTER_TYPE_002,
        CELL_SIZE,
        GAME_MAP_ROW,
        GAME_MAP_COL,
        CELL_TYPE_FIXED,
        CELL_TYPE_FREE,
        CELL_TYPE_BLOCK,
        CELL_TYPE_BLOCK_BROKEN,
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
    } from '../../const'

    export default {
        name: 'Playground',
        components: {
            Logic,
        },
        mounted() {

            // PIXI.jsアプリケーション初期化
            this.app = new PIXI.Application({
                width: GAME_MAP_ROW * CELL_SIZE,
                height: (GAME_MAP_COL * CELL_SIZE) + (CELL_SIZE * 0.25),
                backgroundColor: 0x62972c,
                resolution: window.devicePixelRatio || 1,
                autoResize: true,
            });
            this.$refs.view.appendChild(this.app.view);

            // アニメーションカウント
            this.animationCount = 0;
            setInterval(()=> {
                this.animationCount += 1;
                // ゲームマップ描画
                // this.setMap(this.map);
            }, 1000 / 10);

            this.mapSprite = null;
            this.usersSprite = [];

            this.fieldContainer = new PIXI.Container();
            this.fieldContainer.sortableChildren = true;
            this.app.stage.addChild(this.fieldContainer);

            // フィールド読み込み
            this.loadField().then(()=> {
                // ゲームマップ描画
                this.setMap(this.map);
            });

        },
        methods: {

            // フィールド読み込み
            loadField: function() {
                this.mapSprite = [];
                return new Promise((resolve)=> {
                    const loader = new PIXI.Loader();
                    loader.add('sprite', './assets/field.json').once('complete', ()=>{
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
                        for (i = 0, max = GAME_MAP_ROW; i < max; i = i + 1) {
                            let arr = [];
                            let j, max2;
                            for (j = 0, max2 = GAME_MAP_COL; j < max2; j = j + 1) {
                                const animatedSprite = new PIXI.AnimatedSprite(textures);
                                animatedSprite.position.set(j * CELL_SIZE, i * CELL_SIZE);
                                animatedSprite.width = CELL_SIZE;
                                animatedSprite.height = CELL_SIZE + (CELL_SIZE * 0.25);
                                animatedSprite.zIndex = i * CELL_SIZE;
                                this.fieldContainer.addChild(animatedSprite);
                                // this.app.stage.addChild(animatedSprite);
                                animatedSprite.gotoAndStop(1);
                                arr.push(animatedSprite);
                            }
                            this.mapSprite.push(arr);
                        }
                        resolve();
                    });
                    loader.load();
                });
            },

            // プレーヤー読み込み
            loadPlayer: function(uid, type, name) {
                return new Promise((resolve)=> {
                    let json = './assets/player000.json';
                    switch(type) {
                        case CHARACTER_TYPE_000:
                            json = './assets/player000.json'
                            break;
                        case CHARACTER_TYPE_001:
                            json = './assets/player001.json'
                            break;
                        case CHARACTER_TYPE_002:
                            json = './assets/player002.json'
                            break;
                    }
                    const loader = new PIXI.Loader();
                    loader.add('sprite', json).once('complete', ()=>{
                        // スプライト
                        const textures = [];
                        let i, max;
                        for (i = 0, max = 3; i <= max; i = i + 1) {
                            textures.push(PIXI.Texture.from(`player-down-${i}`));
                        }
                        for (i = 0, max = 3; i <= max; i = i + 1) {
                            textures.push(PIXI.Texture.from(`player-up-${i}`));
                        }
                        for (i = 0, max = 3; i <= max; i = i + 1) {
                            textures.push(PIXI.Texture.from(`player-left-${i}`));
                        }
                        for (i = 0, max = 3; i <= max; i = i + 1) {
                            textures.push(PIXI.Texture.from(`player-right-${i}`));
                        }
                        textures.push(PIXI.Texture.from(`player-death`));
                        const sprite = new PIXI.AnimatedSprite(textures);
                        sprite.position.set(-CELL_SIZE * 0.25, -CELL_SIZE * 0.3);
                        sprite.width = CELL_SIZE * 1.5;
                        sprite.height = CELL_SIZE * 1.5;
                        sprite.gotoAndStop(0);
                        // 名前
                        const text = new PIXI.Text(name, new PIXI.TextStyle({
                            fontSize: 12,
                            lineHeight: 12,
                            fontWeight: 'bold',
                            fill: this.$store.state.uid === uid ? '#ff6600' : '#ffffff',
                            stroke: '#000',
                            strokeThickness: 2,
                            align: 'center',
                            breakWords: true,
                            wordWrap: true,
                            wordWrapWidth: CELL_SIZE * 2,
                        }));
                        text.x = (CELL_SIZE / 2) - (text.width / 2);
                        text.y = -(CELL_SIZE / 2) - text.height + 5;
                        // コンテナ
                        const container = new PIXI.Container();
                        container.addChild(sprite);
                        container.addChild(text);
                        this.fieldContainer.addChild(container);
                        //
                        this.usersSprite.push({
                            uid: uid,
                            container: container,
                            sprite: sprite,
                            message: null,
                            commentContainer: null,
                        });
                        resolve();
                    });
                    loader.load();
                });
            },

            // ゲームマップ描画
            setMap: function(arr) {
                if (!arr) return;
                let i, max;
                for (i = 0, max = arr.length; i < max; i = i + 1) {
                    let j, max2;
                    for (j = 0, max2 = arr[i].length; j < max2; j = j + 1) {
                        if (!this.mapSprite[i] || !this.mapSprite[i][j] || arr[i][j] === undefined) continue;
                        switch(arr[i][j]) {
                            case CELL_TYPE_BOMB:
                                this.mapSprite[i][j].height = CELL_SIZE;
                                if (this.animationCount % 4 === 0) {
                                    this.mapSprite[i][j].gotoAndStop(arr[i][j]);
                                } else {
                                    this.mapSprite[i][j].gotoAndStop((this.animationCount % 4) + 22);
                                }
                                break;
                            case CELL_TYPE_BLOCK_BROKEN:
                                this.mapSprite[i][j].height = CELL_SIZE + (CELL_SIZE * 0.25);
                                if (this.animationCount % 4 === 0) {
                                    this.mapSprite[i][j].gotoAndStop(arr[i][j]);
                                } else {
                                    this.mapSprite[i][j].gotoAndStop((this.animationCount % 4) + 25);
                                }
                                break;
                            case CELL_TYPE_EXPLOSION_B:
                                this.mapSprite[i][j].height = CELL_SIZE + (CELL_SIZE * 0.25);
                                if (this.animationCount % 3 === 0) {
                                    this.mapSprite[i][j].gotoAndStop(arr[i][j]);
                                } else {
                                    this.mapSprite[i][j].gotoAndStop((this.animationCount % 3) + 28);
                                }
                                break;
                            case CELL_TYPE_EXPLOSION_T:
                                this.mapSprite[i][j].height = CELL_SIZE + (CELL_SIZE * 0.25);
                                if (this.animationCount % 3 === 0) {
                                    this.mapSprite[i][j].gotoAndStop(arr[i][j]);
                                } else {
                                    this.mapSprite[i][j].gotoAndStop((this.animationCount % 3) + 30);
                                }
                                break;
                            case CELL_TYPE_EXPLOSION_L:
                                this.mapSprite[i][j].height = CELL_SIZE + (CELL_SIZE * 0.25);
                                if (this.animationCount % 3 === 0) {
                                    this.mapSprite[i][j].gotoAndStop(arr[i][j]);
                                } else {
                                    this.mapSprite[i][j].gotoAndStop((this.animationCount % 3) + 32);
                                }
                                break;
                            case CELL_TYPE_EXPLOSION_R:
                                this.mapSprite[i][j].height = CELL_SIZE + (CELL_SIZE * 0.25);
                                if (this.animationCount % 3 === 0) {
                                    this.mapSprite[i][j].gotoAndStop(arr[i][j]);
                                } else {
                                    this.mapSprite[i][j].gotoAndStop((this.animationCount % 3) + 34);
                                }
                                break;
                            case CELL_TYPE_EXPLOSION_LR:
                                this.mapSprite[i][j].height = CELL_SIZE + (CELL_SIZE * 0.25);
                                if (this.animationCount % 3 === 0) {
                                    this.mapSprite[i][j].gotoAndStop(arr[i][j]);
                                } else {
                                    this.mapSprite[i][j].gotoAndStop((this.animationCount % 3) + 36);
                                }
                                break;
                            case CELL_TYPE_EXPLOSION_TB:
                                this.mapSprite[i][j].height = CELL_SIZE + (CELL_SIZE * 0.25);
                                if (this.animationCount % 3 === 0) {
                                    this.mapSprite[i][j].gotoAndStop(arr[i][j]);
                                } else {
                                    this.mapSprite[i][j].gotoAndStop((this.animationCount % 3) + 38);
                                }
                                break;
                            case CELL_TYPE_EXPLOSION_TR:
                                this.mapSprite[i][j].height = CELL_SIZE + (CELL_SIZE * 0.25);
                                if (this.animationCount % 3 === 0) {
                                    this.mapSprite[i][j].gotoAndStop(arr[i][j]);
                                } else {
                                    this.mapSprite[i][j].gotoAndStop((this.animationCount % 3) + 40);
                                }
                                break;
                            case CELL_TYPE_EXPLOSION_TL:
                                this.mapSprite[i][j].height = CELL_SIZE + (CELL_SIZE * 0.25);
                                if (this.animationCount % 3 === 0) {
                                    this.mapSprite[i][j].gotoAndStop(arr[i][j]);
                                } else {
                                    this.mapSprite[i][j].gotoAndStop((this.animationCount % 3) + 42);
                                }
                                break;
                            case CELL_TYPE_EXPLOSION_BL:
                                this.mapSprite[i][j].height = CELL_SIZE + (CELL_SIZE * 0.25);
                                if (this.animationCount % 3 === 0) {
                                    this.mapSprite[i][j].gotoAndStop(arr[i][j]);
                                } else {
                                    this.mapSprite[i][j].gotoAndStop((this.animationCount % 3) + 44);
                                }
                                break;
                            case CELL_TYPE_EXPLOSION_BR:
                                this.mapSprite[i][j].height = CELL_SIZE + (CELL_SIZE * 0.25);
                                if (this.animationCount % 3 === 0) {
                                    this.mapSprite[i][j].gotoAndStop(arr[i][j]);
                                } else {
                                    this.mapSprite[i][j].gotoAndStop((this.animationCount % 3) + 46);
                                }
                                break;
                            case CELL_TYPE_EXPLOSION_BLR:
                                this.mapSprite[i][j].height = CELL_SIZE + (CELL_SIZE * 0.25);
                                if (this.animationCount % 3 === 0) {
                                    this.mapSprite[i][j].gotoAndStop(arr[i][j]);
                                } else {
                                    this.mapSprite[i][j].gotoAndStop((this.animationCount % 3) + 48);
                                }
                                break;
                            case CELL_TYPE_EXPLOSION_TBR:
                                this.mapSprite[i][j].height = CELL_SIZE + (CELL_SIZE * 0.25);
                                if (this.animationCount % 3 === 0) {
                                    this.mapSprite[i][j].gotoAndStop(arr[i][j]);
                                } else {
                                    this.mapSprite[i][j].gotoAndStop((this.animationCount % 3) + 50);
                                }
                                break;
                            case CELL_TYPE_EXPLOSION_TLR:
                                this.mapSprite[i][j].height = CELL_SIZE + (CELL_SIZE * 0.25);
                                if (this.animationCount % 3 === 0) {
                                    this.mapSprite[i][j].gotoAndStop(arr[i][j]);
                                } else {
                                    this.mapSprite[i][j].gotoAndStop((this.animationCount % 3) + 52);
                                }
                                break;
                            case CELL_TYPE_EXPLOSION_TBL:
                                this.mapSprite[i][j].height = CELL_SIZE + (CELL_SIZE * 0.25);
                                if (this.animationCount % 3 === 0) {
                                    this.mapSprite[i][j].gotoAndStop(arr[i][j]);
                                } else {
                                    this.mapSprite[i][j].gotoAndStop((this.animationCount % 3) + 54);
                                }
                                break;
                            case CELL_TYPE_EXPLOSION_TBLR:
                                this.mapSprite[i][j].height = CELL_SIZE + (CELL_SIZE * 0.25);
                                if (this.animationCount % 3 === 0) {
                                    this.mapSprite[i][j].gotoAndStop(arr[i][j]);
                                } else {
                                    this.mapSprite[i][j].gotoAndStop((this.animationCount % 3) + 56);
                                }
                                break;
                            case CELL_TYPE_ITEM_BOMB_POSSESSIONS:
                                this.mapSprite[i][j].height = CELL_SIZE;
                                this.mapSprite[i][j].gotoAndStop(arr[i][j]);
                                break;
                            case CELL_TYPE_ITEM_EXPLOSION_POWER:
                                this.mapSprite[i][j].height = CELL_SIZE;
                                this.mapSprite[i][j].gotoAndStop(arr[i][j]);
                                break;
                            case CELL_TYPE_ITEM_MOVE_SPEED:
                                this.mapSprite[i][j].height = CELL_SIZE;
                                this.mapSprite[i][j].gotoAndStop(arr[i][j]);
                                break;
                            default:
                                this.mapSprite[i][j].height = CELL_SIZE + (CELL_SIZE * 0.25);
                                this.mapSprite[i][j].gotoAndStop(arr[i][j]);
                        }
                    }
                }
            },

            // プレーヤー描画
            setPlayer: function(uid, state, comment) {
                let sprite = null;
                let container = null;
                let i, max;
                for (i = 0, max = this.usersSprite.length; i < max; i = i + 1) {
                    if (uid === this.usersSprite[i].uid) {
                        sprite = this.usersSprite[i].sprite;
                        container = this.usersSprite[i].container;
                        //
                        if (comment && comment.message) {
                            if (this.usersSprite[i].message !== comment.message) {
                                // console.log('コメント変更', comment.message);
                                const commentContainer = new PIXI.Container();
                                const text = new PIXI.Text(comment.message, new PIXI.TextStyle({
                                    fontSize: 10,
                                    lineHeight: 10,
                                    fill: '#000000',
                                    align: 'center',
                                    breakWords: true,
                                    wordWrap: true,
                                    wordWrapWidth: (CELL_SIZE * 3) - 10,
                                }));
                                text.x = 5;
                                text.y = 5;
                                const graphics = new PIXI.Graphics();
                                graphics.beginFill(0xffffff, 0.9);
                                graphics.drawRoundedRect(0, 0, CELL_SIZE * 3, text.height + 10, 15);
                                graphics.endFill();
                                commentContainer.x = (CELL_SIZE / 2) - (((CELL_SIZE * 3) - 10) / 2);
                                commentContainer.y = -(text.height + 50);
                                //
                                commentContainer.addChild(graphics);
                                commentContainer.addChild(text);
                                container.addChild(commentContainer);
                                //
                                if (this.usersSprite[i].commentContainer) container.removeChild(this.usersSprite[i].commentContainer);
                                //
                                this.usersSprite[i].message = comment.message;
                                this.usersSprite[i].commentContainer = commentContainer;
                            }
                        } else {
                            if (this.usersSprite[i].message) {
                                // console.log('コメント変更', null);
                                if (this.usersSprite[i].commentContainer) container.removeChild(this.usersSprite[i].commentContainer);
                                //
                                this.usersSprite[i].message = null;
                                this.usersSprite[i].commentContainer = null;
                            }
                        }
                        break;
                    }
                }
                if (!sprite || !container) return;
                //
                container.position.set(state.displayPositionX * CELL_SIZE, state.displayPositionY * CELL_SIZE);
                container.zIndex = Math.floor(state.displayPositionY * CELL_SIZE);
                if (state.death) {
                    sprite.gotoAndStop(16);
                    return;
                }
                switch (state.lastMovingDirection) {
                    case DIRECTION_UP:
                        if (1 <= state.movingDirectionArr.length) {
                            sprite.gotoAndStop((this.animationCount % 4) + 4);
                        } else {
                            sprite.gotoAndStop(4);
                        }
                        break;
                    case DIRECTION_DOWN:
                        if (1 <= state.movingDirectionArr.length) {
                            sprite.gotoAndStop(this.animationCount % 4);
                        } else {
                            sprite.gotoAndStop(0);
                        }
                        break;
                    case DIRECTION_RIGHT:
                        if (1 <= state.movingDirectionArr.length) {
                            sprite.gotoAndStop((this.animationCount % 4) + 8);
                        } else {
                            sprite.gotoAndStop(8);
                        }
                        break;
                    case DIRECTION_LEFT:
                        if (1 <= state.movingDirectionArr.length) {
                            sprite.gotoAndStop((this.animationCount % 4) + 12);
                        } else {
                            sprite.gotoAndStop(12);
                        }
                        break;
                }
            },

        },
        computed: {
            map: function() {
                return this.$store.state.map;
            },
            users: function() {
                return this.$store.state.users;
            },
        },
        watch: {
            map(val) {
                // console.log('map変更', val);
                // ゲームマップ描画
                this.setMap(val);
            },
            users(val, oldVal) {
                if (oldVal.length < val.length) {
                    // console.log('user追加', val[0].uid, val[0].name);
                    // プレーヤー読み込み
                    const addedUser = val[0];
                    this.loadPlayer(addedUser.uid, addedUser.type, addedUser.name).then(() => {
                        // プレーヤー描画
                        this.setPlayer(addedUser.uid, addedUser.state, addedUser.comments[0]);
                    });
                } else if (val.length < oldVal.length) {
                    // console.log('user削除');
                    // 不用なSpriteの削除
                    let i, max;
                    for (i = 0, max = this.usersSprite.length; i < max; i = i + 1) {
                        let flg = false;
                        let j, max2;
                        for (j = 0, max2 = val.length; j < max2; j = j + 1) {
                            if (this.usersSprite[i].uid === val[j].uid) {
                                flg = true;
                                break;
                            }
                        }
                        if (!flg) {
                            this.app.stage.removeChild(this.usersSprite[i].container);
                        }
                    }
                    for (i = 0, max = val.length; i < max; i = i + 1) {
                        // プレーヤー描画
                        this.setPlayer(val[i].uid, val[i].state, val[i].comments[0]);
                    }
                } else {
                    let i, max;
                    for (i = 0, max = val.length; i < max; i = i + 1) {
                        // プレーヤー描画
                        this.setPlayer(val[i].uid, val[i].state, val[i].comments[0]);
                    }
                }
            },
        }
    }
</script>

<style scoped lang="scss">
    .container {
        background-color: #333;
    }
</style>
