interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`bg-gray-100 ${className}`}
      aria-hidden="true"
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="block">
      <Skeleton className="aspect-product mb-3" />
      <Skeleton className="h-3 w-16 mb-2" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-20" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductPageSkeleton() {
  return (
    <div className="container py-6">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Gallery skeleton */}
        <div className="space-y-4">
          <Skeleton className="aspect-product" />
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="aspect-product" />
            ))}
          </div>
        </div>

        {/* Info skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-5 w-24" />
          <div className="pt-4 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="pt-4">
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CollectionHeaderSkeleton() {
  return (
    <div className="mb-6">
      <Skeleton className="h-7 w-48 mb-2" />
      <Skeleton className="h-4 w-full max-w-md" />
    </div>
  );
}

export function TextBlockSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
        />
      ))}
    </div>
  );
}
