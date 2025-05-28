from pydantic import BaseModel
from typing import Optional

class CompanyBase(BaseModel):
    nit: str
    name: str
    address: Optional[str] = None
    phone: Optional[str] = None

class CompanyCreate(CompanyBase):
    pass

class CompanyUpdate(CompanyBase):
    pass

class Price(BaseModel):
    usd: float
    eur: float
    cop: float

class ProductOut(BaseModel):
    id: int
    name: str
    id_company: int
    company_name: str 
    characteristics: str
    price: Price

class ProductBase(BaseModel):
    name: str
    characteristics: Optional[str] = None
    price_usd: Optional[float] = None
    price_eur: Optional[float] = None
    price_cop: Optional[float] = None
    id_company: int

class ProductCreate(BaseModel):
    name: str
    characteristics: Optional[str] = None
    price: Price
    id_company: int


class ProductUpdate(ProductCreate):
    pass