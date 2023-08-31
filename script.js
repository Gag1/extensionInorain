// getting images
const enabledExt = localStorage.getItem("enabledExt");
const enabledExtParsed = JSON.parse(enabledExt);
const closePng = chrome.runtime.getURL("content-img/close.png");
const flag = chrome.runtime.getURL("content-img/flag.png");
const sla = chrome.runtime.getURL("content-img/sla.png");
const formKit = chrome.runtime.getURL("content-img/formkit_tools.png");
const js = chrome.runtime.getURL("content-img/js.png");
const search = chrome.runtime.getURL("content-img/search.png");
const pen = chrome.runtime.getURL("content-img/penincircle.png");
const dragdrop = chrome.runtime.getURL("content-img/dragdrop.png");
const arrowTop = chrome.runtime.getURL("content-img/arrow-top.png");
const gallery = chrome.runtime.getURL("content-img/gallery.png");
const play = chrome.runtime.getURL("content-img/play.png");
const toolb = document.createElement("div");
toolb.classList.add("product-gid-toolbar");

const loginTokenContentParsed = localStorage.getItem('login-token-content')
if(loginTokenContentParsed){
 changeBackgroundColor();
 if(!enabledExtParsed){
   getTooltipsAndShow();
 }
}



// creating div for tooltip's title and description request
function makeTooltipRequestIncludingHtmlCode() {
  const addTooltipInformation = document.createElement("div");
  addTooltipInformation.classList.add("product-gid-addTooltipInformation");

  const tooltipDiv = `
    <div class="product-gid-tooltipDiv" >
      <img class="product-gid-closeTooltipDiv" src="${closePng}" >
      <input class="product-gid-tooltipDivInput" placeholder="Title" type="text" >
      <br> <br>
      <div class="product-gid-tooltipDivTextarea" class="product-gid-textareaDetails">
      <textarea class="product-gid-tooltipTextarea" placeholder="Description" name="" id="" cols="30" rows="10"></textarea>
       <div class="product-gid-bottom-images">
       /*
          <img class="product-gid-tooltipDivGalery"  src="${play}">
          <img class="product-gid-tooltipDivVideo" src="${gallery}">
          */
       </div>
      </div>
      <br>
      <button class="product-gid-saveTooltipBtn"> Save </button>
  </div>
  `;
  // <p class="canSkipBtn"> <img class="canSkipImg" src="${arrowTop}"> Can Skip </p>

  addTooltipInformation.style.display = "none";
  addTooltipInformation.innerHTML = tooltipDiv;
  document.body.appendChild(addTooltipInformation);
  const closeTooltipDiv = document.querySelector(".product-gid-closeTooltipDiv");
  closeTooltipDiv.addEventListener("click", () => {
    addTooltipInformation.style.display = "none";
  });
}


