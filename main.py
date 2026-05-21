from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

# CORS
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
    return {
        "message": "GitHub Card Backend Running"
    }

# USER PROFILE
@app.get("/github/{username}")
def get_github_user(username: str):

    url = f"https://api.github.com/users/{username}"

    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "github-card-generator"
    }

    response = requests.get(url, headers=headers)

    # DEBUG
    print("GitHub Status:", response.status_code)

    if response.status_code != 200:
        return {
            "error": "User not found",
            "status_code": response.status_code
        }

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

    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "github-card-generator"
    }

    response = requests.get(url, headers=headers)

    print("Repo Status:", response.status_code)

    if response.status_code != 200:
        return {
            "error": "Repositories not found",
            "status_code": response.status_code
        }

    return response.json()