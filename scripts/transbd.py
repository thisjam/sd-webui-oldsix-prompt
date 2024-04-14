'''
Author: thisjam 3213441409@qq.cm
Date: 2024-01-02 14:11:27
LastEditors: Six_God_K
LastEditTime: 2024-04-08 08:33:53
FilePath: \webui\extensions\sd-webui-oldsix-prompt\scripts\transbd.py
Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
'''
import requests
import json


def decodeLong(data):
      
     return data['data'][0]['dst']

def decodeShort(data):
     result=json.loads(data['result'])  
     restcont=result['content'][0]['mean'][0]['cont']
     restext=list(restcont.keys())[0]
     return restext

def decodeText(data): 
    jsonObj=json.loads(data.content.decode('utf-8'))
    if(jsonObj['type']==1): # type=1||2
      return  decodeShort(jsonObj)
    else :
      return  decodeLong(jsonObj)  
   
def get(trans_text):
    print(requests.__version__)
    url1="https://fanyi.baidu.com/transapi"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }

    postdata1={
        "from": "zh",
        "to": "en",
        "query": trans_text,
        "source": "txt",
    }
    try:    
        res= requests.post(url1,headers=headers,data=postdata1)   
        return decodeText(res)

    except requests.exceptions.RequestException as e:
        print(f"err：{e}")
        return None    
 

if __name__ == '__main__':
#   print(get('(拼贴1.5),(关注细节),精细的细节,景深,极其细致的CG unity 8k壁纸,杰作,吸血鬼女孩,美丽的深紫色长发,(1个女孩:1.5),((详细的美丽蝴蝶) ),(黑色吊带裙:1.3),(((个展)),(水中卷毛)),(红水:1.2),(蓝色背景:1.3),(细节背景),(星空 在美丽的细节）,（朦胧的雾）,完美的细节,美丽华丽的项链,{{{真实细致的脸}}},高曝光,明亮的光线,（反光玻璃碎片：1.7）,（小玻璃球：1）, （宝石纹理：1.5）,彩色瞳孔细节,,（极光）,眼泪,电影角度,紫玫瑰花框,色差,（破镜：0.7）,Armin Hansen'))
  print(get('一个黄色头发的美女'))