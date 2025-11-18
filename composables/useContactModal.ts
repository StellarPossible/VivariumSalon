export const useContactModal = () => {
  const isOpen = useState<boolean>('contact.modal.open', () => false)
  const open = () => (isOpen.value = true)
  const close = () => (isOpen.value = false)
  const toggle = () => (isOpen.value = !isOpen.value)
  return { isOpen, open, close, toggle }
}
