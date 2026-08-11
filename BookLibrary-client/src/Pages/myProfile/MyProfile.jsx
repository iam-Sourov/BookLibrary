import React, { useContext, useState, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Camera, Loader2, Mail, User, ShieldCheck } from "lucide-react";
import { AuthContext } from "../../contexts/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useRole from "../../hooks/useRole";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const MyProfile = () => {
  const { user, setUser, updateUser } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const role = useRole();
  const fileInputRef = useRef(null);

  const [name, setName] = useState(user?.displayName || "");
  const [imagePreview, setImagePreview] = useState(user?.photoURL);
  const [imageFile, setImageFile] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      let imageURL = user.photoURL;
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const imgbbRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMG_BB_API_KEY}`,
          formData
        );
        imageURL = imgbbRes.data.data.display_url;
      }
      await updateUser({
        displayName: name,
        photoURL: imageURL
      });
      const updatedUser = {
        name,
        photoURL: imageURL,
      };
      const res = await axiosSecure.patch(`/users/update/${user.email}`, updatedUser);
      if (res.data.modifiedCount > 0 || imageFile) {
        const newUserData = { ...user, displayName: name, photoURL: imageURL };
        setUser(newUserData);
        toast.success("Profile updated successfully");
      } else {
        toast.info("No changes detected");
      }
    } catch (err) {
      console.error("Update Error:", err);
      toast.error("Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex justify-center py-10 px-4 min-h-[80vh] bg-background">
      <Card className="w-full max-w-2xl overflow-hidden border-none shadow-md sm:border sm:shadow-sm">
        <div className="h-32 bg-linear-to-r from-blue-600 to-indigo-600 opacity-90 relative">
          <div className="absolute inset-0 bg-grid-white/10 mask-[linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        </div>
        <div className="relative px-6 pb-6">
          <div className="-mt-16 mb-6 flex flex-col items-center sm:items-start sm:flex-row sm:gap-6">
            <div className="relative group">
              <Avatar className="h-32 w-32 border-4 border-background shadow-xl cursor-pointer">
                <AvatarImage src={imagePreview} className="object-cover" />
                <AvatarFallback className="text-4xl bg-muted text-muted-foreground">
                  {name?.slice(0, 1)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div
                onClick={triggerFileInput}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-4 border-transparent">
                <Camera className="text-white h-8 w-8" />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange} />
            </div>
            <div className="mt-4 text-center sm:mt-16 sm:text-left">
              <h1 className="text-2xl font-bold tracking-tight mb-1">{user?.displayName || "User"}</h1>
              <p className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                {role[0] || "Member"} Account
              </p>
            </div>
          </div>
          <Separator className="my-6" />
          <CardContent className="p-0">
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="bg-background"/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    value={user?.email}
                    disabled
                    className="bg-muted/50 text-muted-foreground cursor-not-allowed"/>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full sm:w-auto min-w-[140px]">
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default MyProfile;