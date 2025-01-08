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
import sqlite3
from typing import Dict
import uvicorn
# from total import main_total
app = FastAPI()
# Static files and templates
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["127.0.0.2:8001"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", response_class=HTMLResponse)
async def login_page(request: Request):
    """Serve the login page."""
    return templates.TemplateResponse("index.html", {"request": request})

# Helper function to get a database connection
def get_db_connection():
    conn = sqlite3.connect("chat.db")
    conn.row_factory = sqlite3.Row  # Makes rows accessible as dictionaries
    return conn

# Create a new chat and return its ID
@app.post("/new_chat/")
async def create_new_chat():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO chats DEFAULT VALUES")  # Insert a new row in the `chats` table
    conn.commit()
    chat_id = cursor.lastrowid
    conn.close()
    return {"chat_id": chat_id}

@app.post("/add_message/{chat_id}/")
async def add_message(chat_id: int, message: Dict[str, str]):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if the chat ID exists
    chat = cursor.execute("SELECT * FROM chats WHERE id = ?", (chat_id,)).fetchone()
    if not chat:
        conn.close()
        raise HTTPException(status_code=404, detail="Chat ID not found")

    # Insert the message
    question = message.get("question")
    answer =  message.get("question")

    if not question or not answer:
        conn.close()
        raise HTTPException(status_code=400, detail="Both 'question' and 'answer' are required")

    cursor.execute(
        "INSERT INTO messages (chat_id, question, answer) VALUES (?, ?, ?)",
        (chat_id, question, answer),
    )
    conn.commit()
    conn.close()
    return {"status": "Message added successfully"}

@app.get("/recents/")
async def get_recents():
    conn = get_db_connection()
    query = """
        SELECT chats.id AS chat_id, chats.created_at, 
               messages.question, messages.answer
        FROM chats
        LEFT JOIN messages ON chats.id = messages.chat_id
        ORDER BY chats.id DESC
    """
    result = conn.execute(query).fetchall()
    conn.close()

    # Grouping messages under each chat
    chats = {}
    for row in result:
        chat_id = row["chat_id"]
        if chat_id not in chats:
            chats[chat_id] = {
                "chat_id": chat_id,
                "created_at": row["created_at"],
                "messages": []
            }
        chats[chat_id]["messages"].append({
            "question": row["question"],
            "answer": row["answer"]
        })

    # Convert chats dict to a list for the response
    return {"chats": list(chats.values())}

# Retrieve all messages for a specific chat
@app.get("/get_chat_messages/{chat_id}/")
async def get_chat_messages(chat_id: int):
    conn = get_db_connection()
    messages = conn.execute(
        "SELECT question, answer FROM messages WHERE chat_id = ? ORDER BY id", (chat_id,)
    ).fetchall()
    conn.close()
    return {"messages": [dict(message) for message in messages]}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
