#!/usr/bin/env python3
# Method 2: Using googletrans library (pip install googletrans==4.0.0-rc1)
import sys
from googletrans import Translator

text = sys.stdin.read()

# text = "hello"
translator = Translator()

try:
    result = translator.translate(text, src='zh-cn', dest='en')
    sys.stdout.write(result.text)
except Exception:
    # Output original text when translation fails
    sys.stdout.write(text)
