from fastapi import FastAPI, HTTPException
import requests
import pandas as pd
import logging
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# GitHub API Base Settings
GITHUB_ORG = "ushahidi"  # Organization name
BASE_URL = "https://api.github.com"
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")  # Load token from .env file


# Configure logging for debugging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# GitHub API headers with authentication token
HEADERS = {
    "Authorization": f"token {GITHUB_TOKEN}",
    "Accept": "application/vnd.github.v3+json"
}

def fetch_repos():
    url = f"{BASE_URL}/orgs/{GITHUB_ORG}/repos"
    print(f"Fetching repositories from: {url}")
    
    response = requests.get(url)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Failed to fetch repositories")
    
    repos = response.json()
    repo_names = [repo["name"] for repo in repos]
    print(f"Found repositories: {repo_names}")
    return repo_names

def fetch_contributors(repo_name):
    url = f"{BASE_URL}/repos/{GITHUB_ORG}/{repo_name}/contributors"
    print(f"Fetching contributors for {repo_name} from: {url}")
    
    try:
        response = requests.get(url)
        status_code = response.status_code

        # Handle different status codes
        if status_code == 403:
            raise HTTPException(status_code=403, detail="Rate limit exceeded. Use a valid GitHub token.")
        elif status_code == 404:
            print(f"No contributors found for {repo_name}")
            return []
        elif status_code == 204:
            print(f"No content found for {repo_name}. Returning empty list.")
            return []
        elif status_code != 200:
            raise HTTPException(status_code=status_code, detail=f"Failed to fetch contributors for {repo_name}")

        # Process JSON response if successful
        contributors = response.json()
        print(f"Found {len(contributors)} contributors for {repo_name}")
        return contributors

    except requests.exceptions.RequestException as e:
        # Handle network-related errors (timeout, DNS failure, etc.)
        print(f"Network error while fetching {repo_name}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error while fetching contributors")

@app.get("/contributors")
def get_contributors():
    repos = fetch_repos()
    contributor_data = []
    
    for repo in repos:
        contributors = fetch_contributors(repo)
        for contributor in contributors:
            contributor_data.append({
                "id": contributor["id"],
                "login": contributor["login"],
                "contributions": contributor["contributions"],
                "avatar_url": contributor["avatar_url"]
            })
    
    # Convert list to DataFrame and aggregate contributions per contributor
    df = pd.DataFrame(contributor_data)
    if not df.empty:
        df = df.groupby(["id", "login", "avatar_url"], as_index=False).agg({"contributions": "sum"})
        
        # Sort by contributions in descending order
        df = df.sort_values(by="contributions", ascending=False)

        print("\nFinal aggregated contributors data:")
        print(df)
        
        return df.to_dict(orient="records")
    else:
        print("No contributors found across any repositories")
        return []

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)