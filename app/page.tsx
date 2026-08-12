"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Visual = "pullup" | "pushup" | "split-squat" | "dip" | "abwheel" | "plank" | "knee-raise" | "run";
type Exercise = { name:string; detail:string; reps:string; sets:number; rest:number; cue:string; visual:Visual };
type WorkoutDay = { day:number; dayName:string; code:string; title:string; accent:string; description:string; kind:"strength"|"cardio"; exercises:Exercise[] };

const strengthA: Exercise[] = [
  { name:"Shyby", detail:"Záda · biceps", reps:"6 až 10 shybů", sets:4, rest:90, cue:"Hrudník vzhůru, lopatky stáhni dolů a netahej švihem.", visual:"pullup" },
  { name:"Kliky", detail:"Hrudník · triceps", reps:"10 až 15 kliků", sets:4, rest:75, cue:"Tělo drž v jedné linii a lokty veď lehce dozadu.", visual:"pushup" },
  { name:"Bulharské dřepy", detail:"Nohy · hýždě", reps:"10 na každou nohu", sets:3, rest:75, cue:"Přední chodidlo drž celé na zemi a koleno ve směru špičky.", visual:"split-squat" },
  { name:"Dipy na bradlech", detail:"Triceps · hrudník", reps:"4 až 8 dipů", sets:3, rest:90, cue:"Ramena drž dole. Klesej jen do rozsahu bez bolesti.", visual:"dip" },
  { name:"Ab wheel", detail:"Střed těla", reps:"6 až 10 opakování", sets:3, rest:75, cue:"Podsad pánev, zpevni břicho a neprohýbej bedra.", visual:"abwheel" },
  { name:"Plank", detail:"Břicho · hluboký stabilizační systém", reps:"40 sekund", sets:3, rest:60, cue:"Zatni hýždě, podsad pánev a drž tělo v jedné přímce.", visual:"plank" },
];

