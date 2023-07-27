listJson=[]

function loadNodes(){
    let Elements={
         prompt:getEle('#oldsix-prompt1'),
         prompt2:getEle('#oldsix-prompt2'),
         txt2img:getEle("#txt2img_toprow"),
         img2img:getEle("#img2img_toprow"),
         txtpromt:document.querySelector('#txt2img_prompt textarea'), 
         txtnpromt:document.querySelector('#txt2img_neg_prompt textarea'), 
         imgpromt:document.querySelector('#img2img_prompt textarea'), 
         imgnpromt:document.querySelector('#img2img_neg_prompt textarea'), 
         check1:null,
         check2:null
     } 
     return Elements
}

function getEle(key){
    return  gradioApp().querySelector(key)
}

 

function addPrompt(eve,text){
    let ischeck;
    let elementprompt;
    if(eve.dataset.page){
        ischeck=Elements.check2.checked
        elementprompt=ischeck?Elements.imgnpromt:Elements.imgpromt
    }else{
        ischeck=Elements.check1.checked
        elementprompt=ischeck?Elements.txtnpromt:Elements.txtpromt
    }
    
    elementprompt.value+=text+','
}

// function togglePrompt2(e){
//     console.log(e);
//     e.target.classList.toggle("showcontent")
// }
 
 
onUiLoaded(async =>{  
   Elements= loadNodes()

   Elements.check1= Elements.prompt.querySelector("input")
   Elements.check1.id="oldsix-check1"
   Elements.txt2img.parentNode.insertBefore(Elements.prompt,Elements.txt2img.nextSibling)
   let contents= Elements.prompt.querySelectorAll(".prose")
   contents.forEach(element => {
      element.classList.add("oldsix-content")
   });
   

   Elements.img2img.parentNode.insertBefore(Elements.prompt2,Elements.img2img.nextSibling)
   btns=Elements.prompt2.querySelectorAll(".oldsix-btn") 
   Elements.check2= Elements.prompt2.querySelector("input") 
   Elements.check2.id="oldsix-check2"
   for (const item of btns) {
       item.dataset.page='img2img'
   }
   let contents2= Elements.prompt2.querySelectorAll(".prose")
   contents2.forEach(element => {
      element.classList.add("oldsix-content")
   });
   

   
})

 


function CreatePanel(num){
    
  
}



 
 

 