// toursWindowParent --- tooltips from backend
function openTooltipsIncludingHtmlCode() {
  const tooltipsWindowParent = document.createElement("div");
  tooltipsWindowParent.classList.add("product-gid-tooltipsWindowParent");
  tooltipsWindowParent.style.display = "none";
  const dndDiv = `
  <div class="product-gid-tours-window1">
  <img class="product-gid-closeBtn" src="${closePng}" alt="">
  <div class="product-gid-search-tour1">
      <img src="${search}" alt="">
      <input class="product-gid-tours-search-input" placeholder="Search tour" type="text">
  </div>
  <div class="product-gid-toursdnd">
    
    </div>
  </div>
  `;
  tooltipsWindowParent.innerHTML = dndDiv;
  document.body.appendChild(tooltipsWindowParent);

  const toursdnd = document.querySelector(".product-gid-toursdnd");

  const loginTokenContent = localStorage.getItem("login-token-content");
  const currentUrl = window.location.href;
  console.log(`login token is ---> ${loginTokenContent}`);
  fetch(
    `https://product-gid-api.inorain.com/admin/tooltip?url=${currentUrl}`,
    {
      method: "GET",
      headers: { authorization: `Bearer ${loginTokenContent}` },
    }
  ).then((res) => res.json()).then((res) =>{

    if(!res.rows) return
    toursdnd.innerHTML = ""
    for (let i = 0; i < res.rows.length; i++) {
      const tour1 = document.createElement("div");
      tour1.classList.add("product-gid-tour1");
      tour1.innerHTML = `
        <div class="product-gid-details1">
                <div class="product-gid-inner-details1">
                <img class="product-gid-flag-img" src="${flag}" alt="">
                <input disabled class="product-gid-tours-input" type="text" value="${res.rows[i].description}">
                <div class="product-gid-last-images">
                    <img class="product-gid-edit" src="${pen}" alt="">
                    <img class="product-gid-remove" src="${closePng}" alt="">
                </div>
            </div>
        </div>
     `;
      toursdnd.appendChild(tour1);
    }
  

  tooltipsWindowParent.style.display = "none";

  const closeBtn = document.querySelector(".product-gid-closeBtn");
  if(closeBtn){
    closeBtn.addEventListener("click", () => {
      tooltipsWindowParent.style.display = "none";
     
    });
  }


  // drag and drop logic

  const sortableList = document.querySelector(".product-gid-toursdnd");
  const tour = sortableList.querySelectorAll(".product-gid-tour1");
  if(tour)
  tour.forEach((t) => {
      t.draggable = true;
    t.addEventListener("dragstart", () => {
      setTimeout(() => {
        t.classList.add("product-gid-dragging");
      }, 0);
    });
    t.addEventListener("dragend", () => t.classList.remove("product-gid-dragging"));
  });

  const initSortableList = (e) => {
    e.preventDefault();
    const draggingItem = sortableList.querySelector(".product-gid-dragging");
    const ab = [...sortableList.querySelectorAll(".product-gid-tour1:not(.product-gid-dragging)")];
    let a = ab.find((item) => {
      return e.clientY <= item.offsetTop + item.offsetHeight / 2;
    });
   sortableList.insertBefore(draggingItem, a);
  };

  sortableList.addEventListener("dragover", initSortableList);

  const removeBtn = document.querySelectorAll(".product-gid-last-images .product-gid-remove");
  const editBtn = document.querySelectorAll(".product-gid-last-images .product-gid-edit");
  const input = document.querySelectorAll(".product-gid-tour1 input");

  let disabled = true;
  for (let i = 0; i < tour.length; i++) {
    removeBtn[i].addEventListener("click", () => {
      tour[i].remove();
    });
    editBtn[i].addEventListener("click", () => {
      input[i].disabled = !disabled;
      disabled = !disabled;
    });
  }
});
  let closeDndLists = document.querySelector(".product-gid-closeBtn");
  if (closeDndLists) {
    closeDndLists.addEventListener("click", () => {
      tooltipsWindowParent.style.display = "none";
    });
  }

  /////////////////////////////////////
}



// <img class="product-gid-close-btn" src="${play}">
function actionBarIncludingHtmlCode() {
  const contentOfToolbar = `
  <div class="product-gid-container">
  <label class="product-gid-switch" for="checkbox">
    <input type="checkbox" class="product-gid-checkbox" id="checkbox" />
    <div class="product-gid-slider product-gid-round"></div>
  </label>
</div>

 <div class="product-gid-lis">
 <br>
  <div class="product-gid-li product-gid-first-li">
      <img class="product-gid-img-li" src="${flag}">
      <p class="product-gid-p-li">Tours</p>
  </div>
  <div class="product-gid-li product-gid-second-li">
      <img class="product-gid-img-li" src="${formKit}" >
      <p class="product-gid-p-li">Tooltips</p>
  </div>
  <div class="product-gid-li">
      <img class="product-gid-img-li" src="${sla}" >
      <p class="product-gid-p-li">Add Grabbers</p>
  </div>
  <div class="product-gid-li">
      <img class="product-gid-img-li" src="${js}">
      <p class="product-gid-p-li">JS Documentation</p>
  </div>
</div>
`;
  toolb.innerHTML = contentOfToolbar;
  document.body.appendChild(toolb);
  toolb.style.display = "block";
  

  
}







