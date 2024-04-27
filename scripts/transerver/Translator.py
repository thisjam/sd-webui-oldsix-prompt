'''
Author: Six_God_K
Date: 2024-04-13 12:12:19
LastEditors: Six_God_K
LastEditTime: 2024-04-26 22:06:41
FilePath: \webui\extensions\sd-webui-oldsix-prompt\scripts\transerver\Translator.py
Description: 

Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
'''
from abc import ABC, abstractmethod
import hashlib

class TranslatorInterface(ABC):
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36',
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
        self.lang_from='zh'
        self.lang_to='en'
    @abstractmethod
    def translate(self,*args, **kwargs) -> str:
        pass

    def encrypt_string_to_md5(self,input_string):
        encoded_string = input_string.encode()
        md5_hash = hashlib.md5()
        md5_hash.update(encoded_string)
        hashed_value = md5_hash.hexdigest()
        return hashed_value
    
def translate_text(translator: TranslatorInterface,*args, **kwargs):
            return translator.translate(*args, **kwargs)

 