const schedule: Record<number, WorkoutDay> = {
  1: { day:1, dayName:"Pondělí", code:"TRÉNINK A", title:"Celé tělo.", accent:"Síla a základ.", description:"Hlavní silový trénink týdne. Kontrolovaný pohyb a čistá technika.", kind:"strength", exercises:strengthA },
  2: { day:2, dayName:"Úterý", code:"KONDICE 1", title:"Běh a chůze.", accent:"Lehký rozjezd.", description:"Krátké intervaly zlepší kondici bez zbytečného přetížení po pondělní síle.", kind:"cardio", exercises:[
    { name:"Svižná chůze", detail:"Zahřátí", reps:"5 minut", sets:1, rest:0, cue:"Jdi svižně, rozhýbej paže a dýchej plynule.", visual:"run" },
    { name:"Běh–chůze", detail:"Hlavní intervaly", reps:"1 minuta běhu, potom 2 minuty chůze", sets:6, rest:0, cue:"Běž tempem, při kterém bys zvládl říct krátkou větu. Nejde o sprint.", visual:"run" },
    { name:"Pomalá chůze", detail:"Zklidnění", reps:"5 minut", sets:1, rest:0, cue:"Postupně zpomal a nech tep přirozeně klesnout.", visual:"run" },
  ]},
  3: { day:3, dayName:"Středa", code:"TRÉNINK B", title:"Celé tělo.", accent:"Kontrola a objem.", description:"Druhý silový den mění pořadí a tempo, aby tělo dostalo nový podnět.", kind:"strength", exercises:[
    { name:"Pomalé shyby", detail:"Záda · biceps", reps:"5 až 8 shybů", sets:4, rest:90, cue:"Spouštěj se pomalu po dobu tří sekund. Bez houpání.", visual:"pullup" },
    { name:"Kliky s pauzou", detail:"Hrudník · triceps", reps:"8 až 12 kliků", sets:4, rest:75, cue:"Dole na jednu sekundu zastav, potom se vytlač bez ztráty pevného těla.", visual:"pushup" },
    { name:"Bulharské dřepy", detail:"Nohy · hýždě", reps:"8 na každou nohu", sets:4, rest:75, cue:"Pohyb veď pomalu dolů a odtlač se celým předním chodidlem.", visual:"split-squat" },
    { name:"Dipy s dopomocí", detail:"Triceps · hrudník", reps:"5 až 7 dipů", sets:3, rest:90, cue:"Pokud technika odchází, pomoz si odporovou gumou.", visual:"dip" },
    { name:"Ab wheel", detail:"Střed těla", reps:"6 až 8 opakování", sets:3, rest:75, cue:"Jeď jen tak daleko, dokud udržíš pevná bedra.", visual:"abwheel" },
    { name:"Zvedání kolen ve visu", detail:"Břicho · flexory kyčlí", reps:"8 až 12 opakování", sets:3, rest:75, cue:"Bez houpání přitáhni kolena k hrudníku a pomalu je spusť.", visual:"knee-raise" },
  ]},
  4: { day:4, dayName:"Čtvrtek", code:"KONDICE 2", title:"Tempo a dech.", accent:"O kousek dál.", description:"Druhý kondiční den přidá trochu běhu, ale pořád nechává rezervu na pátek.", kind:"cardio", exercises:[
    { name:"Svižná chůze", detail:"Zahřátí", reps:"5 minut", sets:1, rest:0, cue:"Začni klidně a během pěti minut přejdi do svižného tempa.", visual:"run" },
    { name:"Běh–chůze", detail:"Hlavní intervaly", reps:"90 sekund běhu, potom 90 sekund chůze", sets:6, rest:0, cue:"Drž stejné klidné tempo ve všech intervalech. Poslední nemá být sprint.", visual:"run" },
    { name:"Pomalá chůze", detail:"Zklidnění", reps:"5 minut", sets:1, rest:0, cue:"Zpomal, uvolni ramena a vydýchej se.", visual:"run" },
  ]},
  5: { day:5, dayName:"Pátek", code:"TRÉNINK C", title:"Celé tělo.", accent:"Silný závěr.", description:"Poslední silový trénink týdne. Víkend pak necháme regeneraci a zábavě.", kind:"strength", exercises:[
    { name:"Shyby", detail:"Záda · biceps", reps:"6 až 10 shybů", sets:4, rest:90, cue:"Každé opakování začni aktivními lopatkami a dokonči bez švihu.", visual:"pullup" },
    { name:"Kliky", detail:"Hrudník · triceps", reps:"12 až 18 kliků", sets:4, rest:75, cue:"Když už neudržíš rovné tělo, sérii ukonči.", visual:"pushup" },
    { name:"Bulharské dřepy", detail:"Nohy · hýždě", reps:"10 na každou nohu", sets:4, rest:75, cue:"Koleno sleduje směr špičky, váha zůstává na přední noze.", visual:"split-squat" },
    { name:"Dipy na bradlech", detail:"Triceps · hrudník", reps:"4 až 8 dipů", sets:3, rest:90, cue:"Ramena netlač k uším a zastav před bolestivým rozsahem.", visual:"dip" },
    { name:"Ab wheel", detail:"Střed těla", reps:"6 až 10 opakování", sets:3, rest:75, cue:"Zpevni hýždě a břicho, bedra se nesmí propadnout.", visual:"abwheel" },
    { name:"Plank", detail:"Břicho · stabilita", reps:"45 sekund", sets:3, rest:60, cue:"Tlač předloktí do země, pravidelně dýchej a nepropadej se v bedrech.", visual:"plank" },
  ]},
};

const weekPlans=[
  {name:"Vstupní fáze",focus:"Najdi čisté tempo a nech si dvě opakování v rezervě.",rep:0,sets:0},
  {name:"Stavíme základ",focus:"Přidej malé množství práce bez zhoršení techniky.",rep:1,sets:0},
  {name:"První objem",focus:"První dva cviky dostávají jednu sérii navíc.",rep:2,sets:1},
  {name:"Odlehčení",focus:"Méně sérií, lehčí běh a prostor pro regeneraci.",rep:-1,sets:-1},
  {name:"Nový blok",focus:"Vracíme objem a posouváme hranici opakování.",rep:2,sets:0},
  {name:"Budování síly",focus:"Drž pevnou techniku i s vyšším počtem opakování.",rep:3,sets:0},
  {name:"Vrchol objemu",focus:"První dva cviky mají další pracovní sérii.",rep:3,sets:1},
  {name:"Odlehčení",focus:"Záměrně uber, ať do závěru přijdeš čerstvý.",rep:0,sets:-1},
  {name:"Síla a výdrž",focus:"Delší série a delší souvislé úseky běhu.",rep:3,sets:0},
  {name:"Silný týden",focus:"Přidej opakování, jen pokud zůstává čistá technika.",rep:4,sets:0},
  {name:"Vrchol programu",focus:"Nejvyšší plánovaný objem celého bloku.",rep:4,sets:1},
  {name:"Kontrolní týden",focus:"Dokonči blok kvalitně a porovnej pocit s prvním týdnem.",rep:2,sets:0},
];
const cardioProgress=[
  [[60,120,6],[90,90,6]],[[60,105,7],[90,90,7]],[[75,105,7],[105,75,7]],[[60,120,5],[75,105,5]],
  [[90,90,7],[120,75,7]],[[90,75,8],[120,60,8]],[[105,75,8],[135,60,8]],[[75,105,6],[90,90,6]],
  [[120,60,8],[150,60,7]],[[120,60,9],[180,60,7]],[[150,60,8],[180,45,8]],[[180,60,6],[240,60,5]],
];
function addToReps(text:string,delta:number){return text.replace(/\d+/g,(value,index)=>index===0?String(Math.max(1,Number(value)+delta)):value)}
function planWorkout(base:WorkoutDay,week:number):WorkoutDay{const plan=weekPlans[week-1];if(base.kind==="cardio"){const [run,walk,rounds]=cardioProgress[week-1][base.day===2?0:1];return {...base,code:`${base.code} · T${week}`,description:`${plan.name}. ${plan.focus}`,exercises:base.exercises.map((item,index)=>index===1?{...item,sets:rounds,reps:`${run} s běhu, potom ${walk} s chůze`}:item)}}return {...base,code:`${base.code} · T${week}`,description:`${plan.name}. ${plan.focus}`,exercises:base.exercises.map((item,index)=>({...item,reps:addToReps(item.reps,plan.rep),sets:Math.max(2,item.sets+(index<2?plan.sets:0))}))}}

