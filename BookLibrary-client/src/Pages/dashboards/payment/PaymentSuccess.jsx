import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Loader2, Check, ArrowRight, Receipt, AlertCircle } from "lucide-react";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import confetti from "canvas-confetti";

const PaymentSuccess = () => {
  const axiosSecure = useAxiosSecure();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [status, setStatus] = useState('loading');

  useEffect(() => {
    if (sessionId) {
      axiosSecure.patch(`/payment-success?session_id=${sessionId}`)
        .then(res => {
          console.log(res.data)
          setStatus('success');
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#10b981', '#3b82f6', '#f59e0b']
          });
        })
        .catch(err => {
          console.error(err);
          setStatus('error');
        });
    } else {
      setStatus('error');
    }
  }, [sessionId, axiosSecure]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center space-y-4">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Finalizing your transaction...
        </p>
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <Card className="w-full max-w-md border-none shadow-none sm:border sm:shadow-sm">
          <CardContent className="flex flex-col items-center p-10 text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold">Verification Failed</h2>
            <p className="mt-2 text-muted-foreground mb-6">
              We couldn't verify the payment session. If you were charged, please contact support.
            </p>
            <Button asChild variant="secondary" className="w-full">
              <Link to="/contact">Contact Support</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-md overflow-hidden border-none shadow-none sm:border sm:shadow-lg animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center p-8 pb-0 text-center sm:p-10 sm:pb-0">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
            <Check className="h-10 w-10 text-emerald-600 dark:text-emerald-400" strokeWidth={3} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Payment Confirmed!
          </h1>
          <p className="mt-3 text-muted-foreground">
            Thank you for your purchase. A confirmation email has been sent to your inbox.
          </p>
        </div>
        <CardContent className="p-8 sm:p-10">
          <div className="rounded-lg border bg-muted/50 p-4 text-sm">
            <div className="flex items-center gap-2 font-medium text-foreground mb-3">
              <Receipt className="h-4 w-4" />
              <span>Transaction Summary</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Reference ID</span>
              <span className="font-mono text-foreground truncate max-w-[150px]">
                {sessionId?.slice(-8).toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Date</span>
              <span className="text-foreground">
                {new Date().toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Payment Method</span>
              <span className="text-foreground">Card</span>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3">
            <Button asChild size="lg" className="w-full rounded-full font-semibold shadow-sm hover:shadow-md transition-all">
              <Link to="/dashboard/my-orders">
                View My Orders
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button asChild variant="ghost" size="sm" className="w-full text-muted-foreground">
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;