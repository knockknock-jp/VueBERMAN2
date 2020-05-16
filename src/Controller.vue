<template>
    <div ref="view"></div>
</template>

<script>
    import * as PIXI from 'pixi.js';

    export default {
        name: 'Controller',
        data () {
            return {
                footerHeight: 200,
                isPointerMove: false,
                direction: null,
            }
        },
        mounted() {
            // PIXI.jsアプリケーション初期化
            this.app = new PIXI.Application({
                width: window.innerWidth,
                height: window.innerHeight - 200,
                backgroundColor: 0x62972c,
                resolution: window.devicePixelRatio || 1,
                autoResize: true,
            });
            this.$refs.view.appendChild(this.app.view);

            // デバッグ用テキスト
            this.debugText = new PIXI.Text('start', new PIXI.TextStyle({
                fontSize: 16,
                fontWeight: 'bold',
                lineHeight: 16,
                fill: 0xffffff,
            }));
            this.debugText.position.set(10, 10);
            this.app.stage.addChild(this.debugText);

            // コントローラー
            this.controllerContainer = new PIXI.Container();
            this.app.stage.addChild(this.controllerContainer);

            // 方向ボタン作成
            this.moveButtonContainer = new PIXI.Container();
            this.moveButtonContainer.position.set(0, 0);
            this.createMoveButton();
            this.controllerContainer.addChild(this.moveButtonContainer);

            // 爆弾ボタン作成
            this.bombButtonContainer = new PIXI.Container();
            this.bombButtonContainer.position.set(0, 70);
            this.createBombButton();
            this.controllerContainer.addChild(this.bombButtonContainer);

            //
            this.chara = new PIXI.Container();
            this.chara.position.set(window.innerWidth / 2, (window.innerHeight - 200) / 2);
            let graphics = new PIXI.Graphics();
            graphics.beginFill(0xff0000, 1);
            graphics.drawCircle(0, 0, 40);
            graphics.endFill();
            this.chara.addChild(graphics);
            this.app.stage.addChild(this.chara);

            this.intervalId = null;

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

                //
                this.controllerContainer.y = windowHeight - this.controllerContainer.height - 20;
                this.controllerContainer.x = 20;
                this.bombButtonContainer.x = windowWidth - (this.bombButtonContainer.width + 40);

            },
            // 方向ボタン
            createMoveButton: function() {
                //
                const moveGraphics = new PIXI.Graphics();
                moveGraphics.beginFill(0xffffff, 0.2);
                moveGraphics.drawCircle(70, 70, 70);
                moveGraphics.endFill();
                moveGraphics.alpha = 0.5;
                moveGraphics.position.set(0, 0);
                this.moveButtonContainer.addChild(moveGraphics);
                //
                const moveUpGraphics = new PIXI.Graphics();
                moveUpGraphics.beginFill(0x000000, 0.2);
                moveUpGraphics.drawCircle(25, 25, 25);
                moveUpGraphics.endFill();
                moveUpGraphics.alpha = 0.5;
                moveUpGraphics.position.set(45, 5);
                this.moveButtonContainer.addChild(moveUpGraphics);
                //
                const moveUpSprite = PIXI.Sprite.from('./assets/icon-up.png');
                moveUpSprite.position.set(70, 28);
                moveUpSprite.width = 15;
                moveUpSprite.height = 15;
                moveUpSprite.alpha = 0.5;
                moveUpSprite.anchor.set(0.5, 0.5);
                this.moveButtonContainer.addChild(moveUpSprite);
                //
                const moveDownGraphics = new PIXI.Graphics();
                moveDownGraphics.beginFill(0x000000, 0.2);
                moveDownGraphics.drawCircle(25, 25, 25);
                moveDownGraphics.endFill();
                moveDownGraphics.alpha = 0.5;
                moveDownGraphics.position.set(45, 85);
                this.moveButtonContainer.addChild(moveDownGraphics);
                //
                const moveDownSprite = PIXI.Sprite.from('./assets/icon-down.png');
                moveDownSprite.position.set(70, 113);
                moveDownSprite.width = 15;
                moveDownSprite.height = 15;
                moveDownSprite.alpha = 0.5;
                moveDownSprite.anchor.set(0.5, 0.5);
                this.moveButtonContainer.addChild(moveDownSprite);
                //
                const moveLeftGraphics = new PIXI.Graphics();
                moveLeftGraphics.beginFill(0x000000, 0.2);
                moveLeftGraphics.drawCircle(25, 25, 25);
                moveLeftGraphics.endFill();
                moveLeftGraphics.alpha = 0.5;
                moveLeftGraphics.position.set(5, 45);
                this.moveButtonContainer.addChild(moveLeftGraphics);
                //
                const moveLeftSprite = PIXI.Sprite.from('./assets/icon-left.png');
                moveLeftSprite.position.set(28, 70);
                moveLeftSprite.width = 15;
                moveLeftSprite.height = 15;
                moveLeftSprite.alpha = 0.5;
                moveLeftSprite.anchor.set(0.5, 0.5);
                this.moveButtonContainer.addChild(moveLeftSprite);
                //
                const moveRightGraphics = new PIXI.Graphics();
                moveRightGraphics.beginFill(0x000000, 0.2);
                moveRightGraphics.drawCircle(25, 25, 25);
                moveRightGraphics.endFill();
                moveRightGraphics.alpha = 0.5;
                moveRightGraphics.position.set(84, 45);
                this.moveButtonContainer.addChild(moveRightGraphics);
                //
                const moveRightSprite = PIXI.Sprite.from('./assets/icon-right.png');
                moveRightSprite.position.set(111, 70);
                moveRightSprite.width = 15;
                moveRightSprite.height = 15;
                moveRightSprite.alpha = 0.5;
                moveRightSprite.anchor.set(0.5, 0.5);
                this.moveButtonContainer.addChild(moveRightSprite);
                // イベント
                this.moveButtonContainer.interactive = true;
                this.moveButtonContainer.buttonMode = true;
                this.moveButtonContainer.on('pointerdown', (e)=> {
                    moveGraphics.alpha = 1;
                    const point = e.data.getLocalPosition(e.currentTarget);
                    const degree = Math.atan2(70 - point.y, 70 - point.x) * (180 / Math.PI);
                    move(degree);
                    this.isPointerMove = true;
                    // this.setConsole('startMove degree: ' + degree);
                });
                this.moveButtonContainer.on('pointermove', (e)=> {
                    if (!this.isPointerMove) return;
                    const point = e.data.getLocalPosition(e.currentTarget);
                    const degree = Math.atan2(70 - point.y, 70 - point.x) * (180 / Math.PI);
                    move(degree);
                    // this.setConsole('onMove degree: ' + degree);
                });
                this.moveButtonContainer.on('pointerupoutside', ()=> {
                    this.isPointerMove = false;
                    moveGraphics.alpha = 0.5;
                    clear();
                    // this.setConsole('endMove');
                });
                this.moveButtonContainer.on('pointerup', ()=> {
                    this.isPointerMove = false;
                    moveGraphics.alpha = 0.5;
                    clear();
                    // this.setConsole('endMove');
                });
                //
                const move = (degree)=> {
                    if (45 < degree && degree <= 135) {
                        if (this.direction === 'up') return ;
                        this.direction = 'up';
                        // moveUpGraphics.alpha = 1;
                        moveUpSprite.width = 25;
                        moveUpSprite.height = 25;
                        // moveLeftGraphics.alpha = 0.5;
                        moveLeftSprite.width = 15;
                        moveLeftSprite.height = 15;
                        // moveDownGraphics.alpha = 0.5;
                        moveDownSprite.width = 15;
                        moveDownSprite.height = 15;
                        // moveRightGraphics.alpha = 0.5;
                        moveRightSprite.width = 15;
                        moveRightSprite.height = 15;
                    } else if (-45 < degree && degree <= 45) {
                        if (this.direction === 'left') return ;
                        this.direction = 'left';
                        // moveUpGraphics.alpha = 0.5;
                        moveUpSprite.width = 15;
                        moveUpSprite.height = 15;
                        // moveLeftGraphics.alpha = 1;
                        moveLeftSprite.width = 25;
                        moveLeftSprite.height = 25;
                        // moveDownGraphics.alpha = 0.5;
                        moveDownSprite.width = 15;
                        moveDownSprite.height = 15;
                        // moveRightGraphics.alpha = 0.5;
                        moveRightSprite.width = 15;
                        moveRightSprite.height = 15;
                    } else if (-135 < degree && degree <= -45) {
                        if (this.direction === 'down') return ;
                        this.direction = 'down';
                        // moveUpGraphics.alpha = 0.5;
                        moveUpSprite.width = 15;
                        moveUpSprite.height = 15;
                        // moveLeftGraphics.alpha = 0.5;
                        moveLeftSprite.width = 15;
                        moveLeftSprite.height = 15;
                        // moveDownGraphics.alpha = 1;
                        moveDownSprite.width = 25;
                        moveDownSprite.height = 25;
                        // moveRightGraphics.alpha = 0.5;
                        moveRightSprite.width = 15;
                        moveRightSprite.height = 15;
                    } else {
                        if (this.direction === 'right') return ;
                        this.direction = 'right';
                        // moveUpGraphics.alpha = 0.5;
                        moveUpSprite.width = 15;
                        moveUpSprite.height = 15;
                        // moveLeftGraphics.alpha = 0.5;
                        moveLeftSprite.width = 15;
                        moveLeftSprite.height = 15;
                        // moveDownGraphics.alpha = 0.5;
                        moveDownSprite.width = 15;
                        moveDownSprite.height = 15;
                        // moveRightGraphics.alpha = 1;
                        moveRightSprite.width = 25;
                        moveRightSprite.height = 25;
                    }
                }
                const clear = ()=> {
                    this.direction = null;
                    // moveUpGraphics.alpha = 0.5;
                    moveUpSprite.width = 15;
                    moveUpSprite.height = 15;
                    // moveLeftGraphics.alpha = 0.5;
                    moveLeftSprite.width = 15;
                    moveLeftSprite.height = 15;
                    // moveDownGraphics.alpha = 0.5;
                    moveDownSprite.width = 15;
                    moveDownSprite.height = 15;
                    // moveRightGraphics.alpha = 0.5;
                    moveRightSprite.width = 15;
                    moveRightSprite.height = 15;
                }
            },
            // 爆弾ボタン作成
            createBombButton: function() {
                //
                const bombGraphics = new PIXI.Graphics();
                bombGraphics.beginFill(0xffffff, 0.2);
                bombGraphics.drawRoundedRect(0, 0, 70, 70, 20);
                bombGraphics.endFill();
                bombGraphics.position.set(0, 0);
                bombGraphics.alpha = 0.5;
                this.bombButtonContainer.addChild(bombGraphics);
                //
                const bombSprite = PIXI.Sprite.from('./assets/bomb.png');
                bombSprite.position.set(35, 35);
                bombSprite.width = 40;
                bombSprite.height = 40;
                bombSprite.alpha = 0.5;
                bombSprite.anchor.set(0.5, 0.5);
                this.bombButtonContainer.addChild(bombSprite);
                // イベント
                this.bombButtonContainer.interactive = true;
                this.bombButtonContainer.buttonMode = true;
                this.bombButtonContainer.on('pointerdown', ()=> {
                    bombGraphics.alpha = 1;
                    bombSprite.width = 50;
                    bombSprite.height = 50;
                });
                this.bombButtonContainer.on('pointerupoutside', ()=> {
                    bombGraphics.alpha = 0.5;
                    bombSprite.width = 40;
                    bombSprite.height = 40;
                });
                this.bombButtonContainer.on('pointerup', ()=> {
                    bombGraphics.alpha = 0.5;
                    bombSprite.width = 40;
                    bombSprite.height = 40;
                    this.setConsole('bomb');
                });
            },
            setConsole: function(log) {
                this.debugText.text = log;
                console.log(log);
            },
        },
        watch: {
            direction(val, oldVal) {
                if (val === 'up') {
                    if (this.intervalId) clearInterval(this.intervalId);
                    this.intervalId = setInterval(() => {
                        this.chara.y -= 3;
                    }, 1000 / 30);
                } else if (val === 'down') {
                    if (this.intervalId) clearInterval(this.intervalId);
                    this.intervalId = setInterval(()=> {
                        this.chara.y += 3;
                    }, 1000 / 30);
                } else if (val === 'left') {
                    if (this.intervalId) clearInterval(this.intervalId);
                    this.intervalId = setInterval(()=> {
                        this.chara.x -= 3;
                    }, 1000 / 30);
                } else if (val === 'right') {
                    if (this.intervalId) clearInterval(this.intervalId);
                    this.intervalId = setInterval(()=> {
                        this.chara.x += 3;
                    }, 1000 / 30);
                } else {
                    if (this.intervalId) clearInterval(this.intervalId);
                }
                this.setConsole('set: ' + val + ', clear: ' + oldVal);
            }
        }
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
</style>
<style scoped lang="scss">
</style>
