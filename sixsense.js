'use strict';
const SIX_COMMON_FIELDS=[
 ['phonics','拼读单词数','填写实际词数','count',true],['recited','背诵单词数','填写实际词数','count',true],
 ['dictationTotal','默写抽查词数','模板为10词，可按实际修改','count',true],['dictationErrors','默写错误词数','全部正确请填0','count',true],
 ['translationTotal','英汉互译词数','未检测请填0','count',true],['translationErrors','英汉互译错误词数','全部正确或未检测请填0','count',true],
 ['overall','整体表现',['状态稳定','进步显著','状态尚可'],'select'],['quality','学习质量',['很高','较高','一般'],'select'],
 ['attention','注意力',['全程专注','状态在线','慢慢投入'],'select'],['interaction','课堂互动记录','按实际填写问答或随堂任务的参与情况','area'],
 ['pronunciation','单词发音',['吐字清晰','发音自然','有所改善'],'select'],['spelling','拼写作答',['落笔顺畅','节奏平稳','还需多加练习'],'select'],
 ['highlights','亮点与肯定','填写实际观察到的特质与具体场景','area'],['focusTaught','本次是否已开展六感词元教学',['是','否'],'select'],
 ['reviewPlan','巩固复盘建议','选填，留空使用复习认读、书写和背诵的建议','area'],['weak','需针对性强化的问题','如：个别词汇发音生疏或词义记不牢','area'],
 ['practicePlan','针对性练习建议','选填，可按实际安排跟读或书写','area'],['extension','拓展练习建议','选填，留空使用学有余力时的练习建议','area'],
 ['history','往期对比记录','只有提供真实往期记录时填写，不自动判断进步','area']
];
function sixSenseConfig(trial){return {title:trial?'六感标准试课记录':'六感标准正课记录',fields:trial?SIX_COMMON_FIELDS:[['lesson','第几次正课','填写本次正课序号','positive',true],...SIX_COMMON_FIELDS]};}
function sixSenseData(x,trial){
 const keys=['phonics','recited','dictationTotal','dictationErrors','translationTotal','translationErrors'];if(!trial)keys.push('lesson');
 const data={};for(const key of keys){if(x[key]===undefined||x[key]===null||String(x[key]).trim()==='')throw Error('请完整填写本次词数、两项错误数和正课序号（试课无需序号）；未开展的检测请填0。');const v=Number(x[key]);if(!Number.isInteger(v)||v<0||v>100000||(key==='lesson'&&v<1))throw Error('词数和错误数须为非负整数；正课序号须为正整数。');data[key]=v;}
 for(const [prefix,label] of [['dictation','默写'],['translation','英汉互译']]){if(data[prefix+'Errors']>data[prefix+'Total'])throw Error(label+'错误数不能超过本次检测词数。');const total=data[prefix+'Total'],errors=data[prefix+'Errors'];data[prefix+'Correct']=total-errors;data[prefix+'Rate']=total===0?null:(total-errors)/total*100;}
 return data;
}
function sixMetric(total,errors,label){if(total===0)return `• ${label}：本次未开展检测（0词），不计算正确率。`;const correct=total-errors;return `• ${label}：${label==='默写抽查'?'抽查':'检测'}${total}词，答对${correct}词，错误${errors}词，正确率${feedbackRate(correct/total*100)}%。`;}
function buildSixSenseFeedback(d,wish){
 const x=d.subject||{},trial=d.type==='sixtrial',v=sixSenseData(x,trial),date=d.date.split('-').map(Number);
 const lines=[trial?'📖 六感标准试课反馈':'📖 六感标准正课反馈',`📅 ${date[0]}年${date[1]}月${date[2]}日`,`👤 学生：${d.name}`];if(d.coach)lines.push(`👨‍🏫 教练：${d.coach}`);
 lines.push('',trial?`此次试课，${d.name}同学的核心学习成果如下：`:`本次课程是第${v.lesson}次正课，${d.name}同学的核心学习成果如下：`);
 if(x.overall)lines.push(`• 整体表现：${x.overall}。`);
 lines.push('','📚 知识掌握',`• 拼读：${v.phonics}个单词。`,`• 背诵：${v.recited}个单词。`,sixMetric(v.dictationTotal,v.dictationErrors,'默写抽查'),sixMetric(v.translationTotal,v.translationErrors,'英汉互译'));if(x.quality)lines.push(`• 学习质量：${x.quality}。`);
 if(x.attention||x.interaction) {lines.push('','☀️ 课堂状态');if(x.attention)lines.push(`• 注意力：${x.attention}。`);if(x.interaction)lines.push(`• 课堂互动：${x.interaction}`);}
 if(x.pronunciation||x.spelling){lines.push('','🌟 能力表现');if(x.pronunciation)lines.push(`• 单词发音：${x.pronunciation}。`);if(x.spelling)lines.push(`• 拼写作答：${x.spelling}。`);}
 if(x.highlights)lines.push('','👍 亮点与肯定',x.highlights);
 if(x.focusTaught==='是')lines.push('','📘 本次教学重点','本节课将重点精力投入六感词元的教学环节，引导学员辨识辅音和元音、理解单词内在的发音规则，帮助搭建系统的拼读思路。');
 if(d.notes)lines.push('','📝 教练评语',d.notes);
 lines.push('','📖 课后建议',`• 巩固复盘：${x.reviewPlan||'利用课余时间温习本次所学新单词及易混词汇，通过认读、书写和背诵加深记忆。'}`);
 if(x.weak)lines.push(`• 需强化问题：${x.weak}`);
 lines.push(`• 针对性练习：${x.practicePlan||(x.weak?'针对本次需强化的问题，结合音频跟读、反复书写逐步巩固。':'结合本次实际薄弱环节，按教练安排进行跟读或书写练习。')}`,`• 拓展练习：${x.extension||'学有余力时，可尝试绘本阅读、单词造句或配套习题，进一步夯实英语基础。'}`);
 if(x.history)lines.push('','🔄 往期对比（老师提供的记录）',x.history);
 lines.push('','坚持课后积累，逐步巩固本次所学。继续加油！💪🌷');
 if(wish)lines.push('','🌱寄语：','',wish[0],'',wish[1]);return lines.join('\n');
}
