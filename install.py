'''
Author: Six_God_K
Date: 2024-03-28 09:32:28
LastEditors: Six_God_K
LastEditTime: 2024-04-07 23:45:47
FilePath: \webui\extensions\sd-webui-oldsix-prompt\install.py
Description: 

Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
'''
import pkg_resources
import launch
import requests
min_version = "2.31.0"
current_version = pkg_resources.get_distribution("requests").version
if not launch.is_installed('requests'):
            launch.run_pip("install requests")
else:
     if pkg_resources.parse_version(current_version) < pkg_resources.parse_version(min_version): 
             launch.run_pip("install --upgrade requests")
if not launch.is_installed('fastapi'):
            launch.run_pip("install fastapi")

