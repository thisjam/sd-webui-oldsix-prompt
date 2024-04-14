'''
Author: Six_God_K
Date: 2024-04-13 12:54:31
LastEditors: Six_God_K
LastEditTime: 2024-04-13 15:50:47
FilePath: \ComfyUI\custom_nodes\comfyui-sixgod_prompt\transerver\baidu.py
Description: 

Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
'''
import Translator 
import requests
import json

class BaiduTranslator(Translator.TranslatorInterface):
     def translate(self,appid:str,secretKey:str,text: str,headers, lang_from: str, lang_to: str) -> str:
        url='https://fanyi-api.baidu.com/api/trans/vip/translate'
       
        postdata={
            "appid":appid,
            "from": lang_from,
            "to": lang_to,
            "q": text,
            "salt": "1435660288",# 随机数
            "sign":self.encrypt_string_to_md5(appid+text+"1435660288"+secretKey)
            }
      
        try:    
            resdata= requests.post(url,headers=headers,data=postdata)  
            jsonObj=json.loads(resdata.content.decode('utf-8'))
            if('error_code'in jsonObj):
                print('trans_result erro')
                return text
            return jsonObj['trans_result'][0]['dst']
         
            
        except requests.exceptions.RequestException as e:
            print(e)
        


if __name__ == '__main__':
    appid='xx'
    secretKey='xx'
    text="今天天气非常不错"
    baidu_translator = BaiduTranslator()
    res = Translator.translate_text(baidu_translator, appid,secretKey,text)
    print(res)
            