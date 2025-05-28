import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/organisms/card";
import { Button } from "../components/atoms/button";
import { useUser } from "../app/contexts/UserContext";
import { useData } from "../app/contexts/DataContext";

const Index = () => {
  const { user } = useUser();
  const { companies, products } = useData();
  const navigate = useNavigate();

  const totalCompanies = companies.length;
  const totalProducts = products.length;
  const averageProductsPerCompany =
    totalCompanies > 0 ? (totalProducts / totalCompanies).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-inventario-800">
          Sistema de Gestión de Inventario
        </h1>
        <p className="text-muted-foreground mt-2">
          Gestiona empresas y productos de manera eficiente
        </p>
      </div>

      {!user ? (
        <Card>
          <CardHeader>
            <CardTitle>Bienvenido</CardTitle>
            <CardDescription>
              Por favor inicia sesión para acceder a todas las funciones del
              sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button
              onClick={() => navigate("/login")}
              className="bg-inventario-600 hover:bg-inventario-700"
            >
              Iniciar Sesión
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{totalCompanies}</CardTitle>
                <CardDescription>Empresas Registradas</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="ghost"
                  className="w-full justify-start p-0 hover:bg-transparent hover:underline text-inventario-600"
                  onClick={() =>
                    user.role === "admin"
                      ? navigate("/companies")
                      : navigate("/companies-view")
                  }
                >
                  {user.role === "admin"
                    ? "Gestionar empresas"
                    : "Ver empresas"}{" "}
                  →
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{totalProducts}</CardTitle>
                <CardDescription>Productos en Inventario</CardDescription>
              </CardHeader>
              <CardContent>
                {user.role === "admin" && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start p-0 hover:bg-transparent hover:underline text-inventario-600"
                    onClick={() => navigate("/products")}
                  >
                    Gestionar productos →
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">
                  {averageProductsPerCompany}
                </CardTitle>
                <CardDescription>
                  Promedio de productos por empresa
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user.role === "admin" && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start p-0 hover:bg-transparent hover:underline text-inventario-600"
                    onClick={() => navigate("/inventory")}
                  >
                    Ver inventario →
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="overflow-hidden">
            <CardHeader className="bg-inventario-50 border-b">
              <CardTitle>Acceso Rápido</CardTitle>
              <CardDescription>
                Accede a las principales funciones del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {user.role === "admin" && (
                  <>
                    <Button
                      variant="outline"
                      className="h-auto text-left flex flex-col items-start p-4 gap-1"
                      onClick={() => navigate("/companies")}
                    >
                      <span className="font-medium">Gestionar Empresas</span>
                      <span className="text-xs text-muted-foreground">
                        Añadir, editar o eliminar empresas
                      </span>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-auto text-left flex flex-col items-start p-4 gap-1"
                      onClick={() => navigate("/products")}
                    >
                      <span className="font-medium">Gestionar Productos</span>
                      <span className="text-xs text-muted-foreground">
                        Añadir, editar o eliminar productos
                      </span>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-auto text-left flex flex-col items-start p-4 gap-1"
                      onClick={() => navigate("/inventory")}
                    >
                      <span className="font-medium">Inventario</span>
                      <span className="text-xs text-muted-foreground">
                        Ver y exportar inventario a PDF
                      </span>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-auto text-left flex flex-col items-start p-4 gap-1"
                      onClick={() => navigate("/ai-recommendations")}
                    >
                      <span className="font-medium">Recomendaciones IA</span>
                      <span className="text-xs text-muted-foreground">
                        Sugerencias de productos basadas en IA
                      </span>
                    </Button>
                  </>
                )}

                {user.role === "external" && (
                  <>
                    <Button
                      variant="outline"
                      className="h-auto text-left flex flex-col items-start p-4 gap-1"
                      onClick={() => navigate("/companies-view")}
                    >
                      <span className="font-medium">Ver Empresas</span>
                      <span className="text-xs text-muted-foreground">
                        Navegar por el directorio de empresas
                      </span>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-auto text-left flex flex-col items-start p-4 gap-1"
                      onClick={() => navigate("/inventory")}
                    >
                      <span className="font-medium">Inventario</span>
                      <span className="text-xs text-muted-foreground">
                        Ver y exportar inventario a PDF
                      </span>
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Index;