const dayNames = ["Neděle","Pondělí","Úterý","Středa","Čtvrtek","Pátek","Sobota"];
const dateKey = () => new Date().toLocaleDateString("sv-SE");
let beepAudio:HTMLAudioElement|null=null;
let beepSequence=0;
function prepareAudio(){if(typeof window==="undefined")return null;if(!beepAudio){beepAudio=new Audio("/fitplan-beep.wav");beepAudio.preload="auto";beepAudio.volume=.72;beepAudio.load()}return beepAudio}
function waitForBeep(audio:HTMLAudioElement){return new Promise<void>(resolve=>{let done=false;const finish=()=>{if(done)return;done=true;audio.removeEventListener("ended",finish);resolve()};audio.addEventListener("ended",finish,{once:true});window.setTimeout(finish,650)})}
async function playBeeps(count:number){const audio=prepareAudio();if(!audio)return false;const sequence=++beepSequence;try{for(let index=0;index<count;index++){if(sequence!==beepSequence)return false;audio.pause();audio.currentTime=0;await audio.play();await waitForBeep(audio);if(index<count-1)await new Promise(resolve=>window.setTimeout(resolve,160))}return true}catch{return false}}
async function playCompletion(){return playBeeps(4)}
function sayExercise(exercise:Exercise){if(!("speechSynthesis" in window))return;speechSynthesis.cancel();const message=new SpeechSynthesisUtterance(`Další cvik: ${exercise.name}. ${exercise.reps}. ${exercise.cue}`);message.lang="cs-CZ";speechSynthesis.speak(message)}

type ScreenLock={released:boolean;release:()=>Promise<void>;addEventListener:(type:"release",listener:()=>void)=>void};
function useScreenAwake(active:boolean){
  const lock=useRef<ScreenLock|null>(null);
  useEffect(()=>{
    let disposed=false;
    const request=async()=>{if(!active||disposed||document.visibilityState!=="visible"||lock.current&&!lock.current.released)return;const wakeLock=(navigator as Navigator&{wakeLock?:{request:(type:"screen")=>Promise<ScreenLock>}}).wakeLock;if(!wakeLock)return;try{const sentinel=await wakeLock.request("screen");if(disposed){await sentinel.release();return}lock.current=sentinel;sentinel.addEventListener("release",()=>{if(lock.current===sentinel)lock.current=null})}catch{return}};
    const onVisibility=()=>{if(document.visibilityState==="visible")void request()};
    void request();document.addEventListener("visibilitychange",onVisibility);
    return()=>{disposed=true;document.removeEventListener("visibilitychange",onVisibility);const current=lock.current;lock.current=null;if(current&&!current.released)void current.release()};
  },[active]);
}

