// app/observatory/space-report/page.tsx
import Link from 'next/link';

// Type definitions
interface Person {
  name: string;
  craft: string;
}
interface SpaceData {
  number: number;
  people: Person[];
}

// Data fetching function
async function getSpaceData(): Promise<SpaceData | null> {
  try {
    const res = await fetch('http://api.open-notify.org/astros.json', {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// The Page Component
export default async function SpaceReportPage() {
  const spaceData = await getSpaceData();

  return (
    <div className="p-4 sm:p-8 text-white min-h-screen">
      <div className="max-w-5xl mx-auto">
        
        {/* Back navigation link */}
        <Link href="/observatory" className="inline-block text-purple-400 hover:text-purple-300 mb-8">
          &larr; Back to The Observatory
        </Link>
        
        <h1 className="text-4xl font-bold mb-8">Live Space Report</h1>

        {!spaceData ? (
          <p className="text-red-400">Could not load live space data.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center flex flex-col justify-center">
              <h2 className="text-lg font-semibold text-cyan-300 mb-2">Live Count</h2>
              <p className="text-7xl font-bold my-3">{spaceData.number}</p>
              <p className="text-base text-gray-400">astronauts in space.</p>
            </div>
            <div className="md:col-span-2 bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-cyan-300 mb-4">Crew Manifest</h2>
              <ul className="space-y-2">
                {spaceData.people.map((person) => (
                  <li key={person.name} className="py-2 px-3 rounded-md bg-gray-700/40 flex justify-between items-center">
                    <span className="font-medium">{person.name}</span>
                    <span className="text-sm text-gray-400 bg-gray-900/50 px-2 py-1 rounded">{person.craft}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}