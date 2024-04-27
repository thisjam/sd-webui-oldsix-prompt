'''
Author: Six_God_K
Date: 2024-04-13 12:54:31
LastEditors: Six_God_K
LastEditTime: 2024-04-26 22:05:11
FilePath: \webui\extensions\sd-webui-oldsix-prompt\scripts\transerver\baidu.py
Description: 

Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
'''
import Translator 
import requests
import json

class BaiduTranslator(Translator.TranslatorInterface):
     def translate(self,appid:str,secretKey:str,text: str) -> str:
        url='https://fanyi-api.baidu.com/api/trans/vip/translate'
       
        postdata={
            "appid":appid,
            "from": self.lang_from,
            "to": self.lang_to,
            "q": text,
            "salt": "1435660288",# 随机数
            "sign":self.encrypt_string_to_md5(appid+text+"1435660288"+secretKey)
            }
      
        try:    
            resdata= requests.post(url,headers=self.headers,data=postdata)  
            jsonObj=json.loads(resdata.content.decode('utf-8'))
            if('error_code'in jsonObj):
                print('trans_result erro')
                return text
            return jsonObj['trans_result'][0]['dst']
         
            
        except requests.exceptions.RequestException as e:
            print(e)
        


if __name__ == '__main__':
    appid='202406401002012191'
    secretKey='qKvBIOYoQsiqSm9RjlcGU'
    text="红色的气球"
    baidu_translator = BaiduTranslator()
    res = Translator.translate_text(baidu_translator, appid,secretKey,text)
    print(res)
            