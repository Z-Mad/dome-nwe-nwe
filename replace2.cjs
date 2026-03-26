const fs = require('fs')
const content = fs.readFileSync('components/UserProfile.tsx', 'utf-8')

const startRev = content.indexOf('  const renderSellerMonitoring = () => (')
const endRev = content.indexOf('  const renderSellerAssets = () => (')

if (startRev !== -1 && endRev !== -1) {
  const newContent = content.substring(0, startRev) + content.substring(endRev)
  fs.writeFileSync('components/UserProfile.tsx', newContent)
  console.log('Successfully deleted renderSellerMonitoring')
} else {
  console.log('Could not find start or end markers')
}