export default function Home() {
  const today = new Date().getDay();
  const [selectedWeek,setSelectedWeek] = useState(1);
  const [selectedDay,setSelectedDay] = useState(today>=1&&today<=5?today:1);
  const workoutDay = useMemo(()=>planWorkout(schedule[selectedDay],selectedWeek),[selectedDay,selectedWeek]);
  const workout = workoutDay.exercises;
  const [exerciseIndex,setExerciseIndex] = useState(0);
  const [setNumber,setSetNumber] = useState(1);
  const [resting,setResting] = useState(false);
  const [seconds,setSeconds] = useState(0);
  const [voice,setVoice] = useState(true);
  const [finishedSets,setFinishedSets] = useState(0);
  const [started,setStarted] = useState(false);
  const [complete,setComplete] = useState(false);
  useScreenAwake(started&&!complete);
  const exercise = workout[exerciseIndex];
  const totalSets = useMemo(() => workout.reduce((sum,item) => sum + item.sets,0),[workout]);
  const progress = totalSets ? Math.round((finishedSets/totalSets)*100) : 0;

  useEffect(() => {
    const rememberedWeek=Math.min(12,Math.max(1,Number(localStorage.getItem("fitplan-selected-week"))||1));
    setSelectedWeek(rememberedWeek);
    const rememberedDay=Number(localStorage.getItem("fitplan-selected-day"));
    const initialDay=rememberedDay>=1&&rememberedDay<=5?rememberedDay:(today>=1&&today<=5?today:1);
    setSelectedDay(initialDay);
    const saved = localStorage.getItem(`fitplan-session-${rememberedWeek}-${initialDay}`);
    if (saved) {
      const state = JSON.parse(saved);
      if (state.date === dateKey()) { setExerciseIndex(state.exerciseIndex??0); setSetNumber(state.setNumber??1); setFinishedSets(state.finishedSets??0); setStarted(state.started??false); }
    }
    const completions = JSON.parse(localStorage.getItem("fitplan-completions") || "{}");
    setComplete(Boolean(completions[`week-${rememberedWeek}-${initialDay}`]));
    const voiceSetting = localStorage.getItem("fitplan-voice");
    if (voiceSetting !== null) setVoice(voiceSetting === "true");
    navigator.serviceWorker?.register("./sw.js").catch(()=>undefined);
  },[]);

  useEffect(() => {
    localStorage.setItem(`fitplan-session-${selectedWeek}-${selectedDay}`,JSON.stringify({ date:dateKey(), exerciseIndex,setNumber,finishedSets,started }));
    localStorage.setItem("fitplan-selected-week",String(selectedWeek));
    localStorage.setItem("fitplan-selected-day",String(selectedDay));
    localStorage.setItem("fitplan-voice",String(voice));
  },[exerciseIndex,setNumber,finishedSets,started,voice,selectedDay,selectedWeek]);

  useEffect(() => {
    if (!resting) return;
    if (seconds<=0) { setResting(false); if (voice&&"speechSynthesis" in window) speechSynthesis.speak(new SpeechSynthesisUtterance("Pauza skončila. Jdeme dál.")); return; }
    const timer=window.setTimeout(()=>setSeconds(v=>v-1),1000); return()=>window.clearTimeout(timer);
  },[resting,seconds,voice]);

  function speak(_text:string) { if (voice) playBeeps(1); }
  function begin() { setStarted(true); if(voice&&workoutDay.kind==="strength"){void playBeeps(1);window.setTimeout(()=>sayExercise(exercise),650)} else speak(""); }
  function markComplete() { setComplete(true); const completions=JSON.parse(localStorage.getItem("fitplan-completions")||"{}"); completions[`week-${selectedWeek}-${selectedDay}`]={ code:workoutDay.code, sets:totalSets, finishedAt:new Date().toISOString() }; localStorage.setItem("fitplan-completions",JSON.stringify(completions)); localStorage.removeItem(`fitplan-session-${selectedWeek}-${selectedDay}`); if(voice)playCompletion(); }
  function finishSet() {
    setFinishedSets(v=>v+1);
    if (setNumber<exercise.sets) { setSetNumber(v=>v+1); if (exercise.rest>0) { setSeconds(exercise.rest); setResting(true); } speak(exercise.rest ? `Hotovo. Pauza ${exercise.rest} sekund.` : "Hotovo. Pokračuj dalším intervalem."); }
    else if (exerciseIndex<workout.length-1) { const next=workout[exerciseIndex+1]; setExerciseIndex(v=>v+1); setSetNumber(1); if (exercise.rest>0) { setSeconds(exercise.rest); setResting(true); } speak(`Hotovo. Následuje ${next.name}.`); }
    else markComplete();
  }
  function loadSelection(week:number,day:number){setExerciseIndex(0);setSetNumber(1);setFinishedSets(0);setResting(false);setStarted(false);const saved=JSON.parse(localStorage.getItem(`fitplan-session-${week}-${day}`)||"null");if(saved?.date===dateKey()){setExerciseIndex(saved.exerciseIndex??0);setSetNumber(saved.setNumber??1);setFinishedSets(saved.finishedSets??0);setStarted(saved.started??false)}const completions=JSON.parse(localStorage.getItem("fitplan-completions")||"{}");setComplete(Boolean(completions[`week-${week}-${day}`]))}
  function chooseDay(day:number) { setSelectedDay(day);loadSelection(selectedWeek,day); }
  function chooseWeek(week:number){setSelectedWeek(week);loadSelection(week,selectedDay);}
  function repeatWorkout() { setExerciseIndex(0); setSetNumber(1); setFinishedSets(0); setResting(false); setComplete(false); setStarted(false); const completions=JSON.parse(localStorage.getItem("fitplan-completions")||"{}"); delete completions[`week-${selectedWeek}-${selectedDay}`]; localStorage.setItem("fitplan-completions",JSON.stringify(completions)); }
  function endWorkout() { if(!window.confirm("Opravdu chceš ukončit rozcvičený trénink? Dnešní plán se neoznačí jako dokončený."))return; speechSynthesis?.cancel(); setStarted(false); setExerciseIndex(0); setSetNumber(1); setFinishedSets(0); setResting(false); localStorage.removeItem(`fitplan-session-${selectedWeek}-${selectedDay}`); }

  if (complete) { const nextDay=selectedDay===5?(selectedWeek<12?`Týden ${selectedWeek+1} · Pondělí`:"Celý 12týdenní blok je hotový"):`${schedule[selectedDay+1]?.dayName} · ${schedule[selectedDay+1]?.code}`; return <main className="shell done"><Brand/><div className="trophy">✓</div><p className="eyebrow">TÝDEN {selectedWeek} · PLÁN DOKONČEN</p><h1>Výborná práce.</h1><p>Dokončil jsi {workoutDay.code} a všech {totalSets} {workoutDay.kind==="cardio"?"intervalů":"sérií"}. V programu následuje <b>{nextDay}</b>.</p><ProgramStrip selectedWeek={selectedWeek} onSelect={chooseWeek}/><WeekStrip today={today} selectedDay={selectedDay} onSelect={chooseDay}/><button className="secondary-action" onClick={repeatWorkout}>Odjet tento plán znovu</button></main>; }

  if (!started) {
    const cardio=cardioProgress[selectedWeek-1][selectedDay===2?0:1]; const minutes=workoutDay.kind==="cardio" ? Math.round((600+cardio[2]*(cardio[0]+cardio[1]))/60) : Math.round(workout.reduce((sum,item)=>sum+item.sets*item.rest,0)/60+21);
    return <main className="shell welcome"><header className="topbar"><Brand/><VoiceButton voice={voice} setVoice={setVoice}/></header><ProgramStrip selectedWeek={selectedWeek} onSelect={chooseWeek}/><WeekStrip today={today} selectedDay={selectedDay} onSelect={chooseDay}/><section className={`hero-card ${workoutDay.kind}`}><p className="eyebrow">TÝDEN {selectedWeek} · {workoutDay.dayName.toUpperCase()} · {workoutDay.code}</p><h1>{workoutDay.title}<br/><span>{workoutDay.accent}</span></h1><p className="lead">{workoutDay.description}</p><div className="stats"><Stat value={`${workout.length}`} label="částí"/><Stat value={`${totalSets}`} label={workoutDay.kind==="cardio"?"intervalů":"sérií"}/><Stat value={`~${minutes}`} label="minut"/></div><button className="primary" onClick={begin}>Otevřít vybraný plán <b>→</b></button></section><section className="preview-list"><div><p className="eyebrow">TÝDEN {selectedWeek} · {weekPlans[selectedWeek-1].name.toUpperCase()}</p><h2>Co tě čeká</h2></div>{workout.map((item,index)=><div className="preview-row" key={item.name}><span>{String(index+1).padStart(2,"0")}</span><div><b>{item.name}</b><small>{item.sets>1?`${item.sets} × `:""}{item.reps}{item.rest?` · pauza ${item.rest} s`:""}</small></div><i>{item.detail}</i></div>)}</section></main>;
  }

  if (workoutDay.kind==="cardio") return <CardioPlayer day={selectedDay} week={selectedWeek} voice={voice} setVoice={setVoice} onComplete={markComplete} onExit={endWorkout}/>;
  if (workoutDay.kind==="strength") return <StrengthPlayer workout={workout} voice={voice} setVoice={setVoice} onComplete={markComplete} onExit={endWorkout}/>;

  return <main className="workout-shell"><header className="topbar"><Brand/><div className="header-actions"><span>{exerciseIndex+1} / {workout.length}</span><VoiceButton voice={voice} setVoice={setVoice}/></div></header><div className="progress-track"><span style={{width:`${progress}%`}}/></div><section className="exercise-grid"><div className="motion-card" aria-label={`Ukázka ${exercise.name}`}><div className="motion-label"><span>{workoutDay.kind==="cardio"?"DNEŠNÍ INTERVAL":"UKÁZKA POHYBU"}</span><button onClick={()=>speak(exercise.cue)}>Poslechnout pokyn</button></div><ExerciseVisual type={exercise.visual}/></div><div className="exercise-panel"><p className="eyebrow">{workoutDay.kind==="cardio"?"ČÁST":"CVIK"} {String(exerciseIndex+1).padStart(2,"0")} · {exercise.detail.toUpperCase()}</p><h1>{exercise.name}</h1><p className="cue">{exercise.cue}</p><div className="set-display"><div><span>{workoutDay.kind==="cardio"?"INTERVAL":"SÉRIE"}</span><strong>{setNumber}<small> / {exercise.sets}</small></strong></div><div className="rep-target"><span>TEĎ UDĚLEJ</span><strong>{exercise.reps}</strong></div></div><button className="primary complete-set" onClick={finishSet}>{workoutDay.kind==="cardio"?"Interval hotový":"Série hotová"} <b>✓</b></button><div className="nav-row"><button disabled={exerciseIndex===0} onClick={()=>{setExerciseIndex(Math.max(0,exerciseIndex-1));setSetNumber(1)}}>← Předchozí</button><button onClick={()=>{if(exerciseIndex<workout.length-1){setExerciseIndex(exerciseIndex+1);setSetNumber(1)}}}>Přeskočit →</button></div></div></section>{resting&&<div className="rest-overlay"><div className="rest-modal"><p className="eyebrow">PAUZA · DÝCHEJ</p><div className="timer">{Math.floor(seconds/60)}:{String(seconds%60).padStart(2,"0")}</div><p>Další: <b>{exercise.name} · {setNumber}. série</b></p><div className="rest-actions"><button onClick={()=>setSeconds(v=>v+15)}>+ 15 s</button><button className="primary" onClick={()=>setResting(false)}>Pokračovat</button></div></div></div>}</main>;
}

