const htmlhint = require('htmlhint').HTMLHint
const fs = require('fs')
const path = require('path')

const htmlFiles = [
  path.join(__dirname, '../index.html')
]

let hasErrors = false

console.log('Running HTML Validation...')

htmlFiles.forEach(file => {
  const html = fs.readFileSync(file, 'utf8')
  const htmlhintConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../.htmlhintrc'), 'utf8'))
  const messages = htmlhint.verify(html, htmlhintConfig)

  if (messages.length > 0) {
    hasErrors = true
    console.error(`HTMLHint errors in ${file}:`)
    messages.forEach(message => {
      console.error(`  [${message.type}] ${message.message} (Line ${message.line}, Col ${message.col})`)
    })
  } else {
    console.log(`HTMLHint: No errors found in ${file}`)
  }
})

if (hasErrors) {
  console.error('HTML Validation FAILED!')
  process.exit(1)
} else {
  console.log('HTML Validation PASSED!')
  process.exit(0)
}
