(() => {
  'use strict';

  const storageKey = 'mitii-inline-learning-v1:';
  const marks = [
    { value: '2', label: 'Вспомнил полностью' },
    { value: '1', label: 'Вспомнил частично' },
    { value: '0', label: 'Не вспомнил' }
  ];
  const modes = [['read', 'Вопросы и ответы'], ['steps', 'По шагам'], ['cards', 'Карточки'], ['all', 'Проверка всего блока']];

  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (className) node.className = className;
    return node;
  }

  function button(label, action, className) {
    const node = element('button', label, className || 'ib');
    node.type = 'button';
    node.addEventListener('click', action);
    return node;
  }

  function readProgress(id) {
    try {
      const progress = JSON.parse(localStorage.getItem(storageKey + id));
      if (progress && progress.cards && progress.ratings && Array.isArray(progress.attempts)) return progress;
    } catch {
      // A blocked storage area should still allow practice.
    }
    return { cards: {}, ratings: {}, attempts: [], stage: 0 };
  }

  function shuffled(items) {
    const result = items.slice();
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function mountBlock(block) {
    const fallback = block.querySelector('.learn-fallback');
    const items = Array.from(fallback?.querySelectorAll('li[data-prompt]') || [], (li, id) => ({
      id, question: li.dataset.prompt, hint: li.dataset.hint, answer: li.querySelector('.learn-model-answer')?.textContent.trim()
    }));
    if (!block.dataset.studyId || !items.length) return;

    const counts = (block.dataset.steps || '').split(',').map(Number).filter(n => n > 0 && n <= items.length);
    if (counts[counts.length - 1] !== items.length) counts.push(items.length);
    const saved = readProgress(block.dataset.studyId);
    let stage = Math.min(Math.max(saved.stage || 0, 0), counts.length - 1);
    let mode = 'read';
    let phase = 'recall';
    let order = items.slice();
    let position = 0;
    let flipped = false;
    let review = null;
    let draft = {};
    const panel = element('div', '', 'learn-panel');
    const status = element('p', '', 'learn-status');
    status.setAttribute('role', 'status');
    const tabs = element('div', '', 'learn-actions');
    const activity = element('div', '', 'learn-activity');
    activity.tabIndex = -1;
    const history = element('div', '', 'learn-history');
    panel.append(tabs, status, activity, history);

    function store() {
      try {
        localStorage.setItem(storageKey + block.dataset.studyId, JSON.stringify(saved));
      } catch {
        status.textContent = 'Браузер не сохраняет прогресс между посещениями.';
      }
    }

    function scope() {
      return mode === 'steps' ? 'step-' + stage : mode;
    }

    function pending(ratings) {
      return items.filter(item => ratings[item.id] === '0' || ratings[item.id] === '1');
    }

    function switchMode(next) {
      mode = next;
      phase = next === 'steps' ? 'study' : 'recall';
      draft = {};
      review = null;
      flipped = false;
      position = 0;
      draw(true);
    }

    function changeStage(next) {
      stage = next;
      saved.stage = next;
      phase = 'study';
      draft = {};
      draw(true);
      store();
    }

    function record(set, ratings) {
      const values = set.map(item => Number(ratings[item.id]));
      const full = values.filter(n => n === 2).length;
      const partial = values.filter(n => n === 1).length;
      const percentage = Math.round(100 * (full + partial * 0.5) / values.length);
      Object.assign(saved.ratings[scope()] ||= {}, ratings);
      saved.attempts.unshift({ scope: scope(), review: Boolean(review), time: Date.now(), total: values.length, full, partial, percentage });
      saved.attempts = saved.attempts.slice(0, 60);
      draw(true);
      store();
    }

    function rateRow(item, ratings, group, onRate) {
      const row = element('div', '', 'learn-actions learn-ratings');
      row.setAttribute('role', 'group');
      row.setAttribute('aria-label', group);
      for (const mark of marks) {
        const control = button(mark.label, () => {
          ratings[item.id] = mark.value;
          for (const action of row.children) {
            action.setAttribute('aria-pressed', String(action.dataset.mark === mark.value));
          }
          onRate();
        });
        control.dataset.mark = mark.value;
        control.setAttribute('aria-pressed', String(ratings[item.id] === mark.value));
        row.append(control);
      }
      return row;
    }

    function renderCards() {
      const card = order[position];
      if (!card) {
        activity.append(element('p', 'Все карточки в этой подборке пройдены.'));
        return;
      }
      activity.append(element('p', `Карточка ${position + 1} из ${order.length}`, 'learn-progress'));
      const flip = button(card.question, () => {
        flipped = !flipped;
        draw();
        activity.querySelector('.learn-card').focus();
      }, 'learn-card');
      flip.setAttribute('aria-expanded', String(flipped));
      flip.append(element('small', flipped ? 'Скрыть ответ' : 'Открыть ответ'));
      activity.append(flip);
      if (flipped) {
        activity.append(element('p', card.answer, 'learn-answer'));
        activity.append(rateRow(card, saved.cards, card.question, () => {
          store();
          const remaining = pending(saved.cards).length;
          status.textContent = `Карточек к повторению: ${remaining}.`;
          activity.querySelector('.learn-next')?.focus();
        }));
      }
      const controls = element('div', '', 'learn-actions');
      const prev = button('Назад', () => { position--; flipped = false; draw(true); });
      prev.disabled = position === 0;
      const next = button('Дальше', () => { position++; flipped = false; draw(true); }, 'ib learn-next');
      next.disabled = position === order.length - 1;
      const repeat = button('Незапомненные', () => {
        const remaining = pending(saved.cards);
        if (!remaining.length) {
          status.textContent = 'Пока нет карточек, отмеченных для повторения.';
          return;
        }
        order = remaining;
        position = 0;
        flipped = false;
        draw(true);
      });
      const mix = button('Перемешать', () => {
        order = shuffled(order);
        position = 0;
        flipped = false;
        draw(true);
      });
      const every = button('Все карточки', () => {
        order = items.slice();
        position = 0;
        flipped = false;
        draw(true);
      });
      controls.append(prev, next, repeat, mix, every);
      activity.append(controls);
    }

    function renderRecall() {
      const set = mode === 'steps' ? items.slice(0, counts[stage]) : review || items;
      if (mode === 'steps') {
        activity.append(element('p', `Шаг ${stage + 1} из ${counts.length} · ${set.length} из ${items.length} элементов`, 'learn-progress'));
      }

      if (phase === 'study') {
        const list = element('ol');
        for (const item of set) {
          const row = element('li', item.answer);
          if (item.hint) row.prepend(element('strong', item.hint + ' → '));
          if (stage && item.id >= counts[stage - 1]) row.classList.add('learn-new');
          list.append(row);
        }
        activity.append(list, button('Скрыть материал и вспомнить', () => { phase = 'recall'; draw(true); }));
      } else {
        const ratings = draft;
        const list = element('ol');
        const task = mode === 'steps' || block.dataset.recall
          ? block.dataset.recall || 'Воспроизведи изученные элементы и объясни каждый своими словами.'
          : 'Ответь своими словами, затем сверь смысл с эталоном.';
        activity.append(element('p', task));
        for (const item of set) {
          const row = element('li');
          if (block.dataset.recall && !review) row.textContent = 'Элемент ' + (item.id + 1);
          else row.textContent = item.question;
          if (phase === 'answer') {
            row.append(element('p', item.answer, 'learn-answer'));
            row.append(rateRow(item, ratings, item.question, () => {
              save.disabled = set.some(entry => ratings[entry.id] == null);
            }));
          }
          list.append(row);
        }
        activity.append(list);
        if (phase === 'recall') {
          const hints = set.filter(item => item.hint);
          if (hints.length) {
            const clue = element('details', '', 'learn-hints');
            clue.append(element('summary', 'Подсказка'), element('p', hints.map(item => item.hint).join(' → ')));
            activity.append(clue);
          }
          activity.append(button('Открыть эталон', () => {
            draft = {};
            phase = 'answer';
            draw(true);
          }));
        }
        const save = button('Сохранить попытку', () => {
          phase = 'saved';
          record(set, ratings);
        });
        save.disabled = set.some(entry => ratings[entry.id] == null);
        if (phase === 'answer') activity.append(save);
        if (phase === 'saved') {
          const controls = element('div', '', 'learn-actions');
          if (mode === 'all') controls.append(button('Сначала трудные', repeatDifficult));
          controls.append(button('Повторить', () => {
            phase = 'recall';
            draft = {};
            draw(true);
          }));
          if (review) controls.append(button('Весь блок', () => switchMode('all')));
          activity.append(controls);
        }
      }

      if (mode === 'steps') {
        const controls = element('div', '', 'learn-actions');
        const prev = button('Предыдущий шаг', () => changeStage(stage - 1));
        prev.disabled = stage === 0;
        const next = button('Следующий шаг', () => changeStage(stage + 1));
        next.disabled = stage === counts.length - 1;
        controls.append(prev, next);
        activity.append(controls);
      } else if (phase === 'recall' && !review) {
        activity.append(button('Сначала трудные', repeatDifficult));
      } else if (phase === 'recall' && review) {
        activity.append(button('Весь блок', () => switchMode('all')));
      }
    }

    function repeatDifficult() {
      const ratings = saved.ratings.all || saved.ratings['step-' + (counts.length - 1)] || {};
      const remaining = pending(ratings);
      if (!remaining.length) {
        status.textContent = 'Пока нет элементов, отмеченных для повторения в проверке всего блока.';
        return;
      }
      review = remaining;
      phase = 'recall';
      draw(true);
    }

    function renderReading() {
      if (block.dataset.recall) activity.append(element('p', block.dataset.recall));
      const list = element('ol');
      for (const item of items) {
        const row = element('li');
        row.append(element('strong', item.question));
        if (item.hint) row.append(element('p', 'Подсказка — ' + item.hint, 'learn-reading-hint'));
        row.append(element('p', item.answer, 'learn-answer'));
        list.append(row);
      }
      activity.append(list);
    }

    function draw(focus) {
      status.textContent = '';
      tabs.replaceChildren();
      activity.replaceChildren();
      history.replaceChildren();
      for (const [name, label] of modes) {
        if (name === 'steps' && counts.length === 1) continue;
        const tab = button(label, () => switchMode(name));
        tab.setAttribute('aria-pressed', String(mode === name));
        tabs.append(tab);
      }

      if (mode === 'read') renderReading();
      else if (mode === 'cards') renderCards();
      else renderRecall();

      if (mode !== 'cards') {
        const attempts = saved.attempts.filter(attempt => attempt.scope === scope()).slice(0, 6);
        if (attempts.length) {
          const list = element('ul');
          for (const attempt of attempts) {
            const date = new Date(attempt.time).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' });
            list.append(element('li', `${date}${attempt.review ? ' · трудные элементы' : ''} · полностью ${attempt.full} из ${attempt.total}, частично ${attempt.partial}, освоение ${attempt.percentage}%`));
          }
          history.append(element('strong', 'История попыток'), list, element('small', 'Частичный ответ даёт половину балла.'));
        }
      }
      if (focus) activity.focus({ preventScroll: true });
    }

    const section = element('section');
    for (const { name, value } of block.attributes) section.setAttribute(name, value);
    section.append(element('h3', block.querySelector('summary')?.textContent, 'learn-title'), panel);
    block.replaceWith(section);
    draw();
  }

  window.HubInlineLearning = function (root) {
    for (const block of root.querySelectorAll('details.inline-learning')) {
      mountBlock(block);
    }
    const first = root.querySelector('.inline-learning');
    const lesson = first?.closest('.doc');
    const title = lesson?.querySelector('h1');
    if (!title || lesson.querySelector('.learn-jump')) return;
    const jump = button('К самопроверке', () => {
      first.querySelector('.learn-activity')?.focus({ preventScroll: true });
      first.scrollIntoView({ block: 'center', behavior: 'instant' });
    }, 'ib learn-jump u2-keep');
    title.after(jump);
  };
})();
