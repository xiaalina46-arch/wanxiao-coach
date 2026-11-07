'use strict';
// Original encouragement pairs; no student information is stored by this module.
const FEEDBACK_WISHES = [
["It's not how many words you learn, but how many you remember.","重要的不是学过多少单词，而是真正记住了多少！"],
['A little review today makes tomorrow easier.','今天多一点复习，明天就多一份从容。'],
['Small steps, taken often, lead to lasting progress.','坚持迈出小小的一步，也能积累长久的进步。'],
['Every word you review is another chance to grow.','每一次回顾单词，都是一次成长的机会。'],
['Learning grows stronger with practice.','让练习陪伴学习，让知识更加扎实。'],
['Give new words time to become old friends.','给新单词一点时间，让它们慢慢成为熟悉的朋友。'],
['A steady habit can carry you a long way.','一个稳定的好习惯，能陪你走很远。'],
['Keep learning, keep reviewing, keep growing.','继续学习，常常回顾，一点一点成长。'],
['Remembering takes practice, and practice takes patience.','记忆需要练习，练习也需要耐心。'],
['One word at a time, one step at a time.','一个单词、一个脚印，慢慢积累自己的力量。'],
['Mistakes show us where to practise next.','错误会告诉我们，下一步可以在哪里多练一练。'],
['Your learning journey has its own pace.','学习有自己的节奏，稳稳前行就很好。'],
['Make a little space for review every day.','每天留一点时间给复习，让记忆慢慢扎根。'],
['What you practise today can support you tomorrow.','今天认真练习的内容，会成为明天的底气。'],
['Be curious about new words and kind to yourself.','对新单词保持好奇，也对学习中的自己多一点耐心。'],
['A familiar word begins with a first try.','每一个熟悉的单词，都从第一次尝试开始。'],
['Bring yesterday’s words into today’s practice.','把昨天学过的词，带进今天的小练习里。'],
['Progress can be quiet and still be meaningful.','进步有时很安静，但每一点积累都有意义。'],
['Let patience and practice work together.','让耐心和练习一起，陪伴知识慢慢扎根。'],
['You do not need to rush to keep moving forward.','不必着急，保持向前的节奏就好。'],
['Turn a new word into a lasting memory.','通过一次次回顾，让新单词成为长久的记忆。'],
['Review is a bridge from learning to remembering.','复习是一座桥，连接学过与记住。'],
['Try again, and give your memory another chance.','再试一次，也给自己的记忆多一次机会。'],
['Build your knowledge with care, one day at a time.','认真积累每一天，让知识一点点丰厚起来。']
];
function feedbackRate(a){return String(a===100?100:Math.min(99.9,Math.round(a*10)/10))}
function buildParentFeedback(d,wish){
 if(['grammar','reading','companion'].includes(d.type))return buildSubjectFeedback(d,wish);
 const {type,name,total,times,forgot,rate,notes,words,vocab,date}=d;
 const [,month,day]=date.split('-');
 const title={review:'单词抗遗忘复习反馈',class:'单词正课学习反馈',trial:'英语试课反馈',finish:'试课结束反馈'}[type];
 const hasTotal=total!==''&&total!=null,hasRate=rate!==null&&rate!==undefined;
 let out=`📖${Number(month)}月${Number(day)}日 ${name}同学${title}\n\n`;
 const metrics=[];
 if(hasTotal)metrics.push(`今日完成${Number(total)}个单词${type==='review'||type==='finish'?'复习':'学习'}`);
 if(hasRate)metrics.push(`正确率${feedbackRate(rate)}%`);
 let record=metrics.length?'✅'+metrics.join('，')+'！'+(rate===100?'💯🎉':'🌷'):'本次未填写词数或正确率，暂不评价掌握情况。';
 if(times)record+=`\n🔄第${Number(times)}次抗遗忘复习`;
 if(forgot!==null&&forgot!==undefined)record+=`\n📝本次遗忘${Number(forgot)}个单词`;
 const practice='学习新单词的同时，也别忘了经常回顾之前学过的词汇哦！📖✨ 通过不断复习、反复巩固，让学过的单词慢慢成为自己的知识积累。💪❤️';
 let summary='';
 if(rate===100)summary=`${name}本次${hasTotal?Number(total)+'个单词':'单词检测'}全部答对，拿下本次满分，为这份学习成果点个赞！💯👏 `;
 else if(hasRate)summary=`本次检测正确率为${feedbackRate(rate)}%，可以结合检测记录继续查漏补缺。🌱 `;
 if(notes)summary+=notes+'\n\n';
 if(words)summary+=`本次需加强的单词：\n${words}\n\n`;
 summary+=practice;
 if(type==='trial')out+=`🔎一、词汇检测\n${vocab||'本次未填写词汇检测记录，暂不判断词汇水平。'}\n\n☀️二、试课表现\n${record}\n\n${notes||'本次未填写课堂表现记录。'}\n\n📚三、单词表\n${words||'本次未填写单词表。'}\n\n${practice}`;
 else out+=`${record}\n\n☀️学习小结：\n\n${summary}`;
 if(type==='finish')out+='\n\n本次试课已结束，感谢孩子和家长的配合与支持。🌷';
 else if(wish)out+=`\n\n🌱寄语：\n\n${wish[0]}\n\n${wish[1]}希望${name}继续培养好习惯，让每一个学过的单词都成为自己的知识积累！🌟🌷`;
 return out;
}

