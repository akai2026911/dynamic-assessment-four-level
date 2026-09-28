      const showSummary = () => {
        const result = state.hand ? '需要第四级完整教学支持' : '在第四级示范后能够完成';
        els.summary.innerHTML = `<div class="summary-card"><span class="summary-tag">评估完成</span><h3>以所需提示层级判断能力水平</h3><p>本次表现：<strong>${result}</strong>。记录儿童在哪一级提示后成功，比简单记录“对或错”更能反映其学习潜能与适宜教学起点。</p><div class="summary-grid"><div class="summary-item"><strong>1 对错回馈</strong>温和鼓励，未完成</div><div class="summary-item"><strong>2 口语提示</strong>明确线索，未完成</div><div class="summary-item"><strong>3 平行题练习</strong>相似任务中完成</div><div class="summary-item"><strong>4 原题目教学</strong>${state.hand ? '手把手辅助后完成' : '示范后完成'}</div></div><button class="action" type="button" data-action="reset">再练习一次</button></div>`;
        els.summary.hidden = false; els.summary.querySelector('button').focus(); announce('评估完成，已生成提示层级总结。');
      };
      const reset = () => {
        speechSynthesis?.cancel?.(); Object.assign(state,{level:1,done:[],mode:'original',selected:false,hand:false});
        setTask('original'); els.summary.hidden=true; els.bubble.hidden=true; els.student.className='person student unsure';
        els.kicker.textContent='观察阶段'; els.title.textContent='儿童没有完成颜色配对'; els.record.textContent='等待评估者选择提示';
        els.messageTitle.textContent='先给予最少量的支持'; els.messageText.textContent='请选择“第一级：对错回馈”，观察儿童反应。';
        setActions([{action:'level1',label:'给予对错回馈'}]); refreshRail(); announce('练习已重新开始。');
      };
      const actions = { level1:runLevel1, level2:runLevel2, level3:runLevel3, level4:runLevel4, assist, reset };
      document.addEventListener('click', e => { const a=e.target.closest('[data-action]'); if(a && actions[a.dataset.action]) actions[a.dataset.action](); });
      $('#resetBtn').addEventListener('click', reset);
      els.levels.forEach(btn => btn.addEventListener('click', () => { const n=+btn.dataset.level; if(!btn.disabled && actions['level'+n]) actions['level'+n](); }));
      els.drag.addEventListener('click', () => { state.selected=!state.selected; els.drag.style.outline=state.selected?'4px solid var(--amber)':''; announce(state.selected?'积木已选中，请选择目标位置':'已取消选择'); });
      els.target.addEventListener('click', () => { if(state.selected) placeBlock(); });
      els.target.addEventListener('keydown', e => { if((e.key==='Enter'||e.key===' ') && state.selected){e.preventDefault();placeBlock();} });
      let dragOffset={x:0,y:0};
      els.drag.addEventListener('pointerdown', e => { if(e.pointerType==='mouse' && e.button!==0) return; const r=els.drag.getBoundingClientRect(); dragOffset={x:e.clientX-r.left,y:e.clientY-r.top}; els.drag.setPointerCapture(e.pointerId); els.drag.classList.add('dragging'); els.drag.style.width=r.width+'px'; els.drag.style.height=r.height+'px'; els.drag.style.left=(e.clientX-dragOffset.x)+'px'; els.drag.style.top=(e.clientY-dragOffset.y)+'px'; });
      els.drag.addEventListener('pointermove', e => { if(!els.drag.classList.contains('dragging')) return; els.drag.style.left=(e.clientX-dragOffset.x)+'px'; els.drag.style.top=(e.clientY-dragOffset.y)+'px'; const r=els.target.getBoundingClientRect(); els.target.classList.toggle('over',e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom); });
      els.drag.addEventListener('pointerup', e => { if(!els.drag.classList.contains('dragging')) return; const r=els.target.getBoundingClientRect(), hit=e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom; els.target.classList.remove('over'); els.drag.classList.remove('dragging'); els.drag.style.cssText=''; if(hit) placeBlock(); });

      const registerWebMCP = () => {
        const context = document.modelContext; if (!context?.registerTool) return;
        const schema = {type:'object',properties:{level:{type:'integer',minimum:1,maximum:4}},required:['level'],additionalProperties:false};
        Promise.resolve(context.registerTool({name:'apply_prompt_level',title:'应用提示级别',description:'在当前动态化评估练习中应用指定的四级提示。只能按已解锁的顺序使用。',inputSchema:schema,annotations:{readOnlyHint:false,untrustedContentHint:false},execute:({level})=>{const btn=els.levels[level-1];if(!btn||btn.disabled)throw new Error('该提示级别尚未解锁');actions['level'+level]();return {appliedLevel:level,record:els.record.textContent};}})).catch(()=>{});
        Promise.resolve(context.registerTool({name:'reset_assessment_practice',title:'重置评估练习',description:'将四级提示系统练习恢复到初始观察阶段。',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute:()=>{reset();return {status:'reset'};}})).catch(()=>{});
      };
      registerWebMCP();
