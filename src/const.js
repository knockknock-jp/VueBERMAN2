export const CHARACTER_TYPE_000 = 'character_type_000';
export const CHARACTER_TYPE_001 = 'character_type_001';
export const CHARACTER_TYPE_002 = 'character_type_002';
export const CHARACTER_TYPES = [CHARACTER_TYPE_000, CHARACTER_TYPE_001, CHARACTER_TYPE_002];

//
// ---------- ゲーム設定 ---------- //
//
// セル情報
export const CELL_SIZE = 32;
export const CELL_TYPE_FIXED = 0; // 壊せない壁
export const CELL_TYPE_FREE = 1; // 通路
export const CELL_TYPE_BLOCK = 2; // ブロック（壊せる壁）
export const CELL_TYPE_BLOCK_BROKEN = 3; // ブロック（壊れた状態）
export const CELL_TYPE_BOMB = 4; // 爆弾設置
export const CELL_TYPE_EXPLOSION_B = 5; // 爆弾爆発
export const CELL_TYPE_EXPLOSION_T = 6; // 爆弾爆発
export const CELL_TYPE_EXPLOSION_L = 7; // 爆弾爆発
export const CELL_TYPE_EXPLOSION_R = 8; // 爆弾爆発
export const CELL_TYPE_EXPLOSION_LR = 9; // 爆弾爆発
export const CELL_TYPE_EXPLOSION_TB = 10; // 爆弾爆発
export const CELL_TYPE_EXPLOSION_TR = 11; // 爆弾爆発
export const CELL_TYPE_EXPLOSION_TL = 12; // 爆弾爆発
export const CELL_TYPE_EXPLOSION_BL = 13; // 爆弾爆発
export const CELL_TYPE_EXPLOSION_BR = 14; // 爆弾爆発
export const CELL_TYPE_EXPLOSION_BLR = 15; // 爆弾爆発
export const CELL_TYPE_EXPLOSION_TBR = 16; // 爆弾爆発
export const CELL_TYPE_EXPLOSION_TLR = 17; // 爆弾爆発
export const CELL_TYPE_EXPLOSION_TBL = 18; // 爆弾爆発
export const CELL_TYPE_EXPLOSION_TBLR = 19; // 爆弾爆発
export const CELL_TYPE_ITEM_EXPLOSION_POWER = 20; // アイテム（火力）
export const CELL_TYPE_ITEM_BOMB_POSSESSIONS = 21; // アイテム（爆弾所有数）
export const CELL_TYPE_ITEM_MOVE_SPEED = 22; // アイテム（移動速度）
// プレーヤー情報
export const PLAYER_INITIAL_MOVE_SPEED = 0.1;
export const PLAYER_INITIAL_EXPLOSION_POWER = 1;
export const PLAYER_INITIAL_BOMB_POSSESSIONS = 1;
export const PLAYER_INITIAL_INVINCIBLY_TIME = 5000; // 初期化時無敵時間
// アイテム情報
export const ITEM_EXPLOSION_POWER_STEP_UP_POINT =  1; // アイテム（火力）の上昇数
export const ITEM_MOVE_SPEED_STEP_UP_POINT = 0.025; // アイテム（移動速度）の上昇数
export const ITEM_BOMB_POSSESSIONS_STEP_UP_POINT = 1; // アイテム（爆弾所有数）の上昇数
// 向き
export const DIRECTION_UP = 'up';
export const DIRECTION_RIGHT = 'right';
export const DIRECTION_DOWN = 'down';
export const DIRECTION_LEFT = 'left';
// その他
export const GAME_MAP_ROW = 21; // 行
export const GAME_MAP_COL = 31; // 列
export const MAX_MOVE_SPEED = 1; // 最大移動スピード