function onclickOpenPopup(left, top, width, onClickPopup) {
  onClickPopup.style.position = "absolute";
  onClickPopup.style.zIndex = 9999998;
  onClickPopup.style.cursor = "pointer";
  document.body.appendChild(onClickPopup);
  onClickPopup.style.display = "none";
  let scrTop = document.documentElement.scrollTop;

  const tooltipElements = `
  
    <div class="product-gid-tooltip-lists">
    <img class="product-gid-removeTooltipLists" src="${closePng}">
      <div class="product-gid-tooltip-list product-gid-addTooltipClickBtn">
          <img src="${formKit}">
          <p>Add tool tip </p>
      </div>
      <div class="product-gid-tooltip-list">
          <img src="${flag}">
          <p>Mark as tour item </p>
      </div>
      <div class="product-gid-tooltip-list product-gid-last-child">
          <img src="${sla}">
          <p>Add attention grabber</p>
      </div>
  </div>
`;
  onClickPopup.innerHTML = tooltipElements;

  document.body.appendChild(onClickPopup);

  const addTooltipClickBtn = document.querySelector(".product-gid-addTooltipClickBtn");
  addTooltipClickBtn.addEventListener("click", () => {
    const pos = onClickPopup.getBoundingClientRect();
    const cont = document.querySelector(".product-gid-addTooltipInformation");
    cont.style.display = "inline-block";
    cont.style.position = "absolute";
    if(pos.top > 250 && pos.top < 400){
      cont.style.display = "block";
      cont.style.left = pos.left + 60 + "px";
      cont.style.top = pos.top + scrTop - 200 + "px";
      if(pos.left > 1000){
        cont.style.left = pos.left - 300 + "px";
      }
      return
    }else if(pos.top > 400){
      cont.style.display = "block";
      cont.style.left = pos.left + 60 + "px";
      cont.style.top = pos.top + scrTop - 200 + "px";
      if(pos.left > 1000){
        cont.style.left = pos.left - 300 + "px";
      }
      return
    }
    if(pos.left > 1000){
      cont.style.display = "block";
      cont.style.left = pos.left - 250 + "px";
      cont.style.top = pos.top + scrTop + 30 + "px";
      return
    }
    cont.style.display = "block";
    cont.style.left = pos.left + 30 + "px";
    cont.style.top = pos.top + scrTop + 50 + "px";




  });
}




