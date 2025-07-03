import { Skeleton } from "@/components/ui/skeleton"
import { SkeletonCard } from "./SkeltonCard"

export default function MainSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <Skeleton className="h-8 w-40 rounded-md" />
          <div className="flex space-x-4">
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-8 w-20 rounded-md" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-white shadow-sm rounded-lg p-4 animate-slide-right">
          <Skeleton className="h-6 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6 mb-2" />
          <Skeleton className="h-4 w-4/5 mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Main Area */}
        <div className="flex-1">
          <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
            <Skeleton className="h-10 w-1/2 mb-4" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white shadow-sm p-4 mt-6">
        <div className="container mx-auto flex justify-between">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
    </div>
  )
}
