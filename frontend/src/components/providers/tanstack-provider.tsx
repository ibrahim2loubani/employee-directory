'use client'

import { getQueryClient } from '@/lib/queryClient'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export function TanStackProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => getQueryClient()) // ✅ this ensures it's stable

  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
