import modules.scripts as scripts
import gradio as gr
import os,json
import json
import random

current_script = os.path.realpath(__file__)
current_folder = os.path.dirname(current_script)   
work_basedir = os.path.dirname(current_folder)   #本插件目录  
path1 = work_basedir+ r"/json"
path2 = work_basedir+ r"/yours"
pathrandom = work_basedir+ r"/random"
def LoadTagsFile():    
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
    
def loadRandomList():
      files = os.listdir( pathrandom ) 
      for item in files:
        if item.endswith(".json"):
                filepath=pathrandom+'/'+item
                filename=filepath[filepath.rindex('/') + 1:-5]
                with open(filepath, "r",encoding="utf-8-sig") as f:
                        jsonlist=json.loads(f.read())                       
                return jsonlist
    
 
class Script(scripts.Script):
        
        rdlist=loadRandomList()
        json= LoadTagsFile()
        randomIndex=0
        txtprompt=None
                            
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
        
        def after_component(self, component, **kwargs):
           if(component.elem_id=="txt2img_prompt" or component.elem_id=="img2img_prompt"):
               self.txtprompt=component
            #    print(component,component.elem_id)
              
           
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
                             with gr.Column(scale=4,elem_id="oldsix-optit"):
                                btnreload=gr.Button('🔄',elem_classes="oldsix-reload sm secondary gradio-button svelte-1ipelgc")
                                gr.Button('清空正面提示词', variant="secondary",elem_classes="oldsix-clear")
                                gr.Button('清空负面提示词',variant="secondary",elem_classes="oldsix-clear")
                             with gr.Accordion(label="随机灵感",open=False):
                                rdtextarea=gr.TextArea(label='灵感词预览框')
                                with gr.Row():
                                    with gr.Column(scale=4):
                                        btnRandom=gr.Button('随机灵感关键词',variant="primary")                              
                                    with gr.Column(scale=4):  
                                        btnSend=gr.Button('发送到提示词框',variant="primary")
            
            def send():                                  
                return self.rdlist[self.randomIndex]['val']        
            
            def randomPrompt():     
                self.randomIndex= random.randint(0,len(self.rdlist))
                return self.rdlist[self.randomIndex]['key']    
            
            def reloadData():
                return LoadTagsFile()
                 
      
            btnreload.click(fn=reloadData,inputs=None,outputs=textarea)  
            btnRandom.click(fn=randomPrompt,inputs=None,outputs=rdtextarea)      
            btnSend.click(fn=send,inputs=None,outputs=self.txtprompt)  
     
                                                                                                                        
            return [btnreload]
    
       
        
                
 

