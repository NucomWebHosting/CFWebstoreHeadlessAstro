import type { TestimonialRow } from "../../lib/types";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 mb-3" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i <= rating ? "text-yellow-400" : "text-gray-500"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

interface Props {
  testimonials: TestimonialRow[];
}

export default function TestimonialsWidget({ testimonials }: Props) {
  if (!testimonials.length) return null;

  return (
    <section className="py-12 bg-gray-800 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 6).map((t) => (
            <blockquote
              key={t.ReviewID}
              className="bg-gray-700 rounded-xl p-6 flex flex-col"
            >
              {t.Rating !== null && t.Rating > 0 && (
                <StarRating rating={Math.round(t.Rating)} />
              )}
              {t.Title && (
                <h3 className="font-semibold text-white mb-2 leading-snug">{t.Title}</h3>
              )}
              {t.Comment && (
                <p className="text-gray-300 text-sm leading-relaxed flex-1">{t.Comment}</p>
              )}
              {t.Anon_name && (
                <p className="mt-4 text-sm font-medium text-gray-400">— {t.Anon_name}</p>
              )}
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
