let Elements;
const selectPrompts={}
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
        trans:getEleAll('.old-six-traninput'),
        tabtxt:getEle("#tab_txt2img"),
        tabimg:getEle("#tab_img2img"),
        autoComs:[],
      
        
        btnReload:[],
        btnClearP:[],
        btnClearNP:[],
        pClasses:[],
        txtLeftLayout:getEle('#txt2img_results'),
        imgLeftLayout:getEle('#img2img_results'),
        txtul:null,
        imgul:null
        
        

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
    ishas=false;
    for (const item of dom.classList) {
        if(item=='active'){     
            ishas=true
        }
    }
    if(!ishas){
         //删除带权重
        if(elementprompt.value.includes(str+':')){
            const teststr=`${str},|\\(${str}:\\d+\\.\\d+\\),`
            const regex =new RegExp(teststr);    
            // console.log(regex.test(elementprompt.value));       
            elementprompt.value= elementprompt.value.replace(regex,'');
             
        }
        //删除
        else{ 
            elementprompt.value= elementprompt.value.replace(str+',','');       
        }
        
        let selet=selectPrompts[dom.textContent] 
        if(selet){
            selet.li.parentNode.removeChild(selet.li)
            delete selectPrompts[dom.textContent] 
        }
       
        return //
    }
    
     //添加
    let ul =e.target.dataset.pageindex==1 ? Elements.imgul : Elements.txtul 
    let cn=dom.innerHTML
    let en=str 
    addLi(ul,cn,en,dom)
    updatatextToTextArea(elementprompt,en)
     
}


function addNPrompt(e) {
    let elementprompt = e.target.dataset.pageindex==1 ? Elements.imgnpromt : Elements.txtnpromt   
    elementprompt.focus();
    document.execCommand('insertText', false, e.target.dataset.sixoldtit + ',')
    closeAotuCom()
}

function updatatextToTextArea(inputelem,val){ 
    inputelem.value+=val+','
    updateInput(inputelem)
    closeAotuCom()
    
  
}

function closeAotuCom(){
    if(Elements.autoComs.length<2){
        Elements.autoComs=getEleAll(".autocompleteParent.p")
       
    }
    setTimeout(() => {
        Elements.autoComs.forEach(element => {
            element.style.display = "none";
        })
    }, 50) 


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
            btn.addEventListener('click', function () {
                addDicClasses(name, val, pageindex)
            });
          
            btn.addEventListener('contextmenu', function (e) {
                e.preventDefault();
                addDynamicToTextArea(btn, pageindex)
       
            })
        }

        return div
    } 
   
   return div
}

 

function addDynamicToTextArea(btnele,pageindex){
    let btns= btnele.parentNode.querySelectorAll('.oldsix-btn') 
    if(btns.length){
        let text='#['+btnele.textContent
        text+=']';
        let elementprompt =pageindex==1 ? Elements.imgpromt : Elements.txtpromt
        elementprompt.focus();
        document.execCommand('insertText', false, text + ',')
        closeAotuCom()
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
        let tabbtn=CreateEle('button',tabnav,tabButtonCss,key)
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
    let checkboxParents= getEleAll('.oldsix-checklock')
    checkboxParents.forEach(item=>{
        item.parentElement.classList.add('oldsix-inline')
    })
    Elements.trans.forEach((item,index)=>{
        item.classList.remove('block')
        let ul=CreateEle('ul',item,'oldsix-ul','')
        if(!index){
            Elements.txtul=ul
        }
        else{
            Elements.imgul=ul
        }
        item.onmousedown = function(event) {
           
            let istriggel=event.target.classList.contains("old-six-traninput");
            if(!istriggel)return
                
            // 获取div当前的x和y坐标
            var x = event.clientX - item.offsetLeft;
            var y = event.clientY - item.offsetTop;
            item.style.cursor = 'grabbing';
            document.onmousemove = function(event) {
              // 获取鼠标当前的位置
              var newX = event.clientX - x;
              var newY = event.clientY - y;
          
              // 设置div的新位置
              item.style.left = newX + 'px';
              item.style.top = newY + 'px';
            };
          
            document.onmouseup = function() {
              // 当鼠标松开时，移除mousemove和mouseup事件，以防止继续拖动
              item.style.cursor = 'grab';
              document.onmousemove = null;
              document.onmouseup = null;
            };
        };
    })
    getEle("#tab_txt2img").appendChild(Elements.trans[0])
    getEle("#tab_img2img").appendChild(Elements.trans[1])
}



 

function clearPrompt(pageindex){
   
     let textarea, container,ul
     if(pageindex==0){
        textarea=Elements.txtpromt;
        container=Elements.prompt
        ul=Elements.txtul
     }else{
        textarea=Elements.imgpromt;
        container=Elements.prompt2
        ul=Elements.imgul
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
     ul.innerHTML=''
  
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
             closeAotuCom() 
        })
    })

    
}
 
