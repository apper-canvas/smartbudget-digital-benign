import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, createContext, useContext } from "react";
import { setUser, clearUser, setInitialized } from "@/store/userSlice";
import { getRouteConfig, verifyRouteAccess } from "@/router/route.utils";
import { getApperClient } from "@/services/apperClient";
import { ToastContainer } from "react-toastify";

// Auth context for logout functionality
const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within Root component");
  }
  return context;
};

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      <p className="text-slate-600 font-medium">Initializing SmartBudget...</p>
    </div>
  </div>
);

export default function Root() {
  const { isInitialized, user } = useSelector(state => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, []);

  useEffect(() => {
    // Guard: exit early if not initialized
    if (!isInitialized) return;

    const config = getRouteConfig(location.pathname);

    const { allowed, redirectTo, excludeRedirectQuery } = verifyRouteAccess(config, user);

    // Guard: exit early if access is allowed or no redirect
    if (allowed || !redirectTo) return;

    // Build redirect URL - add redirect query param unless excluded
    let redirectUrl = redirectTo;
    if (!excludeRedirectQuery) {
      const redirectPath = location.pathname + location.search;
      const separator = redirectTo.includes('?') ? '&' : '?';
      redirectUrl = `${redirectTo}${separator}redirect=${encodeURIComponent(redirectPath)}`;
    }

    navigate(redirectUrl, { replace: true });
  }, [isInitialized, user, location.pathname, location.search, navigate]);

  const initializeAuth = async () => {
    try {
      // Wait for SDK to load and get client
      const apperClient = await getApperClient();

      if (!apperClient || !window.ApperSDK) {
        console.error('Failed to initialize ApperSDK or ApperClient');
        dispatch(clearUser());
        handleAuthComplete();
        return;
      }

      const { ApperUI } = window.ApperSDK;

      ApperUI.setup(apperClient, {
        target: "#authentication",
        clientId: import.meta.env.VITE_APPER_PROJECT_ID,
        view: "both",
        onSuccess: handleAuthSuccess,
        onError: handleAuthError,
      });

    } catch (error) {
      console.error('Failed to initialize authentication:', error);
      dispatch(clearUser());
      handleAuthComplete();
    }
  };

  const handleAuthSuccess = (user) => {
// CRITICAL: Declare variables in scope accessible to both if/else blocks
    let currentPath = window.location.pathname + window.location.search;
    let redirectPath = new URLSearchParams(window.location.search).get('redirect');
    const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || 
                       currentPath.includes('/callback') || currentPath.includes('/error');
    
    if (user) {
      // CRITICAL: This exact currentPath logic must be preserved
      if (redirectPath) {
        navigate(redirectPath);
      } else if (!isAuthPage) {
        if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
          navigate(currentPath);
        } else {
          navigate('/');
        }
      } else {
        navigate('/');
      }
      
      // Store user information in Redux
      dispatch(setUser(JSON.parse(JSON.stringify(user))));
    } else {
      // User is not authenticated
      if (!currentPath.includes('/login') && !currentPath.includes('/signup') && 
          !currentPath.includes('/callback') && !currentPath.includes('/error')) {
        navigate('/login');
      }
      dispatch(clearUser());
    }
    handleAuthComplete();
  };

  const handleAuthError = (error) => {
    console.error("Auth error:", error);
    dispatch(clearUser());
    handleAuthComplete();
  };

  const handleAuthComplete = () => {
    setAuthInitialized(true); // Local loading state
    dispatch(setInitialized(true)); // Redux state for route guards
  };

  const logout = async () => {
    try {
      dispatch(clearUser());
      navigate("/login");
      await window.ApperSDK?.ApperUI?.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Show loading spinner until auth is initialized
  if (!authInitialized) {
    return <LoadingSpinner />;
  }

  return (
    <AuthContext.Provider value={{ logout, isInitialized: authInitialized }}>
      <div id="authentication" className="hidden"></div>
      <Outlet />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </AuthContext.Provider>
  );
}