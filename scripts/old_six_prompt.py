import modules.scripts as scripts
import gradio as gr
import os,json
import json
import random
import re

current_script = os.path.realpath(__file__)
current_folder = os.path.dirname(current_script)   
work_basedir = os.path.dirname(current_folder)   #本插件目录
wildcards_basedir = os.path.join(os.path.dirname(work_basedir), 'sd-dynamic-prompts')

hasDynamicPrompts = os.path.exists(wildcards_basedir)

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
     
      return obj                   
 
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
        json = LoadTagsFile()
        randomIndex=0
        txtprompt=None
        
        def after_component(self, component, **kwargs):
           if(component.elem_id=="txt2img_prompt" or component.elem_id=="img2img_prompt"):
               self.txtprompt=component
                            
        def title(self):
                return "Old_Six_For_Dynamic"
               
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
                       with gr.Accordion(label="SixGod_K提示词(Dynamic版 v1.0.1)",open=False):
                             gr.HTML('插件改造自<a href="https://github.com/thisjam/sd-webui-oldsix-prompt/">【SixGod_K提示词】</a>，动态提示词需配合<a href="https://github.com/adieyal/sd-dynamic-prompts">【Dynamic Prompts插件】</a>一起使用，点击查看<a href="https://www.bilibili.com/video/BV1T94y167ft">【教程视频】</a>')
                             textarea=gr.TextArea(self.json,elem_id=tid,visible=False)
                             with gr.Row():
                                btnreload = gr.Button('🔄',elem_classes="oldsix-reload sm secondary gradio-button svelte-1ipelgc")
                                gr.Button('清空正面提示词', variant="secondary",elem_classes="oldsix-clear")
                                gr.Button('清空负面提示词',variant="secondary",elem_classes="oldsix-clear")
                                btnAsyncTag = gr.Button('同步至wildcards',variant="primary",elem_classes="oldsix-async-tag",visible=hasDynamicPrompts)
                                gr.Checkbox(label="启用动态语法",elem_classes="oldsix-switch-dynamic",value=hasDynamicPrompts,visible=hasDynamicPrompts)
                             with gr.Column(scale=4,elem_id="oldsix-optit",visible=not hasDynamicPrompts):
                                  gr.HTML('<p class="oldsix-classes-shop"></p>')  
                             with gr.Accordion(label="随机灵感",elem_id="oldsix-random",open=False,visible=not hasDynamicPrompts):                               
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

            async def asyncTag():
                # 获取保存目录的基础路径
                base_path = wildcards_basedir + r"/wildcards/dp"  # 替换为实际的路径

                data = json.loads(self.json)

                def sanitize_filename(filename):
                    return "".join(c if c.isalnum() or c in ['_', '.'] else '_' for c in filename)

                for node_name, node_data in data.items():
                    node_path = os.path.join(base_path, sanitize_filename(node_name))
                    os.makedirs(node_path, exist_ok=True)

                    print('node_path', node_path)

                    for txt_name, tags in node_data.items():
                        txt_file_path = os.path.join(node_path, sanitize_filename(txt_name) + '.txt')
                        with open(txt_file_path, "w", encoding="utf-8") as file:
                            if isinstance(tags, dict):
                                for v in tags.values():
                                    file.write(v + '\n')
                            else:
                                file.write(tags + '\n')

            btnreload.click(fn=reloadData,inputs=None,outputs=textarea)  
            btnRandom.click(fn=randomPrompt,inputs=None,outputs=[rdtextareaEn,rdtextareaZh])
            btnAsyncTag.click(fn=asyncTag,inputs=None,outputs=None)
        
     
                                                                                                                        
            return [btnreload]
           
    
        def before_process(self, p, *args):      
            extract_classesTags(p)
            extract_tags(p)
            pass
            
 
def extract_classesTags(p):  
   pattern = r'#\[(.*?)\]'
   matches=re.findall(pattern, p.prompt)  
   if(len(matches)==0) :
       return  
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
        p.prompt=p.prompt.replace(mathch,newtext,1)
        pass
            
              
def extract_tags(p):
   pattern = r'#\[(.*?)\]'
   matches = re.findall(pattern, p.prompt)  
   text=p.prompt
   if(len(matches)==0) :
       return   
   for item in matches:
      arr=item.split('#')
      random.seed(getSeed())
      rdindex=random.randint(0,len(arr)-1)
      rdtext=arr[rdindex]
      text = re.sub(pattern, rdtext, text,count=1)
   p.prompt=text  
    

def getSeed():
     seed = random.random()
     return seed
 