function getChineseIndex(str) {
    let matches = str.match(/[\u4e00-\u9fa5]/g);
    return matches ? matches.length : 0;
}

function translateText(text){
     
    text=JSON.parse(text)
    let ul=isTxtPage()? Elements.txtul : Elements.imgul;
    let elementprompt=getCurrentPromptsEle()
    if(text.origintext.includes("#[")||text.origintext.includes("<lora")) {
        addLi(ul,text.origintext,text.origintext)   
        updatatextToTextArea(elementprompt,text.origintext)    
        return
    }
    if(!text||!text.translate) return
   

    let cn,en
    let translate=text.translate.replaceAll('，',',')
    let origintext=text.origintext.replaceAll('，',',')  
    if(getChineseIndex(translate)>getChineseIndex(origintext)){
        cn=translate
        en=origintext
    }
    else{
        cn=origintext
        en=translate
    }
    if(cn){      
        let arrcn=cn.split(',').filter(Boolean);
        let arren=en.split(',').filter(Boolean);
 
        for (let i = 0; i < arrcn.length; i++) {
       
            addLi(ul,arrcn[i].trim(),arren[i].trim().toLowerCase())        
        }
        updatatextToTextArea(elementprompt,en.toLowerCase())    
    }
 
}

function addLi(parent,cn,en,btn=null){
   let li=CreateEle('li',parent,'','')
   li.setAttribute("draggable",'true')
    let data={
        en,
        w:1.0,
        btn,
        li,     
    }
 
    if(!btn){
        if(~en.indexOf(':')){      
            let splitstartIndex=en.lastIndexOf(':')
            data.w=en.substring(splitstartIndex+1, en.length-1);     
        }
     
     
    }
  
   li.dataset.en=en 
   selectPrompts[cn]={...data}
   let calculate =CreateEle('span',li,'alculate','')
   let addw =CreateEle('span',calculate,'add','+')
   let subw =CreateEle('span',calculate,'sub','-')
   let content =CreateEle('span',li,'content',cn)
   let close =CreateEle('span',li,'close','x')
   close.onclick=function(e){
       e.stopPropagation();
          delLi(li,cn)
   } 
    addw.onclick = function (e) {
        e.stopPropagation();
        ModifyWeidht(li,cn)
 
    } 
    subw.onclick = function (e) {
        e.stopPropagation();
        ModifyWeidht(li,cn,false)
       
    } 
    li.onmouseover=function(){
        hoverLi(li.dataset.en)
    }
    li.onmouseout=function(){
        let textarea =getCurrentPromptsEle()
        textarea.selectionStart = 0;
        textarea.selectionEnd = 0;
    }
  
    li.addEventListener('dragstart', handleDragStart, false);
    li.addEventListener('dragleave', handleDragLeave, false);
    li.addEventListener('dragend', handleDragEnd, false);
    
 

}
 
var dragSrcEl = null;
var initialX;
var dragTarget;
 

function handleDragStart(e) {
    dragSrcEl = this;
    initialX=e.clientX;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.outerHTML);
  }
  
 
function handleDragLeave(e) {
    let target = this;
    if (target !== dragSrcEl && target.tagName === 'LI') {
        const currentX = e.clientX;
        const deltaX = currentX - initialX;
        if (deltaX > 0) {
            // 向右拖动     
            target.after(dragSrcEl)
        } else if (deltaX < 0) {
            target.before(dragSrcEl)
        }
        dragTarget=target
    }
}

function getguid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
          v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
function handleDragEnd(e) {
    let targetTex=dragTarget.dataset.en;
    let originText=dragSrcEl.dataset.en;   
    let guid=getguid()
    let textarea =getCurrentPromptsEle()   
    let temptext=textarea.value;
    // console.log(temptext);
    temptext=temptext.replace(targetTex,guid)
    temptext=temptext.replace(originText,targetTex)
    temptext=temptext.replace(guid,originText)
    textarea.value=temptext
    updateInput(textarea)
   
}

  

