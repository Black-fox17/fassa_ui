import easyocr
import cv2
from fastapi import FastAPI, File, UploadFile

def preprocess_for_ocr(image):
    # Convert the image to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Enhance image contrast using histogram equalization

    # Apply adaptive thresholding to binarize the image

    return gray
def extract_transaction_info(receipt_list):
    """
    Extract bank name, amount paid, recipient account number, and sender name from transaction receipts.
    
    Args:
        receipt_list (list): List containing transaction receipt information
    
    Returns:
        dict: Dictionary with bank name, amount, recipient account, and sender name
    """
    # Initialize result dictionary
    result = {
        "bank_name": None,
        "amount_paid": None,
        "recipient_account": None,
        "sender_name": None,
        "payment_date": None
    }
    
    # Convert all strings to lowercase for easier matching
    lower_receipt = [item.lower() if isinstance(item, str) else item for item in receipt_list]
    
    # Identify bank name - usually one of the first few items
    for item in receipt_list[:5]:
        if isinstance(item, str) and any(bank in item.lower() for bank in ["opay", "firstbank", "stanbic", "zenith", "uba", "gtbank", "access"]):
            result["bank_name"] = item
            break
    
    # Extract amount - look for currency pattern or after "amount" keyword
    for i, item in enumerate(receipt_list):
        if isinstance(item, str):
            # Check for currency format (N7,300.00 or 300,000.00)
            if (item.startswith('N') and '.' in item) or (',' in item and '.' in item and any(c.isdigit() for c in item)):
                result["amount_paid"] = item
                break
            # If it's a numerical value without formatting, it might be the amount
            elif i < len(receipt_list) - 1 and item.lower() in ["amount", "amount:"]:
                result["amount_paid"] = receipt_list[i+1]
                break
    
    # Find recipient account number
    for i, item in enumerate(lower_receipt):
        if isinstance(item, str):
            # Common patterns for account numbers
            if "account no" in item or "account number" in item:
                if i < len(receipt_list) - 1:
                    result["recipient_account"] = receipt_list[i+1]
                    break
            # For OPay, the account number is usually after the recipient name
            elif "recipient details" in item and i < len(receipt_list) - 3:
                # Look for a numeric string that could be an account number
                for j in range(i+1, min(i+5, len(receipt_list))):
                    if isinstance(receipt_list[j], str) and any(c.isdigit() for c in receipt_list[j]) and len(receipt_list[j].strip()) >= 8:
                        result["recipient_account"] = receipt_list[j]
                        break
    
    # Find sender name
    for i, item in enumerate(lower_receipt):
        if isinstance(item, str):
            if "sender name" in item or "sender details" in item:
                if i < len(receipt_list) - 1:
                    # Some receipts have the name on the next line
                    result["sender_name"] = receipt_list[i+1]
                    break
    
    # Special case for OPay where "sender details" is followed by the name
    if "opay" in str(lower_receipt).lower():
        for i, item in enumerate(lower_receipt):
            if isinstance(item, str) and "sender details" in item and i < len(receipt_list) - 1:
                result["sender_name"] = receipt_list[i+1]
                break

    import re
    from datetime import datetime
    
    # Common date formats in receipts
    date_patterns = [
        r'([A-Z][a-z]{2}\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4})',  # Mar 29th, 2025
        r'([A-Z][a-z]+\s+\d{1,2},\s+\d{4})'  # February 18, 2025
    ]
    
    for item in receipt_list:
        if isinstance(item, str):
            # Check for date patterns
            for pattern in date_patterns:
                match = re.search(pattern, item)
                if match:
                    date_str = match.group(1)
                    
                    # Handle different formats
                    try:
                        # Try different formats until one works
                        for fmt in ["%b %dst, %Y", "%b %dnd, %Y", "%b %drd, %Y", "%b %dth, %Y", 
                                   "%B %d, %Y", "%b %d, %Y"]:
                            try:
                                date_obj = datetime.strptime(date_str, fmt)
                                result["payment_date"] = date_obj.strftime("%Y-%m-%d")
                                break
                            except ValueError:
                                continue
                    except:
                        # If parsing fails, at least return the matched date string
                        result["payment_date"] = date_str
                    
                    if result["payment_date"]:
                        break
            
            if result["payment_date"]:
                break
    
    return result

reader = easyocr.Reader(['en'])
image_1 = cv2.imread("test.jpg")
image_2 = cv2.imread("test1.jpg")
preprocess_1 = preprocess_for_ocr(image_1)
preprocess_2 = preprocess_for_ocr(image_2)
result_1 = reader.readtext(preprocess_1,detail=0)
result_2 = reader.readtext(preprocess_2,detail=0)
print(extract_transaction_info(result_1))
print(extract_transaction_info(result_2))