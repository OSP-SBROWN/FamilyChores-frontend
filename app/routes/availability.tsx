import { AvailabilityMatrixComponent } from '../components/AvailabilityMatrix';

export default function AvailabilityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8ECAE6] to-[#219EBC] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#023047] mb-2">
            Availability Matrix
          </h1>
          <p className="text-[#023047]/70">
            Manage when people are available across different days and timezones
          </p>
        </div>

        <AvailabilityMatrixComponent />
      </div>
    </div>
  );
}
