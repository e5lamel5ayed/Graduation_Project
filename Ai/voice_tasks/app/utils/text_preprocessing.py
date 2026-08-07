
import re
import contractions
from num2words import num2words
import unicodedata 


def remove_accents(text):
    nfkd_form = unicodedata.normalize('NFKD', text)
    return "".join([c for c in nfkd_form if not unicodedata.combining(c)])


def text_preprocessing(text):
    text = text.lower().strip()
    text = contractions.fix(text)
    text = remove_accents(text)
    def convert_decimal(match):
        number = match.group(0)
        integer, decimal = number.split(".")
        integer_words = num2words(int(integer))
        decimal_words = num2words(int(decimal))
        return f"{integer_words} point {decimal_words}"
        
    text = re.sub(r"\b\d+\.\d+\b", convert_decimal, text)
    text = re.sub(r"\b\d+\b", lambda x: num2words(int(x.group(0))), text)
    text = re.sub(r"[^\w\s]", " ", text)
    text = re.sub(r"\s+", " ", text)

    return text.split()