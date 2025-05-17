import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/organisms/card";
import { Input } from "../components/atoms/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/molecules/table";
import { useData } from "../app/contexts/DataContext";

const CompaniesView = () => {
  const { companies, products } = useData();
  const [search, setSearch] = useState("");

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(search.toLowerCase()) ||
      company.address.toLowerCase().includes(search.toLowerCase())
  );

  const productCount = companies.reduce((acc, company) => {
    acc[company.nit] = products.filter(
      (p) => p.companyNit === company.nit
    ).length;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Directorio de Empresas</h1>
        <p className="text-muted-foreground">
          Visualización de empresas registradas
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Buscar por nombre o dirección..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Empresas</CardTitle>
          <CardDescription>
            Total: {filteredCompanies.length} empresas registradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCompanies.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NIT</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Productos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.map((company) => (
                  <TableRow key={company.nit}>
                    <TableCell>{company.nit}</TableCell>
                    <TableCell>{company.name}</TableCell>
                    <TableCell>{company.address}</TableCell>
                    <TableCell>{company.phone}</TableCell>
                    <TableCell>{productCount[company.nit] || 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No hay empresas que coincidan con los filtros
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompaniesView;
