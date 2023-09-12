
function loadNodes() {
    let Elements = {
        prompt: getEle('#oldsix-prompt1'),
        prompt2: getEle('#oldsix-prompt2'),
        txt2img: getEle("#txt2img_prompt_container"),
        img2img: getEle("#img2img_prompt_container"),

        txtpromt: getEle('#txt2img_prompt textarea'),
        txtnpromt: getEle('#txt2img_neg_prompt textarea'),

        imgpromt: getEle('#img2img_prompt textarea'),
        imgnpromt: getEle('#img2img_neg_prompt textarea'),
        RdtxtAreasEn:getEleAll('#randomTextEn textarea'),
        RdtxtAreasZh:getEleAll('#randomTextZh textarea'),
        btnSends:getEleAll('.oldsix-btnSend'),
        txtStart:getEleAll('.oldsix-txt-start textarea'),
        txtEnd:getEleAll('.oldsix-txt-end textarea'),
        
        btnReload:[],
        btnClearP:[],
        btnClearNP:[],
        pClasses:[],
        
        

    }
    return Elements
}

let dicClass={
   0:{},
   1:{}
}

let tabButtonCss="svelte-1g805jl svelte-kqij2n"
let subClassBtnTitleCss="svelte-1ipelgc svelte-cmf5ev"
 
 
const loadTime=3000
 
let currentTabName = ''

let hasDynamicPrompts = false
  

function getEle(key) {
    return gradioApp().querySelector(key)
}
function getEleAll(key) {
    return gradioApp().querySelectorAll(key)
}

function CreateEle(type,parentDom,css,html){
    let dom= document.createElement(type)
    setCss(dom, css)
    dom.innerHTML=html
    parentDom.appendChild(dom)
    return dom
 }
 
 function addPrompt(e) {
    let dom=e.target;
    let str= e.target.dataset.sixoldtit
    
    let elementprompt =e.target.dataset.pageindex==1 ? Elements.imgpromt : Elements.txtpromt
    dom.classList.toggle("active")
    toggleNavCss(dom)
    let ishas = false;
    for (const item of dom.classList) {
        if(item=='active'){     
            ishas=true
        }
    }
    if(!ishas){
          
        if(elementprompt.value.includes(str+':')){
            const teststr=`${str},|\\(${str}:\\d+\\.\\d+\\),`
            const regex =new RegExp(teststr);    
            console.log(regex.test(elementprompt.value));       
            elementprompt.value= elementprompt.value.replace(regex,'');
             
        }
        else{
            elementprompt.value= elementprompt.value.replace(str+',','');       
        }
        return
    }
    updatatextToTextArea(elementprompt,str)
}


function addNPrompt(e) {
    let elementprompt = e.target.dataset.pageindex==1 ? Elements.imgnpromt : Elements.txtnpromt   
    elementprompt.focus();
    document.execCommand('insertText', false, e.target.dataset.sixoldtit + ',')
   
}

