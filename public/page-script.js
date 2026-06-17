function getPat(){
try{var p=localStorage.getItem("ghf_pat");if(p)return p}catch(ex){}
return null
}
window.addEventListener("message",function(e){
if(e.source!==window||e.data?.type!=="GHF_API_REQUEST")return;
var i=e.data,id=i.id,method=i.method,body=i.body,url=i.url;
var fullUrl=url.indexOf("http")===0?url:"https://api.github.com/"+url;
var h={Accept:"application/vnd.github.v3+json"};
if(body)h["Content-Type"]="application/json";
var opts={method:method||"GET",headers:h,credentials:"include",body:body!==void 0?JSON.stringify(body):void 0};
try{var p=localStorage.getItem("ghf_pat");if(p){h["Authorization"]="token "+p;opts.credentials="omit"}}catch(ex){}
fetch(fullUrl,opts)
.then(function(r){return r.json().then(function(d){return{status:r.status,data:d}}).catch(function(){return{status:r.status,data:null}})})
.then(function(res){window.postMessage({type:"GHF_API_RESPONSE",id:id,status:res.status,data:res.data,error:void 0},"*")})
.catch(function(ex){window.postMessage({type:"GHF_API_RESPONSE",id:id,status:0,data:void 0,error:ex.message},"*")});
});
