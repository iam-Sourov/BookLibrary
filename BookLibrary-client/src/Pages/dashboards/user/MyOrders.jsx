import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  CreditCard,
  Ban,
  Loader2
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { AuthContext } from "../../../contexts/AuthContext";

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [cancelId, setCancelId] = useState(null);
  const [isPaymentLoading, setIsPaymentLoading] = useState(null);

  const { data: orders = [], refetch, isLoading } = useQuery({
    queryKey: ["my-orders", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/orders?email=${user.email}`);
      return res.data;
    },
    refetchInterval: 5000,
  });

  const handleCancel = async () => {
    if (!cancelId) return;

    try {
      await axiosSecure.patch(`/orders/cancel/${cancelId}`);
      toast.success("Order Cancelled");
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel order");
    } finally {
      setCancelId(null);
    }
  };

  const handlePayment = async (order) => {
    setIsPaymentLoading(order._id);
    try {
      const paymentData = {
        _id: order._id,
        email: user.email,
        price: order.price,
        bookTitle: order.bookTitle,
        image: order.image
      };
      const res = await axiosSecure.post('/payment-checkout-session', paymentData);
      if (res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to initiate payment");
    } finally {
      setIsPaymentLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100",
      shipped: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100",
      delivered: "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
      cancelled: "bg-red-100 text-red-700 border-red-200 hover:bg-red-100",
    };

    const icons = {
      pending: <Clock className="w-3 h-3 mr-1" />,
      shipped: <Truck className="w-3 h-3 mr-1" />,
      delivered: <CheckCircle className="w-3 h-3 mr-1" />,
      cancelled: <AlertCircle className="w-3 h-3 mr-1" />,
    };

    return (
      <Badge variant="outline" className={`font-normal ${styles[status] || "bg-gray-100 text-gray-700"}`}>
        {icons[status]}
        <span className="capitalize">{status}</span>
      </Badge>
    );
  };

  if (isLoading) return <OrdersSkeleton />;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold tracking-tight">Order History</h2>
        <p className="text-muted-foreground">Track pending orders and view past purchases.</p>
      </div>
      <Card className="border shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[50px]">SL</TableHead>
                <TableHead className="w-[300px]">Product</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length > 0 ? (
                orders.map((order, indx) => (
                  <TableRow key={order._id} className="group">
                    <TableCell>
                      {indx + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-9 rounded overflow-hidden bg-muted border shrink-0">
                          <img
                            src={order.image}
                            alt={order.bookTitle}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                        </div>
                        <span className="font-medium text-foreground line-clamp-2">{order.bookTitle}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground whitespace-nowrap">
                      {order.date ? format(new Date(order.date), "MMM dd, yyyy") : "N/A"}
                    </TableCell>
                    <TableCell className="font-medium">
                      ${order.price}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(order.status)}
                    </TableCell>
                    <TableCell>
                      <div className={`text-xs font-semibold px-2 py-1 rounded-full w-fit flex items-center gap-1 ${order.payment_status === 'paid'
                        ? "text-emerald-600 bg-emerald-50 border border-emerald-100"
                        : "text-amber-600 bg-amber-50 border border-amber-100"
                        }`}>
                        {order.payment_status === 'paid' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {order.payment_status === 'paid' ? "PAID" : "UNPAID"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {order.status === 'pending' && order.payment_status !== 'paid' ? (
                          <>
                            <Button
                              size="sm"
                              className="bg-primary hover:bg-primary/90 h-8"
                              onClick={() => handlePayment(order)}
                              disabled={isPaymentLoading === order._id}>
                              {isPaymentLoading === order._id ? (
                                <Loader2 className="w-3 h-3 animate-spin mr-1" />
                              ) : (
                                <CreditCard className="w-3 h-3 mr-1" />
                              )}
                              Pay Now
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-8"
                              onClick={() => setCancelId(order._id)}>
                              <Ban className="w-3 h-3 mr-1" />
                              Cancel
                            </Button>
                          </>
                        ) : (
                          order.status === 'cancelled' && (
                             <span className="text-xs text-muted-foreground italic pr-2">Order Cancelled</span>
                          )
                        )}

                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Package className="h-12 w-12 mb-3 opacity-20" />
                      <p className="text-lg font-medium">No orders found</p>
                      <p className="text-sm">You haven't placed any orders yet.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <AlertDialog open={!!cancelId} onOpenChange={() => setCancelId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently cancel your order.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, Keep Order</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCancel}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600">
              Yes, Cancel Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
};

const OrdersSkeleton = () => (
  <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
    <div className="space-y-2">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-64" />
    </div>
    <div className="border rounded-xl bg-card overflow-hidden">
      <div className="p-4 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <Skeleton className="h-12 w-9 rounded" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-20 rounded" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default MyOrders;