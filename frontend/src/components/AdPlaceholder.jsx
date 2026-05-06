export default function AdPlaceholder({ position }) {
  const styles = {
    top: 'w-full h-24 mb-6',
    middle: 'w-full h-40 my-6',
    'sticky-mobile': 'fixed bottom-0 left-0 w-full h-16 md:hidden z-50',
  }

  return (
    <div className={`${styles[position]} bg-slate-800/50 border border-slate-700 rounded-lg flex items-center justify-center text-slate-400 text-sm`}>
      {/* POPADS {position.toUpperCase()} PLACEHOLDER */}
      POPADS {position.toUpperCase()} PLACEHOLDER
    </div>
  )
}
