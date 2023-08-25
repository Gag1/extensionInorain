// getting images
const enabledExt = localStorage.getItem('enabledExt');
const enabledExtParsed = JSON.parse(enabledExt);
const closePng = chrome.runtime.getURL("content-img/close.png");
const flag = chrome.runtime.getURL("content-img/flag.png");
const sla = chrome.runtime.getURL("content-img/sla.png");
const formKit = chrome.runtime.getURL("content-img/formkit_tools.png")
const js = chrome.runtime.getURL("content-img/js.png");
const search = chrome.runtime.getURL("content-img/search.png");
const pen = chrome.runtime.getURL("content-img/penincircle.png");
const dragdrop = chrome.runtime.getURL("content-img/dragdrop.png");
const arrowTop = chrome.runtime.getURL("content-img/arrow-top.png");
const gallery = chrome.runtime.getURL("content-img/gallery.png");
const play = chrome.runtime.getURL("content-img/play.png");
const toolb = document.createElement('div');
toolb.classList.add('toolbar');

if (enabledExtParsed) {   
  changeBackgroundColor(enabledExtParsed);

} else {
  changeBackgroundColor(enabledExtParsed);
}

function makeTooltipRequestIncludingHtmlCode(){


  const addTooltipInformation = document.createElement('div');
  addTooltipInformation.classList.add("addTooltipInformation");
  
  const tooltipDiv = `
    <div class="tooltipDiv" >
      <img class="closeTooltipDiv" src="${closePng}" >
      <input class="tooltipDivInput" placeholder="Title" type="text" >
      <br> <br>
      <div class="tooltipDivTextarea" class="textareaDetails">
      <textarea class="tooltipTextarea" placeholder="Description" name="" id="" cols="30" rows="10"></textarea>
       <div class="bottom-images">
          <img class="tooltipDivGalery"  src="${play}">
          <img class="tooltipDivVideo" src="${gallery}">
       </div>
      </div>
      <br>
      <button class="saveTooltipBtn"> Save </button>
  </div>
  `;
        // <p class="canSkipBtn"> <img class="canSkipImg" src="${arrowTop}"> Can Skip </p>

  addTooltipInformation.style.display = "none";
  addTooltipInformation.innerHTML = tooltipDiv;
  document.body.appendChild(addTooltipInformation);
  const closeTooltipDiv = document.querySelector('.closeTooltipDiv');
  closeTooltipDiv.addEventListener('click',() =>{
    addTooltipInformation.style.display = "none"
  })


 
}

function openTooltipsIncludingHtmlCode() {
  const toursWindowParent = document.createElement('div');
  toursWindowParent.classList.add('toursWindowParent');
  

  const dndDiv = `
  <div class="tours-window1">
  <img class="closeBtn" src="${closePng}" alt="">
  <div class="search-tour1">
      <img src="${search}" alt="">
      <input class="tours-search-input" placeholder="Search tour" type="text">
  </div>
  <div class="toursdnd">
    
    </div>
  </div>
  `;
  toursWindowParent.innerHTML = dndDiv;
  document.body.appendChild(toursWindowParent)


  const toursdnd = document.querySelector('.toursdnd');
  for (let i = 0; i < 6; i++) {
     const tour1 = document.createElement('div');
     tour1.classList.add('tour1');
     tour1.innerHTML = `
        <div class="details1">
        <img class="dragdrop" src="${dragdrop}" alt="">
                <div class="inner-details1">
                <p class="tours-p">Element: h${i}.div</p>
                <img class="flag-img" src="${flag}" alt="">
                <input disabled class="tours-input" type="text" value="Title of the tour">
                <div class="last-images">
                    <img class="edit" src="${pen}" alt="">
                    <img class="remove" src="${closePng}" alt="">
                </div>
            </div>
        </div>
     `;
     toursdnd.appendChild(tour1);
}
 



toursWindowParent.style.display = 'none';

  // toursWindowParent.style.right = "306px";
  // toursWindowParent.style.bottom = "100px";
  // toursWindowParent.style.zIndex = "9999999999999999999";
  // toursWindowParent.style.display = "none";

  const cloeseBtn = document.querySelector('.closeBtn');
  cloeseBtn.addEventListener('click',() =>{
    toursWindowParent.style.display = "none";
  })

  // drag and drop logic 

const sortableList = document.querySelector('.toursdnd');
const tour = sortableList.querySelectorAll('.tour1');

tour.forEach(t =>{
    t.addEventListener('dragstart',() =>{
        setTimeout(() => {
            t.classList.add('dragging')
        }, 0);
    })
    t.addEventListener('dragend',() => t.classList.remove('dragging'))
});

const initSortableList = (e) =>{
    e.preventDefault()
    const draggingItem = sortableList.querySelector('.dragging')
    const ab = [...sortableList.querySelectorAll(".tour1:not(.dragging)")];
    let a = ab.find((item) =>{
        return e.clientY <= item.offsetTop + item.offsetHeight / 2;
    })
    
    sortableList.insertBefore(draggingItem,a)

}

sortableList.addEventListener('dragover',initSortableList)


const removeBtn = document.querySelectorAll('.last-images .remove');
const editBtn = document.querySelectorAll('.last-images .edit');
const input = document.querySelectorAll('.tour1 input');

let disabled = true;
for (let i = 0; i < tour.length; i++) {
       removeBtn[i].addEventListener('click',() =>{
       tour[i].remove()
    } )
    editBtn[i].addEventListener('click',() =>{
        input[i].disabled = !disabled;
        disabled = !disabled;
    })
}

let closeDndLists = document.querySelector('.closeBtn');
      if(closeDndLists){
        closeDndLists.addEventListener('click',() =>{
            toursWindowParent.style.display = "none";
           
       })
      }

 /////////////////////////////////////
}




