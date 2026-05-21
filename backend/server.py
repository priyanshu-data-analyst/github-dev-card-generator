from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "GitHub Card Backend Running"}

@app.get("/github/{username}")
def get_github_user(username: str):

    url = f"https://api.github.com/users/{username}"

    response = requests.get(url)

    if response.status_code != 200:
        return {"error": "User not found"}

    data = response.json()

    return {
        "name": data.get("name"),
        "username": data.get("login"),
        "bio": data.get("bio"),
        "avatar": data.get("avatar_url"),
        "followers": data.get("followers"),
        "public_repos": data.get("public_repos"),
        "profile_url": data.get("html_url")
    }
@app.get("/repos/{username}")
def get_repositories(username: str):

    url = f"https://api.github.com/users/{username}/repos"

    response = requests.get(url)

    if response.status_code != 200:
        return {"error": "Repositories not found"}

    return response.json()