const form=document.querySelector('#nutrition-form');
const mealSection=document.querySelector('#meal-plan');
let current={};

const copy={
  lose:{label:'SUSTAINABLE FAT LOSS',summary:'A moderate deficit designed to preserve muscle while your weight trends down.',pace:'Aim for roughly 0.25–0.5 kg per week.'},
  lean:{label:'BODY RECOMPOSITION',summary:'Near-maintenance calories with higher protein to support strength and a leaner look.',pace:'Track strength, waist and photos—not only weight.'},
  gain:{label:'LEAN WEIGHT GAIN',summary:'A controlled surplus to fuel training without pushing calories unnecessarily high.',pace:'Aim for roughly 0.1–0.25 kg per week.'}
};

const mealText={
  lose:[['7:30 AM','Breakfast','Masala oats & protein','Vegetable oats, 2 eggs or tofu bhurji, and unsweetened tea'],['10:30 AM','Morning snack','Fruit & curd','Seasonal fruit with thick curd or Greek yogurt'],['1:30 PM','Lunch','High-protein thali','Chicken or paneer, rice, dal, salad and vegetables'],['5:00 PM','Evening snack','Crunchy fiber snack','Roasted chana with cucumber, tomato and lemon'],['8:00 PM','Dinner','Light balanced plate','Paneer, fish or chicken with vegetables, dal and rotis']],
  lean:[['7:30 AM','Breakfast','Protein power breakfast','Eggs or paneer bhurji, whole-wheat toast, fruit and milk'],['10:30 AM','Morning snack','Yogurt energy bowl','Greek yogurt, banana, chia seeds and almonds'],['1:30 PM','Lunch','Performance thali','Chicken, tofu or paneer, rice, dal, sabzi, curd and salad'],['5:00 PM','Training snack','Easy pre-workout fuel','Banana with roasted chana or peanut-butter toast'],['8:00 PM','Dinner','Recovery dinner','Fish, chicken, paneer or soya with rice or rotis and vegetables']],
  gain:[['7:30 AM','Breakfast','Calorie-dense breakfast','Milk oats, banana, peanut butter, nuts, plus eggs or paneer'],['10:30 AM','Morning snack','Smoothie & trail mix','Milk, banana, oats and peanut-butter smoothie with nuts'],['1:30 PM','Lunch','Growth-focused thali','Chicken, paneer or soya, rice, dal, vegetables and curd'],['5:00 PM','Evening snack','Loaded sandwich','Paneer, egg or chicken sandwich with fruit and lassi'],['8:30 PM','Dinner','Complete recovery plate','Fish, chicken, paneer or tofu with rice, dal and vegetables']]
};

function calculate(){
  const profile={weight:+document.querySelector('#weight').value,height:+document.querySelector('#height').value,age:+document.querySelector('#age').value,sex:document.querySelector('#sex').value,activity:+document.querySelector('#activity').value,goal:document.querySelector('[name=goal]:checked').value};
  const base=10*profile.weight+6.25*profile.height-5*profile.age;
  const maintenance=Math.max(1200,(base+(profile.sex==='male'?5:-161))*profile.activity);
  const calories=Math.round(maintenance*({lose:.84,lean:.96,gain:1.1}[profile.goal])/10)*10;
  const protein=Math.round(profile.weight*({lose:1.8,lean:2,gain:1.7}[profile.goal]));
  const fat=Math.round(profile.weight*(profile.goal==='gain'?.9:.8));
  const carbs=Math.max(0,Math.round((calories-protein*4-fat*9)/4));
  const fiber=Math.max(25,Math.round(calories/1000*14));
  current={profile,targets:{calories,maintenance:Math.round(maintenance/10)*10,protein,fat,carbs,fiber}};
  document.querySelector('#calories').textContent=calories.toLocaleString();
  ['protein','carbs','fat','fiber'].forEach(id=>document.querySelector('#'+id).textContent=current.targets[id]);
  document.querySelector('#maintenance').textContent=current.targets.maintenance.toLocaleString()+' kcal';
  document.querySelector('#goal-label').textContent=copy[profile.goal].label;
  document.querySelector('#goal-summary').textContent=copy[profile.goal].summary;
  document.querySelector('#pace').textContent=copy[profile.goal].pace;
  mealSection.classList.add('hidden');
  try{sessionStorage.setItem('nourishProfile',JSON.stringify(current))}catch{}
}

form.addEventListener('submit',e=>{e.preventDefault();calculate()});
document.querySelectorAll('[name=goal]').forEach(r=>r.addEventListener('change',()=>document.querySelectorAll('.goal').forEach(x=>x.classList.toggle('active',x.querySelector('input').checked))));
document.querySelector('#meal-button').addEventListener('click',()=>{
  const shares=[.24,.11,.30,.10,.25],proteinShares=[.22,.12,.30,.12,.24];let usedC=0,usedP=0;
  document.querySelector('#meal-goal').textContent=copy[current.profile.goal].label;
  document.querySelector('#meal-total').textContent=`${current.targets.calories.toLocaleString()} kcal · ${current.targets.protein}g protein`;
  document.querySelector('#meal-list').innerHTML=mealText[current.profile.goal].map((m,i)=>{const last=i===4;const c=last?current.targets.calories-usedC:Math.round(current.targets.calories*shares[i]/10)*10;const p=last?current.targets.protein-usedP:Math.round(current.targets.protein*proteinShares[i]);usedC+=c;usedP+=p;return `<article class="meal-row"><time>${m[0]}</time><div><p>${m[1]}</p><h3>${m[2]}</h3><span class="foods">${m[3]}</span></div><aside><strong>${c} kcal</strong><small>${p}g protein</small></aside></article>`}).join('');
  mealSection.classList.remove('hidden');mealSection.scrollIntoView({behavior:'smooth'});
});
document.querySelector('#workout-button').addEventListener('click',()=>{try{sessionStorage.setItem('nourishProfile',JSON.stringify(current))}catch{} location.href=`workout.html?goal=${current.profile.goal}&activity=${current.profile.activity}`});
calculate();
