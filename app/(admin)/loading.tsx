import { PageSkeleton } from "@/components/PageSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--bg-app)] px-4 py-8 sm:px-6 lg:px-8">
      <PageSkeleton />
    </div>
  );
}
