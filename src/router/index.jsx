import React, { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { getRouteConfig } from "./route.utils";

// Layouts
import Root from "@/layouts/Root";
import Layout from "@/components/Layout";

// Lazy-loaded pages
const Dashboard = lazy(() => import("@/components/pages/Dashboard"));
const Transactions = lazy(() => import("@/components/pages/Transactions"));
const Budget = lazy(() => import("@/components/pages/Budget"));
const Goals = lazy(() => import("@/components/pages/Goals"));
const Reports = lazy(() => import("@/components/pages/Reports"));
const Login = lazy(() => import("@/pages/Login"));
const Signup = lazy(() => import("@/pages/Signup"));
const Callback = lazy(() => import("@/pages/Callback"));
const ErrorPage = lazy(() => import("@/pages/ErrorPage"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const PromptPassword = lazy(() => import("@/pages/PromptPassword"));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      <p className="mt-4 text-slate-600">Loading...</p>
    </div>
  </div>
);

// Helper to create route with config
const createRoute = ({ path, index, element, access, children, ...meta }) => {
  let configPath;
  if (index) {
    configPath = "/";
  } else {
    configPath = path.startsWith('/') ? path : `/${path}`;
  }

  const config = getRouteConfig(configPath);
  const finalAccess = access || config?.allow;

  const route = {
    ...(index ? { index: true } : { path }),
    element: element ? (
      <Suspense fallback={<LoadingFallback />}>{element}</Suspense>
    ) : element,
    handle: {
      access: finalAccess,
      ...meta,
    },
  };

  if (children && children.length > 0) {
    route.children = children;
  }

  return route;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Layout />,
        children: [
          createRoute({
            index: true,
            element: <Dashboard />,
          }),
          createRoute({
            path: "transactions",
            element: <Transactions />,
          }),
          createRoute({
            path: "budget",
            element: <Budget />,
          }),
          createRoute({
            path: "goals",
            element: <Goals />,
          }),
          createRoute({
            path: "reports",
            element: <Reports />,
          }),
        ],
      },
      createRoute({
        path: "login",
        element: <Login />,
      }),
      createRoute({
        path: "signup",
        element: <Signup />,
      }),
      createRoute({
        path: "callback",
        element: <Callback />,
      }),
      createRoute({
        path: "error",
        element: <ErrorPage />,
      }),
      createRoute({
        path: "reset-password/:appId/:fields",
        element: <ResetPassword />,
      }),
      createRoute({
        path: "prompt-password/:appId/:emailAddress/:provider",
        element: <PromptPassword />,
      }),
    ],
  },
]);