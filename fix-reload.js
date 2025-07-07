// Clear reload count manually
console.log('Clearing reload count...');

// This will be executed in browser console
const script = `
localStorage.setItem('reload-count', '0');
console.log('Reload count cleared!');
console.log('Current reload count:', localStorage.getItem('reload-count'));
`;

console.log('Run this in your browser console:');
console.log(script);
