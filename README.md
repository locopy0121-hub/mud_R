# Mud_R — 萬王之城 MUD

以 **King of Kingdoms (萬王之王 / KoK)** 為風格的網頁 MUD（文圖介面），跑在 **Render** 上：

- **資料庫**：`mud-r-db`（Supabase Postgres）
- **網頁服務**：`mud-r`（Node.js）

**部署**：Blueprint（`render.yaml`）— 每次 push 到 `main` 自動同步並部署。

## 玩法

- 文字指令：`help`、`look`、`go north/east/south/west`、`inventory`、`take`、`recall`
- **新特性**：
  - 中文內容（KoK 風格：冒險者中心、王城、礦谷、森林、洞穴、火山島…）
  - 圖形化 8×8 小地圖（以玩家為中心，標記出口、NPC、寶物、怪物）
  - `recall` 回冒險者中心
  - 打怪掉寶 + 分級升級
  - 多玩家同場（Supabase 存檔）

## 指令清單

| 指令 | 說明 |
| --- | --- |
| `help` | 顯示說明 |
| `look` / `l` | 看目前房間 |
| `go north` / `go east` / `go south` / `go west` | 移動（也可 `go n`） |
| `inventory` / `i` | 查看背包 |
| `take all` | 撿起地上的物品 |
| `recall` | 回冒險者中心 |
| `say hi` | 對同房的人說話 |
| `quit` / `exit` | 離開 |

## 地圖節點

- 王城廣場（起始）、王宮、王城商店、冒險者中心、城外森林、黑暗森林
- 鐵礦山谷、精靈小徑、精靈遺跡、地下洞穴、火山島
- 王城碼頭、王城港口、王城酒窖、寶藏洞窟（寶物）

## 本地執行

```powershell
git clone https://github.com/locopy0121-hub/mud_R
cd mud_R
npm install
# .env 提供 DATABASE_URL（Supabase pooler connection string）
npm start
# 開 http://localhost:10000
```

## 技術

- Node.js + Express + ws（websocket）
- 圖形介面：`public/index.html`（純 HTML/CSS/JS，含小地圖 + 聊天）
- 存檔：Supabase Postgres（`rooms`、`players` 表 + RLS）
- 部署：Render Blueprint（`render.yaml`）
