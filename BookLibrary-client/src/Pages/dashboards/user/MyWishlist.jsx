import React, { useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Trash2, PackageOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { AuthContext } from '../../../contexts/AuthContext';

const MyWishlist = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: wishlist = [], isLoading, isError } = useQuery({
    queryKey: ['wishlist', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/wishlist?email=${user.email}`);
      return res.data;
    }
  });
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.delete(`/wishlist/${id}`);
    },
    onSuccess: () => {
      toast.success("Removed from wishlist");
      queryClient.invalidateQueries(['wishlist']);
    },
    onError: () => {
      toast.error("Failed to remove item");
    }
  });

  if (isLoading) return <WishlistSkeleton />;

  if (isError) return (
    <div className="flex h-[50vh] flex-col items-center justify-center gap-2 text-destructive">
      <p>Failed to load wishlist.</p>
      <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
    </div>
  );
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Saved Books</h2>
          <p className="text-muted-foreground mt-1">Manage your curated list of favorites.</p>
        </div>
        <div className="text-sm font-medium bg-muted px-3 py-1 rounded-full">
          {wishlist.length} Items
        </div>
      </div>
      <Card className="border shadow-sm overflow-hidden">
        <CardContent className="">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>SL</TableHead>
                <TableHead className="w-[400px]">Product Details</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className='text-right'>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wishlist.length > 0 ? (
                wishlist.map((item, indx) => (
                  <TableRow key={item._id} className="group">
                    <TableCell>
                      {indx + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-12 rounded-sm overflow-hidden bg-muted border shrink-0">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                        </div>
                        <div className="space-y-1">
                          <span className="font-semibold text-foreground line-clamp-1">{item.title}</span>
                          <span className="text-xs text-muted-foreground block">{item.author}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="primary" className="font-normal text-muted-foreground bg-muted/50">
                        {item.category || "General"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      ${item.price}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-muted-foreground hover:text-red-600 hover:bg-red-50"
                        onClick={() => deleteMutation.mutate(item._id)}
                        disabled={deleteMutation.isPending}
                        title="Remove from wishlist">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-96 w-full border text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-4">
                      <div className="p-4 rounded-full bg-muted/50">
                        <PackageOpen className="h-12 w-12 text-muted-foreground/50" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Your wishlist is empty</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Looks like you haven't saved any books yet. Explore our collection to find your next read.
                        </p>
                      </div>
                      <Button asChild className="mt-4">
                        <Link to="/all-books">
                          Browse Collection <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

const WishlistSkeleton = () => (
  <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
    <div className="space-y-2">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-64" />
    </div>
    <div className="border rounded-xl bg-card overflow-hidden">
      <div className="p-4 space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-[400px]">
              <Skeleton className="h-16 w-12 rounded-sm" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  </div>
);
export default MyWishlist;