function Brand(){return <div className="brand"><span><img src="/fitplan-logo.png" alt=""/></span>FITPLAN</div>}
function VoiceButton({voice,setVoice}:{voice:boolean;setVoice:(value:boolean)=>void}){function toggle(){const next=!voice;setVoice(next);if(next)void playBeeps(1)}return <div className="sound-controls"><button className="voice" onClick={toggle} aria-label="Přepnout zvuková upozornění">{voice?"♪ Zvuk zapnut":"Zvuk vypnut"}</button><button className="sound-test" onClick={()=>void playBeeps(1)}>Vyzkoušet zvuk</button></div>}
function Stat({value,label}:{value:string;label:string}){return <div><strong>{value}</strong><span>{label}</span></div>}
function ProgramStrip({selectedWeek,onSelect}:{selectedWeek:number;onSelect:(week:number)=>void}){return <section className="program-block"><div className="program-heading"><div><p className="eyebrow">12TÝDENNÍ PROGRAM</p><b>Týden {selectedWeek}: {weekPlans[selectedWeek-1].name}</b></div><span>{selectedWeek} / 12</span></div><div className="program-strip">{weekPlans.map((plan,index)=>{const week=index+1;return <button type="button" key={plan.name+week} className={week===selectedWeek?"selected":""} onClick={()=>onSelect(week)} aria-pressed={week===selectedWeek}><b>{week}</b><small>{plan.name}</small></button>})}</div></section>}
function WeekStrip({today,selectedDay,onSelect}:{today:number;selectedDay:number;onSelect:(day:number)=>void}){return <div className="week-strip" aria-label="Výběr tréninkového dne">{[1,2,3,4,5].map(day=><button type="button" key={day} onClick={()=>onSelect(day)} className={`${day===selectedDay?"selected":""} ${day===today?"today":""}`} aria-pressed={day===selectedDay}><b>{schedule[day].dayName.slice(0,2).toUpperCase()}</b><span>{schedule[day].kind==="strength"?schedule[day].code:"BĚH"}</span>{day===today&&<i>DNES</i>}</button>)}</div>}
function ExerciseVisual({type}:{type:Visual}){if(type==="run")return <div className="run-visual"><div className="track-ring"><b>BĚH</b><span>+</span><b>CHŮZE</b></div><p>Drž klidné tempo.<br/>Nejde o sprint.</p></div>;return <div className={`realistic-sequence ${type}`} role="img" aria-label="Ukázka správného provedení cviku"/>}

