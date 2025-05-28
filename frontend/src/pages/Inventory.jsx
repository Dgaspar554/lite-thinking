import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/organisms/card";
import { Input } from "../components/atoms/input";
import { Button } from "../components/atoms/button";
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

import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";

const Inventory = () => {
  const { companies, products } = useData();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [emailInput, setEmailInput] = useState("");

  const filteredProducts = products.filter(
    (product) =>
      (selectedCompany === "all" || product.id_company == selectedCompany) &&
      (product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.characteristics.toLowerCase().includes(search.toLowerCase()))
  );

  const productsByCompany = products.reduce((acc, product) => {
    const companyName =
      companies.find((c) => c.nit === product.companyNit)?.name ||
      "Sin Empresa";
    if (!acc[companyName]) {
      acc[companyName] = [];
    }
    acc[companyName].push(product);
    return acc;
  }, {});

  const handleGeneratePDF = (save = true) => {
    try {
      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text("Reporte de Inventario", 14, 22);
      doc.setFontSize(11);
      doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 32);

      if (selectedCompany !== "all") {
        const company = companies.find((c) => c.id === selectedCompany);
        if (company) {
          doc.text(`Empresa: ${company.name} (NIT: ${company.nit})`, 14, 38);
        }
      }

      const headers = [
        "Código",
        "Nombre",
        "Empresa",
        "Características",
        "Precio (USD)",
      ];

      const data = filteredProducts.map((product) => [
        product.id,
        product.name,
        product.company_name,
        product.characteristics,
        `$${product.price.usd.toFixed(2)}`,
      ]);

      autoTable(doc, {
        head: [headers],
        body: data,
        startY: 45,
        theme: "grid",
        styles: {
          fontSize: 9,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: 255,
          fontStyle: "bold",
        },
      });

      if (save) {
        const filename = `inventario_${new Date()
          .toISOString()
          .slice(0, 10)}.pdf`;
        doc.save(filename);

        toast({
          title: "PDF generado",
          description: `El archivo ${filename} ha sido generado correctamente`,
        });
      } else {
        return doc.output("blob");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Ha ocurrido un error al generar el PDF",
        variant: "destructive",
      });
    }
  };

  const handleSendEmail = async () => {
    if (!emailInput || !emailInput.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast({
        title: "Error",
        description: "Por favor ingresa un correo electrónico válido",
        variant: "destructive",
      });
      return;
    }

    const pdfBlob = handleGeneratePDF(false);
    if (!pdfBlob) return;

    const formData = new FormData();
    formData.append("email", emailInput);
    formData.append(
      "pdf",
      new File([pdfBlob], "inventario.pdf", { type: "application/pdf" })
    );

    try {
      const response = await fetch(
        import.meta.env.VITE_URL_BASE + "send-email/",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast({
          title: "Correo enviado",
          description: `El reporte ha sido enviado a ${emailInput}`,
        });
        setEmailInput("");
      } else {
        toast({
          title: "Error",
          description: data.detail || "Error al enviar el correo",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo conectar con el servidor",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Inventario</h1>
        <p className="text-muted-foreground">
          Gestión y visualización del inventario
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar por nombre o características..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="border rounded p-2"
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
          >
            <option value="all">Todas las empresas</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Productos en Inventario</CardTitle>
            <CardDescription>
              Total: {filteredProducts.length} productos
            </CardDescription>
          </div>
          <Button
            onClick={handleGeneratePDF}
            className="bg-inventario-600 hover:bg-inventario-700"
          >
            Descargar PDF
          </Button>
        </CardHeader>
        <CardContent>
          {filteredProducts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Características</TableHead>
                  <TableHead>Precio (USD)</TableHead>
                  <TableHead>Precio (EUR)</TableHead>
                  <TableHead>Precio (COP)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  return (
                    <TableRow key={product.id}>
                      <TableCell>{product.id}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.company_name}</TableCell>
                      <TableCell>{product.characteristics}</TableCell>
                      <TableCell>${product.price.usd.toFixed(2)}</TableCell>
                      <TableCell>€{product.price.eur.toFixed(2)}</TableCell>
                      <TableCell>
                        ${product.price.cop.toLocaleString("es-CO")}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No hay productos que coincidan con los filtros
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Enviar Inventario por Email</CardTitle>
          <CardDescription>
            Ingresa un correo electrónico para enviar el reporte
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="correo@ejemplo.com"
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={handleSendEmail}
            className="bg-inventario-600 hover:bg-inventario-700"
          >
            Enviar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Inventory;
