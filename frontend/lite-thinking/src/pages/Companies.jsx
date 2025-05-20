import { useEffect, useState } from "react";
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

const Companies = () => {
  const { companies, addCompany, updateCompany, deleteCompany } = useData();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nit: "",
    name: "",
    address: "",
    phone: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.nit ||
      !formData.name ||
      !formData.address ||
      !formData.phone
    ) {
      toast({
        title: "Error de validación",
        description: "Todos los campos son obligatorios",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isEditing) {
        updateCompany(formData);
        toast({
          title: "Empresa actualizada",
          description: `${formData.name} ha sido actualizada correctamente`,
        });
      } else {
        if (companies.some((company) => company.nit === formData.nit)) {
          toast({
            title: "Error",
            description: "Ya existe una empresa con este NIT",
            variant: "destructive",
          });
          return;
        }

        addCompany(formData);
        toast({
          title: "Empresa agregada",
          description: `${formData.name} ha sido agregada correctamente`,
        });
      }

      setFormData({
        nit: "",
        name: "",
        address: "",
        phone: "",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Ha ocurrido un error al guardar la empresa",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (company) => {
    setFormData(company);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (
      confirm(
        "¿Estás seguro de eliminar esta empresa? También se eliminarán todos sus productos."
      )
    ) {
      deleteCompany(id);
      toast({
        title: "Empresa eliminada",
        description: "La empresa ha sido eliminada correctamente",
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      nit: "",
      name: "",
      address: "",
      phone: "",
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Gestión de Empresas</h1>
        <p className="text-muted-foreground">
          Registro y administración de empresas
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? "Editar Empresa" : "Registrar Nueva Empresa"}
          </CardTitle>
          <CardDescription>Ingresa los datos de la empresa</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nit">NIT</Label>
                <Input
                  id="nit"
                  name="nit"
                  value={formData.nit}
                  onChange={handleChange}
                  disabled={isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la empresa</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
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
          <CardTitle>Empresas Registradas</CardTitle>
          <CardDescription>
            Listado de todas las empresas en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {companies.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NIT</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company) => (
                  <TableRow key={company.nit}>
                    <TableCell>{company.nit}</TableCell>
                    <TableCell>{company.name}</TableCell>
                    <TableCell>{company.address}</TableCell>
                    <TableCell>{company.phone}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(company)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(company.id)}
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No hay empresas registradas
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Companies;
