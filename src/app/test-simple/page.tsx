// ULTRA SIMPLE TEST PAGE
export default function TestSimple() {
  return (
    <div style={{ padding: '20px', fontSize: '24px' }}>
      <h1>🔥 Simple Test Page 🔥</h1>
      <p>If this page keeps refreshing, the issue is in Next.js config or global setup</p>
      <p>Current time: {new Date().toLocaleTimeString()}</p>
    </div>
  )
}
