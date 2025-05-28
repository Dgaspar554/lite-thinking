import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../atoms/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarProvider,
} from "../organisms/sidebar";
import { useToast } from "../organisms/use-toast";

const AdminMenu = () => (
  <>
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link to="/">
          <span>Dashboard</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link to="/companies">
          <span>Empresas</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link to="/products">
          <span>Productos</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link to="/inventory">
          <span>Inventario</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link to="/ai-recommendations">
          <span>Recomendaciones IA</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </>
);

const ExternalMenu = () => (
  <>
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link to="/">
          <span>Dashboard</span>
        </Link>
      </SidebarMenuButton>
      <SidebarMenuButton asChild>
        <Link to="/companies-view">
          <span>Ver Empresas</span>
        </Link>
      </SidebarMenuButton>
      <SidebarMenuButton asChild>
        <Link to="/inventory">
          <span>Inventario</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </>
);

export default function Layout({ children, user, onLogout }) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    onLogout();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    });
    navigate("/login");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="h-screen">
          <SidebarContent>
            <div className="p-4 border-b">
              <h1 className="text-xl font-bold text-inventario-700">
                Inventario System
              </h1>
              <p className="text-sm text-muted-foreground">
                {user ? `${user.email} (${user.role})` : "No autenticado"}
              </p>
            </div>
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {user?.role === "admin" && <AdminMenu />}
                  {user?.role === "external" && <ExternalMenu />}
                  {!user && (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link to="/login">
                          <span>Iniciar sesión</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            {user && (
              <div className="mt-auto p-4 border-t">
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full"
                >
                  Cerrar sesión
                </Button>
              </div>
            )}
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 p-6">
          <SidebarTrigger className="mb-4" />
          <main>{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
