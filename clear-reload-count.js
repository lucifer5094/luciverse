// Clear browser cache and reload count
console.log('Clearing reload count...');
console.log('Run this in your browser console:');
console.log(`
localStorage.setItem('reload-count', '0');
console.log('Reload count cleared!');
console.log('Current reload count:', localStorage.getItem('reload-count'));
`);
