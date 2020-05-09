# VueBERMAN2

ExpressとSocket.ioとVue.jsとPixi.jsを使ってオンラインボンバーマンを作ってみました。

## npm scripts

+ `npm start`
    Webpackのビルド
+ `npm run prod`
    Webpackのプロダクションビルド
    （.min.jsで書き出すが、HTMLからはリンクが貼ってないので注意）

## サーバ起動

+ `node dist/server.js`
    expressとsocketの立ち上げ
    （localhost:3000で確認できる）
