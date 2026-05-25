from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import UserLogin
from database import SessionLocal, engine
from database_models import User
import database_models
import requests
from sqlalchemy.orm import Session

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


base_url = "https://pokeapi.co/api/v2/"

#with this it will autocreate a login table if not already there, cool isnt it?
database_models.Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/login")
def user_login(credentials: UserLogin, db: Session = Depends(get_db)):
    # pokemonuser is the database name in postgres.
    user = db.query(User).filter(User.username == credentials.username).first()

    if not user:
        print("Pls signup dear Pokemonster!!")
        return {"error":"User Not Found"}
    
    #validate password
    if credentials.password != user.password:
        return {"error":'Incorrect Credentials'}
    
    #if code block reaches here means password is correct and validated from the pokemonuser database
    return {"message":"Login Successful"}

@app.post("/signup")
def user_signup(credentials: UserLogin, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.username == credentials.username).first()

    if user:
        return {"message":"user already exists"}
    
    new_user = User(**credentials.model_dump())
    db.add(new_user)
    db.commit()
    return {"message":{"user created successfully"}}



@app.get("/pokemon")
def get_pokemon_info(name: str):
    try:

        url = f"{base_url}/pokemon/{name}"
        response = requests.get(url)
        return response.json()
    
    except requests.exceptions.RequestException as e:

        return {"error":str(e)}
    

