import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { FileText, Download, Receipt } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { AuthContext } from "../../../contexts/AuthContext";

const Invoices = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ["my-invoices", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user.email}`);
      return res.data;
    }
  });

  if (isLoading) return <InvoiceSkeleton />;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payment History</h2>
          <p className="text-muted-foreground">Manage and download your past invoices.</p>
        </div>
      </div>
      <Card className="border shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="">SL</TableHead>
                <TableHead className="w-[180px]">Transaction ID</TableHead>
                <TableHead>Item Details</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.length > 0 ? (
                invoices.map((invoice, indx) => (
                  <TableRow key={invoice._id} className="group cursor-default">
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {indx + 1}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <FileText className="h-3 w-3" />
                        <span className="truncate max-w-[120px]" title={invoice.transactionId}>
                          {invoice.transactionId ? invoice.transactionId.slice(-8).toUpperCase() : "N/A"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-foreground">
                        {invoice.bookTitle}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {invoice.paymentDate || invoice.date
                        ? format(new Date(invoice.paymentDate || invoice.date), "MMM dd, yyyy")
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="font-mono font-semibold text-emerald-600 bg-emerald-50 border-emerald-100">
                        +${invoice.price?.toFixed(2)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Receipt className="h-12 w-12 mb-3 opacity-20" />
                      <p className="text-lg font-medium">No invoices found</p>
                      <p className="text-sm">You haven't made any purchases yet.</p>
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

const InvoiceSkeleton = () => (
  <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
    <div className="space-y-2">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-64" />
    </div>
    <div className="border rounded-xl bg-card overflow-hidden">
      <div className="p-4 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Invoices;