function actionBarIncludingHtmlCode() {
  // const toolbar = document.createElement('div');
  // toolbar.classList.add('toolbar');

 

  const contentOfToolbar = `


<img class="close-btn" style="cursor:pointer; width:34px;" src="${play}">

<div class="lis">
<br>
    <div class="li first-li">
        <img class="img-li" src="${flag}">
        <p class="p-li">Tours</p>
    </div>
    <div class="li second-li">
        <img class="img-li" src="${formKit}" >
        <p class="p-li">Tooltips</p>
    </div>
    <div class="li">
        <img class="img-li" src="${sla}" >
        <p class="p-li">Add Grabbers</p>
    </div>
    <div class="li">
        <img class="img-li" src="${js}">
        <p class="p-li">JS Documentation</p>
    </div>
</div>
`;
  toolb.innerHTML = contentOfToolbar;
  document.body.appendChild(toolb);

  const secondLi = toolb.querySelector('.lis .second-li');
  

  secondLi.addEventListener('click', (e) => {
    e.stopPropagation();
    const toursWindowParentForClick = document.querySelector('.toursWindowParent');
    toursWindowParentForClick.style.display = "block";
  })


  let isClickedOnBtn = false;


}



function onclickOpenPopup(left, top, width, tooltip) {
  tooltip.style.position = "absolute";
  tooltip.style.zIndex = 9999998;
  tooltip.style.cursor = "pointer";
  document.body.appendChild(tooltip);
  tooltip.style.display = "none";

  const tooltipElements = `
    <div class="tooltip-lists">
      <div class="tooltip-list addTooltipClickBtn">
          <img src="${formKit}">
          <p>Add tool tip </p>
      </div>
      <div class="tooltip-list">
          <img src="${flag}">
          <p>Mark as tour item </p>
      </div>
      <div class="tooltip-list lnXdpd">
          <img src="${sla}">
          <p>Add attention grabber</p>
      </div>
  </div>
`;
  tooltip.innerHTML = tooltipElements;

  document.body.appendChild(tooltip);

  const addTooltipClickBtn = document.querySelector('.addTooltipClickBtn');
  addTooltipClickBtn.addEventListener('click',() =>{
    const tooltipPosition = tooltip.getBoundingClientRect();
     const addTooltipInformation = document.querySelector('.addTooltipInformation');
     addTooltipInformation.style.display = "inline-block";
     addTooltipInformation.style.position = "absolute";
     addTooltipInformation.style.left = tooltipPosition.left + "px";
     addTooltipInformation.style.top = tooltipPosition.top - 50 + "px" ;
     
  })
}


