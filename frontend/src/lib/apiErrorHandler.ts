import { AxiosError } from 'axios'
import { toast } from 'sonner'

export const handleError = (error: unknown) => {
  if (error instanceof AxiosError) {
    // Handle CORS errors
    if (error.code === 'ERR_NETWORK' || error.message.includes('CORS')) {
      toast.error(
        'Network error: Please make sure the backend server is running and CORS is configured properly.',
      )
      return
    }

    switch (error.status) {
      case 409:
        toast.error('Conflict error occurred.')
        break
      case 422:
        toast.error('Validation error occurred.')
        break
      case 404:
        toast.error('Resource not found.')
        break
      case 500:
        toast.error('Internal server error occurred.')
        break
      default:
        toast.error(`API Error: ${error.message}`)
        break
    }
  } else {
    toast.error('An unexpected error occurred.')
  }
}
