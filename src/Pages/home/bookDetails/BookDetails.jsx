import React, { useContext, useState } from 'react';
import { Navigate, useParams } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Star, Heart, ShoppingCart, BookOpen, Globe, MessageSquare, UserStar } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { AuthContext } from '../../../contexts/AuthContext';

const BookDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const [orderBook, setOrderBook] = useState(null);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isOrdering, setIsOrdering] = useState(false);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  const { data: book, isLoading: isBookLoading } = useQuery({
    queryKey: ['book', id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/books/${id}`);
      return res.data;
    }
  });

  const { data: wishlist = [] } = useQuery({
    queryKey: ['wishlist', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/wishlist?email=${user.email}`);
      return res.data;
    }
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/reviews/${id}`);
      return res.data;
    }
  });

  const addToWishlistMutation = useMutation({
    mutationFn: async (bookItem) => {
      const wishlistItem = {
        bookId: bookItem._id,
        title: bookItem.title,
        image: bookItem.image,
        author: bookItem.author,
        price: bookItem.price,
        category: bookItem.category,
        rating: bookItem.rating,
        userEmail: user.email,
        userName: user.displayName,
        addedDate: new Date().toISOString()
      }
      return await axiosSecure.post('/wishlist', wishlistItem);
    },
    onSuccess: () => {
      toast.success("Added to wishlist");
      queryClient.invalidateQueries(['wishlist']);
    },
    onError: (error) => {
      if (error.response?.status === 409) {
        toast.error("Already in wishlist");
      } else {
        toast.error("Failed to add to wishlist");
      }
    }
  });

  const reviewMutation = useMutation({
    mutationFn: async (data) => {
      return await axiosSecure.post('/reviews', data);
    },
    onSuccess: () => {
      toast.success("Review posted successfully!");
      setReviewText('');
      setReviewRating(5);
      setIsReviewModalOpen(false);
      queryClient.invalidateQueries(['reviews']);
      queryClient.invalidateQueries(['book', id]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to post review");
    }
  });

  const handleBuyNowClick = () => {
    if (!user) {
      toast.error("Please login to purchase items");
      Navigate('/login');
      return;
    }
    setOrderBook(book);
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error("You must be logged in to place an order.");
      setOrderBook(null);
      return;
    }
    if (!phone || !address) {
      toast.error("Please provide phone and address.");
      return;
    }

    setIsOrdering(true);
    const orderData = {
      name: user.displayName,
      email: user.email,
      phone,
      address,
      author: orderBook.author,
      bookId: orderBook._id,
      bookTitle: orderBook.title,
      price: orderBook.price,
      status: 'pending',
      image: orderBook.image,
      payment_status: 'unpaid',
      date: new Date().toISOString()
    };

    try {
      const res = await axiosSecure.post('/orders', orderData);
      if (res.data.insertedId === null) {
        toast.error("You have already ordered this book.");
      } else {
        toast.success("Order placed successfully!");
        setOrderBook(null);
        setPhone('');
        setAddress('');
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order.");
    } finally {
      setIsOrdering(false);
    }
  };

  const handleAddToWishlist = () => {
    if (!user) return toast.error("Please login first");
    addToWishlistMutation.mutate(book);
  };

  const handlePostReview = () => {
    if (!user) return toast.error("Please login to review");
    const reviewData = {
      bookId: book._id,
      userEmail: user.email,
      userName: user.displayName,
      userPhoto: user.photoURL,
      rating: reviewRating,
      comment: reviewText,
      date: new Date().toISOString()
    };
    reviewMutation.mutate(reviewData);
  };

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : 0;

  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => {
    const star = Math.round(r.rating);
    if (ratingCounts[star] !== undefined) ratingCounts[star]++;
  });

  if (isBookLoading) return <div className="flex h-screen items-center justify-center"><Spinner className="size-8" /></div>;
  if (!book) return <div className="text-center py-20 text-xl font-semibold">Book not found</div>;

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 md:py-12 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start">
            <div className="relative w-[280px] sm:w-[350px] lg:w-full max-w-[450px] aspect-2/3 rounded-2xl overflow-hidden shadow-2xl bg-muted group">
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          </div>
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6 md:space-y-8">
            <div className="space-y-3 text-center lg:text-left">
              <Badge variant="secondary" className="mb-2 uppercase tracking-wide">{book.category}</Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                {book.title}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground font-medium">
                by {book.author}
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-2 pt-2">
                <div className="flex items-center text-amber-500 rounded-md px-4 py-1 bg-amber-500/20">
                  <Star className="fill-current h-5 w-5" />
                  <span className="ml-1 font-bold text-lg">{book.rating || 0}</span>
                </div>
                <span className="text-muted-foreground">({reviews.length} reviews)</span>
              </div>
            </div>
            <div className="bg-muted/30 p-6 rounded-xl border space-y-6">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm text-muted-foreground line-through opacity-70">${(parseFloat(book.price) * 1.2).toFixed(2)}</p>
                  <div className="text-4xl font-bold text-primary">
                    ${book.price}
                  </div>
                </div>
                <Badge className="bg-emerald-600 hover:bg-emerald-700">In Stock</Badge>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-md h-12 gap-2 rounded-xl"
                  onClick={handleBuyNowClick}>
                  <ShoppingCart className="h-5 w-5" />
                  Buy Now
                </Button>
                <TooltipProvider>
                  <div className="flex gap-3">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-12 w-12 rounded-xl border-2 bg-red-500/20"
                          onClick={handleAddToWishlist}
                          disabled={addToWishlistMutation.isPending}>
                          <Heart className={`h-5 w-5 ${wishlist.some(item => item.bookId === book._id) ? "fill-red-500 text-red-500" : ""}`} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Add to Wishlist</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-12 w-12 rounded-xl border-2"
                          onClick={() => {
                            if (!user) return toast.error("Please login to review");
                            setIsReviewModalOpen(true);
                          }}>
                          <UserStar className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Write a Review</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-semibold">Synopsis</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {book.description}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Globe className="text-muted-foreground h-5 w-5" />
                <div>
                  <p className="text-xs text-muted-foreground">Language</p>
                  <p className="font-semibold">{book.language || "English"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Separator className="my-16" />
        <section className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Customer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-4 space-y-6 sticky top-20">
              <div className="bg-card p-6 rounded-2xl border shadow-sm">
                <div className="text-center mb-6">
                  <div className="text-5xl font-extrabold text-foreground">{averageRating}</div>
                  <div className="flex justify-center text-amber-500 my-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < Math.round(averageRating) ? 'fill-current' : 'text-muted-foreground/20'}`}
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground font-medium text-sm">{totalReviews} Verified Reviews</p>
                </div>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = ratingCounts[star];
                    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center gap-3 text-sm">
                        <div className="flex items-center gap-1 w-12 shrink-0">
                          <span className="font-semibold">{star}</span>
                          <Star className="h-3 w-3 fill-muted-foreground text-muted-foreground" />
                        </div>
                        <Progress
                          value={percentage}
                          className="h-2 flex-1 *:bg-amber-400 bg-muted/50" />
                        <div className="w-8 text-right text-muted-foreground shrink-0">
                          {percentage.toFixed(0)}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="md:col-span-8 space-y-6">
              {reviews.length > 0 ? (
                reviews.map((review, i) => (
                  <div key={i} className="bg-card p-6 rounded-xl border hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border">
                          <AvatarImage src={review.userPhoto} />
                          <AvatarFallback className="font-bold text-primary">
                            {review.userName?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-bold text-base leading-none mb-1">{review.userName}</h4>
                          <p className="text-xs text-muted-foreground">
                            {review.date ? format(new Date(review.date), 'MMM dd, yyyy') : 'Recent'}
                          </p>
                        </div>
                      </div>
                      <div className="flex bg-amber-500/10 px-2 py-1 rounded-full text-amber-600">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${i < review.rating ? 'fill-current' : 'text-muted-foreground/20'}`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                      "{review.comment}"
                    </p>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed rounded-2xl bg-muted/30">
                  <div className="bg-background p-4 rounded-full mb-4 shadow-sm">
                    <MessageSquare className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg">No reviews yet</h3>
                  <p className="text-muted-foreground text-sm max-w-xs mt-1">
                    Be the first to share your thoughts on this book with the community.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
        <Dialog open={!!orderBook} onOpenChange={(open) => !open && setOrderBook(null)}>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Checkout</DialogTitle>
              <DialogDescription>Confirm purchase for {orderBook?.title}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Phone</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+880..." />
              </div>
              <div className="grid gap-2">
                <Label>Address</Label>
                <Textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Full Address" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handlePlaceOrder} disabled={isOrdering}>
                {isOrdering ? <Spinner className="mr-2 h-4 w-4" /> : "Confirm Order"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Write a Review</DialogTitle>
              <DialogDescription>
                Share your thoughts on {book.title}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="flex flex-col items-center gap-2">
                <Label>Rating</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="focus:outline-none transition-transform active:scale-95">
                      <Star className={`h-8 w-8 ${star <= reviewRating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20"}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Your Review</Label>
                <Textarea
                  placeholder="Tell us what you liked or disliked..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="min-h-[120px]" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsReviewModalOpen(false)}>Cancel</Button>
              <Button
                onClick={handlePostReview}
                disabled={reviewMutation.isPending || !reviewText.trim()}>
                {reviewMutation.isPending ? <Spinner className="mr-2 h-4 w-4" /> : "Post Review"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default BookDetails;