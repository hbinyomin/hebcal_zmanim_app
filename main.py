from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import requests

app = FastAPI()

HEBCAL_URL =  "https://www.hebcal.com/zmanim"

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get('/')
def home():
    return FileResponse('index.html')


@app.get('/api/zmanim')
def get_zmanim(location_identifier, date="2026-02-11"):
    # For now, the only way to use this endpoint is with a zip code.
    # Further development would allow user to enter a place name, and the endpoint would fetch a lookup from geoNames

    params = {"cfg":"json","sec":1,"zip":location_identifier,"date":date}
    
    try:
        res = requests.get(HEBCAL_URL,params=params)
        data = res.json()
    except requests.RequestException:
        raise HTTPException(status_code=502, detail="Error fetching Hebcal data")
    
    if "error" in data:
        raise HTTPException(status_code=400, detail=data["error"])

    return data