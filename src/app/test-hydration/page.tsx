import { HydrationErrorBoundary } from '@/components/ErrorBoundary'
import ClientOnly from '@/components/ClientOnly'

export default function TestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Hydration Test Page</h1>
      
      <HydrationErrorBoundary>
        <div className="space-y-4">
          <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <h2 className="text-xl font-semibold">Static Content</h2>
            <p>This content should render identically on server and client.</p>
          </div>
          
          <ClientOnly fallback={
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <p>Loading dynamic content...</p>
            </div>
          }>
            <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <h2 className="text-xl font-semibold">Client-Only Content</h2>
              <p>Current time: {new Date().toLocaleTimeString()}</p>
              <p>User Agent: {typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 50) : 'Unknown'}...</p>
            </div>
          </ClientOnly>
        </div>
      </HydrationErrorBoundary>
    </div>
  )
}
