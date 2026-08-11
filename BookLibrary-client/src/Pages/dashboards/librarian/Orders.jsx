import React, { useContext, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Ban,
  CheckCircle2,
  Truck,
  Package,
  Clock,
} from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AuthContext } from '../../../contexts/AuthContext';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const Orders = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [cancelId, setCancelId] = useState(null)

  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ['librarian-orders', user?.displayName],
    queryFn: async () => {
      const res = await axiosSecure.get(`/orders/${user.displayName}`);
      return res.data;
    }
  });

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axiosSecure.patch(`/orders/status/${orderId}`, { status: newStatus });
      toast.success(`Order marked as ${newStatus}`);
      queryClient.invalidateQueries(['librarian-orders']);
    } catch (error) {
      console.error("Status update failed:", error);
      toast.error("Failed to update status");
    }
  };

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


  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending': return { icon: Clock, color: 'text-amber-600 bg-amber-100 border-amber-200' };
      case 'shipped': return { icon: Truck, color: 'text-blue-600 bg-blue-100 border-blue-200' };
      case 'delivered': return { icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-100 border-emerald-200' };
      case 'cancelled': return { icon: Ban, color: 'text-red-600 bg-red-100 border-red-200' };
      default: return { icon: Package, color: 'text-slate-600 bg-slate-100 border-slate-200' };
    }
  };

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading orders...</div>;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Order Management</h2>
          <p className="text-muted-foreground">Track and manage customer orders for your books.</p>
        </div>
      </div>
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[300px]">Product</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status Flow</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => {
                const { icon: StatusIcon, color } = getStatusConfig(order.status);
                const isFinalState = order.status === 'cancelled' || order.status === 'delivered';
                return (
                  <TableRow key={order._id} className="group">
                    <TableCell>
                      <div className="font-medium text-foreground">{order.bookTitle}</div>
                      <div className="text-xs text-muted-foreground font-mono mt-0.5">
                        #{order._id.slice(-6).toUpperCase()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {order.email?.slice(0, 2).toUpperCase() || 'CU'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm">{order.customerEmail || order.email}</span>
                          {order.address && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="text-xs text-muted-foreground underline decoration-dotted cursor-help w-fit">
                                    View Address
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs">{order.address}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col items-start gap-1">
                        <span className="font-semibold text-sm">
                          ${order.price || '0.00'}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-[10px] px-1.5 py-0 h-5 border-0 ${order.payment_status === 'paid' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                          {order.payment_status || 'Unpaid'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        defaultValue={order.status}
                        onValueChange={(val) => handleStatusChange(order._id, val)}
                        disabled={isFinalState}>
                        <SelectTrigger className={`w-[140px] h-9 border-0 ring-0 focus:ring-0 shadow-none px-2.5 ${color} ${isFinalState ? 'opacity-70 cursor-not-allowed' : ''}`}>
                          <div className="flex items-center gap-2">
                            <StatusIcon className="h-3.5 w-3.5" />
                            <SelectValue />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            value="pending"
                            disabled={order.status === 'shipped' || order.status === 'delivered'}>
                            Pending
                          </SelectItem>
                          <SelectItem
                            value="shipped"
                            disabled={order.status === 'delivered'}>
                            Shipped
                          </SelectItem>
                          <SelectItem
                            value="delivered"
                            disabled={order.status === 'pending'}>
                            Delivered
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      {order.status !== 'cancelled' && order.status === 'pending' ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-red-600"
                          onClick={() => setCancelId(order._id)}
                          title="Cancel Order">
                          <Ban className="h-4 w-4" />
                        </Button>
                      ) : (
                        <div className="h-8 w-8" />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Package className="h-10 w-10 mb-2 opacity-20" />
                    <p>No active orders found.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <AlertDialog open={!!cancelId} onOpenChange={(open) => !open && setCancelId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Order?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this order? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Order</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              className="bg-red-600 hover:bg-red-700 text-white">
              Yes, Cancel it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Orders;