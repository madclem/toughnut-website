// html.js

const fs = require('fs-extra')

const env = process.env.NODE_ENV
const isProd = env === 'production'
const isStandalone = process.env.project === 'standalone';

const processTemplate = (str) => new Promise((resolve, reject) => {  
  if (isProd) {
    str = str.replace(/{{dev.*dev}}/g, '')
    if (isStandalone) {
      str = str.replace(/{{standalone/g, '')
      str = str.replace(/standalone}}/g, '')
    } else {
      str = str.replace(/{{.*}}/g, '')
    }
  } else {
    str = str.replace(/{{dev/g, '')
    str = str.replace(/dev}}/g, '')
    
    if (isStandalone) {
      str = str.replace(/{{standalone/g, '')
      str = str.replace(/standalone}}/g, '')
    }
  }
  

  resolve(str)
})

const writeTemplate = (str) => new Promise((resolve, reject) => {
  fs.writeFile('./dist/index.html', str, 'utf8')
})

fs.readFile('./src/html/index-template.html', 'utf8')
  .then(processTemplate)
  .then(writeTemplate)
  .catch(err => {
    console.log('Error :', err)
  })
