'''
Author: Six_God_K
Date: 2024-03-24 15:56:01
LastEditors: Six_God_K
LastEditTime: 2024-04-14 18:48:58
FilePath: \webui\extensions\sd-webui-oldsix-prompt\scripts\old_six_prompt.py
Description: 

Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
'''
import gradio as gr
import os,json
import json
import random
import re
from modules import shared,scripts,script_callbacks
import requests
from fastapi import FastAPI,Request
import sys 


try:
    from transerver import Translator,baidu,freebd
except:
    transerver_path = os.path.join(os.path.dirname(__file__), "transerver")
    sys.path.append(transerver_path)
    import Translator,baidu,freebd


current_script = os.path.realpath(__file__)
current_folder = os.path.dirname(current_script)   
work_basedir = os.path.dirname(current_folder)   #本插件目录  
path1 = work_basedir+ r"/json"
path2 = work_basedir+ r"/yours"
pathrandom = work_basedir+ r"/random"


transMode=False
 
def LoadTagsFile():    
      dic={}
      loadjsonfiles(path1,dic)
      loadjsonfiles(path2,dic)
      obj=json.dumps(dic,ensure_ascii=False)        
      return  obj                   
 
def loadjsonfiles(path,dic):
    files = os.listdir( path ) 
    for item in files:
        if item.endswith(".json"):
                filepath=path+'/'+item
                filename=filepath[filepath.rindex('/') + 1:-5]
                with open(filepath, "r",encoding="utf-8-sig") as f:
                        res=json.loads(f.read())                       
                        dic[filename]=res

 
def contains_chinese(s):
    pattern = re.compile(r'[\u4e00-\u9fff]+')
    return bool(pattern.search(s))


def translate(text):
    if(transObj['server']=='free'):
         trans_server=freebd.FreeBDTranslator()
         return Translator.translate_text(trans_server, None,None,text)
    else:
         trans_server=baidu.BaiduTranslator()
         return Translator.translate_text(trans_server, transObj['appid'],transObj['secret'],text)



# showtrans = getattr(shared.opts, "oldsix_prompts",True)  


 
def extract_lora(prompt):
    pattern = r'<lora.*?>'
    lora_arr = re.findall(pattern, prompt)
    prompt = re.sub(pattern, '', prompt)
    return lora_arr, prompt

def add_lora(lora_arr,prompt):
    for index, value in enumerate(lora_arr):
      prompt += value + ',' if index != len(lora_arr)-1 else value
    return prompt


   
class Script(scripts.Script):    
 
         
        def after_component(self, component, **kwargs):
               pass
                            
        def title(self):
                return "Old_Six"
               
        def show(self, is_img2img):
                return scripts.AlwaysVisible
       
        def ui(self, is_img2img):
           pass            
                                
           
        def before_process(self, p, *args):       
            p.prompt= extract_tags(p.prompt)
            p.negative_prompt= extract_tags(p.negative_prompt)
            prompt_lora_arr,p.prompt=extract_lora(p.prompt)
            nprompt_lora_arr,p.negative_prompt=extract_lora(p.negative_prompt)
           
            # if(transMode==False):
            if(contains_chinese(p.prompt)==True):      
                      p.prompt=translate(p.prompt)
            if(contains_chinese(p.negative_prompt)==True):    
                      p.negative_prompt=translate(p.negative_prompt)|''
            p.prompt=add_lora(prompt_lora_arr,p.prompt)
            p.negative_prompt=add_lora(nprompt_lora_arr,p.negative_prompt)
                   
        # def process(self, p, *args): 
        #     print(p.prompt)
        #     pass

        
        # def run(self, p, *args):
        #      print('run')
        #      pass
        
        # def before_process_batch(self, p, *args, **kwargs):
        #      print('before_process_batch')
        #      pass
             
 

def extract_tags(text):
    pattern = r'#\[(.*?)\]'
    matches=re.findall(pattern, text)  
    for i in matches:
        newarr=i.split(',')
        random.seed(random.random())
        rdindex=random.randint(0,len(newarr)-1)
        rdtext=newarr[rdindex]
        text = re.sub(pattern, rdtext, text,count=1)
    return text
    
transObj={
     'server':'',
     'appid':'',
     'secret':''
}
 
def on_app_started(_: gr.Blocks, app: FastAPI): 
    @app.get("/api/sixgod/getJsonFiles")
    async def getJsonFiles():   
        return LoadTagsFile()
    
    @app.get("/api/sixgod/setmode")
    async def setmode(isEn):
       global transMode
       transMode=isEn

    @app.post("/api/sixgod/setTransServer")
    async def setTransServer(request:Request):
        postData=await request.json()
        transObj['server']=postData['server']
        transObj['appid']=postData['appid']
        transObj['secret']=postData['secret']
        return 'ok'
       
    @app.get("/api/sixgod/testTransServer")
    async def testTransServer():
        trans_text = translate('苹果')
        if (trans_text!='apple'):
            trans_text='翻译失败'
        else:
            trans_text='接口正常'      
        return trans_text
      
        

script_callbacks.on_app_started(on_app_started)