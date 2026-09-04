"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { StarRating } from "@/components/ui/star-rating";
import { ApiError, createReview, getProductReviews } from "@/lib/api";
import type { Paginated, Review } from "@/lib/api-types";
import { selectIsAuthenticated, useAuthStore } from "@/lib/stores/auth-store";
import { formatDate } from "@/lib/format";

const PAGE_SIZE = 6;

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="flex flex-col gap-3 rounded-[20px] border border-border p-6">
      <StarRating rating={review.rating} showValue={false} />
      <h4 className="flex items-center gap-1 font-bold">
        {review.reviewerName ?? "Anonymous"}
        <span
          aria-label="Verified"
          className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-[10px] text-white"
        >
          ✓
        </span>
      </h4>
      <p className="text-sm leading-6 text-primary-500">
        &ldquo;{review.comment}&rdquo;
      </p>
      <p className="text-xs text-primary-400">
        Posted on {formatDate(review.createdAt)}
      </p>
    </article>
  );
}

function WriteReviewForm({
  productId,
  onSubmitted,
}: {
  productId: string;
  onSubmitted: () => void;
}) {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isAuthenticated) {
    return (
      <Button
        variant="secondary"
        onClick={() => router.push(`/login?redirect=/product`)}
      >
        Log in to write a review
      </Button>
    );
  }

  if (!open) {
    return <Button onClick={() => setOpen(true)}>Write a Review</Button>;
  }

  return (
    <form
      className="w-full rounded-[20px] border border-border p-5"
      onSubmit={async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
          await createReview(productId, { rating, comment });
          setOpen(false);
          setComment("");
          onSubmitted();
        } catch (err) {
          setError(
            err instanceof ApiError
              ? err.message
              : "Could not submit your review",
          );
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <div className="flex items-center gap-3">
        <span className="text-sm text-primary-500">Your rating</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              className={n <= rating ? "text-[#FFC633]" : "text-primary-300"}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <Textarea
        required
        minLength={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your thoughts about this product…"
        rows={4}
        className="mt-3"
      />
      {error && <p className="mt-2 text-sm text-sale">{error}</p>}
      <div className="mt-3 flex gap-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Submitting…" : "Submit Review"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => setOpen(false)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

export function ProductReviews({
  productId,
  initial,
}: {
  productId: string;
  initial: Paginated<Review>;
}) {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>(initial.data);
  const [total, setTotal] = useState(initial.total);
  const [page, setPage] = useState(initial.page);
  const [loading, setLoading] = useState(false);

  const hasMore = reviews.length < total;

  async function loadMore() {
    setLoading(true);
    try {
      const next = await getProductReviews(productId, {
        page: page + 1,
        limit: PAGE_SIZE,
      });
      setReviews((r) => [...r, ...next.data]);
      setPage(next.page);
      setTotal(next.total);
    } finally {
      setLoading(false);
    }
  }

  async function refresh() {
    const fresh = await getProductReviews(productId, {
      page: 1,
      limit: PAGE_SIZE,
    });
    setReviews(fresh.data);
    setTotal(fresh.total);
    setPage(1);
    router.refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-xl font-bold">
          All Reviews{" "}
          <span className="text-sm font-normal text-primary-400">
            ({total})
          </span>
        </h3>
        <WriteReviewForm productId={productId} onSubmitted={refresh} />
      </div>

      {reviews.length === 0 ? (
        <p className="py-12 text-center text-sm text-primary-400">
          No reviews yet. Be the first to review this product.
        </p>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {reviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <Button variant="secondary" onClick={loadMore} disabled={loading}>
            {loading ? "Loading…" : "Load More Reviews"}
          </Button>
        </div>
      )}
    </div>
  );
}
