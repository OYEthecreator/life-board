

(() => {
  'use strict';

  /* ================= CONFIG ================= */
  const CONFIG = {
    STORAGE_KEY: 'lifeboard_entries_v1',
    AUTOSAVE_PREFIX: 'lifeboard_autosave::', // + date
    DEFAULT_WPM: 200,
    DEBOUNCE_MS: 250,
    CALM_ROTATE_MS: 5 * 60 * 1000, // 5 minutes
    PROMPT_ROTATE_MS: 24 * 60 * 60 * 1000, // 24 hours (daily)
    MAX_RECENT: 6,
    // selectors tuned to your HTML (no class/id renames)
    SELECTORS: {
      moodBtns: '.mood-selector .mood-btn',
      textarea: 'textarea.journal-textarea', // specific to avoid clash with search input
      wordStat: '.journal-footer .entry-stats .entry-stat:nth-child(1) span',
      readStat: '.journal-footer .entry-stats .entry-stat:nth-child(2) span',
      saveBtn: '.journal-card .action-buttons .btn.btn-primary',
      voiceBtn: '.journal-card .action-buttons .btn.btn-secondary',
      calendarEl: '.calendar',
      entriesContainer: '#entries-container',
      recentList: '.sidebar.left .entry-list',
      dateDisplaySpan: '.date-display span',
      streakDisplay: '.streak-count',
      searchInput: '.sidebar.left input[placeholder^="Search"]',
      dailyPromptsHost: '.journal-main .card .entry-list' // fallback if needed
    }
  };

  /* ================ Content arrays (edit freely) ================ */
  const CALM_MESSAGES = [
    "Breathe slowly for 60 seconds. Notice your breath.",
    "Name 5 things you can see. Ground yourself in the present.",
    "Take a tiny stretch. Ease the tension in your shoulders.",
    "Write one short sentence about something you're grateful for.",
    "Close your eyes and listen for 30 seconds.",
    "Sip water slowly. Feel it cool and steady you.",
    "Remind yourself: progress, not perfection.",
    "Set a small, achievable goal for the next hour."
  ];

  const DAILY_PROMPTS = [
    "What's one thing you learned about yourself this week?",
    "Describe a moment today that made you smile.",
    "What challenge did you face today and how did you respond?",
    "List three things you're grateful for right now.",
    "What's one small step toward your goal tomorrow?",
    "Write a kind note to your past self.",
    "What drained your energy today and how can you replenish it?"
  ];

  const WEEKLY_PROMPTS = [
    "How many days this week did you write?",
    "What mood pattern did you notice this week?",
    "What is one thing you'll carry into next week?"
  ];

  /* ================== State ================== */
  let entries = []; // array of {id, dateISO, content, mood, wordCount, readingTime, createdAt, updatedAt}
  let selectedDateISO = toISODate(new Date());
  let editingEntryId = null;
  let recognition = null;
  let isRecording = false;
  let debounceTimer = null;
  let calmInterval = null;
  let promptInterval = null;

  /* ================= Utilities ================= */
  function toISODate(d) {
    const date = (d instanceof Date) ? d : new Date(d);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  }

  function readableFull(dateISO) {
    const d = new Date(dateISO + 'T00:00:00');
    return d.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  function shortReadable(dateISO) {
    const d = new Date(dateISO + 'T00:00:00');
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function nowTs() { return Date.now(); }

  // safe HTML escape (keeps newlines -> <br> for content)
  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
  }

  function uid() { return Date.now() + Math.floor(Math.random() * 1000); }
  function wordCount(text) {
    if (!text) return 0;
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).filter(Boolean).length;
  }
  function readingTime(words) {
    if (!words) return 0;
    return Math.max(1, Math.ceil(words / CONFIG.DEFAULT_WPM));
  }

  /* ================= Storage ================= */
  function loadEntries() {
    try {
      const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
      entries = raw ? JSON.parse(raw) : [];
      entries.forEach(e => { e.createdAt = e.createdAt || nowTs(); e.updatedAt = e.updatedAt || e.createdAt; });
      // sort descending by date then updatedAt
      entries.sort((a, b) => {
        if (a.dateISO === b.dateISO) return b.updatedAt - a.updatedAt;
        return b.dateISO.localeCompare(a.dateISO);
      });
    } catch (err) {
      console.error('Failed to load entries', err);
      entries = [];
    }
  }
  function saveEntries() {
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(entries));
  }
  /* ================= DOM shortcuts ================= */
  const S = CONFIG.SELECTORS;
  const $ = (q) => document.querySelector(q);
  const $$ = (q) => Array.from(document.querySelectorAll(q));
  /* ================= Modal & Toasts ================= */
  // Promise-based modal. Relies on markup you added (#lb-modal).
  function modalOpen({ title = '', body = '', actions = [] } = {}) {
    return new Promise(resolve => {
      const modal = document.getElementById('lb-modal');
      if (!modal) { console.warn('Modal container (#lb-modal) missing.'); resolve(null); return; }
      
      // ENHANCED: Add luxury styling to modal
      modal.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: rgba(0,0,0,0.7);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        animation: fadeIn 0.3s ease forwards;
      `;
      
      const modalPanel = modal.querySelector('.lb-modal-panel') || document.createElement('div');
      modalPanel.className = 'lb-modal-panel';
      modalPanel.style.cssText = `
        background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,250,252,0.98));
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255,255,255,0.3);
        border-radius: 24px;
        padding: 32px;
        max-width: 480px;
        width: 90%;
        box-shadow: 0 32px 64px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.1);
        transform: scale(0.9);
        animation: modalSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      `;

      const titleNode = modal.querySelector('#lb-modal-title') || document.createElement('h3');
      titleNode.id = 'lb-modal-title';
      titleNode.style.cssText = `
        font-size: 24px;
        font-weight: 700;
        color: #1e293b;
        margin: 0 0 16px 0;
        text-align: center;
      `;

      const bodyNode = modal.querySelector('#lb-modal-body') || document.createElement('div');
      bodyNode.id = 'lb-modal-body';
      bodyNode.style.cssText = `
        color: #64748b;
        line-height: 1.6;
        margin-bottom: 24px;
        text-align: center;
        font-size: 16px;
      `;

      const actionsNode = modal.querySelector('#lb-modal-actions') || document.createElement('div');
      actionsNode.id = 'lb-modal-actions';
      actionsNode.style.cssText = `
        display: flex;
        gap: 12px;
        justify-content: center;
        flex-wrap: wrap;
      `;

      const closeBtn = modal.querySelector('#lb-modal-close') || document.createElement('button');
      closeBtn.id = 'lb-modal-close';
      closeBtn.textContent = '×';
      closeBtn.style.cssText = `
        position: absolute;
        top: 16px;
        right: 16px;
        background: none;
        border: none;
        font-size: 24px;
        color: #64748b;
        cursor: pointer;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      `;

      closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.background = 'rgba(0,0,0,0.05)';
        closeBtn.style.color = '#1e293b';
      });

      closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.background = 'none';
        closeBtn.style.color = '#64748b';
      });

      // Set content
      titleNode.innerHTML = escapeHtml(title);
      if (typeof body === 'string') bodyNode.innerHTML = body;
      else if (body instanceof Node) { bodyNode.innerHTML = ''; bodyNode.appendChild(body); }
      else bodyNode.innerHTML = '';

      // Clear and create action buttons
      actionsNode.innerHTML = '';
      actions.forEach((a, idx) => {
        const btn = document.createElement('button');
        btn.className = a.className || 'btn';
        btn.textContent = a.label || `Action ${idx + 1}`;
        
        // Enhanced button styling
        btn.style.cssText = `
          padding: 12px 24px;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 100px;
          font-family: inherit;
          font-size: 14px;
        `;

        if (btn.className.includes('btn-primary')) {
          btn.style.background = 'linear-gradient(135deg, #6366f1, #8b5cf6)';
          btn.style.color = 'white';
          btn.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
        } else {
          btn.style.background = 'rgba(0,0,0,0.05)';
          btn.style.color = '#64748b';
        }

        btn.addEventListener('mouseenter', () => {
          btn.style.transform = 'translateY(-2px)';
          btn.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
        });

        btn.addEventListener('mouseleave', () => {
          btn.style.transform = 'translateY(0)';
          btn.style.boxShadow = btn.className.includes('btn-primary') 
            ? '0 4px 12px rgba(99, 102, 241, 0.3)' 
            : 'none';
        });

        btn.addEventListener('click', (ev) => {
          try { if (a.onClick) a.onClick(ev); } catch (e) { console.error(e); }
          if (a.closeOnClick !== false) modalClose();
          resolve(a.returnValue === undefined ? a.label : a.returnValue);
        });
        actionsNode.appendChild(btn);
      });

      // Ensure modal structure
      if (!modal.querySelector('.lb-modal-panel')) {
        modalPanel.appendChild(titleNode);
        modalPanel.appendChild(bodyNode);
        modalPanel.appendChild(actionsNode);
        modalPanel.appendChild(closeBtn);
        modal.appendChild(modalPanel);
      }

      function keyHandler(e) {
        if (e.key === 'Escape') { modalClose(); resolve(null); }
      }
      
      function modalClose() {
        modal.style.animation = 'fadeOut 0.3s ease forwards';
        modalPanel.style.animation = 'modalSlideOut 0.3s ease forwards';
        setTimeout(() => {
          modal.style.display = 'none';
          modal.setAttribute('aria-hidden', 'true');
          document.removeEventListener('keydown', keyHandler);
          closeBtn.removeEventListener('click', modalClose);
        }, 250);
      }

      closeBtn.addEventListener('click', () => { modalClose(); resolve(null); });
      document.addEventListener('keydown', keyHandler);
      modal.style.display = 'flex';
      modal.setAttribute('aria-hidden', 'false');

      // Focus first button if any
      const firstBtn = actionsNode.querySelector('button');
      if (firstBtn) firstBtn.focus();
    });
  }

  // Enhanced Toasts with luxury styling
  function toast(message, { timeout = 3000, type = 'info' } = {}) {
    const container = document.getElementById('lb-toasts');
    if (!container) return;
    
    const el = document.createElement('div');
    el.className = 'lb-toast';
    el.setAttribute('role', 'status');
    
    // LUXURY TOAST STYLING
    el.style.cssText = `
      padding: 16px 20px;
      margin-top: 12px;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.1);
      font-weight: 600;
      max-width: 320px;
      word-break: break-word;
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.2);
      transform: translateX(100px);
      opacity: 0;
      animation: toastSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      font-size: 14px;
      line-height: 1.4;
    `;

    if (type === 'success') { 
      el.style.background = 'linear-gradient(135deg, rgba(6, 214, 160, 0.95), rgba(4, 181, 131, 0.95))';
      el.style.color = '#fff';
      el.style.border = '1px solid rgba(255,255,255,0.3)';
    } else if (type === 'error') { 
      el.style.background = 'linear-gradient(135deg, rgba(255, 122, 122, 0.95), rgba(255, 79, 79, 0.95))';
      el.style.color = '#fff';
      el.style.border = '1px solid rgba(255,255,255,0.3)';
    } else { 
      el.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,250,252,0.95))';
      el.style.color = '#1e293b';
      el.style.border = '1px solid rgba(255,255,255,0.3)';
    }

    el.innerHTML = escapeHtml(message);
    container.appendChild(el);

    // Auto remove with luxury animation
    setTimeout(() => {
      el.style.animation = 'toastSlideOut 0.5s ease forwards';
      setTimeout(() => el.remove(), 500);
    }, timeout);
  }

  /* ================= Editor & CRUD ================= */
  function loadSelectedEntryToEditor() {
    const ta = document.querySelector(S.textarea);
    if (!ta) return;
    const e = entries.find(x => x.dateISO === selectedDateISO) || null;
    if (e) {
      ta.value = e.content || '';
      setActiveMood(e.mood || '');
      editingEntryId = e.id;
    } else {
      // load autosave if exists
      const draft = localStorage.getItem(CONFIG.AUTOSAVE_PREFIX + selectedDateISO);
      ta.value = draft || '';
      setActiveMood('');
      editingEntryId = null;
    }
    updateStats();
    updateSaveButtonText();
  }

  function setActiveMood(mood) {
    $$(S.moodBtns).forEach(b => {
      if (b.dataset.mood === mood) b.classList.add('active'); else b.classList.remove('active');
    });
  }

  function updateStats() {
    const ta = document.querySelector(S.textarea);
    if (!ta) return;
    const words = wordCount(ta.value);
    const rt = readingTime(words);
    const ws = document.querySelector(S.wordStat);
    const rs = document.querySelector(S.readStat);
    if (ws) ws.textContent = `${words} words`;
    if (rs) rs.textContent = `${rt} min read`;
  }

  function updateSaveButtonText() {
    const btn = document.querySelector(S.saveBtn);
    if (!btn) return;
    btn.textContent = editingEntryId ? 'Update' : 'Save Entry';
  }

  function persistCurrentEntry() {
    const ta = document.querySelector(S.textarea);
    if (!ta) return toast('Editor not found', { type: 'error' });
    const content = ta.value;
    const mood = document.querySelector(`${S.moodBtns}.active`)?.dataset?.mood || '';

    // if empty content, show luxury empty entry modal
    if (!content.trim()) {
      modalOpen({
        title: 'Empty Entry',
        body: 'You are about to save an empty entry. Would you like to continue?',
        actions: [
          { label: 'Cancel', className: 'btn btn-secondary', returnValue: false },
          { label: 'Save Empty', className: 'btn btn-primary', returnValue: true }
        ]
      }).then(answer => {
        if (answer) {
          const words = wordCount(content);
          const rt = readingTime(words);
          saveEntry(content, mood, words, rt);
        }
      });
      return;
    }

    const words = wordCount(content);
    const rt = readingTime(words);
    saveEntry(content, mood, words, rt);
  }

  function saveEntry(content, mood, words, rt) {
    if (editingEntryId) {
      const idx = entries.findIndex(e => e.id === editingEntryId);
      if (idx > -1) {
        entries[idx].content = content;
        entries[idx].mood = mood;
        entries[idx].wordCount = words;
        entries[idx].readingTime = rt;
        entries[idx].updatedAt = nowTs();
      } else {
        editingEntryId = null;
      }
    }

    if (!editingEntryId) {
      // ============ KEEP ADDING FIX - REMOVED THE REPLACEMENT LINE ============
      // REMOVED: entries = entries.filter(e => e.dateISO !== selectedDateISO);
      
      const newEntry = {
        id: uid(),
        dateISO: selectedDateISO,
        content,
        mood,
        wordCount: words,
        readingTime: rt,
        createdAt: nowTs(),
        updatedAt: nowTs()
      };
      entries.unshift(newEntry);
      editingEntryId = newEntry.id;
    }

    saveEntries();
    clearAutosaveForDate(selectedDateISO);
    renderAll();
    
    // LUXURY SUCCESS TOAST
    toast('✨ Entry saved successfully!', { type: 'success', timeout: 2000 });

    // REAL WORLD BEHAVIOR - Clear everything after saving
    document.querySelector(S.textarea).value = '';
    setActiveMood('');
    editingEntryId = null;
    updateStats();
    updateSaveButtonText();
  }

  function startEditEntryById(id) {
    const e = entries.find(x => x.id === id);
    if (!e) return;
    selectedDateISO = e.dateISO;
    editingEntryId = e.id;
    loadSelectedEntryToEditor();
    renderDateHeader();
    renderCalendar();
  }

  function confirmAndDelete(id) {
    // LUXURY DELETE CONFIRMATION MODAL
    modalOpen({
      title: 'Delete Entry',
      body: 'Are you sure you want to delete this entry?<br><br><small style="color: #94a3b8;">This action cannot be undone.</small>',
      actions: [
        { label: 'Cancel', className: 'btn btn-secondary', returnValue: false },
        { label: 'Delete Forever', className: 'btn btn-secondary', returnValue: true }
      ]
    }).then(choice => {
      if (choice) {
        entries = entries.filter(e => e.id !== id);
        if (editingEntryId === id) editingEntryId = null;
        saveEntries();
        renderAll();
        toast('Entry deleted', { type: 'info' });
      }
    });
  }

  /* ================= Autosave ================= */
  function autosaveDraftForDate(dateISO) {
    const ta = document.querySelector(S.textarea);
    if (!ta) return;
    localStorage.setItem(CONFIG.AUTOSAVE_PREFIX + dateISO, ta.value);
  }

  function clearAutosaveForDate(dateISO) {
    localStorage.removeItem(CONFIG.AUTOSAVE_PREFIX + dateISO);
  }

  /* ================== Rendering ================== */
  function renderDateHeader() {
    const el = document.querySelector(S.dateDisplaySpan);
    if (!el) return;
    el.textContent = readableFull(selectedDateISO);
  }

  function renderCalendar() {
    const cal = document.querySelector(S.calendarEl);
    if (!cal) return;
    const base = new Date(selectedDateISO + 'T00:00:00');
    const year = base.getFullYear();
    const month = base.getMonth();

    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const startOffset = first.getDay(); // 0..6
    const daysInMonth = last.getDate();

    const html = [];
    for (let i = 0; i < startOffset; i++) html.push('<div class="calendar-day empty"></div>');
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const has = entries.some(e => e.dateISO === iso);
      const classes = ['calendar-day', has ? 'has-entry' : 'no-entry'];
      if (iso === toISODate(new Date())) classes.push('today');
      html.push(`<div class="${classes.join(' ')}" data-iso="${iso}">${d}</div>`);
    }
    cal.innerHTML = html.join('');

    // attach click listeners
    cal.querySelectorAll('.calendar-day:not(.empty)').forEach(node => {
      node.addEventListener('click', () => {
        selectedDateISO = node.dataset.iso;
        editingEntryId = entries.find(e => e.dateISO === selectedDateISO)?.id || null;
        loadSelectedEntryToEditor();
        renderDateHeader();
        renderCalendar();
      });
    });
  }

  function renderEntriesList(filter = '') {
    const container = document.querySelector(S.entriesContainer);
    if (!container) return;
    const q = (filter || '').toLowerCase().trim();
    const filtered = entries.filter(e => {
      if (!q) return true;
      if ((e.mood || '').toLowerCase().includes(q)) return true;
      if (shortReadable(e.dateISO).toLowerCase().includes(q)) return true;
      if ((e.content || '').toLowerCase().includes(q)) return true;
      return false;
    });

    if (!filtered.length) {
      container.innerHTML = '<div style="text-align:center; padding:40px 20px; color:var(--text-light); font-style:italic;">No entries match your search. Save something and it will appear here.</div>';
    } else {
      // LUXURY ENTRIES DISPLAY
      container.innerHTML = filtered.map(e => {
        const preview = escapeHtml((e.content || '').slice(0, 140));
        const moodBadge = e.mood ? `<div class="mood-badge">${escapeHtml(e.mood)}</div>` : '';
        return `
          <div class="saved-entry luxury-entry" data-id="${e.id}">
            <div class="entry-header">
              <div class="entry-date">${shortReadable(e.dateISO)}</div>
              ${moodBadge}
            </div>
            <div class="entry-content">${preview}${(e.content||'').length>140? '…' : ''}</div>
            <div class="entry-actions">
              <button class="btn-luxury btn-open" data-id="${e.id}">
                <i class="fas fa-eye"></i>
              </button>
              <button class="btn-luxury btn-edit" data-id="${e.id}">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn-luxury btn-delete" data-id="${e.id}">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    // Add luxury CSS for entries
    if (!document.querySelector('#luxury-entries-style')) {
      const style = document.createElement('style');
      style.id = 'luxury-entries-style';
      style.textContent = `
        .saved-entry.luxury-entry {
          background: linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.08));
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 16px;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }

        .saved-entry.luxury-entry::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        }

        .saved-entry.luxury-entry:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 24px 48px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1);
          background: linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.12));
        }

        .entry-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .entry-date {
          font-weight: 700;
          color: white;
          font-size: 15px;
        }

        .mood-badge {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .entry-content {
          color: #e2e8f0;
          line-height: 1.5;
          margin-bottom: 16px;
          font-size: 14px;
        }

        .entry-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .btn-luxury {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 12px;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #e2e8f0;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 12px;
        }

        .btn-luxury:hover {
          background: rgba(255,255,255,0.2);
          transform: scale(1.1);
          color: white;
        }

        .btn-luxury.btn-delete:hover {
          background: rgba(239, 68, 68, 0.2);
          color: #fecaca;
        }

        @keyframes fadeIn {
          to { opacity: 1; }
        }

        @keyframes fadeOut {
          to { opacity: 0; }
        }

        @keyframes modalSlideIn {
          to { transform: scale(1); opacity: 1; }
        }

        @keyframes modalSlideOut {
          to { transform: scale(0.9); opacity: 0; }
        }

        @keyframes toastSlideIn {
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes toastSlideOut {
          to { transform: translateX(100px); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    // wire saved entry buttons
    container.querySelectorAll('.btn-open').forEach(b => b.addEventListener('click', () => {
      const id = Number(b.dataset.id);
      openEntryModal(id);
    }));
    container.querySelectorAll('.btn-edit').forEach(b => b.addEventListener('click', () => {
      const id = Number(b.dataset.id);
      startEditEntryById(id);
    }));
    container.querySelectorAll('.btn-delete').forEach(b => b.addEventListener('click', () => {
      const id = Number(b.dataset.id);
      confirmAndDelete(id);
    }));

    // render recent list left sidebar
    const recentHost = document.querySelector(S.recentList);
    if (recentHost) {
      const recent = entries.slice(0, CONFIG.MAX_RECENT);
      recentHost.innerHTML = recent.length ? recent.map(r => `
        <div class="entry-item" data-id="${r.id}">
          <div class="entry-date">${shortReadable(r.dateISO)}</div>
          <div class="entry-preview">${escapeHtml((r.content || '').slice(0, 120))}${(r.content||'').length>120? '…' : ''}</div>
        </div>
      `).join('') : '<div style="color:var(--text-light); padding:8px;">No recent entries</div>';

      recentHost.querySelectorAll('.entry-item').forEach(n => {
        n.addEventListener('click', () => {
          const id = Number(n.dataset.id);
          startEditEntryById(id);
          renderDateHeader();
          renderCalendar();
        });
      });
    }
  }

  // open full entry in modal
  function openEntryModal(id) {
    const e = entries.find(x => x.id === id);
    if (!e) return;
    const body = `
      <div style="margin-bottom:16px; text-align:center;">
        <span style="background:linear-gradient(135deg,#6366f1,#8b5cf6); color:white; padding:6px 16px; border-radius:20px; font-size:13px; font-weight:600;">
          ${escapeHtml(e.mood || 'No mood set')}
        </span>
      </div>
      <div style="white-space:pre-wrap; color: #1e293b; line-height:1.6; background:rgba(0,0,0,0.02); padding:20px; border-radius:12px; margin:16px 0;">
        ${escapeHtml(e.content)}
      </div>
      <div style="display:flex; justify-content:space-between; color:#64748b; font-size:13px; margin-top:20px;">
        <span>Words: ${e.wordCount || 0}</span>
        <span>Read: ${e.readingTime || 0} min</span>
      </div>
    `;
    modalOpen({
      title: shortReadable(e.dateISO),
      body,
      actions: [
        { label: 'Close', className: 'btn btn-secondary', returnValue: null },
        { label: 'Edit Entry', className: 'btn btn-primary', returnValue: 'edit' },
        { label: 'Delete', className: 'btn btn-secondary', returnValue: 'delete' }
      ]
    }).then(res => {
      if (res === 'edit') {
        startEditEntryById(id);
      } else if (res === 'delete') {
        confirmAndDelete(id);
      }
    });
  }

  /* ================= Insights & Streaks ================= */
  function calcStreak() {
    const daySet = new Set(entries.map(e => e.dateISO));
    let cursor = new Date();
    let count = 0;
    while (true) {
      const iso = toISODate(cursor);
      if (daySet.has(iso)) { count++; cursor.setDate(cursor.getDate() - 1); } else break;
    }
    return count;
  }

  function renderStreak() {
    const node = document.querySelector(S.streakDisplay);
    if (!node) return;
    const s = calcStreak();
    node.textContent = `${s} day streak`;
  }

  function computeInsights() {
    const now = new Date();
    const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    let monthWords = 0;
    const moodCount = {};
    entries.forEach(e => {
      if (e.mood) moodCount[e.mood] = (moodCount[e.mood] || 0) + 1;
      if (e.dateISO.startsWith(monthPrefix)) monthWords += (e.wordCount || 0);
    });
    const daysSoFar = now.getDate();
    const daysWritten = entries.filter(e => e.dateISO.startsWith(monthPrefix)).length;
    const consistency = daysSoFar ? Math.round((daysWritten / daysSoFar) * 100) : 0;
    return { monthWords, moodCount, daysWritten, consistency };
  }

  function renderInsights() {
    const ins = computeInsights();
    // update first insight paragraph if present (mood trend)
    const moodPara = document.querySelector('.insight-item .insight-content p');
    if (moodPara) moodPara.textContent = Object.entries(ins.moodCount).map(([k, v]) => `${k}: ${v}`).join(', ') || 'No data yet';
    // update other insight texts (best-effort mapping based on your DOM)
    const allInsightParas = document.querySelectorAll('.insight-content p');
    if (allInsightParas.length >= 2) {
      allInsightParas[1].textContent = `You've journaled ${ins.daysWritten} days this month`;
    }
    if (allInsightParas.length >= 3) {
      allInsightParas[2].textContent = `${ins.monthWords} words this month`;
    }
    // progress bars mapping (best-effort)
    const pv = document.querySelectorAll('.progress-item .progress-value');
    if (pv && pv.length) {
      if (pv[0]) pv[0].textContent = `${Math.min(ins.daysWritten, 7)}/7`;
      if (pv[1]) pv[1].textContent = `${ins.daysWritten}/30`;
      if (pv[2]) pv[2].textContent = `${ins.monthWords}/15000`;
    }
    const fills = document.querySelectorAll('.progress-fill');
    if (fills && fills.length) {
      const widths = [
        Math.min(100, (ins.daysWritten / 7) * 100 || 0),
        Math.min(100, (ins.daysWritten / 30) * 100 || 0),
        Math.min(100, ((ins.monthWords || 0) / 15000) * 100 || 0)
      ];
      fills.forEach((f, i) => { f.style.width = (widths[i] || 0) + '%'; });
    }
  }

  /* ================= Voice ================= */
  function initVoice() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;
    if (!SR) return;
    recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = navigator.language || 'en-US';

    recognition.addEventListener('result', (ev) => {
      let final = '';
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        if (ev.results[i].isFinal) final += ev.results[i][0].transcript;
      }
      if (final.trim()) {
        const ta = document.querySelector(S.textarea);
        if (!ta) return;
        ta.value = (ta.value + ' ' + final).trim();
        updateStats();
      }
    });

    recognition.addEventListener('end', () => {
      isRecording = false;
      updateVoiceButton();
    });
  }

  function toggleVoice() {
    if (!recognition) { toast('Voice transcription not supported', { type: 'error' }); return; }
    if (isRecording) { recognition.stop(); isRecording = false; updateVoiceButton(); }
    else { recognition.start(); isRecording = true; updateVoiceButton(); }
  }

  function updateVoiceButton() {
    const vb = document.querySelector(S.voiceBtn);
    if (!vb) return;
    vb.textContent = isRecording ? 'Stop Recording' : 'Voice Note';
  }

  /* ================= Calm & Prompts ================= */
  function showCalmMessage() {
    const idx = Math.floor(Math.random() * CALM_MESSAGES.length);
    toast(CALM_MESSAGES[idx], { timeout: 7000, type: 'info' });
  }

  function showDailyPromptToast() {
    // choose prompt by day index to rotate predictably
    const idx = (new Date()).getDate() % DAILY_PROMPTS.length;
    toast('Daily prompt: ' + DAILY_PROMPTS[idx], { timeout: 8000, type: 'info' });
  }

  function renderDailyPromptsCard() {
    // try to render into the Daily Prompts card in main area (it exists)
    // find the daily prompts card - it's the second .card inside .journal-main after entries widget
    const promptCards = Array.from(document.querySelectorAll('.journal-main .card'));
    // heuristics: pick the card with a title 'Daily Prompts'
    let host = null;
    promptCards.forEach(card => {
      const title = card.querySelector('.card-title');
      if (title && title.textContent && title.textContent.toLowerCase().includes('daily prompt')) host = card;
    });
    if (!host) {
      // fallback to selector in config
      host = document.querySelector(S.dailyPromptsHost);
    }
    if (!host) return;
    // find inner .entry-list if present
    const list = host.querySelector('.entry-list') || host;
    list.innerHTML = DAILY_PROMPTS.map((p, i) => `
      <div class="entry-item">
        <div class="entry-date">Prompt</div>
        <div class="entry-preview">${escapeHtml(p)}</div>
      </div>
    `).join('');
  }

  /* ================= Wiring UI ================= */
  function wireMoodButtons() {
    $$(S.moodBtns).forEach(b => {
      b.addEventListener('click', () => {
        $$(S.moodBtns).forEach(x => x.classList.remove('active'));
        b.classList.add('active');
      });
    });
  }

  function wireTextarea() {
    const ta = document.querySelector(S.textarea);
    if (!ta) return;
    ta.addEventListener('input', () => {
      updateStats();
      // debounce autosave per date
      if (window._lb_autosave) clearTimeout(window._lb_autosave);
      window._lb_autosave = setTimeout(() => autosaveDraftForDate(selectedDateISO), 700);
    });
    ta.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        persistCurrentEntry();
      }
    });
  }

  function wireButtons() {
    const save = document.querySelector(S.saveBtn);
    if (save) save.addEventListener('click', persistCurrentEntry);
    const voice = document.querySelector(S.voiceBtn);
    if (voice) voice.addEventListener('click', () => toggleVoice());
    // remove any old inline calendar/entry alerts by preventing default handlers not needed
  }

  function wireSearch() {
    const si = document.querySelector(S.searchInput);
    if (!si) return;
    si.addEventListener('input', (ev) => {
      const q = ev.target.value || '';
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        renderEntriesList(q);
      }, CONFIG.DEBOUNCE_MS);
    });
  }

  /* ================= Open / Edit helpers ================= */
  function loadSelectedEntryToEditorAndFocus() {
    loadSelectedEntryToEditor();
    const ta = document.querySelector(S.textarea);
    if (ta) ta.focus();
  }

  /* ================= Render all ================= */
  function renderAll() {
    renderDateHeader();
    renderCalendar();
    renderEntriesList(document.querySelector(S.searchInput)?.value || '');
    renderStreak();
    renderInsights();
    updateSaveButtonText();
  }

  /* ================= Startup ================= */
  function init() {
    loadEntries();
    // Init modal/toast containers existence
    if (!document.getElementById('lb-modal')) {
      // minimally inject (shouldn't happen because your HTML already has them)
      const injected = `
        <div id="lb-modal" style="display:none;">
          <div class="lb-modal-backdrop"></div>
          <div class="lb-modal-panel" role="document">
            <h3 id="lb-modal-title"></h3>
            <div id="lb-modal-body"></div>
            <div id="lb-modal-actions"></div>
            <button id="lb-modal-close">Close</button>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', injected);
    }
    if (!document.getElementById('lb-toasts')) {
      const toastInject = `<div id="lb-toasts" style="position:fixed; bottom:24px; right:24px; z-index:9999;"></div>`;
      document.body.insertAdjacentHTML('beforeend', toastInject);
    }

    renderDailyPromptsCard();
    renderAll();
    loadSelectedEntryToEditor();

    // Wire UI
    wireMoodButtons();
    wireTextarea();
    wireButtons();
    wireSearch();

    // Voice init
    initVoice();
    updateVoiceButton();

    // Calm messages and daily prompts
    showCalmMessage(); // show once on load
    calmInterval = setInterval(showCalmMessage, CONFIG.CALM_ROTATE_MS);

    showDailyPromptToast();
    // promptInterval at 24h; for test you can reduce it in CONFIG
    promptInterval = setInterval(showDailyPromptToast, CONFIG.PROMPT_ROTATE_MS);
  }

  /* ================= Expose debug API ================= */
  window.lifeboard = {
    getEntries: () => entries,
    exportTxt: function () {
      const content = entries.map(e => `--- ${shortReadable(e.dateISO)} ---\nMood: ${e.mood || '—'}\n\n${e.content || ''}\n\n`).join('\n');
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'lifeboard-entries.txt';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast('Export started', { type: 'info' });
    },
    clearAll: function () {
      modalOpen({
        title: 'Clear all local entries',
        body: 'This will remove all local entries. Continue?',
        actions: [
          { label: 'Cancel', className: 'btn btn-secondary', returnValue: false },
          { label: 'Clear', className: 'btn btn-secondary', returnValue: true }
        ]
      }).then(res => {
        if (res) { entries = []; saveEntries(); renderAll(); toast('Cleared', { type: 'info' }); }
      });
    },
    modalOpen
  };

  /* ================= Helpers used earlier but declared lower for readability ================= */
  function autosaveDraftForDate(dateISO) { const ta = document.querySelector(S.textarea); if (!ta) return; localStorage.setItem(CONFIG.AUTOSAVE_PREFIX + dateISO, ta.value); }
  function clearAutosaveForDate(dateISO) { localStorage.removeItem(CONFIG.AUTOSAVE_PREFIX + dateISO); }

  /* ================ Initialize on DOM ready ================ */
  document.addEventListener('DOMContentLoaded', init);

})();
// ===== COMPLETE PROFESSIONAL VOICE RECORDING SYSTEM =====
class ProfessionalVoiceRecorder {
    constructor() {
        this.isRecording = false;
        this.isPaused = false;
        this.recordingTime = 0;
        this.timerInterval = null;
        this.waveformInterval = null;
        this.transcriptionInterval = null;
        this.voiceInterface = null;
        this.transcription = "";
        this.voiceNotes = JSON.parse(localStorage.getItem('lifeboard_voice_notes')) || [];
        this.currentAnimation = null;
        this.recognition = null;
        this.init();
    }

    init() {
        // Check browser support first
        if (!this.hasSpeechRecognitionSupport()) {
            this.showBrowserFallback();
            return;
        }

        this.createVoiceInterface();
        this.wireEvents();
        this.injectProfessionalStyles();
        this.renderVoiceNotes();
    }

    hasSpeechRecognitionSupport() {
        return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    }

    hasSpeechSynthesisSupport() {
        return 'speechSynthesis' in window;
    }

    showBrowserFallback() {
        const fallbackHTML = `
            <div class="browser-fallback-message">
                <div class="fallback-icon">🎤</div>
                <h3>Voice Features Limited</h3>
                <p>For the best voice experience, please use <strong>Google Chrome</strong> or <strong>Microsoft Edge</strong>.</p>
                <div class="browser-options">
                    <a href="https://www.google.com/chrome/" target="_blank" class="browser-link">
                        <i class="fab fa-chrome"></i>
                        Download Chrome
                    </a>
                    <a href="https://www.microsoft.com/edge" target="_blank" class="browser-link">
                        <i class="fab fa-edge"></i>
                        Download Edge
                    </a>
                </div>
                <p class="fallback-note">Voice recording works best in Chrome-based browsers due to Web Speech API support.</p>
            </div>
        `;

        const voiceBtn = document.querySelector('.btn-secondary');
        if (voiceBtn) {
            voiceBtn.insertAdjacentHTML('afterend', fallbackHTML);
        }
    }

    createVoiceInterface() {
        this.voiceInterface = document.createElement('div');
        this.voiceInterface.className = 'voice-recording-interface';
        this.voiceInterface.innerHTML = `
            <div class="voice-recording-panel">
                <div class="voice-header">
                    <div class="header-content">
                        <i class="fas fa-microphone"></i>
                        <span class="header-title">Voice Recording</span>
                        <div class="recording-indicator">
                            <div class="pulse-dot"></div>
                            <span class="timer">00:00</span>
                        </div>
                    </div>
                    <button class="btn-close-voice">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="waveform-container">
                    <div class="waveform" id="voice-waveform">
                        ${Array.from({length: 45}, () => '<div class="wave-bar"></div>').join('')}
                    </div>
                </div>

                <div class="transcription-container">
                    <div class="transcription-header">
                        <span>Live Transcription</span>
                        <div class="audio-quality">🎙️ High Quality</div>
                    </div>
                    <div class="transcription-content">
                        <p class="transcription-text">Click record to start capturing your thoughts...</p>
                    </div>
                </div>

                <div class="voice-controls">
                    <button class="btn-voice-control btn-record" data-action="record">
                        <div class="btn-icon">
                            <i class="fas fa-microphone"></i>
                        </div>
                        <span class="btn-label">Record</span>
                    </button>

                    <button class="btn-voice-control btn-pause" data-action="pause" style="display: none;">
                        <div class="btn-icon">
                            <i class="fas fa-pause"></i>
                        </div>
                        <span class="btn-label">Pause</span>
                    </button>

                    <button class="btn-voice-control btn-stop" data-action="stop" style="display: none;">
                        <div class="btn-icon">
                            <i class="fas fa-square"></i>
                        </div>
                        <span class="btn-label">Stop</span>
                    </button>

                    <button class="btn-voice-control btn-save" data-action="save" style="display: none;">
                        <div class="btn-icon">
                            <i class="fas fa-save"></i>
                        </div>
                        <span class="btn-label">Save Note</span>
                    </button>
                </div>

                <div class="recording-stats">
                    <div class="stat-item">
                        <i class="fas fa-clock"></i>
                        <span>Duration: <span class="stat-value">0:00</span></span>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-file-alt"></i>
                        <span>Words: <span class="stat-value">0</span></span>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-database"></i>
                        <span>Quality: <span class="stat-value">HD</span></span>
                    </div>
                </div>
            </div>
        `;

        // Insert into action buttons area
        const actionButtons = document.querySelector('.action-buttons');
        if (actionButtons) {
            actionButtons.appendChild(this.voiceInterface);
        }
    }

    injectProfessionalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .voice-recording-interface {
                width: 100%;
                margin: 20px 0;
                display: none;
            }

            .voice-recording-panel {
                background: linear-gradient(135deg, 
                    rgba(255, 255, 255, 0.12) 0%, 
                    rgba(255, 255, 255, 0.08) 100%);
                backdrop-filter: blur(40px);
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 24px;
                padding: 0;
                overflow: hidden;
                box-shadow: 
                    0 25px 50px rgba(0, 0, 0, 0.25),
                    0 0 0 1px rgba(255, 255, 255, 0.1),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2);
                animation: slideInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            }

            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes slideOutDown {
                from {
                    opacity: 1;
                    transform: translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateY(20px);
                }
            }

            .voice-header {
                background: linear-gradient(135deg, 
                    rgba(99, 102, 241, 0.1) 0%, 
                    rgba(139, 92, 246, 0.05) 100%);
                padding: 20px 24px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .header-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .header-content i {
                color: #8b5cf6;
                font-size: 18px;
            }

            .header-title {
                color: white;
                font-size: 18px;
                font-weight: 700;
                letter-spacing: -0.5px;
            }

            .recording-indicator {
                display: flex;
                align-items: center;
                gap: 8px;
                background: rgba(239, 68, 68, 0.15);
                padding: 6px 12px;
                border-radius: 20px;
                border: 1px solid rgba(239, 68, 68, 0.3);
            }

            .pulse-dot {
                width: 8px;
                height: 8px;
                background: #ef4444;
                border-radius: 50%;
                animation: professionalPulse 2s ease-in-out infinite;
            }

            .timer {
                color: #fecaca;
                font-size: 13px;
                font-weight: 700;
                font-variant-numeric: tabular-nums;
            }

            .btn-close-voice {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 12px;
                width: 36px;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #94a3b8;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .btn-close-voice:hover {
                background: rgba(255, 255, 255, 0.15);
                color: white;
                transform: rotate(90deg);
            }

            .waveform-container {
                padding: 30px 24px;
                background: rgba(0, 0, 0, 0.1);
            }

            .waveform {
                display: flex;
                align-items: end;
                justify-content: center;
                height: 80px;
                gap: 2px;
            }

            .wave-bar {
                width: 3px;
                background: linear-gradient(to top, 
                    #6366f1 0%, 
                    #8b5cf6 50%, 
                    #c4b5fd 100%);
                border-radius: 2px;
                transition: height 0.15s cubic-bezier(0.4, 0, 0.2, 1);
                height: 5px;
            }

            .transcription-container {
                padding: 24px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .transcription-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
            }

            .transcription-header span {
                color: white;
                font-weight: 600;
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .audio-quality {
                background: rgba(34, 197, 94, 0.15);
                color: #86efac;
                padding: 4px 10px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: 600;
                border: 1px solid rgba(34, 197, 94, 0.3);
            }

            .transcription-content {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 16px;
                padding: 20px;
                min-height: 80px;
            }

            .transcription-text {
                color: #e2e8f0;
                margin: 0;
                font-size: 15px;
                line-height: 1.6;
                font-weight: 400;
            }

            .voice-controls {
                padding: 24px;
                display: flex;
                justify-content: center;
                gap: 16px;
                background: rgba(0, 0, 0, 0.05);
            }

            .btn-voice-control {
                background: linear-gradient(135deg, 
                    rgba(255, 255, 255, 0.1) 0%, 
                    rgba(255, 255, 255, 0.05) 100%);
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 16px;
                padding: 16px 20px;
                min-width: 100px;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                color: #e2e8f0;
            }

            .btn-voice-control:hover {
                transform: translateY(-2px);
                background: linear-gradient(135deg, 
                    rgba(255, 255, 255, 0.15) 0%, 
                    rgba(255, 255, 255, 0.1) 100%);
                border-color: rgba(255, 255, 255, 0.25);
                box-shadow: 0 12px 25px rgba(0, 0, 0, 0.2);
            }

            .btn-record {
                background: linear-gradient(135deg, 
                    rgba(239, 68, 68, 0.9) 0%, 
                    rgba(220, 38, 38, 0.8) 100%);
                border-color: rgba(239, 68, 68, 0.4);
            }

            .btn-pause {
                background: linear-gradient(135deg, 
                    rgba(245, 158, 11, 0.9) 0%, 
                    rgba(217, 119, 6, 0.8) 100%);
                border-color: rgba(245, 158, 11, 0.4);
            }

            .btn-stop {
                background: linear-gradient(135deg, 
                    rgba(16, 185, 129, 0.9) 0%, 
                    rgba(5, 150, 105, 0.8) 100%);
                border-color: rgba(16, 185, 129, 0.4);
            }

            .btn-save {
                background: linear-gradient(135deg, 
                    rgba(99, 102, 241, 0.9) 0%, 
                    rgba(139, 92, 246, 0.8) 100%);
                border-color: rgba(99, 102, 241, 0.4);
            }

            .btn-icon {
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .btn-icon i {
                font-size: 14px;
            }

            .btn-label {
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .recording-stats {
                padding: 20px 24px;
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 16px;
                background: rgba(0, 0, 0, 0.1);
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }

            .stat-item {
                display: flex;
                align-items: center;
                gap: 8px;
                color: #94a3b8;
                font-size: 13px;
                font-weight: 500;
            }

            .stat-item i {
                width: 16px;
                text-align: center;
                color: #8b5cf6;
            }

            .stat-value {
                color: white;
                font-weight: 600;
            }

            /* Voice Notes List */
            .voice-notes-container {
                margin-top: 24px;
            }

            .voice-note-item {
                background: linear-gradient(135deg, 
                    rgba(255, 255, 255, 0.1) 0%, 
                    rgba(255, 255, 255, 0.05) 100%);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 16px;
                padding: 20px;
                margin-bottom: 12px;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .voice-note-item:hover {
                transform: translateY(-2px);
                border-color: rgba(255, 255, 255, 0.25);
                box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
            }

            .voice-note-header {
                display: flex;
                justify-content: space-between;
                align-items: start;
                margin-bottom: 12px;
            }

            .voice-note-info h4 {
                color: white;
                font-size: 15px;
                font-weight: 600;
                margin: 0 0 4px 0;
            }

            .voice-note-meta {
                color: #94a3b8;
                font-size: 12px;
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .voice-note-actions {
                display: flex;
                gap: 8px;
            }

            .btn-voice-action {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 10px;
                width: 36px;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #e2e8f0;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .btn-voice-action:hover {
                background: rgba(255, 255, 255, 0.15);
                transform: scale(1.05);
            }

            .btn-play:hover {
                background: rgba(34, 197, 94, 0.2);
                color: #86efac;
            }

            .btn-delete:hover {
                background: rgba(239, 68, 68, 0.2);
                color: #fecaca;
            }

            .voice-note-transcription {
                color: #cbd5e1;
                font-size: 14px;
                line-height: 1.5;
                margin: 0;
            }

            @keyframes professionalPulse {
                0%, 100% { 
                    opacity: 1; 
                    transform: scale(1);
                }
                50% { 
                    opacity: 0.7; 
                    transform: scale(1.1);
                }
            }

            .no-voice-notes {
                text-align: center;
                padding: 40px 20px;
                color: #64748b;
                font-style: italic;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 16px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .no-voice-notes i {
                font-size: 32px;
                margin-bottom: 12px;
                display: block;
                opacity: 0.5;
            }

            /* Browser Fallback Styles */
            .browser-fallback-message {
                background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255,255,255,0.2);
                border-radius: 20px;
                padding: 30px;
                text-align: center;
                margin: 20px 0;
                color: white;
            }

            .fallback-icon {
                font-size: 48px;
                margin-bottom: 16px;
            }

            .browser-fallback-message h3 {
                margin: 0 0 12px 0;
                color: white;
                font-size: 20px;
            }

            .browser-fallback-message p {
                margin: 0 0 20px 0;
                color: #e2e8f0;
                line-height: 1.5;
            }

            .browser-options {
                display: flex;
                gap: 12px;
                justify-content: center;
                margin-bottom: 16px;
            }

            .browser-link {
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                color: white;
                padding: 12px 20px;
                border-radius: 12px;
                text-decoration: none;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: all 0.3s ease;
            }

            .browser-link:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(0,0,0,0.3);
            }

            .browser-link:nth-child(2) {
                background: linear-gradient(135deg, #0284c7, #0369a1);
            }

            .fallback-note {
                margin: 0;
                color: #94a3b8;
                font-size: 14px;
            }
        `;
        document.head.appendChild(style);
    }

    wireEvents() {
        // Voice note button click
        const voiceBtn = document.querySelector('.btn-secondary');
        if (voiceBtn) {
            voiceBtn.addEventListener('click', () => {
                this.toggleVoiceInterface();
            });
        }

        // Close button
        this.voiceInterface.querySelector('.btn-close-voice').addEventListener('click', () => {
            this.hideVoiceInterface();
        });

        // Voice control buttons
        this.voiceInterface.querySelectorAll('.btn-voice-control').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleVoiceAction(action);
            });
        });
    }

    toggleVoiceInterface() {
        const isVisible = this.voiceInterface.style.display === 'block';
        if (isVisible) {
            this.hideVoiceInterface();
        } else {
            this.showVoiceInterface();
        }
    }

    showVoiceInterface() {
        this.voiceInterface.style.display = 'block';
        this.voiceInterface.style.animation = 'slideInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards';
        this.resetRecording();
    }

    hideVoiceInterface() {
        this.voiceInterface.style.animation = 'slideOutDown 0.3s ease forwards';
        setTimeout(() => {
            this.voiceInterface.style.display = 'none';
            this.resetRecording();
        }, 300);
    }

    handleVoiceAction(action) {
        switch (action) {
            case 'record':
                this.startRecording();
                break;
            case 'pause':
                this.togglePause();
                break;
            case 'stop':
                this.stopRecording();
                break;
            case 'save':
                this.saveVoiceNote();
                break;
        }
    }

    // ===== REAL WEB SPEECH API - START RECORDING =====
    startRecording() {
        this.isRecording = true;
        this.isPaused = false;
        this.recordingTime = 0;
        this.transcription = "";

        // Initialize Web Speech API
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        // Handle real transcription results
        this.recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';
                } else {
                    interimTranscript += transcript;
                }
            }

            // Update transcription with real speech
            if (finalTranscript) {
                this.transcription += finalTranscript;
            }

            // Display live transcription
            const displayText = this.transcription + interimTranscript;
            this.voiceInterface.querySelector('.transcription-text').textContent = displayText;
            
            // Update word count
            const wordCount = displayText.split(/\s+/).filter(Boolean).length;
            this.voiceInterface.querySelector('.stat-value:nth-child(2)').textContent = wordCount;
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            if (event.error === 'not-allowed') {
                this.showToast('Microphone access denied. Please allow microphone permissions.', 'error');
            } else {
                this.showToast('Speech recognition error: ' + event.error, 'error');
            }
            this.stopRecording();
        };

        this.recognition.onend = () => {
            if (this.isRecording && !this.isPaused) {
                // Automatically restart if not manually stopped
                this.recognition.start();
            }
        };

        // Start real recording
        this.recognition.start();

        // Update UI
        this.showControl('pause');
        this.showControl('stop');
        this.hideControl('record');
        this.hideControl('save');
        
        this.voiceInterface.querySelector('.transcription-text').textContent = '🎤 Listening... Speak now!';
        this.voiceInterface.querySelector('.transcription-text').style.color = '#86efac';

        this.startTimer();
        this.animateProfessionalWaveform();
    }

    // ===== REAL TIMER =====
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.recordingTime++;
            const minutes = Math.floor(this.recordingTime / 60);
            const seconds = this.recordingTime % 60;
            this.voiceInterface.querySelector('.timer').textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // Update duration stat
            this.voiceInterface.querySelector('.stat-value:nth-child(1)').textContent = 
                `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    // ===== REAL WAVEFORM ANIMATION =====
    animateProfessionalWaveform() {
        const waveBars = this.voiceInterface.querySelectorAll('.wave-bar');
        
        const animate = () => {
            if (!this.isRecording || this.isPaused) return;
            
            waveBars.forEach(bar => {
                const randomHeight = 8 + Math.random() * 60;
                bar.style.height = `${randomHeight}px`;
                bar.style.opacity = 0.7 + Math.random() * 0.3;
            });
            
            this.currentAnimation = requestAnimationFrame(animate);
        };
        
        animate();
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        const pauseBtn = this.voiceInterface.querySelector('.btn-pause');
        
        if (this.isPaused) {
            pauseBtn.querySelector('.btn-label').textContent = 'Resume';
            pauseBtn.querySelector('i').className = 'fas fa-play';
            clearInterval(this.timerInterval);
            this.stopWaveformAnimation();
            
            // Pause Web Speech API
            if (this.recognition) {
                this.recognition.stop();
            }
            
            this.voiceInterface.querySelector('.transcription-text').textContent = '⏸️ Recording paused';
            this.voiceInterface.querySelector('.transcription-text').style.color = '#fbbf24';
        } else {
            pauseBtn.querySelector('.btn-label').textContent = 'Pause';
            pauseBtn.querySelector('i').className = 'fas fa-pause';
            this.startTimer();
            this.animateProfessionalWaveform();
            
            // Resume Web Speech API
            if (this.recognition) {
                this.recognition.start();
            }
            
            this.voiceInterface.querySelector('.transcription-text').textContent = '🎤 Listening... Speak now!';
            this.voiceInterface.querySelector('.transcription-text').style.color = '#86efac';
        }
    }

    stopRecording() {
        this.isRecording = false;
        
        // Stop Web Speech API
        if (this.recognition) {
            this.recognition.stop();
        }

        clearInterval(this.timerInterval);
        this.stopWaveformAnimation();

        // Update UI for saving
        this.showControl('save');
        this.hideControl('pause');
        this.hideControl('stop');
        
        this.voiceInterface.querySelector('.transcription-text').style.color = '#e2e8f0';
    }

    // ===== PERFECT SAVE SYSTEM =====
    saveVoiceNote() {
        if (!this.transcription.trim()) {
            this.showToast('Please record something before saving', 'error');
            return;
        }

        const voiceNote = {
            id: Date.now() + Math.floor(Math.random() * 1000),
            transcription: this.transcription,
            duration: this.recordingTime,
            wordCount: this.transcription.split(/\s+/).filter(Boolean).length,
            createdAt: new Date().toISOString(),
            date: new Date().toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };

        // Add to beginning of array (newest first)
        this.voiceNotes.unshift(voiceNote);
        localStorage.setItem('lifeboard_voice_notes', JSON.stringify(this.voiceNotes));

        this.showToast('🎵 Voice note saved successfully!', 'success');
        this.renderVoiceNotes();
        this.hideVoiceInterface();
    }

    stopWaveformAnimation() {
        if (this.currentAnimation) {
            cancelAnimationFrame(this.currentAnimation);
        }
        // Reset waveform bars to minimal height
        const waveBars = this.voiceInterface.querySelectorAll('.wave-bar');
        waveBars.forEach(bar => {
            bar.style.height = '5px';
            bar.style.opacity = '1';
        });
    }

    showControl(control) {
        const btn = this.voiceInterface.querySelector(`.btn-${control}`);
        if (btn) btn.style.display = 'flex';
    }

    hideControl(control) {
        const btn = this.voiceInterface.querySelector(`.btn-${control}`);
        if (btn) btn.style.display = 'none';
    }

    resetRecording() {
        this.isRecording = false;
        this.isPaused = false;
        this.recordingTime = 0;
        this.transcription = "";
        
        clearInterval(this.timerInterval);
        this.stopWaveformAnimation();
        
        // Stop Web Speech API if running
        if (this.recognition) {
            this.recognition.stop();
        }
        
        // Reset UI
        if (this.voiceInterface) {
            this.voiceInterface.querySelector('.timer').textContent = '00:00';
            this.voiceInterface.querySelector('.transcription-text').textContent = 'Click record to start capturing your thoughts...';
            this.voiceInterface.querySelector('.transcription-text').style.color = '#e2e8f0';
            
            // Reset controls
            this.showControl('record');
            this.hideControl('pause');
            this.hideControl('stop');
            this.hideControl('save');
            
            // Reset stats
            this.voiceInterface.querySelectorAll('.stat-value').forEach((stat, index) => {
                if (index === 0) stat.textContent = '0:00';
                if (index === 1) stat.textContent = '0';
                if (index === 2) stat.textContent = 'HD';
            });
        }
    }

    // ===== VOICE NOTES MANAGEMENT =====
    renderVoiceNotes() {
        const container = document.querySelector('#voice-notes-container') || this.createVoiceNotesContainer();
        
        if (this.voiceNotes.length === 0) {
            container.innerHTML = `
                <div class="no-voice-notes">
                    <i class="fas fa-microphone-slash"></i>
                    No voice notes yet. Record your first one!
                </div>
            `;
            return;
        }

        container.innerHTML = this.voiceNotes.map(note => `
            <div class="voice-note-item" data-id="${note.id}">
                <div class="voice-note-header">
                    <div class="voice-note-info">
                        <h4>Voice Note</h4>
                        <div class="voice-note-meta">
                            <span>${note.date}</span>
                            <span>•</span>
                            <span>${Math.floor(note.duration / 60)}:${(note.duration % 60).toString().padStart(2, '0')}</span>
                            <span>•</span>
                            <span>${note.wordCount} words</span>
                        </div>
                    </div>
                    <div class="voice-note-actions">
                        <button class="btn-voice-action btn-play" data-id="${note.id}" title="Play recording">
                            <i class="fas fa-play"></i>
                        </button>
                        <button class="btn-voice-action btn-delete" data-id="${note.id}" title="Delete voice note">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <p class="voice-note-transcription">${note.transcription}</p>
            </div>
        `).join('');

        // Wire up action buttons
        container.querySelectorAll('.btn-play').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                this.playVoiceNote(id);
            });
        });

        container.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                this.deleteVoiceNote(id);
            });
        });
    }

    createVoiceNotesContainer() {
        const container = document.createElement('div');
        container.id = 'voice-notes-container';
        container.className = 'voice-notes-container';
        
        // Insert after journal entries container
        const entriesContainer = document.querySelector('#entries-container');
        if (entriesContainer) {
            entriesContainer.parentNode.insertBefore(container, entriesContainer.nextSibling);
        } else {
            // Fallback: insert at the end of left panel
            const leftPanel = document.querySelector('.panel-left');
            if (leftPanel) {
                leftPanel.appendChild(container);
            }
        }
        
        return container;
    }

    // ===== REAL TEXT-TO-SPEECH PLAYBACK =====
    playVoiceNote(id) {
        const note = this.voiceNotes.find(n => n.id === id);
        if (note && this.hasSpeechSynthesisSupport()) {
            // Stop any currently playing speech
            window.speechSynthesis.cancel();

            // Create new speech
            const utterance = new SpeechSynthesisUtterance(note.transcription);
            
            // Configure voice settings
            utterance.rate = 0.9; // Slightly slower for clarity
            utterance.pitch = 1;
            utterance.volume = 1;

            // Get available voices and try to use a nice one
            const voices = window.speechSynthesis.getVoices();
            const englishVoice = voices.find(voice => 
                voice.lang.includes('en') && voice.localService === false
            );
            if (englishVoice) {
                utterance.voice = englishVoice;
            }

            utterance.onstart = () => {
                this.showToast('🔊 Playing voice note...', 'info');
            };

            utterance.onend = () => {
                this.showToast('✅ Finished playing', 'success');
            };

            utterance.onerror = (event) => {
                this.showToast('Error playing audio: ' + event.error, 'error');
            };

            // Start real playback
            window.speechSynthesis.speak(utterance);
        } else if (!this.hasSpeechSynthesisSupport()) {
            this.showToast('Text-to-speech not supported in this browser', 'error');
        }
    }

    deleteVoiceNote(id) {
        if (confirm('Are you sure you want to delete this voice note? This action cannot be undone.')) {
            this.voiceNotes = this.voiceNotes.filter(n => n.id !== id);
            localStorage.setItem('lifeboard_voice_notes', JSON.stringify(this.voiceNotes));
            this.renderVoiceNotes();
            this.showToast('🗑️ Voice note deleted', 'info');
        }
    }

    showToast(message, type = 'info') {
        // Use existing toast system or fallback
        if (window.toast) {
            toast(message, { type, timeout: 3000 });
        } else {
            // Fallback toast implementation
            const toast = document.createElement('div');
            toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
                color: white;
                padding: 12px 20px;
                border-radius: 12px;
                font-weight: 600;
                z-index: 10000;
                animation: slideInRight 0.3s ease;
            `;
            toast.textContent = message;
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.style.animation = 'slideOutRight 0.3s ease forwards';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }
    }
}

// ===== INITIALIZE WHEN DOM IS READY =====
document.addEventListener('DOMContentLoaded', () => {
    new ProfessionalVoiceRecorder();
    console.log('🎤 Professional Voice Recording System Loaded!');
});