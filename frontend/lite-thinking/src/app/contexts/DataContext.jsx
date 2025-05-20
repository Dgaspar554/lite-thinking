import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";

const initialCompanies = [
  {
    nit: "901234567",
    name: "Empresa ABC",
    address: "Calle 123 #45-67",
    phone: "601-1234567",
  },
  {
    nit: "900123456",
    name: "Soluciones XYZ",
    address: "Avenida 789 #12-34",
    phone: "601-7654321",
  },
];

const initialProducts = [
  {
    id: "1",
    name: "Laptop Dell XPS 13",
    characteristics: "Intel Core i7, 16GB RAM, 512GB SSD",
    price: {
      usd: 1200,
      eur: 1100,
      cop: 4800000,
    },
    companyNit: "901234567",
  },
  {
    id: "2",
    name: 'Monitor LG 27"',
    characteristics: "4K, UltraHD, IPS Panel",
    price: {
      usd: 350,
      eur: 320,
      cop: 1400000,
    },
    companyNit: "900123456",
  },
];

const DataContext = createContext(undefined);

export const DataProvider = ({ children }) => {
  const [companies, setCompanies] = useState([]);
  const [products, setProducts] = useState([]);

  const fetchCompanies = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_URL_BASE + "getCompanies",
        {
          method: "GET",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setCompanies(data);
      }
    } catch (error) {}
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_URL_BASE + "getProducts",
        {
          method: "GET",
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log(data);

        setProducts(data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchCompanies();
    fetchProducts();

    // const savedCompanies = localStorage.getItem("companies");
    // const savedProducts = localStorage.getItem("products");

    // if (savedCompanies) {
    //   setCompanies(JSON.parse(savedCompanies));
    // } else {
    //   setCompanies(initialCompanies);
    // }

    // if (savedProducts) {
    //   setProducts(JSON.parse(savedProducts));
    // } else {
    //   setProducts(initialProducts);
    // }
  }, []);

  useEffect(() => {
    localStorage.setItem("companies", JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const addCompany = async (company) => {
    try {
      const response = await fetch(
        import.meta.env.VITE_URL_BASE + "postCompanies",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(company),
        }
      );

      if (response.ok) {
        fetchCompanies();
      }
    } catch (error) {}
  };

  const updateCompany = async (company) => {
    try {
      const response = await fetch(
        import.meta.env.VITE_URL_BASE + "putCompanies/" + company.id,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(company),
        }
      );

      if (response.ok) {
        fetchCompanies();
      }
    } catch (error) {}
  };

  const deleteCompany = async (id) => {
    try {
      const response = await fetch(
        import.meta.env.VITE_URL_BASE + "deleteCompanies/" + id,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        fetchCompanies();
        fetchProducts();
      }
    } catch (error) {}
  };

  const addProduct = async (product) => {
    try {
      const response = await fetch(
        import.meta.env.VITE_URL_BASE + "postProducts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(product),
        }
      );

      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {}
  };

  const updateProduct = async (product) => {
    try {
      const response = await fetch(
        import.meta.env.VITE_URL_BASE + "putProducts/" + product.id,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(product),
        }
      );

      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {}
  };

  const deleteProduct = async (id) => {
    try {
      const response = await fetch(
        import.meta.env.VITE_URL_BASE + "deleteProducts/" + id,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {}
  };

  const getCompanyName = (nit) => {
    const company = companies.find((c) => c.nit === nit);
    return company ? company.name : undefined;
  };

  return (
    <DataContext.Provider
      value={{
        companies,
        products,
        addCompany,
        updateCompany,
        deleteCompany,
        addProduct,
        updateProduct,
        deleteProduct,
        getCompanyName,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
