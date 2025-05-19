#!/usr/bin/env python3
# 方法二：使用 googletrans 库 (pip install googletrans==4.0.0-rc1)
import sys
from googletrans import Translator

text = sys.stdin.read()

# text = "你好"
translator = Translator()

try:
    result = translator.translate(text, src='zh-cn', dest='en')
    sys.stdout.write(result.text)
except Exception:
    # 翻译异常时输出原文
    sys.stdout.write(text)
