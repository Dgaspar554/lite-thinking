from fastapi import FastAPI, UploadFile, Form
from fastapi.responses import JSONResponse
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Depends
from sqlalchemy.orm import Session
import models, schemas, crud
from database import SessionLocal, engine, Base
import os

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:8080",  
    "http://localhost:5173",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/send-email/")
async def send_email_with_pdf(
    email: str = Form(...),
    pdf: UploadFile = Form(...)
):
    try:
        
        file_bytes = await pdf.read()

        message = EmailMessage()
        message["Subject"] = "📄 Archivo PDF de productos"
        message["From"] = os.getenv("SMTP_USER")
        message["To"] = email
        message.set_content("Adjunto encontrarás el archivo PDF con la información de productos y empresas.")

        
        message.add_attachment(
            file_bytes,
            maintype="application",
            subtype="pdf",
            filename=pdf.filename
        )

        
        with smtplib.SMTP(os.getenv("SMTP_HOST"), int(os.getenv("SMTP_PORT"))) as smtp:
            smtp.starttls()
            smtp.login(os.getenv("SMTP_USER"), os.getenv("SMTP_PASS"))
            smtp.send_message(message)

        return JSONResponse(content={"message": "Correo enviado correctamente."})

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# -------------------- COMPANIES --------------------

@app.get("/getCompanies")
def get_companies(db: Session = Depends(get_db)):
    return crud.get_companies(db)

@app.post("/postCompanies")
def post_company(company: schemas.CompanyCreate, db: Session = Depends(get_db)):
    return crud.create_company(db, company)

@app.put("/putCompanies/{id}")
def put_company(id: int, company: schemas.CompanyUpdate, db: Session = Depends(get_db)):
    return crud.update_company(db, id, company)

@app.delete("/deleteCompanies/{id}")
def delete_company(id: int, db: Session = Depends(get_db)):
    success = crud.delete_company(db, id)
    return {"deleted": success}

# -------------------- PRODUCTS --------------------

@app.get("/getProducts", response_model=list[schemas.ProductOut])
def get_products(db: Session = Depends(get_db)):
    return crud.get_products(db)

@app.post("/postProducts")
def post_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    return crud.create_product(db, product)

@app.put("/putProducts/{id}")
def put_product(id: int, product: schemas.ProductUpdate, db: Session = Depends(get_db)):
    return crud.update_product(db, id, product)

@app.delete("/deleteProducts/{id}")
def delete_product(id: int, db: Session = Depends(get_db)):
    success = crud.delete_product(db, id)
    return {"deleted": success}
