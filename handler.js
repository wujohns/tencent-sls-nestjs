/**
 * 对应的 handler 模块，用于启动对应的 nestjs 服务
 *
 * @author wujohns
 * @date 20/04/02
 */
const { createServer, proxy } = require('tencent-serverless-http')

module.exports.handler = async (event, context) => {
  const { getApp } = require.fromParentEnvironment('./dist/app')
  const app = await getApp()
  const server = createServer(app, null, app.binaryTypes || [])
  return proxy(server, event, context, 'PROMISE').promise
}
