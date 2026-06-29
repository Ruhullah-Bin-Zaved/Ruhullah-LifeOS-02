/* ==========================================
   RUHULLAH LIFE OS
   app.js
   Version 1.0
========================================== */

"use strict";

/* ============================= */

const $ = (id) => document.getElementById(id);

const $$ = (q) => document.querySelectorAll(q);

/* ============================= */
/* USER */

const user = {

name:"Ruhullah",

height:185,

weight:117,

goalWeight:93,

calorieGoal:2300,

proteinGoal:160,

carbGoal:220,

fatGoal:65,

fiberGoal:35,

waterGoal:4

};

/* ============================= */

let state={

calories:0,

protein:0,

carbs:0,

fat:0,

fiber:0,

water:0,

meals:[],

weight:user.weight,

theme:"dark"

};

/* ============================= */
/* FOOD DATABASE */

const foods={

Egg:{
cal:72,
protein:6.3,
carb:.6,
fat:5,
fiber:0
},

Oats:{
cal:389,
protein:16.9,
carb:66.3,
fat:6.9,
fiber:10.6
},

"Soya Chunk":{
cal:345,
protein:52,
carb:33,
fat:.5,
fiber:13
},

Rice:{
cal:130,
protein:2.7,
carb:28,
fat:.3,
fiber:.4
},

"Chicken Breast":{
cal:165,
protein:31,
carb:0,
fat:3.6,
fiber:0
},

Fish:{
cal:120,
protein:22,
carb:0,
fat:3,
fiber:0
},

Milk:{
cal:60,
protein:3.3,
carb:5,
fat:3.2,
fiber:0
},

Banana:{
cal:89,
protein:1.1,
carb:23,
fat:.3,
fiber:2.6
},

Dates:{
cal:282,
protein:2.5,
carb:75,
fat:.4,
fiber:8
},

Besan:{
cal:387,
protein:22,
carb:58,
fat:6.7,
fiber:11
}

};

/* ============================= */
/* CLOCK */

function liveClock(){

const now=new Date();

const t=now.toLocaleTimeString();

const el=$("clock");

if(el) el.innerHTML=t;

}

setInterval(liveClock,1000);

/* ============================= */
/* SAVE */

function save(){

localStorage.setItem(

"lifeos",

JSON.stringify(state)

);

}

/* ============================= */
/* LOAD */

function load(){

const data=

localStorage.getItem("lifeos");

if(data){

state=JSON.parse(data);

updateDashboard();

}

}

/* ============================= */
/* UPDATE DASHBOARD */

function updateDashboard(){

if($("caloriesValue"))

$("caloriesValue").innerHTML=

Math.round(state.calories);

if($("proteinValue"))

$("proteinValue").innerHTML=

state.protein.toFixed(1)+" g";

if($("carbValue"))

$("carbValue").innerHTML=

state.carbs.toFixed(1)+" g";

if($("fatValue"))

$("fatValue").innerHTML=

state.fat.toFixed(1)+" g";

if($("fiberValue"))

$("fiberValue").innerHTML=

state.fiber.toFixed(1)+" g";

if($("waterValue"))

$("waterValue").innerHTML=

state.water.toFixed(1)+" L";

}

/* ============================= */
/* ADD FOOD */

function addFood(name,gram){

if(!foods[name]) return;

const f=foods[name];

const ratio=gram/100;

const item={

name,

gram,

cal:f.cal*ratio,

protein:f.protein*ratio,

carb:f.carb*ratio,

fat:f.fat*ratio,

fiber:f.fiber*ratio

};

state.meals.push(item);

state.calories+=item.cal;

state.protein+=item.protein;

state.carbs+=item.carb;

state.fat+=item.fat;

state.fiber+=item.fiber;

renderMeals();

updateDashboard();

save();

}

/* ============================= */
/* RENDER TABLE */

function renderMeals(){

const table=$("mealTable");

if(!table) return;

table.innerHTML="";

state.meals.forEach((m,i)=>{

table.innerHTML+=`

<tr>

<td>${m.name}</td>

<td>${m.gram} g</td>

<td>${m.cal.toFixed(0)}</td>

<td>${m.protein.toFixed(1)}</td>

<td>${m.carb.toFixed(1)}</td>

<td>${m.fat.toFixed(1)}</td>

<td>

<button onclick="deleteMeal(${i})">

Delete

</button>

</td>

</tr>

`;

});

}

