
import { useEffect, useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { MdRateReview } from "react-icons/md";
import { IoRefresh } from "react-icons/io5";
import Navigation from "../layout/Navigation/StaticNavigationPC";
import { supabase } from "../../lib/supabase";

function Reviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadReviews = async () => {
        setLoading(true);
        setError("");

        try {
            const { data, error } = await supabase
                .from("reviews_mod")
                .select(`
                    *,
                    transaction:transactions_mod (
                        profile:profiles_mod!transactions_mod_user_id_fkey1 (*)
                    )
                `)
                .order("created_at", { ascending: false });

            if (error) throw error;

            setReviews(data ?? []);
        } catch (err) {
            console.error("Error loading reviews:", err);
            setError("Unable to load reviews. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReviews();
    }, []);

    const formatDate = (date) => {
        if (!date) return "Date unavailable";

        return new Date(date).toLocaleString("en-PH", {
            timeZone: "Asia/Manila",
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    };

    const getCustomerName = (review) => {
        const profile = review?.transaction?.profile;

        if (!profile) return "Customer";

        return (
            profile.full_name ||
            profile.name ||
            [profile.first_name, profile.last_name]
                .filter(Boolean)
                .join(" ") ||
            "Customer"
        );
    };

    return (
        <div className="min-h-screen w-full bg-[#f7f7f7]">
            <Navigation />

            <main className="mx-auto w-full max-w-8xl px-7 lg:px-20 py-6 md:px-8 md:py-30">
                {/* Page Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-1">
                        <h1 className='font-akagi font-black text-blue text-4xl'>Reviews</h1>

                        <p className="font-akagi text-sm font-medium text-gray/70 md:text-base">
                            Read feedback from customers about their bike rental experience.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={loadReviews}
                        disabled={loading}
                        className="flex w-fit items-center justify-center gap-2 rounded-lg bg-blue px-4 py-2 font-akagi text-sm font-bold text-[#ffffff] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <IoRefresh className={loading ? "animate-spin" : ""} />
                        Refresh Reviews
                    </button>
                </div>

                {/* Review Summary */}
                {!loading && !error && reviews.length > 0 && (
                    <div className="mb-6 flex items-center gap-4 rounded-xl border border-gray/10 bg-[#ffffff] p-5 shadow-sm">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-yellow">
                            <MdRateReview className="text-2xl text-darkblue" />
                        </div>

                        <div>
                            <h2 className="font-akagi text-lg font-black text-darkblue">
                                {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
                            </h2>

                            <p className="font-akagi text-sm font-medium text-gray/70">
                                Customer feedback and ratings
                            </p>
                        </div>
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-xl bg-[#ffffff] p-8">
                        <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray/20 border-t-blue" />

                        <p className="font-akagi text-sm font-medium text-gray/70">
                            Loading customer reviews...
                        </p>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="flex flex-col items-center gap-4 rounded-xl border border-red-200 bg-[#ffffff] p-8 text-center">
                        <p className="font-akagi text-sm font-medium text-red-500">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={loadReviews}
                            className="rounded-lg bg-blue px-4 py-2 font-akagi text-sm font-bold text-[#ffffff]"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && reviews.length === 0 && (
                    <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-xl border border-gray/10 bg-[#ffffff] p-8 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue/10">
                            <MdRateReview className="text-3xl text-blue" />
                        </div>

                        <h2 className="font-akagi text-xl font-black text-gray/80">
                            No Reviews Yet
                        </h2>

                        <p className="max-w-md font-akagi text-sm font-medium text-gray/70">
                            Customer reviews will appear here once users submit feedback
                            about their bike rental experience.
                        </p>
                    </div>
                )}

                {/* Reviews List */}
                {!loading && !error && reviews.length > 0 && (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {reviews.map((review) => {
                            const rating = Math.min(
                                5,
                                Math.max(0, Math.round(Number(review.stars) || 0))
                            );

                            return (
                                <article
                                    key={review.id}
                                    className="flex flex-col gap-4 rounded-xl border border-gray/10 bg-[#ffffff] p-5 shadow-sm transition hover:shadow-md"
                                >
                                    {/* Customer */}
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-yellow font-akagi text-lg font-black text-darkblue">
                                                {getCustomerName(review)
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>

                                            <div className="min-w-0">
                                                <h2 className="truncate font-akagi text-base font-black text-darkblue">
                                                    {getCustomerName(review)}
                                                </h2>

                                                <p className="font-akagi text-xs font-medium text-gray/60">
                                                    {formatDate(review.created_at)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="shrink-0 rounded-lg bg-yellow/30 px-2 py-1">
                                            <span className="font-akagi text-xs font-bold text-darkblue">
                                                {rating}/5
                                            </span>
                                        </div>
                                    </div>

                                    {/* Star Rating */}
                                    <div
                                        className="flex items-center gap-1"
                                        aria-label={`${rating} out of 5 stars`}
                                    >
                                        {[1, 2, 3, 4, 5].map((star) =>
                                            star <= rating ? (
                                                <FaStar
                                                    key={star}
                                                    className="text-lg text-yellow"
                                                />
                                            ) : (
                                                <FaRegStar
                                                    key={star}
                                                    className="text-lg text-gray/30"
                                                />
                                            )
                                        )}
                                    </div>

                                    {/* Review Title */}
                                    <h3 className="break-words font-akagi text-lg font-black text-blue">
                                        {review.title?.trim() || "Customer Feedback"}
                                    </h3>

                                    {/* Review Content */}
                                    <p className="whitespace-pre-wrap break-words font-akagi text-sm font-medium leading-relaxed text-gray/80">
                                        {review.review || "No written feedback provided."}
                                    </p>

                                    <div className="mt-auto border-t border-gray/10 pt-3">
                                        <p className="font-akagi text-xs font-medium text-gray/50">
                                            Review ID: #{review.id}
                                        </p>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}

export default Reviews;
