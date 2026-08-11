import React from "react";
import { Link } from "react-router";
import { X, ArrowRight, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const PaymentCancel = () => {
  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-none shadow-none sm:border sm:shadow-sm">
        <div className="flex flex-col items-center p-8 text-center sm:p-12">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <X className="h-10 w-10 text-red-600 dark:text-red-500" strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Payment Cancelled
          </h2>
          <p className="mt-3 text-muted-foreground">
            No worries, you haven't been charged. The transaction was cancelled during the checkout process.
          </p>
          <div className="mt-8 flex w-full flex-col gap-3">
            <Button asChild size="lg" className="w-full rounded-full font-medium">
              <Link to="/dashboard/my-orders">
                Return to Orders
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="w-full text-muted-foreground hover:text-foreground">
              <Link to="/contact">
                <HelpCircle className="mr-2 h-4 w-4" />
                Having trouble paying?
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PaymentCancel;