import { StarRating } from "@/components/ui/star-rating";

const REVIEWS = [
  {
    name: "Sarah M.",
    text: "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
  },
  {
    name: "Alex K.",
    text: "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.",
  },
  {
    name: "James L.",
    text: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends.",
  },
  {
    name: "Mooen R.",
    text: "The pieces I ordered arrived quickly and fit perfectly. Shop.co has become my first stop whenever I want to refresh my wardrobe without the guesswork.",
  },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-[1240px] px-4 py-14">
      <h2 className="font-display text-3xl md:text-5xl">Our Happy Customers</h2>
      <div className="no-scrollbar -mx-4 mt-8 flex gap-5 overflow-x-auto px-4 pb-2">
        {REVIEWS.map((r) => (
          <figure
            key={r.name}
            className="flex min-w-[320px] max-w-[380px] flex-col gap-3 rounded-[20px] border border-border p-8"
          >
            <StarRating rating={5} showValue={false} />
            <figcaption className="flex items-center gap-1 font-bold">
              {r.name}
              <span
                aria-label="Verified buyer"
                className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-[10px] text-white"
              >
                ✓
              </span>
            </figcaption>
            <blockquote className="text-sm leading-6 text-primary-500">
              &ldquo;{r.text}&rdquo;
            </blockquote>
          </figure>
        ))}
      </div>
    </section>
  );
}
