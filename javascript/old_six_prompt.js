listJson = []

function loadNodes() {
    let Elements = {
        prompt: getEle('#oldsix-prompt1'),
        prompt2: getEle('#oldsix-prompt2'),
        txt2img: getEle("#txt2img_prompt_container"),
        img2img: getEle("#img2img_prompt_container"),
        txtpromt: document.querySelector('#txt2img_prompt textarea'),
        txtnpromt: document.querySelector('#txt2img_neg_prompt textarea'),
        imgpromt: document.querySelector('#img2img_prompt textarea'),
        imgnpromt: document.querySelector('#img2img_neg_prompt textarea'),
        check1: null,
        check2: null
    }
    return Elements
}

function getEle(key) {
    return gradioApp().querySelector(key)
}


function addNPrompt(isimg2img,text){    
    let elementprompt= isimg2img?Elements.imgnpromt : Elements.txtnpromt
    elementprompt.focus();
    document.execCommand('insertText',false,text + ',')
}


function addPrompt(eve, text) {   
    let elementprompt= eve.dataset.page?Elements.imgpromt : Elements.txtpromt
    elementprompt.focus();
    document.execCommand('insertText',false,text + ',')
    // elementprompt.value += text + ','
}


 

onUiLoaded(async => {
    Elements = loadNodes()
  
    //    Elements.txt2img.parentNode.insertBefore(Elements.prompt,Elements.txt2img.nextSibling)
    Elements.txt2img.appendChild(Elements.prompt)
    let contents = Elements.prompt.querySelectorAll(".prose")
    contents.forEach(element => {
        element.classList.add("oldsix-content")
    });
    btns1 = Elements.prompt.querySelectorAll(".oldsix-btn")
    btns1.forEach(item=>{
        item.addEventListener('contextmenu',function(e){
            e.preventDefault();
            addNPrompt(item.dataset.page,item.dataset.sixoldtit)
          })
    })


    Elements.img2img.appendChild(Elements.prompt2)
    //    Elements.img2img.parentNode.insertBefore(Elements.prompt2,Elements.img2img.nextSibling)
    btns2 = Elements.prompt2.querySelectorAll(".oldsix-btn")
  
    for (const item of btns2) {
        item.dataset.page = 'img2img'
        item.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            addNPrompt(item.dataset.page,item.dataset.sixoldtit)
          })
    }
    let contents2 = Elements.prompt2.querySelectorAll(".prose")
    contents2.forEach(element => {
        element.classList.add("oldsix-content")
    });


   

})












