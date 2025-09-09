# src/ai_study_assistant/processing/parser.py
import pdfplumber
import io

def extract_text_from_pdf(pdf_file: io.BytesIO) -> str:
    """
    Extracts text from a PDF file-like object.

    Args:
        pdf_file: A binary, file-like object containing the PDF data.

    Returns:
        A string containing all the extracted text from the PDF.
    """
    print("Starting PDF text extraction...")
    full_text = ""
    try:
        with pdfplumber.open(pdf_file) as pdf:
            for page in pdf.pages:
                # Extract text from each page and append it
                page_text = page.extract_text()
                if page_text:
                    full_text += page_text + "\n\n"
        print("PDF text extraction successful.")
        return full_text
    except Exception as e:
        print(f"An error occurred during PDF parsing: {e}")
        return "" # Return empty string on failure