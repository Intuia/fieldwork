export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]" role="status" aria-label="Loading">
      <div className="w-8 h-8 border-2 border-teal-500/30 border-t-teal-500 rounded-full animate-spin" />
    </div>
  )
}
