from sqlalchemy import Column, String, Integer, Numeric, Text, ForeignKey
from database import Base
from sqlalchemy.orm import relationship

class Company(Base):
    __tablename__ = "companies"
    id = Column(Integer, primary_key=True, index=True)
    nit = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    address = Column(String)
    phone = Column(String)

    products = relationship("Product", back_populates="company")

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    characteristics = Column(Text)
    price_usd = Column(Numeric(10, 2), nullable=False)
    price_eur = Column(Numeric(10, 2), nullable=False)
    price_cop = Column(Numeric(10, 2), nullable=False)
    id_company = Column(Integer, ForeignKey("companies.id"))

    company = relationship("Company", back_populates="products")