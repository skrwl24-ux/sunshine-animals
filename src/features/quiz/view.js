import { animals } from '../../recovered/animals/index.js';
import { applyCorrectAnswer, checkAnswer, getAnswers, pickQuestion } from './engine.js';
import { setProgressSilent } from '../../app/state.js';

let currentQuestion = null;
let locked = false;
let nextTimer = null;

function text(language, ko, en) { return language === 'en' ? en : ko; }
function animalById(id) { return animals.find((animal) => animal.id === id); }
export function clearQuizState() { currentQuestion=null; locked=false; if(nextTimer)clearTimeout(nextTimer); nextTimer=null; }

export function renderQuiz(root,state,handlers){
  const language=state.language==='en'?'en':'ko'; if(!currentQuestion)currentQuestion=pickQuestion(language);
  const question=currentQuestion; const answers=getAnswers(question,language); const spotAnimal=question.type==='spot'?animalById(question.id):null;
  root.innerHTML=`<div class="feature-shell quiz-shell"><header class="feature-header"><button type="button" class="back-button" data-action="home">← ${text(language,'홈','Home')}</button><div class="resource-pill"><span>🌿</span><span>${text(language,'자연의 빛','Light of Nature')}</span><strong>${state.progress.light}</strong></div></header><section class="feature-title"><span>❓</span><div><h1>${text(language,'동물 퀴즈','Animal Quiz')}</h1><p>${text(language,'정답마다 자연의 빛 1개를 얻어요.','Earn 1 Light of Nature for each correct answer.')}</p></div></section><section class="quiz-card"><div class="quiz-meta"><span>${question.type==='choice'?text(language,'동물 상식','Animal Facts'):question.type==='ox'?text(language,'OX 판단','True or False'):text(language,'관찰 퀴즈','Observation Quiz')}</span><strong>${text(language,'누적 정답','Total wins')} ${state.progress.quizWins}</strong></div>${spotAnimal?`<div class="quiz-spot">${spotAnimal.image?`<img src="${spotAnimal.image}" alt="" loading="lazy" />`:`<div class="result-placeholder">${spotAnimal.emoji||'🐾'}</div>`}<p>${question.hint||''}</p></div>`:''}<h2>${question.q||text(language,'이 동물은 무엇일까요?','Which animal is this?')}</h2><div class="quiz-answers">${answers.map((answer,index)=>`<button type="button" data-answer="${index}">${answer}</button>`).join('')}</div><div id="quiz-feedback" class="quiz-feedback" aria-live="polite"></div></section></div>`;
  root.querySelector('[data-action="home"]')?.addEventListener('click',()=>{clearQuizState();handlers.onHome();});
  root.querySelectorAll('[data-answer]').forEach((button)=>button.addEventListener('click',()=>answerQuestion(root,state,language,Number(button.dataset.answer),handlers)));
}

function answerQuestion(root,state,language,answerIndex,handlers){
  if(locked)return; locked=true; const question=currentQuestion; const correct=checkAnswer(question,answerIndex); const feedback=root.querySelector('#quiz-feedback'); root.querySelectorAll('[data-answer]').forEach((button)=>button.disabled=true);
  if(correct){
    const next=setProgressSilent(applyCorrectAnswer(state.progress));
    const lightNode=root.querySelector('.resource-pill strong'); if(lightNode)lightNode.textContent=next.light;
    feedback.innerHTML=`<div class="quiz-result correct"><strong>✅ ${text(language,'정답!','Correct!')}</strong><p>${question.why||''}</p><small>${text(language,'자연의 빛 +1 · 약 2초 뒤 다음 문제','Light of Nature +1 · Next question in about 2 seconds')}</small></div>`;
  } else {
    const answers=getAnswers(question,language); feedback.innerHTML=`<div class="quiz-result wrong"><strong>❌ ${text(language,'아쉬워요!','Not quite!')}</strong><p>${question.why||''}</p><small>${text(language,`정답: ${answers[question.c]}`,`Answer: ${answers[question.c]}`)}</small></div>`;
  }
  const previousKey=question.key; nextTimer=setTimeout(()=>{currentQuestion=pickQuestion(language,previousKey);locked=false;nextTimer=null;handlers.onRefresh();},2000);
}