function updatatextToTextArea(inputelem,val){ 
    inputelem.value+=val+','
    updateInput(inputelem)
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
 
  




async function getJsonStr() {
  
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let val1 = document.querySelector("#oldsix-area1 textarea").value
    let val2 = document.querySelector("#oldsix-area2 textarea").value
    return val1||val2
}

function clearTextarea(){
    let elarea1= document.querySelector("#oldsix-area1 textarea")
    let elarea2= document.querySelector("#oldsix-area2 textarea")
    elarea1.value=''
    elarea2.value=''
    updateInput(elarea1)
    updateInput(elarea2)
}

function createBtnTitle(name,val,parent,pageindex){
  
   let div=document.createElement('div')
   let btn=document.createElement('button')
   setCss(div,'oldsix-row ')
   setCss(btn,`oldsix-btn-tit sm primary gradio-button ${subClassBtnTitleCss}`)
   btn.innerHTML=name
   div.appendChild(btn)
   parent.appendChild(div)
   for (const key in val) {
       if (typeof val[key] != 'object' ){
            btn.addEventListener('click', function (e) {
                if (hasDynamicPrompts) {
                    addDynamicTitlePrompt(e, name, pageindex)
                } else {
                    addDicClasses(name,val,pageindex)
                }
            });
          
            btn.addEventListener('contextmenu', function (e) {
                e.preventDefault();
                if (hasDynamicPrompts) return
                addDynamicToTextArea(btn, pageindex)
       
            })
        }

        return div
    } 
   
   return div
}


function addDynamicPrompt (e, parent) {
    const dom = e.target
    const str = e.target.dataset.sixoldtit
    const tagLength = parent.querySelectorAll('.oldsix-btn').length
    const activeBtns = parent.querySelectorAll('.oldsix-btn.active')
    const activeTags = []
    activeBtns.forEach(item => activeTags.push(item.dataset.sixoldtit))

    dom.classList.toggle("active")
    toggleNavCss(dom)

    const elementprompt = e.target.dataset.pageindex === 1 ? Elements.imgpromt : Elements.txtpromt

    if (tagLength === activeTags.length) {
        const titleDom = parent.querySelector('.oldsix-btn-tit')
        titleDom.classList.toggle("active")
        toggleNavCss(titleDom)
        const deleteIndex = activeTags.findIndex(e => e === str)
        activeTags.splice(deleteIndex, 1)
        const value = '{' + activeTags.join('|') + '}'
        elementprompt.value = elementprompt.value.replace(`__dp/${currentTabName}/${titleDom.innerHTML}__`, value);       
        return
    }

    const hasAdd = Array.from(dom.classList).includes('active')

    const regex = /{([^{}]+)}/g
    const matches = elementprompt.value.match(regex)
    let currentMatch = ''
    if (matches && matches.length && activeTags.length) {
        currentMatch = matches.find(item => activeTags.every((e) => item.includes(e)))
        if (currentMatch) { // 针对当前的动态语句做处理
            const currentTags = currentMatch.substring(1, currentMatch.length - 1).split('|') // 只保留tag
            if (hasAdd) {
                currentTags.push(str)
            } else {
                const index = currentTags.findIndex(item => item.includes(str))
                if (index !== -1) currentTags.splice(index, 1)
            }
            const finallyVal = currentTags.length ? '{' + currentTags.join('|') + '}' : ''
            elementprompt.value= elementprompt.value.replace(currentMatch, finallyVal);       
            return
        }
    }

    if (hasAdd) {
        updatatextToTextArea(elementprompt,`{${str}}`)
    }
}

function addDynamicTitlePrompt(e, str, pageindex) {
    let dom = e.target;
    currentTabName = currentTabName.replace(/[、|\|]/g, '_')
    const parent = dom.parentNode
    const btns = parent.querySelectorAll('.oldsix-btn')
    const activeBtns = parent.querySelectorAll('.oldsix-btn.active')
    const activeTags = []
    activeBtns.forEach(item => activeTags.push(item.dataset.sixoldtit))

    dom.classList.toggle("active")
    toggleNavCss(dom)
    let hasAdd = Array.from(dom.classList).includes('active')

    for (let btn of btns) {
        if (hasAdd === !Array.from(btn.classList).includes('active')) {
            btn.classList.toggle("active")
            toggleNavCss(btn)
        }
    }
    
    let elementprompt = pageindex === 1 ? Elements.imgpromt : Elements.txtpromt


    if(!hasAdd){
        elementprompt.value= elementprompt.value.replace(`__dp/${currentTabName}/${str}__,`, '');       
        return
    }

    if (activeTags.length) {
        const regex = /{([^{}]+)}/g
        const matches = elementprompt.value.match(regex)
        let currentMatch = ''
        if (matches && matches.length) {
            currentMatch = matches.find(item => activeTags.every((e) => item.includes(e)))
            if (currentMatch) { // 针对当前的动态语句做处理
                elementprompt.value= elementprompt.value.replace(currentMatch, `__dp/${currentTabName}/${str}__`);  
                return
            }
        }
    }
    
    updatatextToTextArea(elementprompt,`__dp/${currentTabName}/${str}__`)
     
}

 

function addDynamicToTextArea(btnele,pageindex){
    let btns= btnele.parentNode.querySelectorAll('.oldsix-btn') 
    if(btns.length){
        let text='#['+btnele.textContent
        text+=']';
        let elementprompt =pageindex==1 ? Elements.imgpromt : Elements.txtpromt
        elementprompt.focus();
        document.execCommand('insertText', false, text + ',')
    
    } 

}

function addDicClasses(key,val,pageindex)
{
    if(dicClass[pageindex][key]){
        return
    }
    let list=[]
    for (const key in val) {
        list.push({'key':key,'val':val[key]})
    }
    dicClass[pageindex][key]=list
    CreateClassesBtn(key,pageindex)
}

function CreateClassesBtn(btnName,pageindex)
{ 
   let btn=document.createElement('button')
   setCss(btn,`sm secondary gradio-button ${subClassBtnTitleCss}`)
   btn.innerHTML=btnName
   Elements.pClasses[pageindex].appendChild(btn);
   btn.addEventListener('click',function(){
       btn.parentElement.removeChild(btn)
       Reflect.deleteProperty(dicClass[pageindex], btnName);
   
   })

    
}



 


function createBtnPrompt(key,val,parent,pageindex){ 
    let btn=document.createElement('button')
    setCss(btn,`sm secondary gradio-button oldsix-btn ${subClassBtnTitleCss}`)
    btn.innerHTML=key
    btn.dataset.sixoldtit=val
    btn.dataset.pageindex=pageindex
    parent.appendChild(btn)
    btn.addEventListener('click',function(e){
        if (hasDynamicPrompts) {
            addDynamicPrompt(e, parent)
        } else {
            addPrompt(e)
        }
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
                let resdom= createBtnTitle(key, obj[key],parent,pageindex)
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
            currentTabName = selfdivs[i].innerHTML
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
        let tabbtn=CreateEle('button',tabnav, tabButtonCss, key)
        tabbtn.dataset.tabitem=count
        tabbtn.addEventListener('click',()=>{
            tabClick(tabbtn)
        })
        let tabitem=CreateEle('div',contentContainer,'tab-item six-hide','')
        tabitem.dataset.tabitem=count
        let content=CreateEle('div',tabitem,'oldsix-content','')
        if(count==0){
            currentTabName = key // Todo 特殊符号处理
            tabbtn.classList.add('selected')
            tabitem.classList.remove('six-hide')
        }
        traverse(jsonObj[key],content,btnreloadDom.dataset.page)
        count++
    });
  
    setCss(tabs, `oldsix-tabs gradio-tabs ${tabButtonCss}`)
    setCss(tabnav, `oldsix-tab-nav scroll-hide ${tabButtonCss}`)
    setCss(contentContainer, 'tab-container')
     
    tabs.appendChild(tabnav)
    tabs.appendChild(contentContainer)
    btnreloadDom.parentNode.parentNode.appendChild(tabs)
    
}


async function loadCustomUI(callback){
    let jsonstr= await getJsonStr()        
    if (jsonstr) {     
            reloadNodes(jsonstr, Elements.btnReload[0])
            reloadNodes(jsonstr, Elements.btnReload[1])    
            clearTextarea()    
    }
    callback&&callback()
   
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

function loadSwitchDynamic () {
    let switchDom1 = Elements.prompt.querySelector('.oldsix-switch-dynamic > label > input')
    let switchDom2 = Elements.prompt2.querySelector('.oldsix-switch-dynamic > label > input')
    let oldsixOptit1 = Elements.prompt.querySelector('#oldsix-optit') 
    let oldsixOptit2 = Elements.prompt2.querySelector('#oldsix-optit') 
    let oldsixRandom1 = Elements.prompt.querySelector('#oldsix-random') 
    let oldsixRandom2 = Elements.prompt2.querySelector('#oldsix-random') 
    hasDynamicPrompts = switchDom1.checked
    switchDom1.addEventListener('click', function (e){ // 文生图和图生图这个开关同步
        hasDynamicPrompts = e.target.checked
        switchDom2.checked = hasDynamicPrompts
        oldsixOptit1.style.display = hasDynamicPrompts ? 'none' : 'block'
        oldsixRandom1.style.display = hasDynamicPrompts ? 'none' : 'block'
    })
    switchDom2.addEventListener('click', function (e){
        hasDynamicPrompts = e.target.checked
        switchDom1.checked = hasDynamicPrompts
        oldsixOptit2.style.display = hasDynamicPrompts ? 'none' : 'block'
        oldsixRandom2.style.display = hasDynamicPrompts ? 'none' : 'block'
    })
}


function ranDomPropt(pageindex){ 
    let texten=''
    let textzh=''
    for (const key in dicClass[pageindex]) {
        let listcount=dicClass[pageindex][key].length
        let rdindex=GetRandomNum(listcount)
        let rdtarget=dicClass[pageindex][key][rdindex]
        texten+=rdtarget.val+','
        textzh+=rdtarget.key+','
    }  
    Elements.RdtxtAreasZh[pageindex].value=textzh
    Elements.RdtxtAreasEn[pageindex].value=texten
    
  
}

 
 
function GetRandomNum(Max) {
   return Math.floor(Math.random() * Max);
} 
function initBtnsEvent(){
    Elements.pClasses=document.querySelectorAll('.oldsix-classes-shop')
    Elements.btnReload= document.querySelectorAll('.oldsix-reload');
    Elements.btnRandoms= document.querySelectorAll('.btn-crandom');
    Elements.btnRandoms.forEach((item,index) => {     
        item.addEventListener('click', () => {  
            ranDomPropt(index)               
        })   
    })
    Elements.btnReload.forEach((item,index) => {
        item.dataset.page=index
        item.addEventListener('click', () => {  
            reloadUI()               
        })
    })
    Elements.btnSends.forEach((item,index) => { 
        item.addEventListener('click', () => {  
            let elementprompt=index==1 ? Elements.imgpromt : Elements.txtpromt
            elementprompt.value=''
            elementprompt.focus(); 
            let str=Elements.RdtxtAreasEn[index].value
            str=Elements.txtStart[index].value+str+Elements.txtEnd[index].value
            document.execCommand('insertText', false,str);   
        })
    })
    Elements.pClasses=document.querySelectorAll('.oldsix-classes-shop')
    Elements.btnReload= document.querySelectorAll('.oldsix-reload');
    Elements.btnRandoms= document.querySelectorAll('.btn-crandom');
    Elements.btnRandoms.forEach((item,index) => {     
        item.addEventListener('click', () => {  
            ranDomPropt(index)               
        })   
    })
    Elements.btnReload.forEach((item,index) => {
        item.dataset.page=index
        item.addEventListener('click', () => {  
            reloadUI()               
        })
    })
    Elements.btnSends.forEach((item,index) => { 
        item.addEventListener('click', () => {  
            let elementprompt=index==1 ? Elements.imgpromt : Elements.txtpromt
            elementprompt.value=''
            elementprompt.focus(); 
            let str=Elements.RdtxtAreasEn[index].value
            str=Elements.txtStart[index].value+str+Elements.txtEnd[index].value
            document.execCommand('insertText', false,str);   
        })
    })

    
}

 

onUiLoaded(()=> {

    initData()
})

function initData(){
    move()   
    loadClearbtn()
    loadSwitchDynamic() 
    initBtnsEvent() 
    loadCustomUI() 
}















