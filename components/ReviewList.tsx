import { Review } from "@/types";

interface ReviewListProps {
  reviews: Review[];
  currentUserId?: string;
}

export default function ReviewList({
  reviews,
  currentUserId,
}: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        Ingen anmeldelser ennå. Bli den første til å anmelde denne filmen!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review._id}
          className="border border-gray-200 dark:border-gray-800 rounded-lg p-6"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="font-semibold">{review.reviewAuthor}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(review.createdAt).toLocaleDateString("nb-NO", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {"⭐".repeat(review.rating)}
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {review.reviewText}
          </p>

          {currentUserId === review.userId && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-800">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Din anmeldelse
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
