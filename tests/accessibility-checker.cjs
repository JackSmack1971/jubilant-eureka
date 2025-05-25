const { JSDOM } = require('jsdom')
const fs = require('fs')
const path = require('path')

const htmlFile = path.join(__dirname, '../index.html')
const html = fs.readFileSync(htmlFile, 'utf8')

const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  resources: 'usable'
})

// Make JSDOM's window and document global for axe-core
global.window = dom.window;
global.document = dom.window.document;

// Now require axe-core, so it finds the global window and document
const axe = require('axe-core')

console.log('Running accessibility checks...')

axe.run(dom.window.document, { // Pass the document from jsdom
  rules: {
    'color-contrast': { enabled: false }
  }
}, (err, results) => {
  // Clean up global window and document after axe.run completes
  delete global.window;
  delete global.document;

  if (err) {
    console.error('Error running axe-core:', err)
    process.exit(1)
  }

  if (results.violations.length > 0) {
    console.error('Accessibility Violations Found!')
    results.violations.forEach(violation => {
      console.error(`  ${violation.help} (${violation.id})`)
      console.error(`    Impact: ${violation.impact}`)
      console.error('    Nodes:')
      violation.nodes.forEach(node => {
        console.error(`      - ${node.html}`)
        console.error(`        Selector: ${node.target.join(', ')}`)
      })
      console.error(`    More info: ${violation.helpUrl}`)
    })
    process.exit(1)
  } else {
    console.log('No accessibility violations found.')
    process.exit(0)
  }
})
