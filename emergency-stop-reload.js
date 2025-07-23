// EMERGENCY: Stop all reload loops - RUN THIS IN BROWSER CONSOLE
console.log('🚨 EMERGENCY RELOAD STOPPER - Browser Console Version');
console.log('Copy and paste this ENTIRE script into your browser console:');
console.log('');
console.log(`
// === PASTE EVERYTHING BELOW THIS LINE INTO BROWSER CONSOLE ===

console.log('🚨 STOPPING ALL RELOAD LOOPS...');

// Clear all reload-related localStorage
const reloadKeys = [
  'reload-count',
  'last-error-reload', 
  'reload-attempted',
  'reload-helper-shown',
  'error-boundary-retry-count'
];

reloadKeys.forEach(key => {
  const value = localStorage.getItem(key);
  if (value) {
    console.log('Clearing: ' + key + ' = ' + value);
    localStorage.setItem(key, '0');
  }
});

// Set development mode flag to prevent future reloads
localStorage.setItem('dev-reload-blocked', 'true');

console.log('✅ All reload counters reset to 0');
console.log('✅ Development reload blocking enabled');
console.log('💡 Page should stop refreshing now');

// === END OF SCRIPT TO PASTE ===
`);