function changeBackgroundColor(enabled) {
  actionBarIncludingHtmlCode();
  openTooltipsIncludingHtmlCode();
  makeTooltipRequestIncludingHtmlCode();
  

  const hideBarBtn = document.querySelector('.close-btn');
  
  hideBarBtn.addEventListener('click',() =>{
      removeElementsHTML()
      discard();
       
  })


  function discard() {
    return document.onmouseover = null;
  }


  if (!enabled) {
    discard()
    return
  };




  document.onmouseover = (e) => handleMouseOver(e);


  const coverDiv = document.createElement('div');
  coverDiv.classList.add("cover3Div");
  document.body.appendChild(coverDiv);


  const tooltip = document.createElement('div');
  tooltip.classList.add('tool3Tip');

  let firstTarget;
  let endMouseOver = false;



  let bool = false;
  let bool2 = false;
  let bool3 = false;
  let _currentTargetElement;
  
  const tooltipDivInput = document.querySelector('.tooltipDivInput');
  const tooltipTextarea = document.querySelector('.tooltipTextarea');

  const saveTooltipBtn = document.querySelector('.saveTooltipBtn');
  saveTooltipBtn.addEventListener('click',() =>{
    const contentLoginToken = localStorage.getItem('login-token-content');
    const currentUrl = window.location.href;
    const hashCode = hashElementCoordinates(_currentTargetElement);
      fetch('https://product-gid-api.inorain.com/admin/tooltip/addToolTip',{
        method:'POST',
        headers:{"Content-Type":"application/json",'authorization':`Bearer ${contentLoginToken}`},
        body:JSON.stringify({
          name:tooltipDivInput.value,
          description:tooltipTextarea.value,
          page_url:currentUrl,
          node_id:hashCode
      })

      }).then(() =>{
        getTooltipsAndShow()
      })
     
      

  })


  function handleMouseOver(e) {
   

    if (endMouseOver) return;
    
    e.defaultPrevented = true;
  
    bool = false;
    bool2 = false;
    bool3 = false;

   
    const toolbarCheckWhetherHover = document.querySelector('.toolbar');
    
    if(toolbarCheckWhetherHover){
      const classlist = e.target.classList[0];
      const isInParent = toolbarCheckWhetherHover.querySelector(`.${classlist}`);

      if(isInParent || e.target === toolbarCheckWhetherHover){
        bool = true;
      
      }
    }


      const showTooltipOnHover = document.querySelectorAll('.showTooltipOnHover');
      showTooltipOnHover.forEach((f) =>{
        f.style.display = "none";
      })
  




    // collecting special elements
    const toursWindow = document.querySelector('.tours-window1');
    if(toursWindow) {
      const classlist = e.target.classList[0];
      if (toursWindow.querySelector(`.${classlist}`)) {
        bool2 = true;
      }
    }
    const addTooltipInformation = document.querySelector('.addTooltipInformation');
    if(addTooltipInformation){
      const classlist = e.target.classList[0];
      if(addTooltipInformation.querySelector(`.${classlist}`)){
        bool3 = true;
      }
    }
    
    animation();
    function animation() {
  
      //    setTimeout(() => {
      function coverDivIncludingHtmlCode() {
        coverDiv.style.left = 0;
        coverDiv.style.top = 0;
        coverDiv.style.position = "absolute";
        coverDiv.style.background = "black";
        coverDiv.style.width = "1920px";
        coverDiv.style.height = "1080px";
        coverDiv.style.opacity = 0.5;
        coverDiv.style.zIndex = 9999;
        coverDiv.style.overflow = "hidden"
        document.body.style.overflow = "hidden"
        coverDiv.style.boxSizing = "border-box";
      }
      coverDivIncludingHtmlCode();

      if (firstTarget && firstTarget !== e.target) {
        coverDiv.style.display = "none";
        firstTarget.style = null;

      }

      firstTarget = e.target;


      const positionTarget = e.target.getBoundingClientRect();


      onclickOpenPopup(positionTarget.left, positionTarget.top, positionTarget.width, tooltip);

      //


     



      // if (e.target === tooltip) return;
      //   if(e.target === toursWindow || e.target === toursWindowParent) return;
      tooltip.style.left = positionTarget.left + "px";
      tooltip.style.top = positionTarget.top - 200 + "px";
      if (positionTarget.top >= document.body.clientHeight - 200) {
        tooltip.style.top = positionTarget.top - 250 + "px";
      }
      if (positionTarget.left >= document.body.clientWidth - 200) {
        tooltip.style.left = positionTarget.left - 250 + "px";
      }
      if (positionTarget.top < 100) {
        tooltip.style.top = positionTarget.top + 30 + "px";
      }

      
      e.target.style.border = "1px solid green";
      e.target.style.zIndex = 9999999;
      e.target.style.position = "relative";
      coverDiv.style.display = "block";
    
     let toursInputs = document.querySelectorAll('.tours-input');
     for (let i = 0; i < toursInputs.length; i++) {
         toursInputs[i].style.position = "static";
     }


     //console.log(bool);
    
      if (bool2 || bool3 || bool) {
        e.target.style.border = "none";
      }
     
     
      tooltip.style.display = "none";
      e.target.onclick = (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        e.stopPropagation();
        e.preventDefault();
        if (!bool && !bool2 && !bool3) {
          tooltip.style.display = "block";
          tooltip.style.zIndex = 99999999;
          endMouseOver = true;
          _currentTargetElement = e;
        }

      }

      tooltip.onclick = () => {
        tooltip.remove();
        endMouseOver = false;
      }
      // }, 300);

    }

    e.target.id = 'removeStyle';

  }

}



function removeElementsHTML() {
  const tool3tip = document.querySelector('.tool3Tip');
  const cover3Div = document.querySelector('.cover3Div');
  const removeStyle = document.querySelectorAll('#removeStyle');
  for (let i = 0; i < removeStyle.length; i++) {
    if (removeStyle[i].style.border = "1px solid green") {
      removeStyle[i].style = null;
    }
  }
  if (tool3tip !== null) {
    tool3tip.remove();
  }
  if (cover3Div !== null) {
    cover3Div.remove();
  }
  if(toolbar !== null){
    toolbar.remove();
  }
}
const toolbar = document.querySelector('.toolbar');
getTooltipsAndShow()

