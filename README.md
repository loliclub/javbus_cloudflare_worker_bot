## javbus cloudflare worker bot

本项目基于 https://github.com/rz3n/teleworker 开发，白嫖 Cloudflare Workers Serverless 服务搭建基于 javbus 的 Telegram 番号查询机器人，而无需单独购买服务器。

项目实例 [@javbus_bot](https://t.me/javbus_bot) , 因为 Free Plan 一天只有 10w 请求，所以强烈建议你部署自己的机器人。

## 部署你自己的 bot

### 注册 Telegram bot

在 Telegram 上，找 [@botfather](https://t.me/botfather) 聊天，即可获得一个你自己的 🤖️机器人，记住 botfather 给你的 bot token。

### 部署 Cloudflare Worker

假设宁已经注册了 [Cloudflare](https://cloudflare.com) 账号，并且拥有一个域名（自行注册或者 Cloudflare 分配的 workers.dev 子域名）。

1. fork 本项目
2. 申请一个 Cloudflare API TOKEN 用于授权 wrangler（你不需要知道这是什么，我只是说说）。 登录 Cloudflare, 在 [Cloudflare 面板](https://dash.cloudflare.com/profile/api-tokens)，点击 "Create Token", 申请一个 API TOKEN ,直接使用 "Edit Cloudflare Workers"，
 这个模版即可. 
3. 在 github 的网页上，仓库设置中，配置一个 Secret，名字是 `CF_API_TOKEN`，值为上一步骤的 API TOKEN 值
4. 修改本项目根目录下 `wrangler.toml` 部署配置文件中的 `name` 和 `account_id`。前者是 worker 的名字，即下文的 `<worker-name>`，后者是宁的 Cloudflare 账号id，可以在 [worker 面板](https://dash.cloudflare.com/?to=/:account/workers/overview) 的右方查看到。请放心，`account_id` 不会泄漏你的账号。
5. 修改本项目 `src/config.js` 配置文件，注意第二行 `BOT_TOKEN`, 在引号中粘贴 botfather 给你的 token.
6. 上述修改你可以在网页上修改，修改完成后，github workflow 会自动执行编译，并部署代码到 cloudflare worker 上。

### 配置 Telegram bot 的 Webhook

#### 设置 bot 的 webhook
```
curl https://api.telegram.org/bot<YOUR-BOT-TOKEN>/setWebhook -F 'url=https://<worker-name>.<subdomain>.workers.dev/teleworker'
```

注意：
1. `<YOUR-BOT-TOKEN>` 需要换成 botfather 给你的 token
2. `<worker-name>` 需要和 `wrangler.toml` 文件中的 `name` 一致
3. `<subdomain>.workers.dev` 需要 [worker 面板](https://dash.cloudflare.com/?to=/:account/workers/overview) 右方 "Your subdomain" 中一致

到这里配置就结束了，你的 bot 已经和 cloudflare worker 绑定，已经可以处理消息。

以下是一些额外的信息：

你也可以用自己的域名，修改 `wrangler.toml` 配置文件
```
workers_dev = false
```
新增 `zone_id` 配置, 配置值在域名面板可以找到

你还要加个 route, 具体看文档，本文不再赘述。


#### 删除 bot 的 webhook
```
curl https://api.telegram.org/bot<YOUR-BOT-TOKEN>/DeleteWebhook
```
如果你的 bot 不再需要 webhook 来接收消息更新，使用此指令删除 webhook

#### 获取 webhook 配置信息
```
curl https://api.telegram.org/bot<YOUR-BOT-TOKEN>/getWebhookInfo
```

#### 使用 curl 发送测试信息到你的 bot:
```
curl --tlsv1 -v -k -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"  -d '{
"update_id":10000,
"message":{
  "date":1441645532,
  "chat":{
     "last_name":"Test Lastname",
     "id":111,
     "first_name":"Test",
     "username":"Test"
  },
  "message_id":1365,
  "from":{
     "last_name":"Test Lastname",
     "id":111,
     "first_name":"Test",
     "username":"Test"
  },
  "text":"Testing"
}
}' "https://<worker-name>.<subdomain>.workers.dev/teleworker"
```