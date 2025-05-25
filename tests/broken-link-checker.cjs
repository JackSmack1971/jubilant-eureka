const blc = require('broken-link-checker')
const path = require('path')

const siteUrl = `file://${path.resolve(__dirname, '../index.html')}`

console.log(`Checking for broken links on ${siteUrl}...`)

const options = {
  exclude: [], // Add any URLs to exclude from checking
  filterLevel: 0, // 0: All links, 1: Only broken links
  honorRobotExclusions: false,
  rateLimit: 1000, // milliseconds
  maxSockets: 10,
  userAgent: 'broken-link-checker/1.0'
}

const siteChecker = new blc.SiteChecker(options, {
  link: function (result) {
    if (result.broken) {
      if (result.brokenReason === 'BLC_DEAD') {
        console.error(`BROKEN LINK: ${result.url.resolved} (Source: ${result.base.resolved}) - Reason: ${result.brokenReason}`)
      }
    }
  },
  end: function () {
    console.log('Broken link check finished.')
    // Note: broken-link-checker doesn't provide a direct way to get a count of broken links
    // or exit with a non-zero code if broken links are found.
    // A more robust solution would involve tracking broken links in the 'link' event
    // and then exiting with an appropriate code in the 'end' event.
    process.exit(0)
  }
})

siteChecker.enqueue(siteUrl)
