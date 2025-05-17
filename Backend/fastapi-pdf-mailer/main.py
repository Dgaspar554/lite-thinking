from fastapi import FastAPI, UploadFile, Form
from fastapi.responses import JSONResponse
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import os

load_dotenv()

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
