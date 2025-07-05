import { Loader } from 'lucide-react'

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Loader className="animate-spin h-12 w-12" />
    </div>
  )
}
export default LoadingOverlay