type CardioPhase={name:string;seconds:number;mode:"warmup"|"run"|"walk"|"cooldown";round?:number};
function makeCardioPhases(day:number,week:number){const phases:CardioPhase[]=[{name:"Svižná chůze · zahřátí",seconds:300,mode:"warmup"}];const [run,walk,rounds]=cardioProgress[week-1][day===2?0:1];for(let round=1;round<=rounds;round++){phases.push({name:"Běh",seconds:run,mode:"run",round});phases.push({name:"Chůze",seconds:walk,mode:"walk",round});}phases.push({name:"Pomalá chůze · zklidnění",seconds:300,mode:"cooldown"});return phases;}
function CardioPlayer({day,week,voice,setVoice,onComplete,onExit}:{day:number;week:number;voice:boolean;setVoice:(value:boolean)=>void;onComplete:()=>void;onExit:()=>void}){
  const phases=useMemo(()=>makeCardioPhases(day,week),[day,week]); const rounds=cardioProgress[week-1][day===2?0:1][2]; const [phaseIndex,setPhaseIndex]=useState(0); const [seconds,setSeconds]=useState(phases[0].seconds); const [running,setRunning]=useState(true); const completed=useRef(false); const wakeLock=useRef<{release:()=>Promise<void>}|null>(null); const phase=phases[phaseIndex]; const total=phases.reduce((sum,item)=>sum+item.seconds,0); const elapsed=phases.slice(0,phaseIndex).reduce((sum,item)=>sum+item.seconds,0)+(phase.seconds-seconds); const next=phases[phaseIndex+1];
  useEffect(()=>{if(voice)playBeeps(phase.mode==="run"?2:1)},[phaseIndex,phase.mode,voice]);
  useEffect(()=>{const nav=navigator as Navigator&{wakeLock?:{request:(type:"screen")=>Promise<{release:()=>Promise<void>}>}};nav.wakeLock?.request("screen").then(lock=>wakeLock.current=lock).catch(()=>undefined);return()=>{wakeLock.current?.release().catch(()=>undefined)}},[]);
  useEffect(()=>{if(!running)return;if(seconds>0){const timer=window.setTimeout(()=>setSeconds(value=>value-1),1000);return()=>window.clearTimeout(timer)}if(phaseIndex<phases.length-1){const following=phases[phaseIndex+1];setPhaseIndex(value=>value+1);setSeconds(following.seconds)}else if(!completed.current){completed.current=true;onComplete()}},[running,seconds,phaseIndex,phases,onComplete]);
  function skip(){if(phaseIndex<phases.length-1){const following=phases[phaseIndex+1];setPhaseIndex(value=>value+1);setSeconds(following.seconds)}else if(!completed.current){completed.current=true;onComplete()}}
  return <main className={`workout-shell cardio-player ${phase.mode}`}><header className="topbar"><Brand/><VoiceButton voice={voice} setVoice={setVoice}/></header><div className="cardio-progress"><span style={{width:`${Math.min(100,(elapsed/total)*100)}%`}}/></div><section className="cardio-stage"><div className="round-pill">{phase.round?`INTERVAL ${phase.round} Z ${rounds}`:phase.mode==="warmup"?"ZAHŘÁTÍ":"ZKLIDNĚNÍ"}</div><p className="eyebrow">TEĎ {phase.mode==="run"?"BĚŽ":phase.mode==="walk"?"JDI":"POKRAČUJ V CHŮZI"}</p><h1>{phase.name}</h1><div className="cardio-timer">{Math.floor(seconds/60)}:{String(seconds%60).padStart(2,"0")}</div><p className="cardio-hint">Část se po skončení přepne sama. Jedno pípnutí znamená chůzi, dvě pípnutí běh. Telefon nemusíš držet v ruce.</p>{next&&<div className="up-next"><span>DÁLE</span><b>{next.name}</b><small>{Math.floor(next.seconds/60)}:{String(next.seconds%60).padStart(2,"0")}</small></div>}<div className="cardio-controls"><button className="primary" onClick={()=>setRunning(value=>!value)}>{running?"Pozastavit":"Pokračovat"}</button><button className="skip-cardio" onClick={skip}>Přeskočit část →</button></div><button className="end-workout" onClick={onExit}>Ukončit trénink</button></section></main>;
}

