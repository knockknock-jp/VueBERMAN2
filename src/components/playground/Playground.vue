<template>
<!--    <div class="container" v-bind:style="{minWidth: minWidth + 'px', minHeight: minHeight + 'px'}">-->
    <div class="container">
        <div class="inner" ref="view"></div>
<!--        <template v-if="introOpen">-->
<!--            <div class="intro" v-bind:class="introHide ? 'hide' : ''">-->
<!--                <div class="intro__box">-->
<!--                    <span class="intro__text">{{'STAGE ' + (stage + 1) + ' START'}}</span>-->
<!--                </div>-->
<!--            </div>-->
<!--        </template>-->
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
        FIELD_SCROLL_POSITION,
        ENEMY_TYPE_001,
        ENEMY_TYPE_002,
        ENEMY_TYPE_003,
        PLAYER_INITIAL_MOVE_SPEED,
        PLAYER_INITIAL_EXPLOSION_POWER,
        PLAYER_INITIAL_BOMB_POSSESSIONS,
    } from '../../const'
    import { TweenMax, Linear, Elastic, Bounce } from 'gsap';

    export default {
        name: 'Playground',
        components: {
            Logic,
        },
        data () {
            return {
                footerHeight: 200,
                // introOpen: false,
                // introHide: false,
            }
        },
        mounted() {

            // PIXI.jsアプリケーション初期化
            this.app = new PIXI.Application({
                width: window.innerWidth,
                height: window.innerHeight - 200,
                // width: GAME_MAP_COL * CELL_SIZE,
                // height: (GAME_MAP_ROW * CELL_SIZE) + (CELL_SIZE * 0.25),
                backgroundColor: 0x000000,
                resolution: window.devicePixelRatio || 1,
                autoResize: true,
            });
            this.$refs.view.appendChild(this.app.view);

            this.mapSprite = null;
            this.usersSprite = [];
            this.enemiesSprite = [];
            this.stageText = null;
            this.enemyText = null;
            this.enemy2Text = null;
            this.enemy3Text = null;

            /*
            app -> container -> gameContainer（プレーヤーに合わせた画面スクロール） -> mapContainer -> enemy, map, user, exit
                  -> headerContainer                                                                           -> ground
            */

            // コンテナ作成
            this.container = new PIXI.Container();
            this.app.stage.addChild(this.container);

            // ゲームコンテナ作成
            this.gameContainer = new PIXI.Container();
            this.container.addChild(this.gameContainer);
            // this.app.stage.addChild(this.gameContainer);

            // グランド作成
            this.createGround();

            // マップ読み込み
            this.mapContainer = new PIXI.Container();
            this.mapContainer.sortableChildren = true;
            this.gameContainer.addChild(this.mapContainer);
            this.loadMap().then(()=> {
                // ゲームマップ描画
                this.setMap(this.map);
            });

            // ヘッダーコンテナ作成
            this.headerContainer = new PIXI.Container();
            this.app.stage.addChild(this.headerContainer);
            this.createHeader();

            // 出口
            this.exitSprite = null;

            // アニメーションカウント
            this.animationCount = 0;
            setInterval(()=> {
                this.animationCount += 1;

                // 出口点滅
                if (this.exit) {
                    if (Math.floor(this.animationCount / 3) % 2) {
                        this.exitSprite.alpha = 0;
                    } else {
                        this.exitSprite.alpha = 1;
                    }
                }

            }, 1000 / 10);

            // 画面リサイズ
            window.addEventListener('resize', this.resizeHandler, false);
            this.resizeHandler();

        },
        methods: {

            resizeHandler: function() {

                if (window.innerWidth <= 896) {
                    this.footerHeight = 150;
                } else {
                    this.footerHeight = 200;
                }

                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight - this.footerHeight;
                this.app.renderer.resize(windowWidth, windowHeight);

                // ゲーム画面を中央にする
                if (this.container.width < windowWidth) {
                    this.container.x = Math.floor((windowWidth - this.container.width) / 2);
                } else {
                    this.container.x = 0;
                }
                if (this.container.height < windowHeight) {
                    this.container.y = Math.floor((windowHeight - this.container.height) / 2);
                } else {
                    this.container.y = 0;
                }

                // ヘッダーを左上にする
                this.headerContainer.position.set(windowWidth - (this.headerContainer.width + 10), 10);

            },

            // ヘッダー作成
            createHeader: function() {

                // 背景
                const graphics = new PIXI.Graphics();
                graphics.beginFill(0x000000, 0.5);
                graphics.drawRoundedRect(0, 0, 290, CELL_SIZE + (CELL_SIZE * 0.25), (CELL_SIZE + (CELL_SIZE * 0.25)) / 2);
                graphics.endFill();
                graphics.position.set(0, 0);
                this.headerContainer.addChild(graphics);

                // ステージ
                this.stageText = new PIXI.Text('STAGE ' + (this.stage + 1) + ' / 3', new PIXI.TextStyle({
                    fontSize: 16,
                    fontWeight: 'bold',
                    lineHeight: 16,
                    fill: 0xffffff,
                    breakWords: false,
                    wordWrap: false,
                }));
                this.stageText.position.set(20, ((CELL_SIZE + (CELL_SIZE * 0.25)) / 2) - 8);
                this.headerContainer.addChild(this.stageText);

                // 敵
                const enemySprite = PIXI.Sprite.from('./assets/enemy_sprite.png');
                enemySprite.width = 20;
                enemySprite.height = 20;
                enemySprite.position.set(130, ((CELL_SIZE + (CELL_SIZE * 0.25)) / 2) - 10);
                this.headerContainer.addChild(enemySprite);
                this.enemyText = new PIXI.Text(0, new PIXI.TextStyle({
                    fontSize: 14,
                    fontWeight: 'bold',
                    lineHeight: 14,
                    fill: 0xd86300,
                    breakWords: false,
                    wordWrap: false,
                }));
                this.enemyText.position.set(155, ((CELL_SIZE + (CELL_SIZE * 0.25)) / 2) - 7);
                this.headerContainer.addChild(this.enemyText);

                // 敵
                const enemySprite2 = PIXI.Sprite.from('./assets/enemy3_sprite.png');
                enemySprite2.width = 20;
                enemySprite2.height = 20;
                enemySprite2.position.set(180, ((CELL_SIZE + (CELL_SIZE * 0.25)) / 2) - 10);
                this.headerContainer.addChild(enemySprite2);
                this.enemy2Text = new PIXI.Text(0, new PIXI.TextStyle({
                    fontSize: 14,
                    fontWeight: 'bold',
                    lineHeight: 14,
                    fill: 0x2ba2e6,
                    breakWords: false,
                    wordWrap: false,
                }));
                this.enemy2Text.position.set(205, ((CELL_SIZE + (CELL_SIZE * 0.25)) / 2) - 7);
                this.headerContainer.addChild(this.enemy2Text);

                // 敵
                const enemySprite3 = PIXI.Sprite.from('./assets/enemy2_sprite.png');
                enemySprite3.width = 20;
                enemySprite3.height = 20;
                enemySprite3.position.set(230, ((CELL_SIZE + (CELL_SIZE * 0.25)) / 2) - 10);
                this.headerContainer.addChild(enemySprite3);
                this.enemy3Text = new PIXI.Text(0, new PIXI.TextStyle({
                    fontSize: 14,
                    fontWeight: 'bold',
                    lineHeight: 14,
                    fill: 0xc21b4a,
                    breakWords: false,
                    wordWrap: false,
                }));
                this.enemy3Text.position.set(255, ((CELL_SIZE + (CELL_SIZE * 0.25)) / 2) - 7);
                this.headerContainer.addChild(this.enemy3Text);

            },

            // グランド作成
            createGround: function() {
                const container = new PIXI.Container();
                let i, max;
                for (i = 0, max = GAME_MAP_ROW; i < max; i = i + 1) {
                    let j, max2;
                    for (j = 0, max2 = GAME_MAP_COL; j < max2; j = j + 1) {
                        const graphics = new PIXI.Graphics();
                        if (j % 2 && i % 2) {
                            graphics.beginFill(0x62972c);
                        } else if (GAME_MAP_ROW - 1 <= i) {
                            graphics.beginFill(0x000000);
                        } else {
                            graphics.beginFill(0x5d8f2b);
                        }
                        graphics.drawRect(0, 0, CELL_SIZE, CELL_SIZE + (CELL_SIZE * 0.25));
                        graphics.endFill();
                        graphics.position.set(j * CELL_SIZE, (i * CELL_SIZE) + (CELL_SIZE * 0.25));
                        container.addChild(graphics);
                    }
                }
                this.gameContainer.addChild(container);
            },

            // マップ読み込み
            loadMap: function() {
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
                                // animatedSprite.zIndex = i * CELL_SIZE;
                                this.mapContainer.addChild(animatedSprite);
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
                        sprite.position.set(-CELL_SIZE * 0.25, -CELL_SIZE * 0.5);
                        // sprite.position.set(-CELL_SIZE * 0.25, -CELL_SIZE * 0.3);
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
                        text.y = CELL_SIZE;
                        // text.y = -(CELL_SIZE / 2) - text.height + 5;
                        // コンテナ
                        const container = new PIXI.Container();
                        container.addChild(sprite);
                        container.addChild(text);
                        this.mapContainer.addChild(container);
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

            // 敵読み込み
            loadEnemy: function(eid, type) {
                return new Promise((resolve)=> {
                    let json = './assets/enemy.json';
                    switch(type) {
                        case ENEMY_TYPE_001:
                            json = './assets/enemy.json'
                            break;
                        case ENEMY_TYPE_002:
                            json = './assets/enemy2.json'
                            break;
                        case ENEMY_TYPE_003:
                            json = './assets/enemy3.json'
                            break;
                    }
                    const loader = new PIXI.Loader();
                    loader.add('sprite', json).once('complete', ()=>{
                        // スプライト
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
                        const sprite = new PIXI.AnimatedSprite(textures);
                        sprite.position.set(0, 0);
                        sprite.width = CELL_SIZE;
                        sprite.height = CELL_SIZE ;
                        sprite.gotoAndStop(0);
                        this.mapContainer.addChild(sprite);
                        //
                        this.enemiesSprite.push({
                            eid: eid,
                            sprite: sprite,
                            currentPositionY: null,
                            currentPositionX: null,
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
                                //
                                const graphics = new PIXI.Graphics();
                                graphics.beginFill(0xffffff, 0.8);
                                graphics.drawRoundedRect(0, 0, CELL_SIZE * 3, text.height + 10, 15);
                                graphics.endFill();
                                //
                                const graphics2 = new PIXI.Graphics();
                                graphics2.beginFill(0xffffff, 0.8);
                                const xCenter = ((CELL_SIZE * 3) - 10) / 2;
                                const yTop = text.height + 10;
                                graphics2.moveTo(xCenter + 5, yTop);
                                graphics2.lineTo(xCenter, yTop + 10);
                                graphics2.lineTo(xCenter - 5, yTop);
                                graphics2.lineTo(xCenter + 5, yTop);
                                graphics2.closePath();
                                graphics2.endFill();
                                //
                                commentContainer.x = (CELL_SIZE / 2) - (((CELL_SIZE * 3) - 10) / 2);
                                commentContainer.y = -(text.height + 40);
                                commentContainer.addChild(graphics);
                                commentContainer.addChild(graphics2);
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
                container.zIndex = state.currentPositionY;
                // container.zIndex = Math.floor(state.displayPositionY * CELL_SIZE);
                // 死亡状態
                if (state.death) {
                    sprite.gotoAndStop(16);
                    return;
                }
                // 無敵状態
                if (state.invincibly) {
                    sprite.alpha = 0.5;
                } else {
                    sprite.alpha = 1;
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

            // 敵描画
            setEnemy: function(eid, death, currentPositionY, currentPositionX, direction, speed) {
                let enemyInfo = null;
                let i, max;
                for (i = 0, max = this.enemiesSprite.length; i < max; i = i + 1) {
                    if (eid === this.enemiesSprite[i].eid) {
                        enemyInfo = this.enemiesSprite[i];
                        break;
                    }
                }
                if (!enemyInfo || !enemyInfo.sprite) return;
                // 移動
                if (enemyInfo.currentPositionY === null && enemyInfo.currentPositionX === null) {
                    enemyInfo.sprite.position.set(currentPositionX * CELL_SIZE, currentPositionY * CELL_SIZE);
                    enemyInfo.currentPositionX = currentPositionX;
                    enemyInfo.currentPositionY = currentPositionY;
                } else {
                    if (enemyInfo.currentPositionY !== currentPositionY || enemyInfo.currentPositionX !== currentPositionX) {
                        enemyInfo.currentPositionX = currentPositionX;
                        enemyInfo.currentPositionY = currentPositionY;
                        TweenMax.to(enemyInfo.sprite.position, (1 / 10) * speed, {
                            y: currentPositionY * CELL_SIZE,
                            x: currentPositionX * CELL_SIZE,
                            ease: Linear.easeNone,
                        });
                    }
                }
                enemyInfo.sprite.zIndex = currentPositionY;
                // アニメーション
                if (death) {
                    enemyInfo.sprite.gotoAndStop(8);
                } else if (direction === DIRECTION_LEFT) {
                    enemyInfo.sprite.gotoAndStop((this.animationCount % 4));
                } else if (direction === DIRECTION_RIGHT) {
                    enemyInfo.sprite.gotoAndStop((this.animationCount % 4) + 4);
                }
            },

            // ステージ開始の表示設定
            setStageIntro: function() {

                // this.introOpen = true;
                // setTimeout(()=> {
                //     this.introHide = true;
                //     setTimeout(()=> {
                //         this.introHide = false;
                //         this.introOpen = false;
                //     }, 1000);
                // }, 1000);

                const container = new PIXI.Container();

                // 背景
                const graphics = new PIXI.Graphics();
                graphics.beginFill(0x000000, 0.5);
                graphics.drawRect(0, 0, window.innerWidth, window.innerHeight - this.footerHeight);
                // graphics.drawRect(0, 0, this.app.stage.width, this.app.stage.height);
                graphics.endFill();
                container.addChild(graphics);

                // ステージ名
                const text = new PIXI.Text('STAGE ' + (this.stage + 1) + ' START', new PIXI.TextStyle({
                    fontSize: 40,
                    fontWeight: 'bold',
                    lineHeight: 40,
                    fill: 0xffffff,
                    breakWords: false,
                    wordWrap: false,
                }));
                text.x = (window.innerWidth / 2) - (text.width / 2);
                text.y = ((window.innerHeight - this.footerHeight) / 2) - (text.height / 2);
                container.addChild(text);

                this.app.stage.addChild(container);

                // フェードイン
                TweenMax.to(container, 1, {
                    alpha: 0,
                    ease: Linear.easeNone,
                    delay : 3,
                    onComplete: ()=> {
                        this.app.stage.removeChild(container);
                    },
                });

            },

            // 獲得ポイント表示
            setPoint: function(y, x, val) {
                const text = new PIXI.Text(val + 'point', new PIXI.TextStyle({
                    fontSize: 18,
                    fontWeight: 'bold',
                    fontStyle: 'italic',
                    lineHeight: 18,
                    fill: 0xa00000,
                    stroke: '#ffffff',
                    strokeThickness: 4,
                }));
                text.alpha = 0;
                text.x = (CELL_SIZE * x) + 10;
                text.y = (CELL_SIZE * y);
                this.gameContainer.addChild(text);

                // フェードアウト
                TweenMax.to(text, 0.5, {
                    alpha: 1,
                    y: text.y + 10,
                    ease: Bounce.easeOut,
                    delay : 0.5,
                    onComplete: ()=> {
                        TweenMax.to(text, 0.5, {
                            alpha: 0,
                            ease: Linear.easeNone,
                            delay : 0.5,
                            onComplete: ()=> {
                                this.app.stage.removeChild(text);
                            },
                        });
                    },
                });

            },

        },
        computed: {
            playerState: function() {
                if (!this.$store.state.uid) return null;
                let i, max;
                for (i = 0, max = this.$store.state.users.length; i < max; i = i + 1) {
                    if (this.$store.state.uid === this.$store.state.users[i].uid) {
                        return this.$store.state.users[i].state;
                    }
                }
                return null;
            },
            invincibly: function() {
                return this.$store.state.invincibly;
            },
            map: function() {
                return this.$store.state.map;
            },
            users: function() {
                return this.$store.state.users;
            },
            enemies: function() {
                return this.$store.state.enemies;
            },
            // minWidth: function() {
            //     return GAME_MAP_COL * CELL_SIZE;
            // },
            // minHeight: function() {
            //     return (GAME_MAP_ROW * CELL_SIZE) + (CELL_SIZE * 0.25);
            // },
            exit: function() {
                return this.$store.state.exit;
            },
            stage: function() {
                return this.$store.state.stage;
            },
            points: function() {
                return this.$store.state.points;
            }
        },
        watch: {
            playerState(val, oldVal) {
                if (!val || !val.displayPositionY || !val.displayPositionX) return;
                // 画面スクロール
                const positionY = Math.floor(val.displayPositionY * CELL_SIZE);
                const positionX = Math.floor(val.displayPositionX * CELL_SIZE);
                const windowHeight = window.innerHeight - this.footerHeight;
                const windowWidth = window.innerWidth;
                let movingDirectionArr = [val.movingDirectionArr[val.movingDirectionArr.length - 1]];
                // 初期化時
                if (oldVal) {
                    if (!val.death && oldVal.death) {
                        movingDirectionArr = [];
                        if (val.displayPositionX < GAME_MAP_COL / 2) {
                            movingDirectionArr.push(DIRECTION_LEFT);
                        } else {
                            movingDirectionArr.push(DIRECTION_RIGHT);
                        }
                        if (val.displayPositionY < GAME_MAP_ROW / 2) {
                            movingDirectionArr.push(DIRECTION_UP);
                        } else {
                            movingDirectionArr.push(DIRECTION_DOWN);
                        }
                    }
                }
                // 上
                if (movingDirectionArr.indexOf(DIRECTION_UP) >= 0) {
                    if (positionY + this.gameContainer.y < FIELD_SCROLL_POSITION - CELL_SIZE) {
                        let y = (FIELD_SCROLL_POSITION - CELL_SIZE) - positionY;
                        if (0 < y) y = 0;
                        this.gameContainer.y = y;
                    }
                }
                // 下
                else if (movingDirectionArr.indexOf(DIRECTION_DOWN) >= 0) {
                    if (windowHeight - FIELD_SCROLL_POSITION < positionY + this.gameContainer.y) {
                        let y = windowHeight - FIELD_SCROLL_POSITION - positionY;
                        let max = windowHeight - ((GAME_MAP_ROW * CELL_SIZE) + (CELL_SIZE * 0.25));
                        if (y < max) y = max;
                        this.gameContainer.y = y;
                    }
                }
                // 左
                if (movingDirectionArr.indexOf(DIRECTION_LEFT) >= 0) {
                    if (positionX + this.gameContainer.x < FIELD_SCROLL_POSITION - CELL_SIZE) {
                        let x = (FIELD_SCROLL_POSITION - CELL_SIZE) - positionX;
                        if (0 < x) x = 0;
                        this.gameContainer.x = x;
                    }
                }
                // 右
                else if (movingDirectionArr.indexOf(DIRECTION_RIGHT) >= 0) {
                    if (windowWidth - FIELD_SCROLL_POSITION < positionX + this.gameContainer.x) {
                        let x = windowWidth - FIELD_SCROLL_POSITION - positionX;
                        let max = windowWidth - (GAME_MAP_ROW * CELL_SIZE);
                        if (x < max) x = max;
                        this.gameContainer.x = x;
                    }
                }
            },
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
                    // console.log('user削除', val);
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
                            this.mapContainer.removeChild(this.usersSprite[i].container);
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
            enemies(val, oldVal) {
                if (oldVal.length < val.length) {
                    // 敵読み込み
                    let i, max;
                    for (i = 0, max = val.length; i < max; i = i + 1) {
                        const addedEnemy = val[i];
                        this.loadEnemy(addedEnemy.eid, addedEnemy.type).then(() => {
                            // 敵描画
                            this.setEnemy(addedEnemy.eid, addedEnemy.death, addedEnemy.currentPositionY, addedEnemy.currentPositionX, addedEnemy.direction, addedEnemy.speed);
                        });
                    }
                } else if (val.length < oldVal.length) {
                    // 不用なSpriteの削除
                    let i, max;
                    for (i = 0, max = this.enemiesSprite.length; i < max; i = i + 1) {
                        let flg = false;
                        let j, max2;
                        for (j = 0, max2 = val.length; j < max2; j = j + 1) {
                            if (this.enemiesSprite[i].eid === val[j].eid) {
                                flg = true;
                                break;
                            }
                        }
                        if (!flg) {
                            this.mapContainer.removeChild(this.enemiesSprite[i].sprite);
                        }
                    }
                    for (i = 0, max = val.length; i < max; i = i + 1) {
                        // 敵描画
                        this.setEnemy(val[i].eid, val[i].death, val[i].currentPositionY, val[i].currentPositionX, val[i].direction, val[i].speed);
                    }
                } else {
                    let i, max;
                    for (i = 0, max = val.length; i < max; i = i + 1) {
                        // 敵描画
                        this.setEnemy(val[i].eid, val[i].death, val[i].currentPositionY, val[i].currentPositionX, val[i].direction, val[i].speed);
                    }
                }
                let enemyCount = 0;
                let enemy2Count = 0;
                let enemy3Count = 0;
                let i, max;
                for (i = 0, max = val.length; i < max; i = i + 1) {
                    const enemy = val[i];
                    if (enemy.type === ENEMY_TYPE_001) {
                        enemyCount += 1;
                    } else if (enemy.type === ENEMY_TYPE_002) {
                        enemy2Count += 1;
                    } else if (enemy.type === ENEMY_TYPE_003) {
                        enemy3Count += 1;
                    }
                }
                this.enemyText.text = enemyCount;
                this.enemy2Text.text = enemy3Count;
                this.enemy3Text.text = enemy2Count;
            },
            exit(val, oldVal) {
                if (val) {
                    this.exitSprite = PIXI.Sprite.from('assets/exit.png');
                    this.exitSprite.position.set(CELL_SIZE * val.x, CELL_SIZE * val.y);
                    this.exitSprite.width = CELL_SIZE;
                    this.exitSprite.height = CELL_SIZE;
                    this.exitSprite.zIndex = val.y;
                    this.mapContainer.addChild(this.exitSprite);
                } else {
                    this.mapContainer.removeChild(this.exitSprite);
                }
            },
            stage: function(val) {
                this.stageText.text = 'STAGE ' + (val + 1) + ' / 3';
                // ステージ開始の表示設定
                this.setStageIntro();
            },
            points: function(val, oldVal) {
                if (oldVal.length < val.length) {
                    // 獲得ポイント表示
                    this.setPoint(val[0].y, val[0].x, val[0].value);
                }
            },
        }
    }
</script>

<style scoped lang="scss">
    .container {
        position: relative;
        width: 100%;
        height: 100%;
        background-color: #555;
    }
    .inner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    /*
    .intro {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        width: 100%;
        height: calc(100% - 200px);
        background-color: rgba(0, 0, 0, 0.7);
        opacity: 1;
        &.hide {
            opacity: 0;
            transition-property: opacity;
            transition-duration: 1s;
        }
        &__box {
            position: absolute;
            top: 50%;
            left: 50%;
            padding: 20px 30px;
            transform: translate(-50%, -50%);
            background-color: #000;
        }
        &__text {
            font-size: 50px;
            font-weight: 900;
            line-height: 1em;
            color: #fc0;
            font-style: italic;
            background: -webkit-linear-gradient(90deg, #f00, #fc0, #f00);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }
    */
    /*@media screen and (max-width: 896px) {*/
    /*    .intro {*/
    /*        height: calc(100% - 150px);*/
    /*        &__box {*/
    /*            padding: 20px;*/
    /*            text-align: center;*/
    /*        }*/
    /*        &__text {*/
    /*            font-size: 30px;*/
    /*        }*/
    /*    }*/
    /*}*/
</style>
