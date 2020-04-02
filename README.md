# tencent-sls-nestjs
适配腾讯云的 nestjs 部署 serverless component

## 版本说明
该 component 是适配 serverless component 1.0 版本。2020/4/2 官方发布了 serverless component 2.x 版本，相关的格式有所调整，待服务商全面支持 2.x 版本的发布模式后可以考虑使用新的模式发布

## serverless.yml 配置
在 serverless.yml 中进行如下配置

```yml
# serverless.yml

express:
  component: 'tencent-sls-nestjs'
  inputs:
    region: ap-guangzhou
    runtime: Nodejs8.9
```

## nestjs 工程适配
这里给出 express 的适配案例，其他底座可以以此类推
### express
```ts
// <project-root>/src/app.ts
import * as express from 'express'
import { ExpressAdapter } from '@nestjs/platform-express'

import { NestFactory } from '@nestjs/core'
import { AppModule } from './modules/app.module'

export const getApp = async () => {
  const expressApp = express()
  const adapter = new ExpressAdapter(expressApp)
  const app = await NestFactory.create(AppModule, adapter)

  ...

  app.init()
  return expressApp
}
```

```ts
// <project-root>/src/main.ts - 供本地调试时使用
import * as http from 'http'
import * as config from 'config'
import { getApp } from './app'

const bootstrap = async () => {
  const expressApp = await getApp()
  const server = http.createServer(expressApp)
  server.listen(config.PORT)
}

bootstrap()
```
