from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"status": "Lyke AI Service is Online"}

@app.post("/vectorize")
async def vectorize_image():
    # We will build this out once the Auth slice is done
    return {"vector": [0.12, 0.45, -0.09]}