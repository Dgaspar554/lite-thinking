# lite-thinking

Este proyecto está compuesto por dos partes: un **backend** construido con FastAPI y un **frontend** desarrollado con tecnologías JavaScript.

## Requisitos Previos

- Python 3.8+
- Node.js y npm

---

## 🔧 Backend (FastAPI)

Ubicación: `backend/fastapi-pdf-mailer`

### Pasos para ejecutar:

1. Entrar a la carpeta del backend:

   ```bash
   cd backend/fastapi-pdf-mailer
   ```

2. Crear un entorno virtual:

   ```bash
   python -m venv venv
   ```

3. Activar el entorno virtual:

   - En **Windows**:

     ```bash
     venv\Scripts\activate
     ```

   - En **Linux/macOS**:

     ```bash
     source venv/bin/activate
     ```

4. Instalar las dependencias:

   ```bash
   pip install -r requirements.txt
   ```

5. Ejecutar el servidor:

   ```bash
   uvicorn main:app --reload
   ```

---

## 🌐 Frontend

Ubicación: `frontend/lite-thinking`

### Pasos para ejecutar:

1. Entrar a la carpeta del frontend:

   ```bash
   cd frontend/lite-thinking
   ```

2. Instalar las dependencias:

   ```bash
   npm install --legacy-peer-deps
   ```

3. Iniciar la aplicación:

   ```bash
   npm run dev
   ```

---

## 📂 Estructura del proyecto

```
lite-thinking/
├── backend/
│   └── fastapi-pdf-mailer/
│       ├── main.py
│       ├── requirements.txt
│       └── ...
├── frontend/
│   └── lite-thinking/
│       ├── package.json
│       ├── src/
│       └── ...
└── README.md
```

---

## 📝 Notas

- Asegúrate de tener instaladas las versiones adecuadas de Python y Node.js.
- Usa entornos virtuales para evitar conflictos de dependencias.
- Si estás en Windows y tienes problemas al activar el entorno, intenta ejecutar la terminal como administrador.

---
