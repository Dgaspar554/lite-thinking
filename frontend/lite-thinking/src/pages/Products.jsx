import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/organisms/card";
import { Input } from "../components/atoms/input";
import { Button } from "../components/atoms/button";
import { Label } from "../components/atoms/label";
import { Textarea } from "../components/atoms/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/molecules/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/molecules/table";
import { useToast } from "../components/organisms/use-toast";
import { useData } from "../app/contexts/DataContext";

const Products = () => {
  const { companies, products, addProduct, updateProduct, deleteProduct } =
    useData();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    characteristics: "",
    price: {
      usd: 0,
      eur: 0,
      cop: 0,
    },
    companyNit: "",
  });
  const [selectedCurrency, setSelectedCurrency] = useState("usd");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!formData.id) {
      setFormData((prev) => ({
        ...prev,
        id: Math.random().toString(36).substr(2, 9),
      }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCompanyChange = (value) => {
    setFormData({ ...formData, companyNit: value });
  };

  const handlePriceChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    const conversionRates = {
      usd: { eur: 0.92, cop: 4000 },
      eur: { usd: 1.09, cop: 4348 },
      cop: { usd: 0.00025, eur: 0.00023 },
    };

    let newPrice = { ...formData.price };

    newPrice[selectedCurrency] = value;

    if (selectedCurrency === "usd") {
      newPrice.eur = parseFloat((value * conversionRates.usd.eur).toFixed(2));
      newPrice.cop = parseFloat((value * conversionRates.usd.cop).toFixed(2));
    } else if (selectedCurrency === "eur") {
      newPrice.usd = parseFloat((value * conversionRates.eur.usd).toFixed(2));
      newPrice.cop = parseFloat((value * conversionRates.eur.cop).toFixed(2));
    } else if (selectedCurrency === "cop") {
      newPrice.usd = parseFloat((value * conversionRates.cop.usd).toFixed(2));
      newPrice.eur = parseFloat((value * conversionRates.cop.eur).toFixed(2));
    }

    setFormData({ ...formData, price: newPrice });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.characteristics || !formData.companyNit) {
      toast({
        title: "Error de validación",
        description: "Todos los campos son obligatorios",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isEditing) {
        updateProduct(formData);
        toast({
          title: "Producto actualizado",
          description: `${formData.name} ha sido actualizado correctamente`,
        });
      } else {
        const newProduct = {
          ...formData,
          id: Math.random().toString(36).substr(2, 9),
        };
        addProduct(newProduct);
        toast({
          title: "Producto agregado",
          description: `${formData.name} ha sido agregado correctamente`,
        });
      }

      setFormData({
        id: Math.random().toString(36).substr(2, 9),
        name: "",
        characteristics: "",
        price: {
          usd: 0,
          eur: 0,
          cop: 0,
        },
        companyNit: "",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Ha ocurrido un error al guardar el producto",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (product) => {
    setFormData(product);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      deleteProduct(id);
      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado correctamente",
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      id: Math.random().toString(36).substr(2, 9),
      name: "",
      characteristics: "",
      price: {
        usd: 0,
        eur: 0,
        cop: 0,
      },
      companyNit: "",
    });
    setIsEditing(false);
  };

  const formatCurrency = (value, currency) => {
    const formatter = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: currency.toUpperCase(),
    });

    return formatter.format(value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Gestión de Productos</h1>
        <p className="text-muted-foreground">
          Registro y administración de productos
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? "Editar Producto" : "Registrar Nuevo Producto"}
          </CardTitle>
          <CardDescription>Ingresa los datos del producto</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del producto</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyNit">Empresa</Label>
                <Select
                  value={formData.companyNit}
                  onValueChange={handleCompanyChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.nit} value={company.nit}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="characteristics">Características</Label>
                <Textarea
                  id="characteristics"
                  name="characteristics"
                  value={formData.characteristics}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Moneda</Label>
                <Select
                  value={selectedCurrency}
                  onValueChange={(value) => setSelectedCurrency(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar moneda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD (Dólares)</SelectItem>
                    <SelectItem value="eur">EUR (Euros)</SelectItem>
                    <SelectItem value="cop">COP (Pesos Colombianos)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Precio</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price[selectedCurrency]}
                  onChange={handlePriceChange}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              {isEditing && (
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              )}
              <Button
                type="submit"
                className="bg-inventario-600 hover:bg-inventario-700"
              >
                {isEditing ? "Actualizar" : "Guardar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Productos Registrados</CardTitle>
          <CardDescription>
            Listado de todos los productos en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {products.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Precio (USD)</TableHead>
                  <TableHead>Precio (EUR)</TableHead>
                  <TableHead>Precio (COP)</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => {
                  const company = companies.find(
                    (c) => c.nit === product.companyNit
                  );
                  return (
                    <TableRow key={product.id}>
                      <TableCell>{product.id}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>
                        {company ? company.name : "No asignada"}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(product.price.usd, "USD")}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(product.price.eur, "EUR")}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(product.price.cop, "COP")}
                      </TableCell>
                      <TableCell className="space-x-2">
                        <Button size="sm" onClick={() => handleEdit(product)}>
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(product.id)}
                        >
                          Eliminar
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <p>No hay productos registrados.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Products;
