'''
Author: Six_God_K
Date: 2024-04-13 12:54:31
LastEditors: Six_God_K
LastEditTime: 2024-04-26 22:07:07
FilePath: \webui\extensions\sd-webui-oldsix-prompt\scripts\transerver\llmTranslate.py
Description: 

Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
'''
import Translator 
import requests
import json
import llm


class LLMTranslator(Translator.TranslatorInterface):
     def translate(self,text: str,modelName:str) -> str:  
        return llm.chat(text,modelName)


if __name__ == '__main__':
    appid='xx'
    secretKey='xx'
    text="今天天气非常不错，我们出去玩吧"
    modelName='qwen/qwen1_5-4b-chat-q5_k_m'
    llm_translator = LLMTranslator()
    res =Translator.translate_text(llm_translator,text,modelName)
    print(res)
            