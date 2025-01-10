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
from total import main_total
import sqlite3
app = FastAPI()
# Static files and templates
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["127.0.0.2:8001","127.0.0.5001","https://ce78-2409-4072-985-396-4d2e-8bb7-82e0-a45.ngrok-free.app/","https://ac74-210-212-229-229.ngrok-free.app/","https://06d0-210-212-229-229.ngrok-free.app/","https://804a-2409-4072-985-396-7521-e8ca-cfcf-f6ff.ngrok-free.app","https://f743-210-212-229-229.ngrok-free.app/"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
def create_tables():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Create `chats` table if it doesn't exist
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS chats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Create `messages` table if it doesn't exist
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            chat_id INTEGER,
            question TEXT,
            answer TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (chat_id) REFERENCES chats(id)
        )
    """)

    conn.commit()
    conn.close()

def drop_all_tables():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Drop the `messages` table
    cursor.execute("DROP TABLE IF EXISTS messages")

    # Drop the `chats` table
    cursor.execute("DROP TABLE IF EXISTS chats")

    conn.commit()
    conn.close()
    print("All tables have been dropped from the database.")

@app.get("/", response_class=HTMLResponse)
async def login_page(request: Request):
    """Serve the login page."""
    drop_all_tables()
    create_tables()
    return templates.TemplateResponse("index.html", {"request": request})

# Helper function to get a database connection
def get_db_connection():
    conn = sqlite3.connect("chat.db")
    conn.row_factory = sqlite3.Row  # Makes rows accessible as dictionaries
    return conn
def feedback_loop(q,a):
  if (q=="")and(a==""):
      return ""
  else:
    print("entering feedback loop")
    question =q
    answer = a
    loop_template = f" This the previous question asked by the user :\n {question}\n\  answer:\n0{answer}\n.\n If the it is useful make use of it ,it is helpful in know the state of the user what they try to ask.\n"
    return loop_template

def get_chats(chat_id):
    conn = get_db_connection()
    messages = conn.execute(
        "SELECT question, answer,created_at FROM messages WHERE chat_id = ? ORDER BY id", (chat_id,)
    ).fetchall()
    a = [dict(message) for message in messages]

    # Invalid answer to skip
    invalid_answer = "This Question not directly related to Bhagavad Gita or Pantanjali yoga sutra"

    # Initialize defaults
    question = ""
    answer = ""

    # Iterate backward to find a valid entry
    for entry in reversed(a):
        if entry.get('question') and entry.get('answer') and entry['answer'] != invalid_answer:
            question = entry['question']
            answer = entry['answer']
            break

    # Debugging output
    # print("33333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333")
    # print("last question", question)
    # print("last answer", answer)
    # print("33333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333")

    conn.close()
    return feedback_loop(question,answer)


def settingChatid(current_chat_id):
    # global last_chat_id
    return get_chats(current_chat_id)
    # last_chat_id = current_chat_id



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
    feedback=settingChatid(chat_id)  
    # print("8888888888888888888888888888888888888888888888888888888888888888888888888888888888888")
    # print(feedback)
    # print("8888888888888888888888888888888888888888888888888888888888888888888888888888888888888")
    question = message.get("question")
    # time.sleep(10)
    # answer =message.get("question")
    answer=main_total(question,feedback)
    # print(answer)

    if not question or not answer:
        conn.close()
        raise HTTPException(status_code=400, detail="Both 'question' and 'answer' are required")
    # if answer!="This Question not directly related to Bhagavad Gita or Pantanjali yoga sutra":
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


# last_chat_id = None


# Retrieve all messages for a specific chat
@app.get("/get_chat_messages/{chat_id}/")
async def get_chat_messages(chat_id: int):
    conn = get_db_connection()
    messages = conn.execute(
        "SELECT question, answer FROM messages WHERE chat_id = ? ORDER BY id", (chat_id,)
    ).fetchall()
    conn.close()
    settingChatid(chat_id)
    return {"messages": [dict(message) for message in messages]}

@app.delete("/delete_chat/{chat_id}/")
async def delete_chat(chat_id: int):
    conn = get_db_connection()
    try:
        # Start a transaction
        conn.execute("BEGIN")
        
        # Delete from the messages table
        conn.execute("DELETE FROM messages WHERE chat_id = ?", (chat_id,))
        
        # Delete from the chats table
        conn.execute("DELETE FROM chats WHERE id = ?", (chat_id,))
        
        # Commit the transaction
        conn.commit()
        conn.close()

        print(f"chat_id {chat_id} deleted successfully from both tables.")
        return {"message": f"chat_id {chat_id} deleted successfully from both tables."}

    except Exception as e:
        # Rollback the transaction in case of an error
        conn.rollback()
        conn.close()

        print(f"Error deleting chat_id {chat_id}: {e}")
        return {"error": f"Error deleting chat_id {chat_id}: {e}"}, 500


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
