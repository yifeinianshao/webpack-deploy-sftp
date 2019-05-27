### Usage

```
// webpack.config.js
const WebpackDeploySftp = require('webpack-deploy-sftp')
plugins: [
  new WebpackDeploySftp({
    port: 'port',
    host: 'host',
    user: 'user',
    password: 'password',
    path: 'localPath',
    remotePath: 'remotePath'
  })
]
```