/* ===== CONTINUE FROM HERE ===== */
/* ============================= */
/* DELETE MEAL */

function deleteMeal(index){

const meal=state.meals[index];

if(!meal) return;

state.calories-=meal.cal;
state.protein-=meal.protein;
state.carbs-=meal.carb;
state.fat-=meal.fat;
state.fiber-=meal.fiber;

state.meals.splice(index,1);

renderMeals();
updateDashboard();
updateProgress();
save();

}

/* ============================= */
/* FOOD BUTTON */

const addBtn=$("addFood");

if(addBtn){

addBtn.addEventListener("click",()=>{

const food=$("foodSelect").value;

const gram=parseFloat(

$("foodGram").value

);

if(isNaN(gram)||gram<=0){

alert("Enter gram.");

return;

}

addFood(food,gram);

$("foodGram").value="";

});

}

/* ============================= */
/* WATER */

function addWater(amount=.25){

state.water+=amount;

if(state.water>user.waterGoal)

state.water=user.waterGoal;

updateDashboard();

updateProgress();

save();

}

/* ============================= */
/* BMI */

function bmi(){

const h=user.height/100;

return (

user.weight/

(h*h)

).toFixed(1);

}

if($("bmiValue"))

$("bmiValue").innerHTML=bmi();

/* ============================= */
/* BMR */

function bmr(){

return Math.round(

10*user.weight+

6.25*user.height-

5*22+

5

);

}

if($("bmrValue"))

$("bmrValue").innerHTML=bmr();

/* ============================= */
/* TDEE */

function tdee(){

return Math.round(

bmr()*1.45

);

}

if($("tdeeValue"))

$("tdeeValue").innerHTML=tdee();

/* ============================= */
/* PROGRESS */

function updateProgress(){

const calorie=

(state.calories/user.calorieGoal)*30;

const protein=

(state.protein/user.proteinGoal)*30;

const water=

(state.water/user.waterGoal)*20;

const workout=10;

const study=10;

let total=

calorie+

protein+

water+

workout+

study;

if(total>100)

total=100;

const text=

document.querySelector(".center h1");

if(text)

text.innerHTML=

Math.round(total)+"%";

drawRing(total);

}

/* ============================= */
/* RING */

function drawRing(value){

const canvas=

$("progressCanvas");

if(!canvas) return;

const ctx=

canvas.getContext("2d");

canvas.width=220;

canvas.height=220;

ctx.clearRect(

0,

0,

220,

220

);

ctx.lineWidth=15;

ctx.strokeStyle=

"#23314d";

ctx.beginPath();

ctx.arc(

110,

110,

85,

0,

Math.PI*2

);

ctx.stroke();

ctx.strokeStyle=

"#4f7cff";

ctx.beginPath();

ctx.arc(

110,

110,

85,

-Math.PI/2,

(value/100)*Math.PI*2-

Math.PI/2

);

ctx.stroke();

}

/* ============================= */
/* THEME */

const themeBtn=

document.querySelector(

".fa-moon"

);

if(themeBtn){

themeBtn.addEventListener(

"click",

()=>{

document.body.classList.toggle(

"light"

);

state.theme=

document.body.classList.contains(

"light"

)

?"light":"dark";

save();

}

);

}

/* ============================= */
/* CALENDAR */

function generateCalendar(){

const grid=

$("calendarGrid");

if(!grid) return;

grid.innerHTML="";

for(let i=1;i<=35;i++){

const d=

document.createElement("div");

d.className="day";

d.innerHTML=i;

grid.appendChild(d);

}

}

generateCalendar();

/* ===== CONTINUE FROM HERE ===== */

/* ============================= */
/* SIMPLE CHARTS */

