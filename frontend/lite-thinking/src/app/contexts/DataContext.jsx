import React, { createContext, useState, useContext, useEffect } from "react";

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

  useEffect(() => {
    const savedCompanies = localStorage.getItem("companies");
    const savedProducts = localStorage.getItem("products");

    if (savedCompanies) {
      setCompanies(JSON.parse(savedCompanies));
    } else {
      setCompanies(initialCompanies);
    }

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(initialProducts);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("companies", JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const addCompany = (company) => {
    setCompanies([...companies, company]);
  };

  const updateCompany = (company) => {
    setCompanies(companies.map((c) => (c.nit === company.nit ? company : c)));
    const oldCompany = companies.find((c) => c.nit === company.nit);
    if (oldCompany && oldCompany.name !== company.name) {
      setProducts(
        products.map((p) =>
          p.companyNit === company.nit ? { ...p, companyName: company.name } : p
        )
      );
    }
  };

  const deleteCompany = (nit) => {
    setCompanies(companies.filter((c) => c.nit !== nit));
    setProducts(products.filter((p) => p.companyNit !== nit));
  };

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      companyName: companies.find((c) => c.nit === product.companyNit)?.name,
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (product) => {
    setProducts(
      products.map((p) =>
        p.id === product.id
          ? {
              ...product,
              companyName: companies.find((c) => c.nit === product.companyNit)
                ?.name,
            }
          : p
      )
    );
  };

  const deleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
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
