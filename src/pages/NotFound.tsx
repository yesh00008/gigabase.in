import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import StarField from "@/components/StarField";
import { App as CapacitorApp } from '@capacitor/app';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  // Handle Android hardware back button - go back to previous page
  useEffect(() => {
    const setupBackButtonHandler = async () => {
      const backButtonHandler = await CapacitorApp.addListener('backButton', ({ canGoBack }) => {
        if (canGoBack) {
          navigate(-1);
        } else {
          navigate('/');
        }
      });

      return backButtonHandler;
    };

    let listenerCleanup: any = null;
    setupBackButtonHandler().then(listener => {
      listenerCleanup = listener;
    });

    return () => {
      if (listenerCleanup) {
        listenerCleanup.remove();
      }
    };
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center relative overflow-hidden">
      <StarField />
      <div className="text-center relative z-10 px-4 sm:px-6">
        <h1 className="mb-4 text-6xl sm:text-7xl md:text-8xl font-serif font-bold text-white">404</h1>
        <p className="mb-6 sm:mb-8 text-lg sm:text-xl text-muted-foreground">Oops! Page not found in the knowledge base</p>
        <Link 
          to="/" 
          className="inline-block px-6 sm:px-8 py-3 sm:py-4 glass-card border border-accent/50 text-accent hover:border-accent hover:shadow-lg hover:shadow-accent/20 transition-all rounded-full font-medium backdrop-blur-md"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
