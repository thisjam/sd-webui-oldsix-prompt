
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

        btnReload:[],
        btnClearP:[],
        btnClearNP:[]
        

    }
    return Elements
}

function getEle(key) {
    return gradioApp().querySelector(key)
}

function CreateEle(type,parentDom,css,html){
    let dom= document.createElement(type)
    setCss(dom, css)
    dom.innerHTML=html
    parentDom.appendChild(dom)
    return dom
 }
 
function addNPrompt(e) {
    let elementprompt = e.target.dataset.pageindex==1 ? Elements.imgnpromt : Elements.txtnpromt
    elementprompt.focus();
    document.execCommand('insertText', false, e.target.dataset.sixoldtit + ',')
   
}


function getParentBycss(obj,css) {
    let parent=obj
    for (let i = 0; i < 10; i++) {
        parent=parent.parentNode
        if(parent.classList.contains(css)){
            return parent
        }
    }
    return null
}
  


function toggleNavCss(dom){

    let tabrow = getParentBycss(dom, 'tab-item')

    let tabnav = tabrow.parentNode.previousSibling;
    let activebtns = tabrow.querySelectorAll(".oldsix-btn.active")
    let target = tabnav.children[tabrow.dataset.tabitem]

    if (activebtns.length) {
        target.classList.add("active")
    }
    else {
        target.classList.remove("active")
    }


  
}
 
  
function addPrompt(e) {
    let dom=e.target;
    let str= e.target.dataset.sixoldtit + ','
    let elementprompt =e.target.dataset.pageindex==1 ? Elements.imgpromt : Elements.txtpromt
    dom.classList.toggle("active")
    toggleNavCss(dom)
    ishas=false;
    for (const item of dom.classList) {
        if(item=='active'){     
            ishas=true
        }
    }
    if(!ishas){
        elementprompt.focus(); 
        elementprompt.value=  elementprompt.value.replace(new RegExp(`(${str})`, 'g'), '');
        return
    }
   
    elementprompt.focus(); 
    document.execCommand('insertText', false,str)
   
     
}




async function getJsonStr() {
  
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let val1 = document.querySelector("#oldsix-area1 textarea").value
    let val2 = document.querySelector("#oldsix-area2 textarea").value
    return val1||val2
}

function clearTextarea(){
   document.querySelector("#oldsix-area1 textarea").value='area1'
   document.querySelector("#oldsix-area2 textarea").value='area2'
}

function createBtnTitle(name,parent){
   let div=document.createElement('div')
   let btn=document.createElement('button')
   setCss(div,'oldsix-row ')
   setCss(btn,'oldsix-btn-tit sm primary gradio-button svelte-1ipelgc')
   btn.innerHTML=name

   div.appendChild(btn)
   parent.appendChild(div)
   return div
}

function createBtnPrompt(key,val,parent,pageindex){ 
    let btn=document.createElement('button')
    setCss(btn,'sm secondary gradio-button svelte-1ipelgc oldsix-btn')
    btn.innerHTML=key
    btn.dataset.sixoldtit=val
    btn.dataset.pageindex=pageindex
    parent.appendChild(btn)
    btn.addEventListener('click',function(e){    
      
        addPrompt(e)
    })
    btn.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        addNPrompt(e)
    })
    
    return btn
 }
 
 
function traverse(obj,parent,pageindex) {
    for (var key in obj) {     
        if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                let resdom= createBtnTitle(key,parent)
                traverse(obj[key],resdom,pageindex);           
            } else {     
                createBtnPrompt(key,obj[key],parent,pageindex)
            }
        }
    }
}

function setCss(dom, css) {
    dom.setAttribute("class", css)
}

