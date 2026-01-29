import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Star, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface Review {
  id: string;
  user_id: string;
  rating: number;
  title: string | null;
  content: string | null;
  is_verified_purchase: boolean;
  created_at: string;
  user_profile?: {
    full_name: string | null;
  };
}

interface ProductDescriptionProps {
  productId: string;
  description: string | null;
}

const CustomStar = ({ filled, className }: { filled: boolean; className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 20 20" 
    fill="currentColor" 
    className={`w-3 h-3 ${filled ? 'text-foreground' : 'text-muted-foreground/30'} ${className}`}
  >
    <path 
      fillRule="evenodd" 
      d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" 
      clipRule="evenodd" 
    />
  </svg>
);

const ProductDescription = ({ productId, description }: ProductDescriptionProps) => {
  const { user } = useAuth();
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCareOpen, setIsCareOpen] = useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  
  // Review state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    if (isReviewsOpen && reviews.length === 0) {
      fetchReviews();
    }
  }, [isReviewsOpen, productId]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch user profiles for reviews
      const reviewsWithProfiles = await Promise.all(
        (data || []).map(async (review) => {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('full_name')
            .eq('id', review.user_id)
            .single();

          return {
            ...review,
            user_profile: profile || undefined,
          };
        })
      );

      setReviews(reviewsWithProfiles);

      // Check if current user has already reviewed
      if (user) {
        const userReview = reviewsWithProfiles.find((r) => r.user_id === user.id);
        setHasReviewed(!!userReview);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to sign in to leave a review',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);

    try {
      // Check if user has purchased this product
      const { data: orderItems } = await supabase
        .from('order_items')
        .select('id, order_id, orders!inner(user_id, status)')
        .eq('product_id', productId);

      const userOrders = (orderItems || []).filter(
        (item: any) => item.orders?.user_id === user.id && item.orders?.status === 'delivered'
      );
      const isVerifiedPurchase = userOrders.length > 0;

      const { error } = await supabase
        .from('reviews')
        .insert({
          user_id: user.id,
          product_id: productId,
          rating,
          title: reviewTitle || null,
          content: reviewContent || null,
          is_verified_purchase: isVerifiedPurchase,
        });

      if (error) throw error;

      toast({
        title: 'Review submitted',
        description: 'Thank you for your review!',
      });

      setShowReviewForm(false);
      setRating(5);
      setReviewTitle('');
      setReviewContent('');
      fetchReviews();
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit review',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-EU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-0 mt-8 border-t border-border">
      {/* Description */}
      {description && (
        <div className="border-b border-border">
          <Button
            variant="ghost"
            onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
            className="w-full h-14 px-0 justify-between hover:bg-transparent font-light rounded-none"
          >
            <span>Description</span>
            {isDescriptionOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          {isDescriptionOpen && (
            <div className="pb-6 space-y-4">
              <p className="text-sm font-light text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {description}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Product Details */}
      <div className="border-b border-border">
        <Button
          variant="ghost"
          onClick={() => setIsDetailsOpen(!isDetailsOpen)}
          className="w-full h-14 px-0 justify-between hover:bg-transparent font-light rounded-none"
        >
          <span>Product Details</span>
          {isDetailsOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
        {isDetailsOpen && (
          <div className="pb-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-light text-muted-foreground">Collection</span>
              <span className="text-sm font-light text-foreground">LavenderLily</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-light text-muted-foreground">Quality</span>
              <span className="text-sm font-light text-foreground">Premium</span>
            </div>
          </div>
        )}
      </div>

      {/* Care Instructions */}
      <div className="border-b border-border">
        <Button
          variant="ghost"
          onClick={() => setIsCareOpen(!isCareOpen)}
          className="w-full h-14 px-0 justify-between hover:bg-transparent font-light rounded-none"
        >
          <span>Care & Cleaning</span>
          {isCareOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
        {isCareOpen && (
          <div className="pb-6 space-y-4">
            <ul className="space-y-2">
              <li className="text-sm font-light text-muted-foreground">• Machine wash cold with like colors</li>
              <li className="text-sm font-light text-muted-foreground">• Do not bleach</li>
              <li className="text-sm font-light text-muted-foreground">• Tumble dry low</li>
              <li className="text-sm font-light text-muted-foreground">• Iron on low if needed</li>
            </ul>
          </div>
        )}
      </div>

      {/* Customer Reviews */}
      <div className="border-b border-border lg:mb-16">
        <Button
          variant="ghost"
          onClick={() => setIsReviewsOpen(!isReviewsOpen)}
          className="w-full h-14 px-0 justify-between hover:bg-transparent font-light rounded-none"
        >
          <div className="flex items-center gap-3">
            <span>Customer Reviews</span>
            {reviews.length > 0 && (
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <CustomStar
                    key={star}
                    filled={star <= Math.round(averageRating)}
                  />
                ))}
                <span className="text-sm font-light text-muted-foreground ml-1">
                  {averageRating.toFixed(1)} ({reviews.length})
                </span>
              </div>
            )}
          </div>
          {isReviewsOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
        {isReviewsOpen && (
          <div className="pb-6 space-y-6">
            {/* Write Review Button */}
            {user && !hasReviewed && !showReviewForm && (
              <Button
                variant="outline"
                className="rounded-none"
                onClick={() => setShowReviewForm(true)}
              >
                Write a Review
              </Button>
            )}

            {/* Review Form */}
            {showReviewForm && (
              <form onSubmit={handleSubmitReview} className="border border-border p-4 space-y-4">
                <h4 className="text-sm font-medium text-foreground">Write Your Review</h4>
                
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="cursor-pointer"
                      >
                        <Star
                          className={`h-5 w-5 ${
                            star <= rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted-foreground'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Title (optional)</label>
                  <input
                    type="text"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="Summary of your review"
                    className="w-full px-3 py-2 border border-border bg-background text-foreground focus:outline-none focus:border-foreground text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Review (optional)</label>
                  <Textarea
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    placeholder="Share your experience with this product"
                    className="rounded-none"
                    rows={3}
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="submit" size="sm" className="rounded-none" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-none"
                    onClick={() => setShowReviewForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {/* Reviews List */}
            {loading ? (
              <div className="text-center py-4 text-sm text-muted-foreground">Loading reviews...</div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">No reviews yet. Be the first to review!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <CustomStar
                            key={star}
                            filled={star <= review.rating}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-light text-muted-foreground">
                        {review.user_profile?.full_name || 'Anonymous'}
                      </span>
                      {review.is_verified_purchase && (
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5">
                          Verified
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground ml-auto">
                        {formatDate(review.created_at)}
                      </span>
                    </div>
                    {review.title && (
                      <p className="text-sm font-medium text-foreground">{review.title}</p>
                    )}
                    {review.content && (
                      <p className="text-sm font-light text-muted-foreground leading-relaxed">
                        "{review.content}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDescription;
