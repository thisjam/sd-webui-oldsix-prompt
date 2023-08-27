import modules.scripts as scripts
import gradio as gr
import os,json
import json
import random
import re

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
                       with gr.Accordion(label="SixGod_K提示词 v1.34",open=False):
                             gr.HTML('<a href="https://github.com/thisjam/sd-webui-oldsix-prompt/">【使用说明书】</a>')
                            
                             textarea=gr.TextArea(self.json,elem_id=tid,visible=False)
                            
                             with gr.Column(scale=4,elem_id="oldsix-optit"):
                                btnreload=gr.Button('🔄',elem_classes="oldsix-reload sm secondary gradio-button svelte-1ipelgc")
                                gr.Button('清空正面提示词', variant="secondary",elem_classes="oldsix-clear")
                                gr.Button('清空负面提示词',variant="secondary",elem_classes="oldsix-clear")
                                chDynamic=gr.Checkbox(label="锁定【动态批次】提示词",elem_classes="oldsix-checklock",container=False,scale=1)
                                
                               
                             with gr.Column(scale=4,elem_id="oldsix-optit"):
                                  gr.HTML('<p class="oldsix-classes-shop"></p>')  
                             with gr.Accordion(label="随机灵感",open=False):                               
                                rdtextareaEn=gr.TextArea(label='英文预览框',elem_id='randomTextEn',lines=3,visible=False)
                                rdtextareaZh=gr.TextArea(label='预览框',elem_id='randomTextZh',lines=3)     
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
                                         gr.Button('发送到提示词框',variant="primary",elem_classes="oldsix-btnSend")   
            
                    
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
 
