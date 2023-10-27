import gradio as gr
import os,json
import json
import random
import re
from bs4 import BeautifulSoup
from modules import shared,scripts,script_callbacks
current_script = os.path.realpath(__file__)
current_folder = os.path.dirname(current_script)   
work_basedir = os.path.dirname(current_folder)   #本插件目录  
path1 = work_basedir+ r"/json"
path2 = work_basedir+ r"/yours"
pathrandom = work_basedir+ r"/random"
listdynamice={}
def LoadTagsFile():    
      dic={}
      loadjsonfiles(path1,dic)
      loadjsonfiles(path2,dic)
      traverse_dict(dic)
      obj=json.dumps(dic,ensure_ascii=False)       
     
      return   obj                   
 
def loadjsonfiles(path,dic):
    files = os.listdir( path ) 
    for item in files:
        if item.endswith(".json"):
                filepath=path+'/'+item
                filename=filepath[filepath.rindex('/') + 1:-5]
                with open(filepath, "r",encoding="utf-8-sig") as f:
                        res=json.loads(f.read())                       
                        dic[filename]=res
    
def loadRandomList():
      files = os.listdir( pathrandom ) 
      for item in files:
        if item.endswith(".json"):
                filepath=pathrandom+'/'+item
                filename=filepath[filepath.rindex('/') + 1:-5]
                with open(filepath, "r",encoding="utf-8-sig") as f:
                        jsonlist=json.loads(f.read())                       
                return jsonlist

def traverse_dict(d,clsName=None):      
        for k, v in d.items():     
            if  isinstance (v, dict):             
                traverse_dict(v,k)
            else:
                listdynamice[clsName]=d
                break

              
import requests


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










# showtrans = getattr(shared.opts, "oldsix_prompts",True)  


class Script(scripts.Script):    
        rdlist=loadRandomList()
        json= LoadTagsFile()
        randomIndex=0
        txtprompt=None
        isLockPrompt=False
       
         
        def after_component(self, component, **kwargs):
           if(component.elem_id=="txt2img_prompt" or component.elem_id=="img2img_prompt"):
               self.txtprompt=component
                            
        def title(self):
                return "Old_Six"
               
        def show(self, is_img2img):
                return scripts.AlwaysVisible
       
        def ui(self, is_img2img):
            if(is_img2img):
                eid='oldsix-prompt2'
                tid='oldsix-area2'
            else:
                eid='oldsix-prompt1'     
                tid='oldsix-area1'      
                
                
            with gr.Row(elem_id=eid):
                       with gr.Accordion(label="SixGod_K提示词 v1.65.1",open=False):
                             gr.HTML('<a class="oldsix-tips" href="https://github.com/thisjam/sd-webui-oldsix-prompt/">【使用说明书】')
                            
                             textarea=gr.TextArea(self.json,elem_id=tid,visible=False)
                             traninput=gr.Textbox(elem_classes="old-six-traninput",visible=False,show_label="",placeholder="输入中文后按回车翻译,[ALT+Q]键呼出/隐藏")
                             tcache=gr.Textbox(elem_classes="old-six-tcache",visible=False)
                            
                             with gr.Column(scale=4,elem_id="oldsix-optit"):
                                btnreload=gr.Button('🔄',elem_classes="oldsix-reload sm secondary gradio-button svelte-1ipelgc")
                                gr.Button('清空正面提示词', variant="secondary",elem_classes="oldsix-clear")
                                gr.Button('清空负面提示词',variant="secondary",elem_classes="oldsix-clear")
                                chDynamic=gr.Checkbox(label="锁定【动态批次】提示词",elem_classes="oldsix-checklock",container=False,scale=1)
                                
                               
                             with gr.Column(scale=4,elem_id="oldsix-optit"):
                                  gr.HTML('<p class="oldsix-classes-shop"></p>')  
                             with gr.Accordion(label="随机灵感",open=False):                               
                                rdtextareaEn=gr.TextArea(label='英文预览框',elem_id='randomTextEn',lines=3,visible=False)
                                rdtextareaZh=gr.TextArea(label='预览框',elem_id='randomTextZh',lines=3,interactive=False)     
                                with gr.Row():       
                                     with gr.Column(scale=4):                    
                                        txtstart=gr.Textbox(placeholder='开头占位提示词',show_label=False,elem_classes="oldsix-txt-start")
                                     with gr.Column(scale=4):     
                                        txtend=gr.Textbox(placeholder='结尾占位提示词',show_label=False,elem_classes="oldsix-txt-end")
                                with gr.Row():
                                    with gr.Column(scale=4):
                                         btnRandom=gr.Button('随机灵感关键词',variant="primary")                                                               
                                    with gr.Column(scale=4):  
                                         gr.Button('分类组合随机',variant="primary",elem_classes="btn-crandom") 
                                    with gr.Column(scale=4):  
                                         btnsend=gr.Button('发送到提示词框',variant="primary",elem_classes="oldsix-btnSend") 
                                        
            
            def tanslatePromp(text):
                en=tanslate(text)
                data={
                      'origintext':text,
                      'translate':en,
                }
                return json.dumps(data,ensure_ascii=False),''
            def randomPrompt():     
                random.seed(getSeed())
                self.randomIndex= random.randint(0,len(self.rdlist)-1)
                rden=self.rdlist[self.randomIndex]['key']             
                return [self.rdlist[self.randomIndex]['val'],rden]            
            def reloadData():
                return LoadTagsFile()
            
            def CheckboxChange(input):
               self.isLockPrompt=input
               return input
              
            
            btnreload.click(fn=reloadData,inputs=None,outputs=textarea)  
            btnRandom.click(fn=randomPrompt,inputs=None,outputs=[rdtextareaEn,rdtextareaZh])   
            chDynamic.select(fn=CheckboxChange,inputs=chDynamic,outputs=chDynamic,show_progress=False)   
            traninput.submit(fn=tanslatePromp, inputs=traninput,outputs=[tcache,traninput]
                            ).then(fn=None,_js="translateText",show_progress=False,inputs=tcache)
             
            # tcache.change(fn=lambda:, inputs=tcache,outputs=tcache)
        
                                                                                                                    
            return [btnreload]
           
     

        def before_process(self, p, *args):       
            if(self.isLockPrompt):
               temppromt= extract_classesTags(p.prompt)
               if(temppromt):
                   res=extract_tags(temppromt)                   
                   if(res):
                        p.prompt=res
        
        def process(self, p, *args): 
             if(not self.isLockPrompt):
                for index,val in  enumerate(p.all_prompts):
                    temppromt=extract_classesTags(p.prompt)
                    if(temppromt):
                        res=extract_tags(temppromt)
                        if(res):
                            p.all_prompts[index]=res
                
             
       
            
 
def extract_classesTags(prompt):  
   pattern = r'#\[(.*?)\]'
   matches=re.findall(pattern, prompt)  
   if(len(matches)==0) :
       return None
   for mathch in matches:
            arr=mathch.split('#')
            randlist=[]
            for classesKey in arr:      
                if(classesKey in listdynamice):       
                    randlist.append(listdynamice[classesKey])  
            if len(randlist)==0: continue    
            random.seed(getSeed())
            rdindex=random.randint(0,len(randlist)-1)
            newtext=''
            for item in randlist[rdindex]:
                newtext+=randlist[rdindex][item]+'#'
            prompt=prompt.replace(mathch,newtext,1)
   return  prompt
            
              
def extract_tags(prompt):
   pattern = r'#\[(.*?)\]'
   matches = re.findall(pattern, prompt)  
   text=prompt
   if(len(matches)==0) :
       return  None
   for item in matches:
      arr=item.split('#')
      random.seed(getSeed())
      rdindex=random.randint(0,len(arr)-1)
      rdtext=arr[rdindex]
      text = re.sub(pattern, rdtext, text,count=1)
   return text
    

def getSeed():
     seed = random.random()
     return seed
 
