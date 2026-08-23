export default function Loader({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-28 gap-6">
      <div className="relative w-16 h-16">
        <span className="absolute inset-0 rounded-full border-4 border-teal-100" />
        <span className="absolute inset-0 rounded-full border-4 border-transparent border-t-medical-teal animate-spin-slow" />
      </div>
      <p className="text-slate-600 font-medium text-base animate-pulse tracking-wide">
        {message}
      </p>
    </div>
  )
}