if(!enabledExtParsed && toolbar){
  toolbar.style.display = "none";
}

// make requests to popup js

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  localStorage.setItem('enabledExt', request.enabled);
  changeBackgroundColor(request.enabled);


  const toolbar = document.querySelectorAll('.toolbar')
  if(request.token){
   localStorage.setItem('login-token-content',request.token);
  }
  if (request.action === 'extensionDisabled') {
    removeElementsHTML();
  
  }

  // if(request.action === 'extensionDisableWhenUserLoggedOut'){
  //   localStorage.removeItem('login-token-content');

  //   removeElementsHTML();


  // }

});


function getTooltipsAndShow(){
  
  const loginTokenContent = localStorage.getItem('login-token-content');
  
  if(!loginTokenContent) return;
  
    fetch('https://product-gid-api.inorain.com/admin/tooltip/getToolTips',{
    method:'GET',
     headers:{'authorization':`Bearer ${loginTokenContent}`}
   }).then((res) =>res.json()).then((res) =>{
       decodeElementCoordinates(res);
       console.log(res);
   })
}

function showTooltipWhenHover(res,field){


  res.rows.forEach((element,i) =>{
    

    const elementPosition = field[i].getBoundingClientRect();
    const showTooltipOnHover = document.createElement('div');
    showTooltipOnHover.classList.add('showTooltipOnHover');
    showTooltipOnHover.style.position = "absolute";
    showTooltipOnHover.style.left = elementPosition.left + elementPosition.width + "px";
    showTooltipOnHover.style.top = elementPosition.top + elementPosition.height + "px";
    
    showTooltipOnHover.classList.toggle('special2');

    if (elementPosition.top >= document.body.clientHeight - 200) {
      showTooltipOnHover.style.top = elementPosition.top - 100 + "px";
      showTooltipOnHover.classList.toggle('special2');

    }
    if (elementPosition.left >= document.body.clientWidth - 200) {

      showTooltipOnHover.style.left = elementPosition.left - 300 + "px";
    }
    if (elementPosition.top < 100) {

      showTooltipOnHover.style.top = elementPosition.top + 40 + "px";
    }


    const tooltipTitleDescription = `
        <div class="title-description">
            <div class="description">
              <p> ${element.description} </p>
            </div>
              <div class="title" >
                <h3>${element.name}</h3>
            </div>
        </div>
    `;
    showTooltipOnHover.innerHTML = tooltipTitleDescription;
    document.body.appendChild(showTooltipOnHover);

    field[i].style.zIndex = "999999999999"
    field[i].addEventListener("mouseover",() =>{
      console.log(1);
        showTooltipOnHover.style.display = "block";
    })

    field[i].addEventListener("mouseleave",() =>{
     console.log(0);
     setTimeout(() => {
      showTooltipOnHover.style.display = "none";

     }, 1000);
    })
    
  
  })
  //  const showTooltipOnHoverMouseover = document.querySelectorAll(".showTooltipOnHover");

    
} 


function hashElementCoordinates(event){ // event.x event.y
  
     const coordinates = event.target.getBoundingClientRect()
     const x1 = coordinates.left;
     const y1 = coordinates.top;
     let attributes = null;
     let codeIndex = null;
     let codeClass = null;
     let hashCode = null;
     if(event.target.className){
      const className = event.target.className;
      attributes = document.querySelectorAll(`.${className}`);
      codeClass = className;
       console.log("class");
       
      }else{
        const tagName = event.target.tagName;
        attributes = document.querySelectorAll(`${tagName}`);
        codeClass = tagName;
        console.log("tag");
      }
      
      attributes.forEach((el,i) =>{
       const coordinates = el.getBoundingClientRect();
       let x = coordinates.left;
       let y = coordinates.top;
 
        if(x1 === x && y1 === y){
          codeIndex = i;
        }
        
      })
      hashCode = codeClass + "/" + codeIndex;

      return hashCode;
   
}


function decodeElementCoordinates(res){
    let fields;
    let index;
    let arrOfHtmlElements = [];
    res.rows.forEach((element,i) =>{
      let attribute = element.node_id.split("/")[0];
      index = element.node_id.split("/")[1];

      fields = document.querySelectorAll(`.${attribute}`);
      const isClass = fields.length > 0;

      if (!isClass) {
        fields = document.getElementsByTagName(attribute);
      }
      //console.log(fields[index]);

      if (!fields[index]) return;
  

      
      arrOfHtmlElements.push(fields[index]);
    })

    showTooltipWhenHover(res,arrOfHtmlElements);

} 

