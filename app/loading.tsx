import LoadingState from '@/components/LoadingState';

export default function RootLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]" id="root-loading">
      <LoadingState message="Loading CarbonTrack..." />
    </div>
  );
}
