from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
import uvicorn
import os
from fastapi import Cookie
import jwt
import time
from total import main_total
app = FastAPI()

# Static files and templates
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Password hashing
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    # allow_origins=["http://127.0.0.1:8000","http://127.0.0.2:5501"],  # Adjust origins for production
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock database for storing users
USERS = {
    "admin@gmail.com": pwd_context.hash("admin")  # Example admin user
}

# Routes
@app.get("/", response_class=HTMLResponse)
async def login_page(request: Request):
    """Serve the login page."""
    return templates.TemplateResponse("login.html", {"request": request})

@app.get("/signup", response_class=HTMLResponse)
async def signup_page(request: Request):
    """Serve the sign-up page."""
    return templates.TemplateResponse("signup.html", {"request": request})

@app.post("/api/signup", response_class=JSONResponse)
async def signup(request: Request):
    """Handle user sign-up."""
    data = await request.json()
    email = data.get("email")
    password = data.get("password")

    # Input validation
    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required.")
    if len(password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters long.")
    if email in USERS:
        raise HTTPException(status_code=400, detail="Email is already registered.")

    # Hash password and store user
    hashed_password = pwd_context.hash(password)
    USERS[email] = hashed_password
    return JSONResponse(content={"message": "User registered successfully."})

@app.post("/api/login", response_class=JSONResponse)
async def login(request: Request):
    """Handle user login."""
    data = await request.json()
    email = data.get("email")
    password = data.get("password")

    if email in USERS and pwd_context.verify(password, USERS[email]):
        # Placeholder for JWT token generation (replace with actual logic)
        token = "secure_jwt_token_example"
        response = JSONResponse(content={"redirect_url": "/logged", "token": token})
        response.set_cookie(
            key="token",
            value=token,
            httponly=True,
            secure=False,  # Use True in production with HTTPS
            samesite="Lax"
        )
        return response

    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/logged", response_class=HTMLResponse)
async def logged_page(request: Request, token: str = Cookie(None)):
    """Serve the logged-in page only if the user is authenticated."""
    if not token or token != "secure_jwt_token_example":  # Replace with actual token validation
        return templates.TemplateResponse("login.html", {"request": request, "error": "Unauthorized access."})
    return templates.TemplateResponse("index.html", {"request": request})




@app.post("/send-text/", response_class=JSONResponse)
async def send_text(request: Request):
    """Receive and process a text payload."""
    
    data = await request.json()
    text = data.get("text", "")
    title=text
    # a="In the Mahabharata war, whom did Duryodhana first talk to?"
    content=main_total(text)
    # time.sleep(5)
    return JSONResponse(content={
        # "translation": f"Received text: {text}",
        # "translation":translation,
        # "sanskrit": sans,
        # "chapter": chapter,
        # "verse": verse,
        # "answer": answer,
        "title":title,
        "content":content
    })

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
