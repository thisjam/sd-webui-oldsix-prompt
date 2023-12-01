from typing import List

import numpy as np
from fastapi import FastAPI, Body
from fastapi.exceptions import HTTPException
from PIL import Image

import gradio as gr

from modules.api.models import *
from modules.api import api

from scripts import external_code, global_state
from scripts.old_six_prompt import APIResponse, loadRandomList



def prompt_api(_: gr.Blocks, app: FastAPI):
    @app.get("/old_six_prompt/version")
    async def version():
        return {"version": "SixGod_K提示词 v1.65.1"}

    @app.get("/old_six_prompt/all_prompts")
    async def prompts_list(update: bool = True):
        return APIResponse()

try:
    import modules.script_callbacks as script_callbacks

    script_callbacks.on_app_started(prompt_api)
except:
    pass
