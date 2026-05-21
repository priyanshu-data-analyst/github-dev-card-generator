from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

<<<<<<< HEAD:backend/server.py
# CORS
=======
# CORS FIX
>>>>>>> 80d532ede6b8ba34a05022f0f51b8dfcc86249f9:server.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# HOME ROUTE
@app.get("/")
def home():
    return {"message": "GitHub Card Backend Running"}

<<<<<<< HEAD:backend/server.py
# USER PROFILE
=======
# GITHUB USER API
>>>>>>> 80d532ede6b8ba34a05022f0f51b8dfcc86249f9:server.py
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

# REPOSITORIES
@app.get("/repos/{username}")
def get_repositories(username: str):

    url = f"https://api.github.com/users/{username}/repos"

    response = requests.get(url)

    if response.status_code != 200:
        return {"error": "Repositories not found"}

    return response.json()