const Storage=(function(){
const K_USERS='sarp_users_v2',K_C='sarp_courses_v2',K_A='sarp_att_v2',K_M='sarp_marks_v2',K_CUR='sarp_cur_v2';
function s(k,v){localStorage.setItem(k,JSON.stringify(v))}
function g(k,f){let r=localStorage.getItem(k);if(!r) return f;try{return JSON.parse(r)}catch(e){return f}}
function defaultData(){
 const users=[
  {id:'admin1',name:'Admin User',role:'admin',password:'admin123'},
  {id:'t_ali',name:'Ali Khan',role:'teacher',password:'teach123'},
  {id:'s_ahmad',name:'Muhammad Ahmad',role:'student',password:'stud123'},
  {id:'s_hassan',name:'Hassan',role:'student',password:'stud123'}
 ];
 const courses=[
  {id:'CS101',title:'Introduction to Programming',teacherId:'t_ali',students:['s_ahmad','s_hassan']},
  {id:'CS102',title:'Data Structures',teacherId:'t_ali',students:['s_ahmad']}
 ];
 return {users,courses,attendance:[],marks:[]};
}
if(!g(K_USERS,null)){const d=defaultData();s(K_USERS,d.users);s(K_C,d.courses);s(K_A,[]);s(K_M,[]);}
return {
 getUsers:()=>g(K_USERS,[]),
 saveUsers:(u)=>s(K_USERS,u),
 getCourses:()=>g(K_C,[]),
 saveCourses:(c)=>s(K_C,c),
 getAttendance:()=>g(K_A,[]),
 saveAttendance:(a)=>s(K_A,a),
 getMarks:()=>g(K_M,[]),
 saveMarks:(m)=>s(K_M,m),
 setCurrent:(u)=>s(K_CUR,u),
 getCurrent:()=>g(K_CUR,null),
 clearCurrent:()=>localStorage.removeItem(K_CUR),
 resetAll:()=>{localStorage.removeItem(K_USERS);localStorage.removeItem(K_C);localStorage.removeItem(K_A);localStorage.removeItem(K_M);localStorage.removeItem(K_CUR);const d=defaultData();s(K_USERS,d.users);s(K_C,d.courses);s(K_A,[]);s(K_M,[]);}
};
})();