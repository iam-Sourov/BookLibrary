import { useContext } from 'react';
import { Outlet } from 'react-router';
import { Spinner } from "@/components/ui/spinner";
import { AuthContext } from '../contexts/AuthContext';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';

const RootLayout = () => {
    const { loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-background">
                <Spinner className="size-8 text-primary"></Spinner>
            </div>
        );
    }
    return (
        <div className="flex min-h-screen flex-col bg-background font-sans antialiased">
            <header>
                <Navbar></Navbar>
            </header>
            <main className="flex-1 w-full">
                <Outlet></Outlet>
            </main>
            <footer>
                <Footer></Footer>
            </footer>
        </div>
    );
};

export default RootLayout;