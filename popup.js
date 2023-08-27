// const tooltipA = document.querySelectorAll('.tooltip a')
// const tooltipBtn = document.querySelectorAll('.btn')
// let bool = false;

// for (let i = 0; i < tooltipBtn.length; i++) {
//   tooltipBtn[i].addEventListener("mouseover",(e) =>{
//     if(!bool){
//       tooltipA[i].style.visibility = "visible";
//     }else if(bool){
//       tooltipA[i].style.visibility = "hidden";

//     }
//     bool = !bool;

//   })
// }

function getProducts(){
  const token = localStorage.getItem('login-token')

  fetch('https://product-gid-api.inorain.com/admin/products/getProduct',{
    method:'GET',
    headers: {'authorization':`Bearer ${token}`}
  }).then((res) => res.json())
   .then((res) =>{
    let titleProject = document.querySelectorAll('.titleProject');
    let lists = document.querySelector('.lists');
    console.log(res)
      if(res){
        lists.innerHTML = ""
       let products = res.rows;
       products.forEach(product => {
        let div = `
        <div class="list">
             <img class="checkList" src="img/Checklist.png" alt="">
             <p class="titleProject">${product.name}</p>
             <div class="btn">
                 <div class="tooltip">
                     <a href="${product.url}"></a>
                 </div>
                 <img class="vector" src="img/Vector.png" alt="">
                 <p>Open project</p>
             </div>
         </div>
        `;
        lists.innerHTML += div;
       })

       const btns = document.querySelectorAll(".btn");
       btns.forEach((btn,i) => {
        btn.onclick = () => {
          window.open(products[i].url)

        }
       })
    
      }

     
   }).catch((e) =>{
    console.log(e);
   })
}






const loginCont = document.querySelector('.login-cont');
const form = document.querySelector('.login-cont form');
const username = form.querySelector('.username');
const password = form.querySelector('.password');
const header = document.querySelector('.header');
header.style.display = "none";

const loginToken = localStorage.getItem("login-token");
if(loginToken){
  header.style.display = "block";
  loginCont.style.display = "none";
}
const errorMessage = document.querySelector('.error-message');
let userEmail = document.querySelector('.userEmail');

form.addEventListener('submit',(e) =>{
  e.preventDefault();

  fetch('https://product-gid-api.inorain.com/admin/users/login',{
    headers: {
      "Content-Type": "application/json",
    },
    method:"POST",
    body: JSON.stringify({
      email:username.value,
      password:password.value
    })
  }).then((res) => res.json()).then((res) => {
  localStorage.setItem('user-email',username.value)
    if(res.token){
      userEmail.innerHTML = username.value;
      console.log(userEmail);
      sendCurrentTabUrl();
      localStorage.setItem("login-token",res.token);
      loginCont.style.display = "none";
      header.style.display = "block";
    return
    }
    errorMessage.innerHTML = res;
    errorMessage.style.color = "red";

  })

})

let userEmailFromLocalStorage = localStorage.getItem('user-email')
userEmail.innerHTML = userEmailFromLocalStorage;
const signup = document.querySelector('.signup');
signup.onclick = () =>{
  window.open('http://product-gid-web.inorain.com/')
}
const signOut = document.querySelector('.signOutBtn');
signOut.addEventListener('click',(e) =>{
  localStorage.removeItem("login-token");
  header.style.display = "none";
  loginCont.style.display = "block";
  localStorage.setItem('extension-enabled',false);

 

})

const enableExtension = document.getElementById('enableExtension');
const extensionEnabledValue = JSON.parse(localStorage.getItem('extension-enabled'))

if(extensionEnabledValue === null ){
  enableExtension.checked = false;
}else{
  enableExtension.checked = extensionEnabledValue;
}

getProducts();

sendCurrentTabUrl()



function sendCurrentTabUrl(){
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function 
  (tabs) {
      let url = tabs[0].url;
      let hostname = new URL(url).hostname;

      if(loginToken){
        fetch('https://product-gid-api.inorain.com/admin/products/createProduct',{
          method:"POST",
          body:JSON.stringify({url:url,
            name:hostname}),
          headers:{'authorization':`Bearer ${loginToken}`,'content-type':'application/json'}
        }).then(() =>{
          getProducts();
        })
        
      }
  });
  
  
 
}



enableExtension.addEventListener ('click', function (e) {
    localStorage.setItem('extension-enabled',e.target.checked);
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if(e.target.checked){
        chrome.tabs.sendMessage(tabs[0].id, { action: 'extensionEnabled',enabled:true,token:localStorage.getItem('login-token') });

         sendCurrentTabUrl();
      }else{
        chrome.tabs.sendMessage(tabs[0].id, { action: 'extensionDisabled', enabled:false});
     
      }
      });
  
 
});

if(enableExtension) enableExtension.checked = extensionEnabledValue;