function tabClick(self){
    let selfdivs=self.parentNode.children
    let contents=self.parentNode.nextSibling.children
    let index=self.dataset.tabitem
  
    for (let i = 0; i < selfdivs.length; i++) {
        
        if(i==index){
            contents[i].classList.remove('six-hide')
            selfdivs[i].classList.add('selected')
        }
        else{
            contents[i].classList.add('six-hide')
            selfdivs[i].classList.remove('selected')
        }
        
    }
    

}
function reloadNodes(jsonstring, btnreloadDom) {
    let jsonObj = JSON.parse(jsonstring)
    let tabs = document.createElement('div')
    let tabnav = document.createElement('div')
    let contentContainer=document.createElement('div')
    let count=0
    Object.keys(jsonObj).forEach(function (key) {      
        let tabbtn=CreateEle('button',tabnav,'svelte-1g805jl',key)
        tabbtn.dataset.tabitem=count
        tabbtn.addEventListener('click',()=>{
            tabClick(tabbtn)
        })
        let tabitem=CreateEle('div',contentContainer,'tab-item six-hide','')
        tabitem.dataset.tabitem=count
        let content=CreateEle('div',tabitem,'oldsix-content','')
        if(count==0){
            tabbtn.classList.add('selected')
            tabitem.classList.remove('six-hide')
        }
        traverse(jsonObj[key],content,btnreloadDom.dataset.page)
        count++
    });
  
    setCss(tabs, 'oldsix-tabs gradio-tabs svelte-1g805jl')
    setCss(tabnav, 'oldsix-tab-nav scroll-hide svelte-1g805jl')
    setCss(contentContainer, 'tab-container')

    tabs.appendChild(tabnav)
    tabs.appendChild(contentContainer)
    btnreloadDom.parentNode.parentNode.appendChild(tabs)
}


async function loadCustomUI(){
    let jsonstr= await getJsonStr()        
    if (jsonstr) {
        
        reloadNodes(jsonstr, Elements.btnReload[0])
        reloadNodes(jsonstr, Elements.btnReload[1])
       
    }

}
function reloadUI(){
    
    divs= document.querySelectorAll('.oldsix-tabs')
    divs.forEach(item=>{
        item.remove()
    })
    loadCustomUI()
}

function move(){
    Elements = loadNodes()
    Elements.txt2img.appendChild(Elements.prompt)
    Elements.img2img.appendChild(Elements.prompt2)
    
}

function clearPrompt(pageindex){
   
     let textarea, container;
     if(pageindex==0){
        textarea=Elements.txtpromt;
        container=Elements.prompt
     }else{
        textarea=Elements.imgpromt;
        container=Elements.prompt2
     }
     textarea.value='';
     let tabs=container.querySelector(".oldsix-tab-nav").children
     let btns=container.querySelectorAll(".oldsix-btn.active")
     
     for (const item of tabs) {
        item.classList.remove('active')
     }
   
     btns.forEach(btn=>{
        btn.classList.remove('active')
     })
  
}

function clearNPrompt(pageindex){
   
    let textarea=pageindex=='1'?Elements.imgnpromt:Elements.txtnpromt;
    textarea.value='';
}

function loadClearbtn(){
  let btns1= Elements.prompt.querySelectorAll('.oldsix-clear')
  let btns2= Elements.prompt2.querySelectorAll('.oldsix-clear')
  btns1.forEach(item=>item.dataset.page='0')
  btns2.forEach(item=>item.dataset.page='1')
  Elements.btnClearP.push(btns1[0])
  Elements.btnClearP.push(btns2[0]) 
  Elements.btnClearNP.push(btns1[1])
  Elements.btnClearNP.push(btns2[1])

  Elements.btnClearP.forEach(item=>{
    item.addEventListener('click',function(e){
        clearPrompt(item.dataset.page)    
    })
  });
  Elements.btnClearNP.forEach(item=>{
    item.addEventListener('click',function(e){
        clearNPrompt(item.dataset.page)    
    })
  })
}


onUiLoaded(async => {
    move()
    
    loadClearbtn()



    Elements.btnReload= document.querySelectorAll('.oldsix-reload');
    Elements.btnReload.forEach((item,index) => {
        item.dataset.page=index
        item.addEventListener('click', () => {  
            reloadUI()               
        })
    })

    loadCustomUI() 

})












