import { readonly } from 'vue'

export type ToastType = 'success' | 'error' | 'info'

export type ToastActionType = 'open-cart'

export interface ToastAction {
  label: string
  type: ToastActionType
}

export interface ToastOptions {
  duration?: number
  action?: ToastAction
}

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration: number
  action?: ToastAction
}

export const useToast = () => {
  const toasts = useState<Toast[]>('toasts', () => [])

  const remove = (id: string) => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  const show = (message: string, type: ToastType = 'info', options: ToastOptions = {}) => {
    const { duration = 3000, action } = options
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
    const toast: Toast = { id, message, type, duration, action }

    toasts.value.push(toast)

    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }
  }

  const success = (message: string, options?: ToastOptions) => {
    show(message, 'success', options)
  }

  const error = (message: string, options?: ToastOptions) => {
    show(message, 'error', options)
  }

  const info = (message: string, options?: ToastOptions) => {
    show(message, 'info', options)
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