// the main function that controls almost everything
function changeBackgroundColor() {
  actionBarIncludingHtmlCode();
  openTooltipsIncludingHtmlCode();
  makeTooltipRequestIncludingHtmlCode();
 
  let currentElement;

  function setNoneSpecificElements(){
    let tooltipsWindowParent = document.querySelector('.product-gid-tooltipsWindowParent');
    let actionBar = document.querySelector('.product-gid-tool3Tip');
    let addTooltipInformation = document.querySelector('.product-gid-addTooltipInformation');
    if(tooltipsWindowParent) tooltipsWindowParent.style.display = "none";

    actionBar.style.display = "none";
    addTooltipInformation.style.display = "none";
   if(currentElement)  currentElement.style.border = "none";

  }

  let endMouseOver = true;
  let endMouseOver2 = true;
  const checkbox = document.getElementById('checkbox');
  if(checkbox){

    checkbox.addEventListener('click',(e) =>{
      localStorage.setItem('enabledExt',e.target.checked)
      let value = !e.target.checked;
      endMouseOver = value;
      endMouseOver2 = value;
      if(value){
        setNoneSpecificElements();
        getTooltipsAndShow()
      }
    })
  }

  
  const firstLi = document.querySelector('.product-gid-second-li');
  firstLi.addEventListener('click',(e) =>{
    const tooltipsWindowParentForClick = document.querySelector(".product-gid-tooltipsWindowParent");
    if(tooltipsWindowParentForClick){
      tooltipsWindowParentForClick.style.display = "block";
     
    }
    endMouseOver2 = true;
    addTooltipInformation.style.display = "none";
    onClickPopup.style.display = "none";
  });
  



  document.onmouseover = (e) => handleMouseOver(e);


  const onClickPopup = document.createElement("div");
  onClickPopup.classList.add("product-gid-tool3Tip");

  let firstTarget;

  let bool = false;
  let bool2 = false;
  let bool3 = false;
  let _currentTargetElement;

  const tooltipDivInput = document.querySelector(".product-gid-tooltipDivInput");
  const tooltipTextarea = document.querySelector(".product-gid-tooltipTextarea");

  const saveTooltipBtn = document.querySelector(".product-gid-saveTooltipBtn");
  const addTooltipInformation = document.querySelector(".product-gid-addTooltipInformation");

  saveTooltipBtn.addEventListener("click", () => {
    addTooltipInformation.style.display = "none";
    const contentLoginToken = localStorage.getItem("login-token-content");
    const currentUrl = window.location.href;
    const hashCode = hashElementCoordinates(_currentTargetElement);
    fetch("https://product-gid-api.inorain.com/admin/tooltip", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${contentLoginToken}`,
      },
      body: JSON.stringify({
        name: tooltipDivInput.value,
        description: tooltipTextarea.value,
        page_url: currentUrl,
        node_id: hashCode,
      }),
    }).then((res) => {
      tooltipDivInput.value = "";
      tooltipTextarea.value = "";
       getTooltipsAndShow();
        return res.json()
    }).then((res) =>{
      console.log(res);
      openTooltipsIncludingHtmlCode();
    })
  });

 

  function handleMouseOver(e) {

    if (endMouseOver || endMouseOver2 ) return;

    e.defaultPrevented = true;

    bool = false;
    bool2 = false;
    bool3 = false;

    const toolbarCheckWhetherHover = document.querySelector(".product-gid-toolbar");

    if (toolbarCheckWhetherHover) {
      const classlist = e.target.classList[0];
      const isInParent = toolbarCheckWhetherHover.querySelector(`.${classlist}`);

      if (isInParent || e.target === toolbarCheckWhetherHover) {
        bool = true;
      }
    }

    const showTooltipOnHover = document.querySelectorAll(".product-gid-showTooltipOnHover");
    showTooltipOnHover.forEach((f) => {
      f.style.display = "none";
    });

    const toursWindow = document.querySelector(".product-gid-tours-window1");
    if (toursWindow) {
      const classlist = e.target.classList[0];
      if (toursWindow.querySelector(`.${classlist}`)) {
        bool2 = true;
      }
    }
    const addTooltipInformation = document.querySelector(
      ".product-gid-addTooltipInformation"
    );
    if (addTooltipInformation) {
      const classlist = e.target.classList[0];
      if (addTooltipInformation.querySelector(`.${classlist}`)) {
        bool3 = true;
      }
    }
    
    animation();

    function animation() {
    //    coverDiv.style.height = document.documentElement.scrollTop + document.body.clientHeight + "px";;

      if (firstTarget && firstTarget !== e.target) {
        firstTarget.style = null;
      }

      firstTarget = e.target;

      const positionTarget = e.target.getBoundingClientRect();

      onclickOpenPopup(
        positionTarget.left,
        positionTarget.top,
        positionTarget.width,
        onClickPopup
      );

      

      // if (e.target === tooltip) return;
      //   if(e.target === toursWindow || e.target === tooltipsWindowParent) return;
      let scrTop = document.documentElement.scrollTop;

      onClickPopup.style.left = positionTarget.left + "px";
      onClickPopup.style.top =  positionTarget.top + scrTop- 200 + "px";

      if (positionTarget.top >= document.body.clientHeight - 200) {
        onClickPopup.style.top = positionTarget.top +scrTop - 300 + "px";
      }
      if (positionTarget.left >= document.body.clientWidth - 200) {
        onClickPopup.style.left = positionTarget.left - 250 + "px";
      }
      if (positionTarget.top < 100) {
        onClickPopup.style.top = positionTarget.top + scrTop + 30 + "px";
      }


      //  e.target.style.border = "1px solid white";
  
      //  e.target.style.zIndex = 9999999999999;
      //  e.target.style.position = "static";

      if (e.target.childNodes.length === 0) { 
        console.log("no child ");
      }


      let toursInputs = document.querySelectorAll(".product-gid-tours-input");
      for (let i = 0; i < toursInputs.length; i++) {
        toursInputs[i].style.position = "static";
      }


      if (bool2 || bool3 || bool) {
        e.target.style.border = "none";
      }


       if (!e.target.className.includes("product-gid")) {
        e.target.style.boxShadow = "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px";
        e.target.style.transition = "0.7s";
       }
        
  
      // if(e.target.onclick !== null){

      //   console.log(123321);
      //  }
      

        let clicked = false;
        //console.log(e.target.innerText);
        e.target.onclick = (ev) => {
        if (!ev.target.className.includes("product-gid")) {
          ev.preventDefault();
          ev.stopPropagation();
          currentElement = ev.target;
        }
   
        clicked = !clicked; 
        if (!bool && !bool2 && !bool3) {
          onClickPopup.style.display = "block";
          onClickPopup.style.zIndex = 999999999999;
          endMouseOver = clicked;
          _currentTargetElement = e;
        }
      };
    
      
      onClickPopup.onclick = (e) => {
        
        onClickPopup.remove();
         endMouseOver = false;
         
      };
     
      const addTooltipClickBtn = document.querySelector('.product-gid-addTooltipClickBtn');
      addTooltipClickBtn.addEventListener('click',() => endMouseOver2 = true);

      const closeTooltipDiv = document.querySelector('.product-gid-closeTooltipDiv');
      closeTooltipDiv.addEventListener('click', () => endMouseOver2 = false);

      const saveTooltipBtn = document.querySelector('.product-gid-saveTooltipBtn');
      saveTooltipBtn.addEventListener('click',() => endMouseOver2 = false);

      const closeBtn = document.querySelector('.product-gid-closeBtn');
      if(closeBtn){
        closeBtn.addEventListener('click',() =>{
          endMouseOver2 = false;
     
       });
      }
      
    }

    e.target.id = "product-gid-removeStyle";
  }
  
}


function removeElementsHTML() {
  const tool3tip = document.querySelector(".product-gid-tool3Tip");
  const cover3Div = document.querySelector(".product-gid-cover3Div");
  const tooltipsWindowParent = document.querySelector(".product-gid-tooltipsWindowParent");
  const removeStyle = document.querySelectorAll("#product-gid-removeStyle");
  const productGidToolbar = document.querySelector('.product-gid-toolbar');

  for (let i = 0; i < removeStyle.length; i++) {
    if ((removeStyle[i].style.border = "1px solid white")) {
      removeStyle[i].style = null;
    }
  }
  // xaytarakutyun dzel sa ...
  if (tool3tip !== null ) {
    tool3tip.remove();
  }
  if (cover3Div !== null) {
    cover3Div.remove();
  }
  if (tooltipsWindowParent !== null) {
    tooltipsWindowParent.remove();
  }
  if(productGidToolbar !== null){
    productGidToolbar.remove()
  }
}



chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  

  if(request.action === "loggedIn"){
    console.log('logged In');
    localStorage.setItem("login-token-content", request.token);
    localStorage.setItem('enabledExt',false)
   
    changeBackgroundColor();

  }

  if(request.action === "loggedOut"){
    console.log('logged out');
    localStorage.removeItem("login-token-content");
    localStorage.removeItem("enabledExt");
    removeElementsHTML();

  }
  
});




function getTooltipsAndShow() {
  const loginTokenContent = localStorage.getItem("login-token-content");
  
  if (!loginTokenContent) return;
  const currentUrl = window.location.href;

  let query = JSON.stringify({limit:100});
  

  fetch(`https://product-gid-api.inorain.com/admin/tooltip?url=${currentUrl}&query=${query}`, {
    method: "GET",
    headers: { authorization: `Bearer ${loginTokenContent}` },

  })
    .then((res) => res.json())
    .then((res) => {
      decodeElementCoordinates(res);
    });
}

function tooltipCreator(res, field) {
   
  res.rows.forEach((element, i) => {
    let scrTop = document.documentElement.scrollTop;

    if(!field[i]) return;
   
    const cont = document.createElement("div");
    cont.classList.add("product-gid-showTooltipOnHover");
    cont.style.position = "fixed";
    cont.style.boxShadow = "rgb(141 141 141 / 26%) 0px 16px 20px 8px";

    cont.classList.toggle("product-gid-special2");
    field[i].addEventListener("mouseover", () => { 
    
      let pos = field[i].getBoundingClientRect();
      const tooltipRects = {
        width: 250,
        height: 100,
        marginX: 10,
        marginY: 10,
        align: "center"
      }

        const isTop = pos.top < screen.height / 2
        const isLeft = pos.left < screen.width / 2

        let left;
        let top;

        if (isTop && isLeft) { // 2
          top = pos.top + pos.height + tooltipRects.marginY
          left = pos.left + tooltipRects.marginX
        }
        else if (isTop && !isLeft) { // 1
          top = pos.top + pos.height + tooltipRects.marginY
          left = pos.left  - tooltipRects.width + tooltipRects.marginX
        }
        else if (!isTop && isLeft) { // 3
          top = pos.top - tooltipRects.height - tooltipRects.marginY
          left = pos.left + tooltipRects.marginX
        }
        else if (!isTop && !isLeft) { // 4
          top = pos.top - tooltipRects.height - tooltipRects.marginY
          left = pos.left + tooltipRects.marginX - tooltipRects.width
        }
        cont.style.display = "block";
        cont.style.top = top + "px"
        cont.style.left = left + "px"
        cont.style.width = tooltipRects.width + "px"
        cont.style.height = tooltipRects.height + "px"

  

    const tooltipTitleDescription = `
    
        <div class="product-gid-title-description">
            <div class="product-gid-description">
              <p> ${element.description} </p>
            </div>
            <br><br>
              <div class="product-gid-title" >
                <h3>${element.name}</h3>
            </div>
        </div>
    `;
    cont.innerHTML = tooltipTitleDescription;
    document.body.appendChild(cont);
  
     field[i].style.zIndex = "999999999999999";
  
      cont.style.display = "block";
    });

    field[i].addEventListener("mouseleave", () => {
        cont.style.display = "none";
     
    });
  });
  
}

function hashElementCoordinates(event) {
  // event.x event.y
  const coordinates = event.target.getBoundingClientRect();
  const x1 = coordinates.left;
  const y1 = coordinates.top;
  let attributes = null;
  let codeIndex = null;
  let codeClass = null;
  let hashCode = null;

  if (event.target.classList.length > 0 ) {
    const className = event.target.classList[0];
    attributes = document.querySelectorAll(`.${className}`);
    codeClass = className;
  } else {
    const tagName = event.target.tagName;
    attributes = document.querySelectorAll(`${tagName}`);
    codeClass = tagName;
 
  }

  attributes.forEach((attribute, i) => {
    const attributeCoordinates = attribute.getBoundingClientRect();
    let x = attributeCoordinates.left;
    let y = attributeCoordinates.top;

    if (x1 === x && y1 === y) {
      codeIndex = i;
    }
  });
  hashCode = codeClass + "/" + codeIndex;
  // console.log(codeIndex);
  return hashCode;
}

function decodeElementCoordinates(res) {
  let fields;
  let index;
  let arrOfHtmlElements = [];
  if(!res.rows) return;
  res.rows.forEach((element, i) => {
    let attribute = element.node_id.split("/")[0];
    index = element.node_id.split("/")[1];
    fields = document.querySelectorAll(`.${attribute}`);
    const isClass = fields.length > 0;

    if (!isClass) {
      
      fields = document.getElementsByTagName(attribute);
      // if(fields.length == 0){
      //   console.log(attribute,"attribute");
      // };
    }

  
    if (!fields[index]) return;

    arrOfHtmlElements.push(fields[index]);
  });
  console.log(res,arrOfHtmlElements);
  tooltipCreator(res, arrOfHtmlElements);
}
