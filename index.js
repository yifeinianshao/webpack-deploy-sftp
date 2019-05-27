const client = require('scp2')
const sftpClient = require('ssh2-sftp-client')
const chalk = require('chalk')

const sftp = new sftpClient()
const pluginName = 'WebpackDeploySftp'
const requiredParams = ['port', 'host', 'user', 'password', 'path', 'remotePath']
class WebpackDeploySftp {
  constructor(options) {
    this.options = options || {}
  }
  consoleErrorInfo(err) {
    console.error(chalk.red(`deploy failure: ${err}`))
  }
  apply(compiler) {
    compiler.hooks.done.tap(pluginName, compilation => {
      const requiredValiResult = requiredParams.filter(val => !this.options.hasOwnProperty(val))
      if (requiredValiResult.length) {
        this.consoleErrorInfo(`${requiredValiResult.join(',')} is required`)
      } else {
        const { port, host, user, password, path, remotePath } = this.options
        sftp.connect({
          host,
          port,
          username: user,
          password
        })
        .then(() => sftp.rmdir(remotePath, true))
        .then(() => {
          const remote = `${user}:${password}@${host}:${port}:${remotePath}`
          client.scp(path, remote, err => {
            if (err) {
              this.consoleErrorInfo(err)
            } else {
              console.log(chalk.green('deploy success'))
            }
            client.close()
            sftp.end()
          })
        })
        .catch(err => {
          this.consoleErrorInfo(err)
          sftp.end()
        })
      }
    })
  }
}

module.exports = WebpackDeploySftp
