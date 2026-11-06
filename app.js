'use strict';
const $=id=>document.getElementById(id);
let type='review',dirty=false;
const titles={review:'每日抗遗忘复习反馈',class:'正课反馈',trial:'试课反馈',finish:'试课结束反馈'};
const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
$('date').value=today();
function mode(){return document.querySelector('input[name="mode"]:checked').value}
function accuracy(){const total=$('total').value,score=$('score').value;if(score==='')return null;const s=Number(score),n=Number(total);if(!Number.isFinite(s)||s<0)return null;if(mode()==='rate')return s<=100?s:null;if(total===''||!Number.isInteger(n)||n<=0||!Number.isInteger(s)||s>n)return null;return (n-s)/n*100}
function update(){const a=accuracy();$('rate').replaceChildren(document.createTextNode(a===null?'—':feedbackRate(a)));const small=document.createElement('small');small.textContent='%';$('rate').append(small);$('scoreTitle').textContent=mode()==='rate'?'正确率（%）':'遗忘数';$('score').step=mode()==='rate'?'0.1':'1';$('score').max=mode()==='rate'?'100':$('total').value||'100000';$('score').placeholder=mode()==='rate'?'如：96.7':'如：2';$('mathHint').textContent=mode()==='rate'?'使用老师填写的正确率，不反推遗忘数。':'正确率 =（复习词数 − 遗忘数）÷ 复习词数';if(dirty)$('status').textContent='记录已修改，重新生成后才会更新文案。'}
function count(){$('count').textContent=Array.from($('output').value).length+' 字';$('copy').disabled=!$('output').value.trim()}
document.querySelectorAll('[data-type]').forEach(b=>b.addEventListener('click',()=>{type=b.dataset.type;document.querySelectorAll('[data-type]').forEach(t=>{t.classList.toggle('active',t===b);t.setAttribute('aria-pressed',String(t===b))});$('vocabWrap').hidden=type!=='trial';$('wordsLabel').textContent=type==='trial'?'单词表（本次学习 / 需加强）':'需加强单词及词义';$('totalLabel').textContent=type==='class'||type==='trial'?'本次学习词数':'复习词数';update()}));
$('form').addEventListener('input',update);
$('form').addEventListener('submit',e=>{e.preventDefault();$('error').textContent='';const n=$('name').value.trim(),total=$('total').value,score=$('score').value,times=$('times').value,a=accuracy();if(!n){$('error').textContent='请填写学生姓名。';return}if(!/^\d{4}-\d{2}-\d{2}$/.test($('date').value)){$('error').textContent='请选择有效日期。';return}if((total!==''&&(!Number.isInteger(Number(total))||Number(total)<=0||Number(total)>100000))||(times!==''&&(!Number.isInteger(Number(times))||Number(times)<1||Number(times)>10000))){$('error').textContent='词数和复习次数须为范围内的正整数。';return}if(score!==''&&a===null){$('error').textContent=mode()==='rate'?'正确率应在 0～100% 之间。':'请填写复习词数；遗忘数须为 0 到总词数之间的整数。';return}
const notes=$('notes').value.trim(),words=$('words').value.trim(),vocab=$('vocab').value.trim();
const wish=type==='finish'?null:nextFeedbackWish();
const body=buildParentFeedback({type,name:n,date:$('date').value,total,times,rate:a,forgot:score!==''&&mode()==='forgot'?Number(score):null,notes,words,vocab},wish);
$('output').value=body;dirty=true;count();$('status').textContent='已生成，可编辑后复制。';if(window.innerWidth<761)$('output').scrollIntoView({behavior:'smooth',block:'center'})});
$('output').addEventListener('input',count);
$('copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('output').value);$('status').textContent='已复制，可以粘贴到微信。'}catch{$('output').focus();$('output').select();try{if(!document.execCommand('copy'))throw Error();$('status').textContent='已复制，可以粘贴到微信。'}catch{$('status').textContent='请长按或使用系统复制，文案已选中。'}}});
$('clear').addEventListener('click',()=>{$('form').reset();$('date').value=today();$('output').value='';$('error').textContent='';$('status').textContent='已清空本次记录。';dirty=false;update();count()});
$('example').addEventListener('click',()=>{$('name').value='小禾（示例）';$('total').value='60';$('times').value='2';document.querySelector('[value="forgot"]').checked=true;$('score').value='2';$('words').value='perfect — adj. 完美的\nalready — adv. 已经';$('notes').value='示例记录：能跟读单词，遇到不确定的词会主动提问。';$('vocab').value='示例记录：本次词汇检测约 70 词';update();$('status').textContent='已填入虚构示例，请替换为真实记录后生成。'});
update();

let wishCursor=0;
try { const saved=Number(localStorage.getItem('wanxiao-wish-index'));if(Number.isInteger(saved)&&saved>=0)wishCursor=saved%FEEDBACK_WISHES.length;} catch {}
function nextFeedbackWish(){const wish=FEEDBACK_WISHES[wishCursor];wishCursor=(wishCursor+1)%FEEDBACK_WISHES.length;try{localStorage.setItem('wanxiao-wish-index',String(wishCursor));}catch{}return wish;}
