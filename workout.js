let stored=null;try{stored=JSON.parse(sessionStorage.getItem('nourishProfile')||'null')}catch{}
const query=new URLSearchParams(location.search);
const queryGoal=['lose','lean','gain'].includes(query.get('goal'))?query.get('goal'):null;
const queryActivity=Number(query.get('activity'));
const profile=stored?.profile||{goal:queryGoal||'lean',activity:Number.isFinite(queryActivity)&&queryActivity>0?queryActivity:1.55};

const plans={
  lose:[
    ['Monday','Full-body foundation','Strength','45 min','Moderate',['Goblet squat — 3 × 10–12','Incline push-up — 3 × 8–12','One-arm row — 3 × 10 each','Farmer carry — 4 × 30 sec']],
    ['Wednesday','Intervals & core','Conditioning','35 min','Brisk',['Fast walk / cycle — 8 × 1 min hard','Dead bug — 3 × 10 each','Mountain climber — 3 × 30 sec','Side plank — 3 × 25 sec']],
    ['Friday','Lower body & engine','Strength + cardio','50 min','Moderate',['Romanian deadlift — 3 × 10','Reverse lunge — 3 × 10 each','Glute bridge — 3 × 15','Incline walk — 15 min easy']],
    ['Saturday','Upper body & steps','Strength','45 min','Moderate',['Dumbbell press — 3 × 10','Lat pulldown / band row — 3 × 12','Shoulder press — 3 × 10','Easy walk — 20 min']],
    ['Sunday','Mobility reset','Recovery','25 min','Easy',['Hip mobility flow — 6 min','Thoracic rotation — 2 × 8 each','Hamstring stretch — 2 × 30 sec','Relaxed walk — 15 min']]
  ],
  lean:[
    ['Monday','Upper-body strength','Strength','55 min','Progressive',['Bench press / push-up — 4 × 6–10','One-arm row — 4 × 8–12','Shoulder press — 3 × 8–10','Lat pulldown — 3 × 10–12']],
    ['Tuesday','Lower-body strength','Strength','55 min','Progressive',['Squat / goblet squat — 4 × 6–10','Romanian deadlift — 4 × 8–10','Walking lunge — 3 × 10 each','Standing calf raise — 3 × 15']],
    ['Thursday','Full-body muscle','Hypertrophy','50 min','Moderate',['Leg press / split squat — 3 × 10–12','Incline dumbbell press — 3 × 10–12','Seated cable row — 3 × 10–12','Hip thrust — 3 × 12']],
    ['Saturday','Conditioning & core','Athletic','40 min','Brisk',['Cycle / row intervals — 10 × 45 sec','Kettlebell swing — 4 × 12','Hanging knee raise — 3 × 10','Plank — 3 × 40 sec']],
    ['Sunday','Movement quality','Recovery','30 min','Easy',['Zone 2 walk — 20 min','Hip flexor stretch — 2 × 30 sec','Shoulder mobility — 5 min','Deep breathing — 3 min']]
  ],
  gain:[
    ['Monday','Push muscles','Hypertrophy','60 min','Challenging',['Bench press — 4 × 6–8','Incline dumbbell press — 3 × 8–12','Shoulder press — 3 × 8–10','Triceps pushdown — 3 × 12–15']],
    ['Tuesday','Pull muscles','Hypertrophy','60 min','Challenging',['Deadlift / rack pull — 3 × 5–6','Lat pulldown — 4 × 8–12','Chest-supported row — 3 × 8–12','Dumbbell curl — 3 × 12']],
    ['Thursday','Leg strength','Strength','65 min','Challenging',['Back squat / leg press — 4 × 6–10','Romanian deadlift — 4 × 8','Bulgarian split squat — 3 × 10 each','Calf raise — 4 × 12–15']],
    ['Saturday','Upper-body volume','Hypertrophy','55 min','Moderate',['Dumbbell bench press — 3 × 10–12','Seated cable row — 3 × 10–12','Lateral raise — 4 × 12–15','Biceps + triceps superset — 3 × 12 each']],
    ['Sunday','Legs & core volume','Hypertrophy','50 min','Moderate',['Front squat / goblet squat — 3 × 10','Hip thrust — 4 × 10–12','Leg curl — 3 × 12','Weighted plank — 3 × 35 sec']]
  ]
};

const meta={
  lose:['🏋 Fat-loss plan','Move more. Keep your muscle.','Strength work protects muscle while conditioning raises weekly energy use.','Burn & build','Lose weight'],
  lean:['🏋 Body-recomposition plan','Build strength. Reveal shape.','Progressive resistance training is the main signal for a leaner, stronger body.','Strength & shape','Lean body'],
  gain:['🏋 Muscle-gain plan','Train hard. Recover harder.','Training volume and progressive overload turn a calorie surplus into muscle.','Size & strength','Gain muscle']
}[profile.goal];

const days=profile.activity<=1.375?3:profile.activity>=1.725?5:4;
document.querySelector('#workout-label').textContent=meta[0];
document.querySelector('#workout-title').innerHTML=meta[1].replace('. ','.<br>');
document.querySelector('#workout-note').textContent=meta[2];
document.querySelector('#workout-accent').textContent=meta[3];
document.querySelector('#workout-goal').textContent=meta[4];
document.querySelector('#training-days').textContent=days;
document.querySelector('#workout-activity').textContent=profile.activity<=1.375?'Building a base':profile.activity>=1.725?'Highly active':'Moderately active';
document.querySelector('#workout-grid').innerHTML=plans[profile.goal].slice(0,days).map((w,i)=>`<article class="workout-card"><header><b>${String(i+1).padStart(2,'0')}</b><div><p>${w[0]}</p><h3>${w[1]}</h3></div></header><div class="tags"><span>🏋 ${w[2]}</span><span>◷ ${w[3]}</span><span>🔥 ${w[4]}</span></div><ul>${w[5].map(x=>`<li><span>${x.split(' — ')[0]}</span><strong>${x.split(' — ')[1]}</strong></li>`).join('')}</ul></article>`).join('');
