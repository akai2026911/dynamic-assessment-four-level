      const runLevel3 = () => {
        state.level = 3; setTask('parallel'); els.bubble.hidden = true; els.kicker.textContent = '第三级提示'; els.title.textContent = '先用相似题练习，再观察迁移';
        els.record.textContent = '等待完成平行题'; els.messageTitle.textContent = '请完成红色积木配对';
        els.messageText.textContent = '拖拽积木到同色位置；也可以选中积木后，在目标位置按回车。'; setActions([]); refreshRail();
        announce('平行题开始。请把红色积木放入红色位置。');
      };
      const completeParallel = () => {
        if (state.mode !== 'parallel') return;
        unlock(3); els.student.classList.remove('unsure'); els.student.classList.add('happy');
        els.record.textContent = '平行题练习后掌握'; els.messageTitle.textContent = '配对成功';
        els.messageText.textContent = '儿童能在平行题中完成。现在回到原题，检验是否能迁移。';
        setActions([{action:'level4', label:'返回原题教学'}]); speak('配对成功'); announce('平行题配对成功。第四级提示已解锁。');
      };
      const runLevel4 = () => {
        state.level = 4; setTask('original'); els.student.classList.add('unsure'); els.student.classList.remove('happy');
        els.kicker.textContent = '第四级提示'; els.title.textContent = '回到原题，示范正确做法'; els.record.textContent = '等待观察原题表现';
        bubble('看，我先示范一次。'); speak('看，我先示范一次。'); els.target.classList.add('highlight');
        els.messageTitle.textContent = '完成示范后，给儿童尝试机会'; els.messageText.textContent = '可以直接拖拽完成；若儿童仍无反应，再选择手把手辅助。';
        setActions([{action:'assist', label:'仍无反应，给予手把手辅助', kind:'coral'}]); refreshRail();
        setTimeout(() => els.target.classList.remove('highlight'), 2400); announce('已回到原题并完成示范。');
      };
      const assist = () => {
        state.hand = true; const hand = document.createElement('div'); hand.className='coach-hand'; hand.textContent='☝️'; hand.setAttribute('aria-hidden','true'); els.taskPanel.appendChild(hand);
        const r = els.drag.getBoundingClientRect(), p = els.taskPanel.getBoundingClientRect(); hand.style.left=(r.left-p.left+30)+'px'; hand.style.top=(r.top-p.top+20)+'px';
        bubble('我们一起做。'); speak('我们一起做。'); els.record.textContent = '使用手把手辅助';
        setTimeout(() => { hand.remove(); placeBlock(); }, 1700); announce('正在进行手把手辅助。');
      };
      const completeOriginal = () => {
        if (state.done.includes(4)) return; state.done.push(4); refreshRail();
        els.student.classList.remove('unsure'); els.student.classList.add('happy'); els.record.textContent = state.hand ? '手把手辅助后完成' : '原题示范后完成';
        speak('完成了'); setTimeout(showSummary, 650);
      };
      const placeBlock = () => {
        if (els.target.contains(els.drag)) return;
        els.drag.classList.remove('dragging'); els.drag.style.cssText=''; els.target.appendChild(els.drag); els.target.classList.add('filled');
        if (state.mode === 'parallel') completeParallel(); else if (state.level === 4) completeOriginal();
      };