function drawMiniChart(id,data,color="#4f7cff"){

const canvas=$(id);

if(!canvas) return;

const ctx=canvas.getContext("2d");

canvas.width=350;

canvas.height=180;

ctx.clearRect(0,0,350,180);

ctx.lineWidth=4;

ctx.strokeStyle=color;

ctx.beginPath();

data.forEach((v,i)=>{

const x=20+i*45;

const y=160-v;

if(i===0){

ctx.moveTo(x,y);

}else{

ctx.lineTo(x,y);

}

});

ctx.stroke();

}

drawMiniChart(

"calorieChart",

[30,50,70,60,80,95,90]

);

drawMiniChart(

"weightAnalytics",

[30,35,45,55,65,75,90],

"#10b981"

);

drawMiniChart(

"studyChart",

[20,40,35,70,60,80,90],

"#8b5cf6"

);

drawMiniChart(

"waterChart",

[10,20,30,60,70,90,100],

"#38bdf8"

);

drawMiniChart(

"sleepChart",

[70,65,80,85,78,90,88],

"#fb923c"

);

drawMiniChart(

"workoutChart",

[20,60,50,90,80,95,100],

"#ef4444"

);

/* ============================= */
/* STREAK */

function updateStreak(){

let streak=

Number(

localStorage.getItem(

"streak"

)

)||0;

const today=

new Date()

.toDateString();

const last=

localStorage.getItem(

"lastLogin"

);

if(last!==today){

streak++;

localStorage.setItem(

"streak",

streak

);

localStorage.setItem(

"lastLogin",

today

);

}

document

.querySelectorAll(

".card h1"

)

.forEach(e=>{

if(

e.innerHTML.includes(

"Days"

)

){

e.innerHTML=

streak+" Days";

}

});

}

/* ============================= */
/* NOTES */

const note=

document.querySelector(

"textarea"

);

if(note){

note.value=

localStorage.getItem(

"notes"

)||"";

note.addEventListener(

"keyup",

()=>{

localStorage.setItem(

"notes",

note.value

);

}

);

}

/* ============================= */
/* WEIGHT */

function saveWeight(weight){

state.weight=weight;

localStorage.setItem(

"weight",

weight

);

}

function loadWeight(){

const w=

localStorage.getItem(

"weight"

);

if(w){

state.weight=

Number(w);

}

}

/* ============================= */
/* DAILY RESET */

function dailyReset(){

const today=

new Date()

.toLocaleDateString();

const saved=

localStorage.getItem(

"today"

);

if(saved!==today){

state.calories=0;

state.protein=0;

state.carbs=0;

state.fat=0;

state.fiber=0;

state.water=0;

state.meals=[];

localStorage.setItem(

"today",

today

);

save();

}

}

/* ============================= */
/* EXPORT */

function exportData(){

const blob=

new Blob(

[

JSON.stringify(

state,

null,

2

)

],

{

type:

"application/json"

}

);

const a=

document.createElement(

"a"

);

a.href=

URL.createObjectURL(

blob

);

a.download=

"LifeOS_Backup.json";

a.click();

}

/* ============================= */
/* IMPORT */

function importData(file){

const reader=

new FileReader();

reader.onload=e=>{

state=

JSON.parse(

e.target.result

);

save();

updateDashboard();

renderMeals();

updateProgress();

};

reader.readAsText(file);

}

/* ============================= */
/* MOTIVATION */

const quotes=[

"Discipline beats motivation.",

"One workout at a time.",

"Trust the process.",

"Progress over perfection.",

"Stay consistent.",

"Small habits create big results.",

"Never skip twice.",

"Future you will thank you."

];

function randomQuote(){

const q=

quotes[

Math.floor(

Math.random()

*

quotes.length

)

];

const el=

document.getElementById(

"aiAdvice"

);

if(el){

el.innerHTML=q;

}

}

setInterval(

randomQuote,

30000

);

/* ============================= */
/* INIT */

function init(){

load();

loadWeight();

dailyReset();

renderMeals();

updateDashboard();

updateProgress();

updateStreak();

randomQuote();

liveClock();

console.log(

"✅ Ruhullah LifeOS Loaded"

);

}

document.addEventListener(

"DOMContentLoaded",

init

);

/* =============================
   END OF APP.JS
   VERSION 1.0
================================ */