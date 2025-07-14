import { cn } from '@/lib/utils'

interface ShimmerProps {
  className?: string
}

export function Shimmer({ className }: ShimmerProps) {
  return <div className={cn('animate-pulse rounded-md bg-muted', className)} />
}

export function EmployeeCardSkeleton() {
  return (
    <div className='rounded-lg border bg-card text-card-foreground shadow-sm p-6'>
      <div className='flex items-center space-x-4'>
        <Shimmer className='h-12 w-12 rounded-full' />
        <div className='space-y-2 flex-1'>
          <Shimmer className='h-4 w-[200px]' />
          <Shimmer className='h-3 w-[150px]' />
        </div>
      </div>
      <div className='mt-4 space-y-2'>
        <Shimmer className='h-3 w-full' />
        <Shimmer className='h-3 w-[80%]' />
        <div className='flex justify-between items-center mt-4'>
          <Shimmer className='h-6 w-16 rounded-full' />
          <div className='flex space-x-2'>
            <Shimmer className='h-8 w-8 rounded' />
            <Shimmer className='h-8 w-8 rounded' />
          </div>
        </div>
      </div>
    </div>
  )
}
