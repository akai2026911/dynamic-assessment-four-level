const state = { level: 1, done: [], mode: 'original', selected: false, hand: false };
      const $ = (s) => document.querySelector(s);
      const els = {
        levels: [...document.querySelectorAll('.level')], bubble: $('#bubble'), student: $('#student'),
        record: $('#recordText'), kicker: $('#sceneKicker'), title: $('#sceneTitle'), taskName: $('#taskName'),
        taskHint: $('#taskHint'), source: $('#sourceTray'), target: $('#dropTarget'), drag: $('#draggable'),
        messageTitle: $('#messageTitle'), messageText: $('#messageText'), actions: $('#actions'),
        summary: $('#summary'), live: $('#live'), taskPanel: $('#taskPanel')
      };

      const speak = (text) => {
        if (!('speechSynthesis' in window)) return;
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text); u.lang = 'zh-CN'; u.rate = .92; u.pitch = 1.05;
        speechSynthesis.speak(u);
      };
      const announce = (text) => { els.live.textContent = ''; setTimeout(() => els.live.textContent = text, 30); };
      const bubble = (text) => { els.bubble.textContent = text; els.bubble.hidden = false; };
      const setActions = (items) => {
        els.actions.innerHTML = items.map(x => `<button class="action ${x.kind || ''}" type="button" data-action="${x.action}">${x.label}</button>`).join('');
      };
      const refreshRail = () => {
        els.levels.forEach((btn, i) => {
          const n = i + 1; btn.disabled = n > Math.max(1, ...state.done.map(x => x + 1), state.level);
          btn.classList.toggle('active', n === state.level && !state.done.includes(n));
          btn.classList.toggle('done', state.done.includes(n));
          btn.querySelector('.level-state').textContent = state.done.includes(n) ? '✓' : n === state.level ? '●' : '○';
        });
      };
      const unlock = (completed) => { if (!state.done.includes(completed)) state.done.push(completed); state.level = Math.min(4, completed + 1); refreshRail(); };
      const setTask = (mode) => {
        state.mode = mode; state.selected = false; state.hand = false;
        const parallel = mode === 'parallel';
        els.taskName.textContent = parallel ? '平行题：红色积木配对' : '原题：颜色配对';
        els.taskHint.textContent = parallel ? '把红色积木拖到同色位置' : '将蓝色积木放入同色位置';
        els.drag.className = `block ${parallel ? 'red' : 'blue'}`;
        els.drag.setAttribute('aria-label', `${parallel ? '红' : '蓝'}色积木，可拖动或按回车选中`);
        els.target.className = `target ${parallel ? 'red' : 'blue'}`;
        els.target.setAttribute('aria-label', `${parallel ? '红' : '蓝'}色配对位置，选中积木后按回车放置`);
        els.target.innerHTML = ''; els.source.appendChild(els.drag); els.drag.hidden = false;
      };
      const runLevel1 = () => {
        state.level = 1; bubble('我们再来一次。'); speak('我们再来一次。');
        els.record.textContent = '已给予温和鼓励'; els.messageTitle.textContent = '儿童仍未完成';
        els.messageText.textContent = '不要直接判错。观察后，再增加一小步支持。';
        unlock(1); setActions([{action:'level2', label:'进入第二级提示'}]); announce('已播放温和鼓励。儿童仍未完成，第二级提示已解锁。');
      };
      const runLevel2 = () => {
        state.level = 2; bubble('拿一样颜色的。'); speak('拿一样颜色的。'); els.target.classList.add('highlight');
        els.record.textContent = '已给予口语与视觉线索'; els.kicker.textContent = '第二级提示'; els.title.textContent = '突出任务中的关键特征';
        els.messageTitle.textContent = '明确线索后仍需支持'; els.messageText.textContent = '进入平行题，用相似但更易的任务进行示范和练习。';
        unlock(2); setTimeout(() => els.target.classList.remove('highlight'), 2600);
        setActions([{action:'level3', label:'进入平行题练习'}]); announce('相同颜色已高亮，平行题练习已解锁。');
      };
