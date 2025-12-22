import{S as f,i as l}from"./assets/vendor-5ObWk2rO.js";(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))c(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&c(s)}).observe(document,{childList:!0,subtree:!0});function e(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerPolicy&&(o.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?o.credentials="include":t.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function c(t){if(t.ep)return;t.ep=!0;const o=e(t);fetch(t.href,o)}})();const p=document.querySelector(".search-form"),i=document.querySelector(".gallery"),u=document.querySelector(".loader"),d="53768760-b5f65296e9b3085f39f459f54";function m(){u.classList.remove("is-hidden")}function a(){u.classList.add("is-hidden")}const h=new f(".gallery a",{captionsData:"alt",captionDelay:250,captionPosition:"bottom"});p.addEventListener("submit",g);function g(n){n.preventDefault();const r=n.target.elements.query.value.trim();r&&(i.innerHTML="",y(r))}function y(n){m();const r=new URLSearchParams({key:d,q:n,image_type:"photo",orientation:"horizontal",safesearch:"true"});fetch(`https://pixabay.com/api/?${r}`).then(e=>e.json()).then(e=>{if(e.hits.length===0){a(),l.warning({message:"Sorry, there are no images matching your search query. Please try again!",position:"topRight",backgroundColor:"#EF4040",color:"#FFBEBE",messageColor:"#FAFAFB",icon:"fa fa-times-circle",iconColor:"rgba(250, 250, 251, 1)",timeout:5e3});return}b(e.hits)}).catch(()=>{a(),l.error({message:"Something went wrong. Please try again later.",position:"topRight"})})}function b(n){const r=n.map(e=>`
      <li class="gallery-item">
        <a href="${e.largeImageURL}">
          <img src="${e.webformatURL}" alt="${e.tags}" />
        </a>
        <div class="info">
          <p><b>Likes</b><span>${e.likes}</span></p>
          <p><b>Views</b><span>${e.views}</span></p>
          <p><b>Comments</b><span>${e.comments}</span></p>
          <p><b>Downloads</b><span>${e.downloads}</span></p>
        </div>
      </li>
    `).join("");i.innerHTML=r,L().then(()=>{a(),h.refresh()})}function L(){const n=i.querySelectorAll("img");return Promise.all([...n].map(r=>new Promise(e=>{r.complete?e():(r.addEventListener("load",e),r.addEventListener("error",e))})))}
//# sourceMappingURL=index.js.map
