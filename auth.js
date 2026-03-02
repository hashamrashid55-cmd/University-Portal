const Auth=(function(){
function login(id,pw){const u=Storage.getUsers().find(x=>x.id===id&&x.password===pw);if(!u)return {ok:false,msg:'Invalid'};Storage.setCurrent({id:u.id,name:u.name,role:u.role});return {ok:true,user:{id:u.id,name:u.name,role:u.role}}}
function logout(){Storage.clearCurrent();location.href='index.html'}
function cur(){return Storage.getCurrent()}
return {login,logout,cur}
})();