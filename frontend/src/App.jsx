import { Toaster } from "./components/organisms/toaster";
import { Toaster as Sonner } from "./components/organisms/sonner";
import { TooltipProvider } from "./components/atoms/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "./app/contexts/UserContext";
import { DataProvider } from "./app/contexts/DataContext";

import Layout from "./components/templates/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Companies from "./pages/Companies";
import Products from "./pages/Products";
import Inventory from "./pages/Inventory";
import CompaniesView from "./pages/CompaniesView";
import AIRecommendations from "./pages/AIRecommendations";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AdminRoute = ({ children }) => {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AuthRoute = ({ children }) => {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
        <DataProvider>
          <MainApp />
        </DataProvider>
      </UserProvider>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

const MainApp = () => {
  const { user, logout } = useUser();

  return (
    <BrowserRouter>
      <Layout user={user} onLogout={logout}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/companies"
            element={
              <AdminRoute>
                <Companies />
              </AdminRoute>
            }
          />
          <Route
            path="/products"
            element={
              <AdminRoute>
                <Products />
              </AdminRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <AuthRoute>
                <Inventory />
              </AuthRoute>
            }
          />
          <Route
            path="/ai-recommendations"
            element={
              <AdminRoute>
                <AIRecommendations />
              </AdminRoute>
            }
          />

          <Route
            path="/companies-view"
            element={
              <AuthRoute>
                <CompaniesView />
              </AuthRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
