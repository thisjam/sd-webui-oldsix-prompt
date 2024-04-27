'''
Author: Six_God_K
Date: 2024-04-26 22:05:49
LastEditors: Six_God_K
LastEditTime: 2024-04-27 11:26:14
FilePath: \webui\extensions\sd-webui-oldsix-prompt\scripts\transerver\llm.py
Description: 

Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
'''
import time
import os
import random
 

# from llama_cpp import Llama
try:
      from llama_cpp import Llama
      current_script = os.path.realpath(__file__)
      plug_script=os.path.dirname(os.path.dirname(os.path.dirname(current_script)))
      extension_path = os.path.join(plug_script,'models')
      def chat(question,modelName="qwen1_5-4b-chat-q2_k",Preset="Translate Chinese into English"):
        llm = Llama(
            model_path=os.path.join(extension_path,modelName)+'.gguf',
        )
        res=llm.create_chat_completion(
            messages = [
                {"role": "system", "content":Preset},
                {
                    "role": "user",
                    "content": question
                }
            ],
            temperature=1.2

        )
    
        return(res['choices'][0]["message"]['content'])


except Exception as e:
     err_msg='找不到llama_cpp模块'
     print(err_msg)
 