function StrengthPlayer({workout,voice,setVoice,onComplete,onExit}:{workout:Exercise[];voice:boolean;setVoice:(value:boolean)=>void;onComplete:()=>void;onExit:()=>void}){
  const [exerciseIndex,setExerciseIndex]=useState(0); const [setNumber,setSetNumber]=useState(1); const [phase,setPhase]=useState<"prepare"|"work"|"rest">("prepare"); const [running,setRunning]=useState(true); const completed=useRef(false); const warned=useRef(""); const wakeLock=useRef<{release:()=>Promise<void>}|null>(null); const exercise=workout[exerciseIndex]; const workSeconds=exercise.name.includes("Ab wheel")||exercise.name.includes("Dipy")?35:45; const [seconds,setSeconds]=useState(30); const totalSets=workout.reduce((sum,item)=>sum+item.sets,0); const finishedBefore=workout.slice(0,exerciseIndex).reduce((sum,item)=>sum+item.sets,0)+(setNumber-1); const progress=Math.round((finishedBefore/totalSets)*100);
  useEffect(()=>{const nav=navigator as Navigator&{wakeLock?:{request:(type:"screen")=>Promise<{release:()=>Promise<void>}>}};nav.wakeLock?.request("screen").then(lock=>wakeLock.current=lock).catch(()=>undefined);return()=>{wakeLock.current?.release().catch(()=>undefined)}},[]);
  function startNext(){if(setNumber<exercise.sets){setSetNumber(value=>value+1);setPhase("work");setSeconds(workSeconds);if(voice)playBeeps(2)}else if(exerciseIndex<workout.length-1){const nextIndex=exerciseIndex+1;const next=workout[nextIndex];setExerciseIndex(nextIndex);setSetNumber(1);setPhase("prepare");setSeconds(30);if(voice)sayExercise(next)}else if(!completed.current){completed.current=true;onComplete()}}
  useEffect(()=>{if(!running)return;const warningKey=`${exerciseIndex}-${setNumber}`;if(phase==="rest"&&seconds===10&&voice&&warned.current!==warningKey){warned.current=warningKey;playBeeps(1)}if(seconds>0){const timer=window.setTimeout(()=>setSeconds(value=>value-1),1000);return()=>window.clearTimeout(timer)}if(phase==="prepare"){setPhase("work");setSeconds(workSeconds);if(voice)playBeeps(2)}else if(phase==="work"){if(setNumber===exercise.sets&&exerciseIndex===workout.length-1){startNext()}else{setPhase("rest");setSeconds(exercise.rest);if(voice)playBeeps(1)}}else startNext()},[running,seconds,phase,setNumber,exerciseIndex,exercise,workout,voice,onComplete]);
  function skip(){if(phase==="prepare"){setPhase("work");setSeconds(workSeconds);if(voice)playBeeps(2)}else if(phase==="work"){if(setNumber===exercise.sets&&exerciseIndex===workout.length-1)startNext();else{setPhase("rest");setSeconds(exercise.rest);if(voice)playBeeps(1)}}else startNext()}
  const title=phase==="work"?exercise.name:phase==="prepare"?"Připrav se":"Odpočinek"; const target=phase==="work"?exercise.reps:phase==="prepare"?`${exercise.name} · ${exercise.reps}`:`Další: ${setNumber<exercise.sets?`${exercise.name} · ${setNumber+1}. série`:workout[exerciseIndex+1]?.name||"Hotovo"}`;
  return <main className={`workout-shell strength-player ${phase}`}><header className="topbar"><Brand/><VoiceButton voice={voice} setVoice={setVoice}/></header><div className="cardio-progress"><span style={{width:`${progress}%`}}/></div><section className="strength-stage"><div className="strength-visual"><ExerciseVisual type={exercise.visual}/></div><div className="strength-guide"><div className="round-pill">CVIK {exerciseIndex+1} Z {workout.length} · SÉRIE {setNumber} Z {exercise.sets}</div><p className="eyebrow">{phase==="work"?"TEĎ CVIČ":phase==="prepare"?"30 SEKUND NA PŘÍPRAVU":"PAUZA · VYDÝCHEJ SE"}</p><h1>{title}</h1><p className="strength-target">{target}</p><div className="cardio-timer">{Math.floor(seconds/60)}:{String(seconds%60).padStart(2,"0")}</div><p className="cardio-hint">{phase==="work"?"Cvič plynule a skonči dřív, pokud se rozpadá technika.":phase==="prepare"?"Hlas právě popsal cvik. Po odpočtu zazní dvě pípnutí a začne série.":"Jedno pípnutí zahájí pauzu. Dvě pípnutí oznámí další sérii."}</p><div className="cardio-controls"><button className="primary" onClick={()=>setRunning(value=>!value)}>{running?"Pozastavit":"Pokračovat"}</button><button className="skip-cardio" onClick={skip}>Přeskočit část →</button></div><button className="end-workout" onClick={onExit}>Ukončit trénink</button></div></section></main>;
}
