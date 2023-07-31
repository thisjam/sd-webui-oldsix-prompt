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
      path1 = work_basedir+ r"/json"
      path2 = work_basedir+ r"/yours"
      dic={}
      loadjsonfiles(path1,dic)
      loadjsonfiles(path2,dic)
      return json.dumps(dic,ensure_ascii=False)
       
                             
 
def loadjsonfiles(path,dic):
    files = os.listdir( path ) 
    for item in files:
        if item.endswith(".json"):
                filepath=path+'/'+item
                filename=filepath[filepath.rindex('/') + 1:-5]
                with open(filepath, "r",encoding="utf-8-sig") as f:
                        res=json.loads(f.read())                       
                        dic[filename]=res
    

 
class Script(scripts.Script):
        
       
        json= LoadTagsFile()
        
                            
        def title(self):
                return "Old_Six"
               
        def show(self, is_img2img):
                return scripts.AlwaysVisible
          
      
              
        # def createTabs(self):
        #       with gr.Tabs() as tabs:                                     
        #             for item in self.diclist:
        #                 with gr.TabItem(item):                                      
        #                         html=traverse_dict(self.diclist[item])[6:]                                                                           
        #                         gr.HTML(html)                         
        #       return tabs                   
    
           
        def ui(self, is_img2img):
            if(is_img2img):
                eid='oldsix-prompt2'
                tid='oldsix-area2'
            else:
                eid='oldsix-prompt1'     
                tid='oldsix-area1'           
            with gr.Row(elem_id=eid):
                       with gr.Accordion(label="SixGod_K提示词",open=False):
                             textarea=gr.TextArea(self.json,elem_id=tid,visible=False)
                             btnreload=gr.Button('🔄',elem_classes="oldsix-reload sm secondary gradio-button svelte-1ipelgc")
                            
                 
            def reloadData():
                return LoadTagsFile()
            btnreload.click(fn=reloadData,inputs=None,outputs=textarea)    
          
     
                                                                                                                        
            return [btnreload]
    
        
      
     
                
 

