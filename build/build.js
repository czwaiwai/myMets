'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'production'

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')
const fs = require('fs')
const archiver = require('archiver')
const spinner = ora('building for production...')
spinner.start()

function zip() {
  let output = fs.createWriteStream(path.resolve(__dirname, '../dist/update.zip'))
  let archive = archiver('zip', {
    zlib: { level: 9}
  })
  output.on('close', function() {
    console.log('压缩文件大小为:' + archive.pointer() + ' total bytes')
    console.log(chalk.cyan('  压缩完成.\n'))
  })
  archive.on('error', function(err) {
    console.log(chalk.red('压缩文件报错'))
    console.log("error:" + err.message)
    process.exit(1)
  })
  archive.pipe(output)
  let index = path.resolve(__dirname, '../dist/index.html')
  archive.append(fs.createReadStream(index), {name: 'index.html'})
  archive.directory(path.resolve(__dirname, '../dist/static/'), 'static')
  archive.finalize()
}
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
    zip()
  })
})
