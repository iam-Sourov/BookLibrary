import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
    Users, 
    BookOpen, 
    ShoppingBag, 
    ShieldCheck, 
    UserCog, 
    User,
    Clock,
    XCircle,
    CheckCircle2
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import useAxiosSecure from '../../../hooks/useAxiosSecure';


const Stats = () => {
    const axiosSecure = useAxiosSecure();

    const { data: stats, isLoading } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const res = await axiosSecure.get('/stats');
            return res.data;
        }
    });

    if (isLoading) return <DashboardSkeleton />;

    // Calculate percentages for progress bars
    const getPercent = (value, total) => total > 0 ? (value / total) * 100 : 0;

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
                <p className="text-muted-foreground mt-1">
                    Welcome back. Here's what's happening in your library today.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Books</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.books}</div>
                        <p className="text-xs text-muted-foreground">Available in library</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalUsers}</div>
                        <p className="text-xs text-muted-foreground">Registered accounts</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalOrders}</div>
                        <p className="text-xs text-muted-foreground">Lifetime orders placed</p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>User Distribution</CardTitle>
                        <CardDescription>Breakdown of roles across the platform.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-blue-500" />
                                    <span className="font-medium">Standard Users</span>
                                </div>
                                <span className="text-muted-foreground">{stats.users}</span>
                            </div>
                            <Progress value={getPercent(stats.users, stats.totalUsers)} className="h-2 *:bg-blue-500" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <UserCog className="h-4 w-4 text-orange-500" />
                                    <span className="font-medium">Librarians</span>
                                </div>
                                <span className="text-muted-foreground">{stats.librarians}</span>
                            </div>
                            <Progress value={getPercent(stats.librarians, stats.totalUsers)} className="h-2 *:bg-orange-500" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-violet-500" />
                                    <span className="font-medium">Admins</span>
                                </div>
                                <span className="text-muted-foreground">{stats.admins}</span>
                            </div>
                            <Progress value={getPercent(stats.admins, stats.totalUsers)} className="h-2 *:bg-violet-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Order Statistics</CardTitle>
                        <CardDescription>Current status of all transactions.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    <span className="font-medium">Completed</span>
                                </div>
                                <span className="text-muted-foreground">{stats.completedOrders}</span>
                            </div>
                            <Progress value={getPercent(stats.completedOrders, stats.totalOrders)} className="h-2 *:bg-emerald-500" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-amber-500" />
                                    <span className="font-medium">Pending</span>
                                </div>
                                <span className="text-muted-foreground">{stats.pendingOrders}</span>
                            </div>
                            <Progress value={getPercent(stats.pendingOrders, stats.totalOrders)} className="h-2 *:bg-amber-500" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <XCircle className="h-4 w-4 text-red-500" />
                                    <span className="font-medium">Cancelled</span>
                                </div>
                                <span className="text-muted-foreground">{stats.cancelledOrders}</span>
                            </div>
                            <Progress value={getPercent(stats.cancelledOrders, stats.totalOrders)} className="h-2 *:bg-red-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

const DashboardSkeleton = () => (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
        </div>
    </div>
);

export default Stats;