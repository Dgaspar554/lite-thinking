from sqlalchemy.orm import Session
from models import Company, Product
from sqlalchemy.orm import joinedload
import schemas

# Companies
def get_companies(db: Session):
    return db.query(Company).all()

def create_company(db: Session, company: schemas.CompanyCreate):
    db_company = Company(**company.dict())
    db.add(db_company)
    db.commit()
    db.refresh(db_company)
    return db_company

def update_company(db: Session, id: int, company: schemas.CompanyUpdate):
    db_company = db.query(Company).filter(Company.id == id).first()
    if db_company:
        for key, value in company.dict().items():
            setattr(db_company, key, value)
        db.commit()
        return db_company
    return None

def delete_company(db: Session, id: str):
    db_company = db.query(Company).filter(Company.id == id).first()
    if db_company:
        # Eliminar los productos asociados a la empresa
        db.query(Product).filter(Product.id_company == id).delete()

        # Luego eliminar la empresa
        db.delete(db_company)
        db.commit()
        return True
    return False


# Products
def get_products(db: Session):
    products = db.query(Product).options(joinedload(Product.company)).all()
    result = []
    for product in products:
        result.append({
            "id": product.id,
            "name": product.name,
            "characteristics": product.characteristics,
            "price": {
                "usd": product.price_usd,
                "eur": product.price_eur,
                "cop": product.price_cop
            },
            "company_name": product.company.name if product.company else None,
            "id_company": product.id_company
        })
    return result


def create_product(db: Session, product: schemas.ProductCreate):
    db_product = Product(
        name=product.name,
        characteristics=product.characteristics,
        id_company=product.id_company,
        price_usd=product.price.usd,
        price_eur=product.price.eur,
        price_cop=product.price.cop,
    )


    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product(db: Session, id: int, product: schemas.ProductUpdate):
    db_product = db.query(Product).filter(Product.id == id).first()
    if not db_product:
        return None

    db_product.name = product.name
    db_product.characteristics = product.characteristics
    db_product.id_company = product.id_company
    db_product.price_usd = product.price.usd
    db_product.price_eur = product.price.eur
    db_product.price_cop = product.price.cop

    db.commit()
    db.refresh(db_product)
    return db_product


def delete_product(db: Session, id: int):
    db_product = db.query(Product).filter(Product.id == id).first()
    if db_product:
        db.delete(db_product)
        db.commit()
        return True
    return False