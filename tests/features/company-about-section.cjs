const { JSDOM } = require('jsdom')
const fs = require('fs')
const path = require('path')

// Test stub for Company About Section
// Following London school TDD methodology, focusing on behavior verification.

describe('Company About Section', () => {
  let dom

  beforeEach(() => {
    // Setup: Load the relevant part of the page containing the About Section.
    console.log('Setting up Company About Section test environment...')
    const html = fs.readFileSync(path.resolve(__dirname, '../../index.html'), 'utf8')
    dom = new JSDOM(html)
    // No need to set global.document and global.window if we directly use dom.window.document
    // console.log('Loaded HTML:', dom.serialize()) // Keep for debugging if needed
  })

  it('should display a concise mission statement and blockchain expertise highlight', () => {
    // Assuming the about section will be in a div with id="about-section"
    const aboutSection = dom.window.document.querySelector('#about-section')
    expect(aboutSection).not.toBeNull()

    // Check for mission statement
    // Check for mission statement content
    expect(aboutSection.querySelector('.mission-statement')).not.toBeNull();
    expect(aboutSection.querySelector('.mission-statement').textContent.replace(/\s+/g, ' ').trim()).toContain('At Raw Alpha, our mission is to empower businesses with transformative blockchain solutions, driving innovation, security, and efficiency across industries. We are committed to delivering unparalleled value through cutting-edge technology and strategic partnerships.');
    
    // Check for blockchain expertise highlight content
    expect(aboutSection.querySelector('.blockchain-expertise')).not.toBeNull();
    expect(aboutSection.querySelector('.blockchain-expertise').textContent.replace(/\s+/g, ' ').trim()).toContain('Raw Alpha stands at the forefront of blockchain innovation. Our team comprises seasoned experts in distributed ledger technologies, smart contracts, decentralized applications (dApps), and cryptographic security. We specialize in developing bespoke blockchain solutions that address complex business challenges, ensuring transparency, immutability, and enhanced operational efficiency for our clients. Our extensive experience spans across various blockchain platforms, including Ethereum, Hyperledger, and custom-built private blockchains. We leverage our deep understanding of the ecosystem to design, develop, and deploy robust, scalable, and secure blockchain infrastructures tailored to your specific needs.');
  })

  // Add more behavior-focused test cases as per London school TDD
})
