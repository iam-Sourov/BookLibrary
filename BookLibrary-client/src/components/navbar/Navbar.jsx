import React, { useContext, useState } from 'react';
import { Link, NavLink } from 'react-router';
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AuthContext } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import {
    Book,
    BookOpen,
    Home,
    LayoutDashboard,
    LogIn,
    LogOut,
    Menu,
    User,
    UserPlus
} from 'lucide-react';

const Navbar = () => {
    const { user, LogOut: navLogOut } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const getLinkClass = ({ isActive }) =>
        `text-sm font-medium transition-colors hover:text-primary ${isActive ? "text-primary font-bold" : "text-muted-foreground"
        }`;

    const MobileLink = ({ to, icon: Icon, children }) => (
        <NavLink
            to={to}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md transition-all ${isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`
            }>
            <Icon className="h-4 w-4" />
            {children}
        </NavLink>
    );

    const handleSignOut = () => {
        navLogOut()
            .then(() => {
                toast.success("Logged Out Successfully");
                setIsOpen(false);
            })
            .catch((err) => toast.error(err.message));
    };

    return (
        <nav className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-primary/10 p-1.5 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">BookLibrary</span>
                </Link>
                <div className="hidden md:flex items-center gap-8">
                    <NavLink to="/" className={getLinkClass}>
                        Home
                    </NavLink>
                    <NavLink to="/all-books" className={getLinkClass}>
                        All Books
                    </NavLink>
                    {user && (
                        <NavLink to="/dashboard" className={getLinkClass}>
                            Dashboard
                        </NavLink>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <AnimatedThemeToggler />
                    <div className="hidden md:flex items-center gap-3">
                        {!user ? (
                            <>
                                <Button variant="ghost" asChild>
                                    <Link to="/login">Login</Link>
                                </Button>
                                <Button asChild>
                                    <Link to="/register">Get Started</Link>
                                </Button>
                            </>
                        ) : (
                            <div className="flex items-center gap-3 border-l">
                                <Link to="/dashboard/my-profile">
                                    <Avatar className="h-8 w-8 border-2 rounded-full border-white hover:border-primary/20 transition-colors cursor-pointer">
                                        <AvatarImage src={user.photoURL} alt={user.displayName || "User"} />
                                        <AvatarFallback className="font-bold bg-primary/10 text-primary">
                                            {user?.email?.charAt(0).toUpperCase() || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleSignOut}
                                    className="text-muted-foreground hover:text-destructive transition-colors"
                                    title="Logout">
                                    <LogOut className="h-5 w-5" />
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className="md:hidden">
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="-mr-2">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="flex flex-col h-full w-[300px]">
                                <SheetHeader className="mb-4 text-left">
                                    <SheetTitle className="flex items-center gap-2">
                                        <div className="bg-primary/10 p-1 rounded-md">
                                            <BookOpen className="h-4 w-4 text-primary" />
                                        </div>
                                        BookLibrary
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col gap-1">
                                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 pl-3">Menu</div>
                                    <MobileLink to="/" icon={Home}>Home</MobileLink>
                                    <MobileLink to="/all-books" icon={Book}>All Books</MobileLink>

                                    {user && (
                                        <>
                                            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4 mb-2 pl-3">Account</div>
                                            <MobileLink to="/dashboard" icon={LayoutDashboard}>Dashboard</MobileLink>
                                            <MobileLink to="/dashboard/my-profile" icon={User}>My Profile</MobileLink>
                                        </>
                                    )}
                                </div>
                                <div className="mt-auto pt-6 border-t flex flex-col gap-3">
                                    {!user ? (
                                        <>
                                            <Button variant="outline" className="w-full justify-start gap-2" asChild>
                                                <Link to="/login" onClick={() => setIsOpen(false)}>
                                                    <LogIn className="h-4 w-4" /> Login
                                                </Link>
                                            </Button>
                                            <Button className="w-full justify-start gap-2" asChild>
                                                <Link to="/register" onClick={() => setIsOpen(false)}>
                                                    <UserPlus className="h-4 w-4" /> Register
                                                </Link>
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 px-1">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarImage src={user.photoURL} />
                                                    <AvatarFallback className="bg-primary/10 text-primary">
                                                        {user?.email?.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium">{user.displayName || "User"}</span>
                                                    <span className="text-xs text-muted-foreground truncate max-w-[180px]">{user.email}</span>
                                                </div>
                                            </div>
                                            <Button
                                                variant="destructive"
                                                className="w-full justify-start gap-2"
                                                onClick={handleSignOut}>
                                                <LogOut className="h-4 w-4" /> Logout
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;