# <a href="https://gitee.com/lyt-top/vue-next-admin" target="_blank">vue-next-admin 更新日志</a>

🎉🎉🔥 `vue-next-admin` 基于 vue3.x 、Typescript、vite、Element plus 等，适配手机、平板、pc 的后台开源免费模板库（vue2.x 请切换 vue-prev-admin 分支）

## 2.4.33

`2023.04.11`

- 🌟 更新 依赖更新最新版本
- 🎉 新增 `/make/tableDemo` 中添加打印、图片预览功能
- 🐞 修复 菜单收起时（isCollapse），图标不居中问题
- 🐞 修复 演示 `权限管理 -> 前端控制 -> 页面权限` 切换不生效，感谢群友@傲世盛唐
- 🐞 修复 `"typescript": "5.x"` 中 `tsconfig.json`，`compilerOptions.suppressImplicitAnyIndexErrors` 弃用问题 [TypeScript/issues/51909](https://github.com/microsoft/TypeScript/issues/51909)、[suppressImplicitAnyIndexErrors](https://www.typescriptlang.org/tsconfig#suppressImplicitAnyIndexErrors)
- 🎨 合并 [!47cdn 打包支持 pnpm，消除无 external 的报错](https://gitee.com/lyt-top/vue-next-admin/commit/8de54a844bb54468d0bdccca158bf9bcb449f270)，感谢[@yujiacheng](https://gitee.com/YujiaCheng1996)
- 🎯 优化 `layout/navBars/breadcrumb` 文件夹名称改成 `layout/navBars/topBar` 更易理解（`可全局替换`），感谢群友@傲世盛唐
- 🎯 优化 `layout/navBars/topBar/user.vue` 组件，`UserNews` 点击消息图标触发范围，改用 [element plus Popover 气泡卡片 虚拟触发方式](https://element-plus.org/zh-CN/component/popover.html#%E8%99%9A%E6%8B%9F%E8%A7%A6%E5%8F%91)，防止点击消息通知背景色时不触发 `Popover` 弹出框

## 2.4.32

💔💔💔 图片不显示问题（README.md、演示中使用的图片，[vue-next-admin-images](https://gitee.com/lyt-top/vue-next-admin-images)），通过网站 [https://www.hd-r.cn/](https://www.hd-r.cn/) 转在线链接，如若侵权请联系作者 qq：1105290566

`2023.03.26`

- 🌟 更新 依赖更新最新版本
- 🐞 修复 [关于开发环境 sourceMap 的问题](https://gitee.com/lyt-top/vue-next-admin/issues/I6DNDQ)，感谢[@XiaoSongJiang](https://gitee.com/XiaoSongJiang)
- 🐞 修复 打包提示 `[@vue/compiler-sfc] ::v-deep usage as a combinator has been deprecated. Use :deep(<inner-selector>) instead.`，不能使用 `:deep {}`，而应使用 `:deep() {}`
- 🎨 合并 [feat: 一级菜单重定向为空，分栏模式下，点击一次菜单时现在会切换子菜单列表，而不是打开空白页](https://gitee.com/lyt-top/vue-next-admin/commit/a91f84e3a1a86d8d303a5b46171622913d9d0737)，感谢[@写意](https://gitee.com/xjj_0906)
- 🎯 优化 经典布局分割菜单只有一项子级时，收起左侧导航菜单
- 🎯 优化 watch 监听范围
- 🎯 优化 打包：分包（manualChunks）、gzip 压缩、cdn 加速 `默认关闭 .env 中开启`（可查看文章[vue-next-admin vue3 + vite 打包 gzip 压缩、cdn 加速](https://blog.csdn.net/qq_34450741/article/details/129766676)）
