from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from process import extract_text_from_image, extract_transaction_info

app = FastAPI()

# CORS configuration
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Example route
@app.get("/")
async def home():
    return {"message": "Hello from FastAPI in Colab!"}

@app.post("/parse-receipt/", response_class=JSONResponse)
async def parse_receipt(file: UploadFile = File(...)):
    """
    Upload a bank receipt image and extract transaction information
    
    - **file**: An image file of a bank receipt
    
    Returns a JSON with extracted transaction details
    """
    # Check if the file is an image
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Read the file content
    contents = await file.read()
    
    try:
        # Process the image with OCR
        receipt_lines = extract_text_from_image(contents)
        
        # Extract transaction information
        transaction_info = extract_transaction_info(receipt_lines)
        
        return transaction_info
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing receipt: {str(e)}")

# # Start the server
# uvicorn.run(app, host="0.0.0.0", port=8000)
