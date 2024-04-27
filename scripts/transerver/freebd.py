'''
Author: Six_God_K
Date: 2024-04-13 15:23:00
LastEditors: Six_God_K
LastEditTime: 2024-04-26 22:05:30
FilePath: \webui\extensions\sd-webui-oldsix-prompt\scripts\transerver\freebd.py
Description: 

Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
'''
import Translator 
import requests
import json

class FreeBDTranslator(Translator.TranslatorInterface):
    def translate(self,text) -> str:  
        url='https://fanyi.baidu.com/transapi'   
        postdata={
            "from": self.lang_from,
            "to": self.lang_to,
            "query": text,
            "source": "txt",
        }
        try:    
            res= requests.post(url,headers=self.headers,data=postdata)   
            return self.decodeText(res,text)

        except requests.exceptions.RequestException as e:
            print(f"err：{e}")
            return text
         
    def decodeLong(self,data):      
        return data['data'][0]['dst']
    def decodeShort(self,data):
        result=json.loads(data['result'])  
        restcont=result['content'][0]['mean'][0]['cont']
        restext=list(restcont.keys())[0]
        return restext
    def decodeText(self,data,trans_text): 
        jsonObj=json.loads(data.content.decode('utf-8'))
        if 'type' in jsonObj:
            if(jsonObj['type']==1): # type=1||2
                return  self.decodeShort(jsonObj)
            else :
                return  self.decodeLong(jsonObj)        
        else:
            print('trans_result erro')
            return trans_text
    
 
       


if __name__ == '__main__':
    text="一个女孩在雨中行走"
    baidu_translator = FreeBDTranslator()
    res = Translator.translate_text(baidu_translator,text)
    print(res)
        