function subjectArticles(text){return text.split('\n').map(s=>s.trim()).filter(Boolean).map(line=>{const parts=line.split('|').map(x=>x.trim());if(parts.length>2)throw Error('每篇文章请按“文章标题 | 正确率”填写');const raw=(parts[1]||'').replace(/%$/,'').trim();if(raw!==''&&(!/^\d+(\.\d+)?$/.test(raw)||Number(raw)>100))throw Error('文章正确率须为0～100之间的数字');return {title:parts[0],rate:raw===''?null:Number(raw)}})}
function buildSubjectFeedback(d,wish){
 const x=d.subject||{},lines=[],isGrammar=d.type==='grammar',isReading=d.type==='reading';
 const date=d.date.split('-').map(Number);const dateText=`${date[0]}年${date[1]}月${date[2]}日`;
 const header=isGrammar?'🎯 万校AI英语·语法课后反馈':isReading?'🎯 万校英语·阅读课后反馈':'🌻复习数据报告单';
 lines.push(header,`📅 日期：${dateText}`);if(d.coach)lines.push(`👨‍🏫 教练：${d.coach}`);lines.push(`🧑‍🎓 学生：${d.name}`);
 const fallback='本次未填写，暂不作评价。';
 if(isGrammar){
  lines.push('','1. 学习内容',x.textbook?`• 教材对应：${x.textbook}`:'本次未填写教材信息。');
  lines.push('','2. 掌握情况',`• 👍 已掌握：${x.mastered||'本次未填写'}`);lines.push(`• ⚠️ 需加强：${x.weak||'本次未填写'}`);
  lines.push('','3. 提升建议','① 复习错题集，尝试用费曼学习法把解题思路讲清楚。','② 复习本次【学海拾贝】课程内容。');if(x.suggestion)lines.push(x.suggestion);
  lines.push('','4. 教练评语',d.notes||fallback,'针对薄弱点多练习，坚持积累，逐步巩固！💪');
  lines.push('','5. 课后任务',x.tasks||'① 完成群内布置的抄写与背诵任务。\n② 复习本次错题，按教练安排完成额外练习。');
 }else if(isReading){
  const articles=subjectArticles(x.articles||'');
  lines.push('','1. 学习情况');if(x.grade)lines.push(`• 年级：${x.grade}`);if(x.articleCount!==''&&x.articleCount!=null)lines.push(`• 本次阅读：${x.articleCount}篇`);for(const article of articles)lines.push(`• 《${article.title||'未命名文章'}》${article.rate===null?'（未填写正确率）':'正确率：'+article.rate+'%'}`);if(!articles.length)lines.push('• 本次未填写文章及正确率。');
  lines.push('','2. 亮点与进步',`• 亮点：${x.highlights||'本次未填写，暂不评价课堂亮点。'}`,`• 进步：${x.progress||'未提供前后对比记录，暂不作进步判断。'}`);if(x.newWords!==''&&x.newWords!=null)lines.push(`• 本次新增生词：${x.newWords}个`);
  lines.push('','3. 重点词汇',x.keyWords||'本次未填写。');
  lines.push('','4. 小建议',`• 失分点：${x.lostPoints||'本次未填写。'}`,`• 改进：${x.suggestion||'尝试带着问题读文章，结合题目定位依据；必要时使用AI辅助拆解长难句，再自行核对理解。'}`);
  lines.push('','5. 教练评语',d.notes||fallback,'继续坚持适合自己的阅读节奏，逐步积累词汇与理解能力。💪');
  lines.push('','6. 课后任务',x.tasks||'① 万校互联小程序：复习本次生词。\n② 按约定完成教练布置的任务。');
 }else{
  const fields=[['复习内容','reviewContent'],['复习状态','reviewState'],['复习效率','efficiency']];for(const [label,key] of fields)lines.push(`⭐${label}：${x[key]||'本次未填写。'}`);
  lines.push(`⭐耗时：${x.minutes!==''&&x.minutes!=null?x.minutes+'分钟':'本次未填写。'}`,`⭐遗忘知识点：${x.forgotten||'本次未填写。'}`,`⭐高效突破：${x.breakthrough||'建议针对遗忘知识点整理典型例题，分析解题思路，进行专项练习。'}`,`⭐今日总结：${d.notes||fallback}`);
  lines.push('','💎复习方法：','1️⃣ 错题回溯法：回顾易错点并分类强化。','2️⃣ 思维导图梳理：构建知识点网络，强化各模块关联记忆。','3️⃣ 口述讲题：向老师复述解题思路，深化理解并练习表达。','4️⃣ 限时实战：建议每日安排10分钟专项训练，按实际情况调整。');if(x.tasks)lines.push('','📚课后任务：',x.tasks);
 }
 if(wish)lines.push('','🌱寄语：','',wish[0],'',wish[1]+`希望${d.name}保持适合自己的学习节奏，一点一点积累！🌟🌷`);
 return lines.join('\n');
}
