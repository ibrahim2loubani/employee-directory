import { handleError } from '@/lib/apiErrorHandler'
import {
  QueryClient,
  defaultShouldDehydrateQuery,
  isServer,
} from '@tanstack/react-query'
import { AxiosError } from 'axios'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: (failureCount, error) => {
          if (
            error instanceof AxiosError &&
            error.message === 'request failed with a status code 404'
          ) {
            return false
          }
          if (failureCount > 3) return false
          return true
        },
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
      mutations: {
        onError: (error) => handleError(error),
      },
    },
  })
}

let browserQueryClient: QueryClient | null = null

export function getQueryClient() {
  if (isServer) {
    return new QueryClient()
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient()
  }
  return browserQueryClient
}
