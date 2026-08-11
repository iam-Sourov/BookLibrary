import React, { useContext, useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import {
    Loader2,
    Pencil,
    Archive,
    Image as ImageIcon,
    RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import { AuthContext } from '../../../contexts/AuthContext';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const MyBooks = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);

    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
        defaultValues: { title: '', price: '', image: '' }
    });

    const watchedImage = watch('image');
    const { data: books = [], isLoading } = useQuery({
        queryKey: ['my-books', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/my-books/${user.email}`);
            return res.data;
        }
    });

    useEffect(() => {
        if (selectedBook) {
            reset({
                title: selectedBook.title,
                price: selectedBook.price,
                image: selectedBook.image
            });
        }
    }, [selectedBook, reset]);

    // Update Mutation
    const updateMutation = useMutation({
        mutationFn: async ({ id, updatedData }) => {
            const res = await axiosSecure.patch(`/books/${id}`, updatedData);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Book updated");
            queryClient.invalidateQueries(['my-books']);
            setIsEditOpen(false);
        },
        onError: () => toast.error("Update failed")
    });
    const statusMutation = useMutation({
        mutationFn: async ({ id, newStatus }) => {
            const res = await axiosSecure.patch(`/books/${id}`, { status: newStatus });
            return res.data;
        },
        onSuccess: (_, variables) => {
            toast.success(variables.newStatus === 'published' ? "Book Published" : "Book Unpublished");
            queryClient.invalidateQueries(['my-books']);
        },
        onError: () => toast.error("Status update failed")
    });

    const onSubmit = (data) => {
        updateMutation.mutate({
            id: selectedBook._id,
            updatedData: { ...data, price: parseFloat(data.price) }
        });
    };

    if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;
    return (
        <div className="container mx-auto p-6 space-y-8">
            <h2 className="text-3xl font-bold">My Books</h2>

            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="w-[100px]">Image</TableHead>
                            <TableHead>Book Details</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right w-[250px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {books.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-48 text-center text-muted-foreground">
                                    No books found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            books.map((book) => (
                                <TableRow key={book._id}>
                                    <TableCell>
                                        <img src={book.image} alt={book.title} className="h-16 w-12 object-cover rounded bg-muted" />
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-bold">{book.title}</div>
                                        <div className="text-sm text-muted-foreground">${book.price}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={book.status === 'published' ? 'default' : 'secondary'}>
                                            {book.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => { setSelectedBook(book); setIsEditOpen(true); }}
                                            >
                                                <Pencil className="h-4 w-4 mr-1" /> Edit
                                            </Button>
                                            {book.status === 'unpublished' ? (
                                                <Button
                                                    size="sm"
                                                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                                    onClick={() => statusMutation.mutate({ id: book._id, newStatus: 'published' })}
                                                >
                                                    <RotateCcw className="h-4 w-4 mr-1" /> Publish
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => statusMutation.mutate({ id: book._id, newStatus: 'unpublished' })}
                                                >
                                                    <Archive className="h-4 w-4 mr-1" /> Unpublish
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Book</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input {...register("title", { required: true })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Price</Label>
                            <Input type="number" step="0.01" {...register("price", { required: true })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Image URL</Label>
                            <Input {...register("image", { required: true })} />
                        </div>
                        <div className="h-40 w-full bg-muted rounded overflow-hidden flex items-center justify-center">
                            {watchedImage ? <img src={watchedImage} className="h-full object-contain" /> : <ImageIcon className="text-muted-foreground" />}
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={updateMutation.isPending}>
                                {updateMutation.isPending && <Loader2 className="animate-spin mr-2" />} Update
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MyBooks;