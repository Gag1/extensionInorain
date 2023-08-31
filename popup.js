



function getProducts(){
  const token = localStorage.getItem('login-token')

  fetch('https://product-gid-api.inorain.com/admin/products',{
    method:'GET',
    headers: {'authorization':`Bearer ${token}`}
  }).then((res) => res.json())
   .then((res) =>{
    let lists = document.querySelector('.lists');
      if(res){
        lists.innerHTML = "";
       let products = res.rows;
       if(!products) return;
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

  sendCurrentTabUrl();
  getProducts()
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
      localStorage.setItem("login-token",res.token);
      sendCurrentTabUrl();
      // getProducts();
      chrome.extension.getViews({type: 'popup'}).forEach(v => v.close());
      loginCont.style.display = "none";
      header.style.display = "block";
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'loggedIn',enabled:true,token:res.token });
      });

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

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'loggedOut',enabled:false });
  })
  
    localStorage.removeItem("login-token");
    header.style.display = "none";
    loginCont.style.display = "block";
    localStorage.setItem('extension-enabled',false);
})


function sendCurrentTabUrl(){
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function 
  (tabs) {
      let url = tabs[0].url;
      let hostname = new URL(url).hostname;
      console.log(url);
      if(loginToken){
        fetch('https://product-gid-api.inorain.com/admin/products',{
          method:"POST",
          body:JSON.stringify({url:url,
            name:hostname}),
          headers:{'authorization':`Bearer ${loginToken}`,'content-type':'application/json'}
        }).then((res) => res.json()).then((res) =>{
            console.log(res);
            getProducts();
        })
        
      }
  });
}


