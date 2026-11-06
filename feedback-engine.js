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
