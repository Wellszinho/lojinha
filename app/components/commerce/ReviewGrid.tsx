import { Star } from "lucide-react";

import { reviews } from "@/lib/catalog";

export function ReviewGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {reviews.map((review) => (
        <article key={review.name} className="rounded-premium border border-white/10 bg-white/[.045] p-5">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-premium border border-gold/30 bg-gold/10 font-black text-gold">
              {review.name.slice(0, 1)}
            </div>
            <div>
              <h3 className="font-bold text-frost">{review.name}</h3>
              <p className="text-sm text-mist">{review.role}</p>
            </div>
          </div>
          <div className="mt-4 flex text-gold">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className="size-4 fill-current" />
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-mist">“{review.quote}”</p>
        </article>
      ))}
    </div>
  );
}
