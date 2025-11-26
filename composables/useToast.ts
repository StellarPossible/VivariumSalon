import { readonly } from 'vue'

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration: number
}

export const useToast = () => {
  const toasts = useState<Toast[]>('toasts', () => [])

  const remove = (id: string) => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  const show = (message: string, type: ToastType = 'info', duration = 3000) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
    const toast: Toast = { id, message, type, duration }

    toasts.value.push(toast)

    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }
  }

  const success = (message: string, duration?: number) => {
    show(message, 'success', duration)
  }

  const error = (message: string, duration?: number) => {
    show(message, 'error', duration)
  }

  const info = (message: string, duration?: number) => {
    show(message, 'info', duration)
  }

  return {
    toasts: readonly(toasts),
    show,
    remove,
    success,
    error,
    info,
  }
}
