export default function StarRating({ rating, max = 5 }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-200'}`}
        >
          ★
        </span>
      ))}
    </div>
  )
}