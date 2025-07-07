#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

function deleteFolderRecursive(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const curPath = path.join(folderPath, file)
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath)
      } else {
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(folderPath)
  }
}

function clearNextCache() {
  const cacheDir = path.join(process.cwd(), '.next')
  
  console.log('🧹 Clearing Next.js cache...')
  
  try {
    if (fs.existsSync(cacheDir)) {
      deleteFolderRecursive(cacheDir)
      console.log('✅ Successfully cleared .next directory')
    } else {
      console.log('ℹ️  No .next directory found')
    }
    
    // Also clear node_modules/.cache if it exists
    const nodeModulesCache = path.join(process.cwd(), 'node_modules', '.cache')
    if (fs.existsSync(nodeModulesCache)) {
      deleteFolderRecursive(nodeModulesCache)
      console.log('✅ Successfully cleared node_modules/.cache')
    }
    
    console.log('🎉 Cache clearing complete! You can now restart your development server.')
    console.log('💡 Run: npm run dev')
    
  } catch (error) {
    console.error('❌ Error clearing cache:', error.message)
    process.exit(1)
  }
}

clearNextCache()
