/**
 * serverless 的 nest 版本插件
 *
 * @author wujohns
 * @date 20/04/02
 */
const os = require('os')
const path = require('path')
const fs = require('fs')

const { Component } = require('@serverless/core')
const { bundler } = require('@ygkit/bundler')
const ensureIterable = require('type/iterable/ensure')
const ensureString = require('type/string/ensure')
const pkg = require('./package.json')

const DEFAULTS = {
  runtime: 'Nodejs8.9',
  framework: 'nestjs'
}

class NestJsComponent extends Component {
  /**
   * 执行 sls 时会执行的函数
   * @param inputs - 输出参数(会从 serverless.yml 中获取)
   */
  async default (inputs = {}) {
    // 参数格式化
    inputs.include = ensureIterable(inputs.include, { default: [], ensureItem: ensureString })
    inputs.runtime = ensureString(inputs.runtime, { default: DEFAULTS.runtime })

    // 写入对应的 handler 文件
    const cachePath = path.join(
      os.homedir(),
      `.serverless/cache/tencent-${ DEFAULTS.framework }`,
      pkg.version,
      'serverless-handler.js'
    )
    // if (!fs.existsSync(cachePath)) {
    if (true) {
      this.context.debug('Generating serverless handler...')
      await bundler({
        input: path.join(__dirname, 'handler.js'),
        output: cachePath
      })
      this.context.debug('Generated serverless handler successfully.')
    }

    inputs.handler = `${path.basename(cachePath, '.js')}.handler`
    inputs.include.push(cachePath)

    const Framework = await this.load('@serverless/tencent-framework')
    const frameworkOutputs = await Framework({
      ...inputs,
      ...{ framework: DEFAULTS.framework }
    })
    this.state = frameworkOutputs
    await this.save()
    return frameworkOutputs
  }

  /**
   * 执行 sls remove 时会执行的函数
   * @param inputs - 输出参数(会从 serverless.yml 中获取)
   */
  async remove (inputs = {}) {
    const Framework = await this.load('@serverless/tencent-framework')
    await Framework.remove(inputs)
    this.state = {}
    await this.save()
    return {}
  }
}

module.exports = NestJsComponent
