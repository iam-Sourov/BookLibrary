import React, { useContext, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2, UploadCloud, X, BookOpen, DollarSign } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { AuthContext } from '../../../contexts/AuthContext';

const CATEGORIES = [
    "Fiction", "Non-Fiction", "Science Fiction", "Mystery & Thriller",
    "Fantasy", "Biography", "History", "Self-Help", "Children", "Romance"
];

const AddBook = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const [imagePreview, setImagePreview] = useState(null);

    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: {
            status: 'published',
            category: '',
            price: ''
        }
    });
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    };
    const removeImage = () => {
        setImagePreview(null);
        setValue('image', null);
    };

    const onSubmit = async (data) => {
        if (!data.image || data.image.length === 0) {
            toast.error("Please select a book cover image.");
            return;
        }
        try {
            const formData = new FormData();
            formData.append('image', data.image[0]);
            const res = await axios.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMG_BB_API_KEY}`, formData);
            const imageUrl = res.data.data.display_url;
            const bookData = {
                title: data.title,
                author: user?.displayName,
                price: parseFloat(data.price),
                category: data.category,
                status: data.status,
                image: imageUrl,
                rating: 1,
                description: data.description,
                email: user?.email
            };

            await axiosSecure.post('/books', bookData);

            toast.success("Book successfully published!");
            reset();
            setImagePreview(null);

        } catch (err) {
            console.error(err);
            toast.error("Failed to add book. Please try again.");
        }
    };

    return (
        <div className="container mx-auto max-w-5xl py-10 px-4">
            <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight">Add New Book</h2>
                <p className="text-muted-foreground mt-1">Share a new book with the community collection.</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="overflow-hidden border-dashed border-2 shadow-none hover:border-primary/50 transition-colors">
                            <CardContent className="p-0">
                                {imagePreview ? (
                                    <div className="relative aspect-3/4 w-full">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="h-full w-full object-cover"/>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 rounded-full h-8 w-8"
                                            onClick={removeImage}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center aspect-3/4 w-full cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors">
                                        <div className="p-4 rounded-full bg-background shadow-sm mb-4">
                                            <UploadCloud className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                        <span className="text-sm font-medium text-foreground">Click to upload cover</span>
                                        <span className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            {...register("image", {
                                                required: "Cover image is required",
                                                onChange: handleImageChange
                                            })}/>
                                    </label>
                                )}
                            </CardContent>
                        </Card>
                        {errors.image && <p className="text-destructive text-sm font-medium text-center">{errors.image.message}</p>}
                        <div className="bg-muted/30 p-4 rounded-xl border flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={user?.photoURL} />
                                <AvatarFallback>AU</AvatarFallback>
                            </Avatar>
                            <div className="overflow-hidden">
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Librarian</p>
                                <p className="text-sm font-semibold truncate">{user?.displayName || "Unknown User"}</p>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Book Title</Label>
                                <Input
                                    id="title"
                                    placeholder="e.g. The Great Gatsby"
                                    className="h-11 bg-background"
                                    {...register("title", { required: "Title is required" })}/>
                                {errors.title && <span className="text-destructive text-xs">{errors.title.message}</span>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Controller
                                        name="category"
                                        control={control}
                                        rules={{ required: "Category is required" }}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger className="h-11 bg-background">
                                                    <SelectValue placeholder="Select genre" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {CATEGORIES.map((cat) => (
                                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.category && <span className="text-destructive text-xs">{errors.category.message}</span>}
                                </div>

                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Controller
                                        name="status"
                                        control={control}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger className="h-11 bg-background">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="published">Published</SelectItem>
                                                    <SelectItem value="unpublished">Unpublished</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Price</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        type="number"
                                        step="0.01"
                                        className="pl-9 h-11 bg-background"
                                        placeholder="0.00"
                                        {...register("price", { required: "Price is required", min: 0 })}
                                    />
                                </div>
                                {errors.price && <span className="text-destructive text-xs">{errors.price.message}</span>}
                            </div>

                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    placeholder="Write a compelling summary of the book..."
                                    className="min-h-[150px] bg-background resize-none leading-relaxed"
                                    {...register("description", { required: "Description is required" })}
                                />
                                {errors.description && <span className="text-destructive text-xs">{errors.description.message}</span>}
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                className="w-full h-12 text-base"
                                disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Publishing Book...
                                    </>
                                ) : (
                                    <>
                                        <BookOpen className="mr-2 h-4 w-4" />
                                        Publish to Library
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddBook;