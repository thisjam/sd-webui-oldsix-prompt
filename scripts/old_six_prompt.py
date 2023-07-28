import modules.scripts as scripts
import gradio as gr
import os,json
from pathlib import Path
import json
from collections import deque
def LoadTagsFile():  
      current_script = os.path.realpath(__file__)
      current_folder = os.path.dirname(current_script)   
      work_basedir = os.path.dirname(current_folder)   #本插件目录  
      path = work_basedir+ r"/json"
      files = os.listdir( path ) 
      #listjsonpath="extensions/sd-webui-oldsix_prompt/json/"       
      dic={}
      for item in files:
        if item.endswith(".json"):
                filepath=path+'/'+item
                filename=filepath[filepath.rindex('/') + 1:-5]
                with open(filepath, "r",encoding="utf-8-sig") as f:
                        res=json.loads(f.read())                       
                        dic[filename]=res
                                
 
   
      return dic          
                             
def traverse_dict(dictionary,deep=0,html=''):
    index=0
    for key, value in  dictionary.items():
        # if(key=='负面提示'):
        #         pass   
        if isinstance(value, dict):   
            if(deep==0):
                 html+='</div><div class="oldsix-row deep{1}"><button class="oldsix-btn-tit sm primary  gradio-button svelte-1ipelgc">{0}</button>'.format(key,deep)   
            else:
                 html+='<div class="oldsix-row deep{1}"><button class="oldsix-btn-tit sm  primary  gradio-button svelte-1ipelgc">{0}</button><div class="sixold-btn-containers">'.format(key,deep)                              
        #     print(key+str(deep))
            html= traverse_dict(value,deep+1,html)  
        else:
        #     print(key+str(deep), ":", value)      
            html+='<button class="sm secondary gradio-button svelte-1ipelgc oldsix-btn" data-sixoldtit="{1}" onclick="addPrompt(this,\'{1}\')" >{0}</button>'.format(key,value) 
            count=len(dictionary)-1         
            if(index==count):
                 for i in range(deep):                    
                    html+='</div>'
            index+=1
#     print('next')      
    return html
 
class Script(scripts.Script):
              
        def title(self):
                return "Old_Six"
     
        def show(self, is_img2img):
                return scripts.AlwaysVisible
        
       
        
        def after_component(self, component, **kwargs):   
           aa=component
           bb=kwargs
           pass
           
        def ui(self, is_img2img):
            eid=None  
            tabid=None  
            if(is_img2img):
                 eid='oldsix-prompt2'
                 tabid='oldsix-tab1'
            else:
                 eid='oldsix-prompt1'    
                 tabid='oldsix-tab2'    
            diclist=LoadTagsFile()   
         
            with gr.Row(elem_id=eid):
                       with gr.Accordion(label="SixGod_K提示词",open=False):
                            #  oldsix_checkbox=gr.Checkbox(label="负面框输入", value=False) 
                            #  btnreload=gr.Button('🔄', variant='secondary',elem_classes="oldsix-reload")
                             with gr.Tabs(elem_id=tabid):                                     
                                for item in diclist:
                                    with gr.TabItem(item, elem_id=item):                                      
                                            html=traverse_dict(diclist[item])[6:]                                                                           
                                            gr.HTML(html)                                                                                             
            return None
    
        
      
     
                
 

