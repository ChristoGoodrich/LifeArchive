# RealityGit · 现实版本控制器

> 给现实生活装一个 Git —— 存档、对比、回滚、分支。
> Version control for everyday life — commit, diff, rollback, branch.

一个纯前端、零依赖、可离线运行的 App。直接双击 `index.html` 即可使用（数据存在浏览器 `localStorage`，无需服务器、无需联网）。

## 五个页面

| Tab | 中文 | 它做什么 |
|-----|------|---------|
| 🌳 Timeline | 时间线 | 按「场景」(出门包 / 桌面 / 房间 / 冰箱 / 作业 / 小组) 分组的 git 式提交图，每条 commit 有 hash、时间、物品清单、备注 |
| ➕ New commit | 新建存档 | 给现实拍一张照片 + 写一句 commit message + 列出物品清单，生成一个「生活存档点」 |
| 🔍 Reality diff | 现实对比 | **核心功能**：对比两个版本 —— ①照片像素热力图，标出画面里变化最大的区域；②语义清单 diff，告诉你「少了什么 / 多了什么 / 数量变化」 |
| ⏮️ Rollback | 回滚 | 选一个旧存档当目标，自动生成「恢复到这个状态」的分步清单（拿走 X、放回 Y），可逐项打勾 |
| 🔀 Branches | 分支决策 | 纠结时开两个 branch，写下每条路的预期结果，选一条，事后回来复盘评分 |

## 核心设计

**为什么 diff 能跑通而不需要 AI 视觉？** 因为它是两条互补的对比：

1. **图像 diff**（`js/diff.js` → `imageDiff`）：把两张照片画到同尺寸 canvas，逐像素求差，超过阈值就在「之后」那张图上叠红色热力，并用 3×3 网格统计出变化最集中的方位（右下 / 左上…）。告诉你**哪里**变了。
2. **清单 diff**（`itemDiff`）：对结构化的物品清单做集合比较，得出 added / removed / changed / kept。告诉你**什么**变了 —— 这部分稳定可靠，不依赖识别。

照片给方位，清单给语义，合起来就是「现实 Diff」。

## 文件结构

```
index.html        外壳 + 顶栏 + 导航
css/styles.css    暗色「git 客户端」主题 + 响应式
js/store.js       localStorage 仓库层（commits / branches / scenes / meta）
js/diff.js        Reality Diff 引擎（imageDiff 热力图 + itemDiff 清单对比）
js/app.js         UI / 路由 / 中英双语 / 各页面渲染 / 示例数据
```

## 使用

1. 双击 `index.html`（或任意静态服务器）。
2. 首次进入是空状态 —— 点「载入示例数据」可立刻看到出门包 / 桌面两条版本线的 demo。
3. 右上角 `EN / 中` 一键切换语言。
4. 「导出 JSON」可备份全部数据。

MVP 起点场景推荐：**学生**（桌面乱、文件乱、作业版本乱、出门忘带东西）。