function preciseAddOrSub(a, b,isadd=true) {
    let  scale = 1e12; // 选取一个适当的缩放因子
    if(isadd){
         return (a * scale + b * scale) / scale;
    }
   
    return  (a * scale - b * scale) / scale;
}
//isAdd 加权重
function ModifyWeidht(domli,cnkey,isAdd=true){
    let selectObj = selectPrompts[cnkey]
    let oldw = selectObj.w
   if (isAdd&&oldw >= 2 ) return
   if (!isAdd&&oldw <=0.1) return
   let domcontent=domli.querySelector('.content')
   selectObj.w=preciseAddOrSub(selectObj.w,0.1,isAdd)
 
      let newen=selectObj.en
      let newcn=domcontent.textContent
   
       
      if(~selectObj.en.indexOf('<lora')) {
        newen=selectObj.en.replace(':'+oldw,':'+selectObj.w)
        newcn=newcn.replace(':'+oldw,':'+selectObj.w)
          
      } 
      else if(selectObj.w!=1){
          newen = selectObj.en.replace("(", "").replace(")", "").replace(":" + oldw, "")
          newcn = domcontent.textContent.replace("(", "").replace(")", "").replace(":" + oldw, "")
          newen=`(${newen}:${selectObj.w})`
          newcn=`(${newcn}:${selectObj.w})`
         
      }
      else if(selectObj.w==1) {      
        newen = selectObj.en.replace("(", "").replace(")", "").replace(":" + oldw, "")
        newcn = domcontent.textContent.replace("(", "").replace(")", "").replace(":" + oldw, "")
         
      }
      domcontent.textContent=newcn
      let elepormpt=getCurrentPromptsEle()
      elepormpt.value=elepormpt.value.replace(selectObj.en,newen)
      selectObj.en=newen
      domli.dataset.en=newen
       
}


  

function delLi(domli,cnkey){  
   let btn=selectPrompts[cnkey].btn 
   if(btn){
       btn.classList.toggle("active")
       toggleNavCss(btn)    
   }
   let elementprompt =getCurrentPromptsEle()
   elementprompt.value= elementprompt.value.replace(selectPrompts[cnkey].en+',','');     
   domli.parentNode.removeChild(domli)
   delete selectPrompts[cnkey]
   updateInput(elementprompt)
}

 

function hoverLi(searchText) {
    let textarea =getCurrentPromptsEle()
    const text = textarea.value;
    // 寻找 searchText 在文本中的位置
    const startIndex = text.indexOf(searchText);
    if (startIndex !== -1) {
        const endIndex = startIndex + searchText.length;    
        // 设置选择范围
        textarea.selectionStart = startIndex;
        textarea.selectionEnd = endIndex;
        // 让文本框获取焦点
        textarea.focus();
        return[startIndex,endIndex]
    }
    return null
   
}



function isTxtPage(){
   return window.getComputedStyle(Elements.tabtxt).display=='block'
}

function getCurrentPromptsEle(){
    let res=isTxtPage();
    let el=res?Elements.txtpromt:Elements.imgpromt 
    return el
 }
 
function initTrans() {
    document.addEventListener('keydown', function (event) {
        if (event.altKey && event.key.toLowerCase() === 'q') {

            showTransUI();
        }

    });
}

function toggleDisplay(dom){
    dom.style.display = dom.style.display === 'block' ? 'none' : 'block';
}


function showTransUI(){
    let txtdisplay = window.getComputedStyle(Elements.tabtxt).display;
    let imgdisplay = window.getComputedStyle(Elements.tabimg).display;   
   
    if (txtdisplay === 'block') {
           toggleDisplay(Elements.trans[0])
           Elements.trans[0].querySelector('textarea').focus()
        
    }
    if (imgdisplay === 'block') {
        toggleDisplay(Elements.trans[1])
        Elements.trans[1].querySelector('textarea').focus()
    }
}

onUiLoaded(()=> {
    initData()
})

function initData(){
    move()   
    loadClearbtn()    
    initBtnsEvent() 
    loadCustomUI() 
    initTrans()
}


 
  
 
 




  