'''
Author: Six_God_K
Date: 2024-03-24 15:56:01
LastEditors: Six_God_K
LastEditTime: 2024-04-04 10:26:16
FilePath: \webui\extensions\sd-webui-oldsix-prompt\scripts\old_six_prompt.py
Description: 

Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
'''
import gradio as gr
import os,json
import json
import random
import re
from bs4 import BeautifulSoup
from modules import shared,scripts,script_callbacks
import requests
from fastapi import FastAPI
from  scripts.transbd import get as transbd


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

def get_content(text):
    try:  
        localtran=bytes.fromhex('68747470733A2F2F646963742E796F7564616F2E636F6D2F772F') 
        localtran=localtran.decode()
        response = requests.get(localtran+text)
        if  response.status_code==200:       
            return response.text
        else:
            print(f"err_code：{response.status_code}")
            return None
    except requests.exceptions.RequestException as e:
        print(f"err：{e}")
        return None

def tanslate(cntext):
    html_content = get_content(cntext)
    if html_content is not None: 
        dom = BeautifulSoup(html_content, 'html.parser')      
        ydhtml=dom.find('div',id='fanyiToggle')
        if(ydhtml):
            div=ydhtml.find('div',class_='trans-container')
            childhtml=div.find_all('p')
            return childhtml[1].get_text()
        shot=dom.find('a',class_='search-js')
        if(shot):
              return shot.text.strip()
        tWebTrans=dom.find('div',id='tWebTrans')
        if(tWebTrans!=None):             
             span=tWebTrans.find('span')         
             text=span.next_sibling.replace("\n", "")  
             return text.strip()   
    return None     

def contains_chinese(s):
    pattern = re.compile(r'[\u4e00-\u9fff]+')
    return bool(pattern.search(s))






# showtrans = getattr(shared.opts, "oldsix_prompts",True)  



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
            # if(transMode==False):
            if(contains_chinese(p.prompt)==True):      
                      p.prompt=transbd(p.prompt)
            if(contains_chinese(p.negative_prompt)==True):    
                      p.negative_prompt=transbd(p.negative_prompt)|''
           
                   
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
    

 
def on_app_started(_: gr.Blocks, app: FastAPI): 
    @app.get("/api/sixgod/getJsonFiles")
    async def getJsonFiles():   
        return LoadTagsFile()
    
    @app.get("/api/sixgod/setmode")
    async def setmode(isEn):
       global transMode
       transMode=isEn
      
        

script_callbacks.on_app_started(on_app_started)