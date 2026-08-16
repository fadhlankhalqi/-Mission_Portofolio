// ============================================================
//   TaskFlow — script.js
// ============================================================

// ──────── STATE ────────
let tasks = JSON.parse(localStorage.getItem('tf_tasks') || '[]');
let selectedPriority = 'low';
let user = JSON.parse(localStorage.getItem('tf_user') || 'null');

// ──────── INIT ────────
document.addEventListener('DOMContentLoaded', () => {
  if (user) {
    document.getElementById('setupModal').style.display = 'none';
    renderProfile();
    renderAll();
  }

  // Ctrl + Enter shortcut
  document.getElementById('taskInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) addTask();
  });

  // Enter on modal inputs
  document.getElementById('inputRole').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') startApp();
  });

  // Set default priority button active
  setPriority('low');
});

// ──────── SETUP ────────
function startApp() {
  const name = document.getElementById('inputName').value.trim();
  const role = document.getElementById('inputRole').value.trim();
  if (!name || !role) {
    showToast('⚠️ Isi nama dan jabatan dulu!');
    return;
  }
  user = { name, role };
  localStorage.setItem('tf_user', JSON.stringify(user));
  document.getElementById('setupModal').style.display = 'none';
  renderProfile();
  renderAll();
}

// ──────── PROFILE & CLOCK ────────
function renderProfile() {
  const initials = user.name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  document.getElementById('profileCard').innerHTML = `
    <div class="profile-inner">
      <div class="profile-bar"></div>
      <div class="avatar">${initials}</div>
      <div class="profile-info">
        <div class="profile-name">${user.name}</div>
        <div class="profile-role">${user.role}</div>
        <button class="btn-reset-profile" onclick="resetProfile()">✎ Ubah Profil</button>
      </div>
      <div class="datetime">
        <div class="datetime-day"  id="clockDay"></div>
        <div class="datetime-date" id="clockDate"></div>
        <div class="datetime-time" id="clockTime"></div>
      </div>
    </div>`;

  tickClock();
  if (!window.tf_clock_started) {
    setInterval(tickClock, 1000);
    window.tf_clock_started = true;
  }
}

function resetProfile() {
  if (confirm('Ingin mengubah nama atau jabatan?')) {
    user = null;
    localStorage.removeItem('tf_user');
    location.reload();
  }
}

function tickClock() {
  const now    = new Date();
  const days   = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

  document.getElementById('clockDay').textContent  = days[now.getDay()];
  document.getElementById('clockDate').textContent =
    `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  document.getElementById('clockTime').textContent =
    `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

// ──────── PRIORITY ────────
function setPriority(p) {
  selectedPriority = p;
  document.querySelectorAll('.prio-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.p === p);
  });
}

// ──────── ADD TASK ────────
function addTask() {
  const text = document.getElementById('taskInput').value.trim();
  if (!text) {
    showToast('⚠️ Tugas tidak boleh kosong!');
    return;
  }

  tasks.unshift({
    id:       Date.now(),
    text:     text,
    priority: selectedPriority,
    date:     new Date().toISOString(),
    done:     false
  });

  save();
  document.getElementById('taskInput').value = '';
  renderAll();
  showToast('✅ Tugas berhasil ditambahkan!');
}

// ──────── TOGGLE DONE ────────
function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.done = !task.done;
    save();
    renderAll();
  }
}

// ──────── DELETE SINGLE ────────
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  save();
  renderAll();
  showToast('🗑 Tugas dihapus.');
}

// ──────── DELETE ALL (Everything) ────────
function deleteAll() {
  if (tasks.length === 0) {
    showToast('⚠️ Daftar tugas sudah kosong.');
    return;
  }
  
  if (confirm('Hapus seluruh daftar tugas (To Do & Done)?')) {
    tasks = [];
    save();
    renderAll();
    showToast('🗑 Seluruh tugas telah dihapus!');
  }
}

// ──────── RENDER ALL ────────
function renderAll() {
  const searchTerm = (document.getElementById('taskSearch')?.value || '').toLowerCase();
  
  const active = tasks.filter(t => !t.done);
  const done   = tasks.filter(t => t.done);

  const filteredActive = active.filter(t => 
    t.text.toLowerCase().includes(searchTerm) || 
    fmtDate(t.date).toLowerCase().includes(searchTerm)
  );

  document.getElementById('todoCount').textContent = active.length;
  document.getElementById('doneCount').textContent = done.length;

  renderTodo(filteredActive);
  renderDone(done);
}

// ──────── RENDER TO DO ────────
function renderTodo(items) {
  const el = document.getElementById('todoList');

  if (!items.length) {
    el.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">📭</span>
        Belum ada tugas. Yuk tambah!
      </div>`;
    return;
  }

  el.innerHTML = items.map(t => {
    const overdue = isOverdue(t.date);
    return `
      <div class="todo-item" id="item-${t.id}">
        <div class="checkbox-wrap">
          <input type="checkbox"
            class="custom-checkbox"
            ${t.done ? 'checked' : ''}
            onchange="toggleTask(${t.id})">
        </div>
        <div class="task-body">
          <div class="task-text">${escHtml(t.text)}</div>
          <div class="task-meta">
            <span class="task-date">📅 ${fmtDate(t.date)}</span>
            <span class="prio-tag ${t.priority}">${t.priority}</span>
            ${overdue ? '<span class="overdue-tag">⏰ Overdue</span>' : ''}
          </div>
        </div>
        <button class="btn-del" onclick="deleteTask(${t.id})">✕</button>
      </div>`;
  }).join('');
}

// ──────── RENDER DONE ────────
function renderDone(items) {
  const el = document.getElementById('doneList');

  if (!items.length) {
    el.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">🎯</span>
        Belum ada tugas selesai.
      </div>`;
    return;
  }

  el.innerHTML = items.map(t => `
    <div class="done-item-row">
      <span class="done-tick">✓</span>
      <span class="done-text">${escHtml(t.text)}</span>
      <span class="done-prio ${t.priority}">${t.priority}</span>
    </div>`).join('');
}

// ──────── HELPERS ────────
function save() {
  localStorage.setItem('tf_tasks', JSON.stringify(tasks));
}

function isOverdue(dateStr) {
  const diffHours = (new Date() - new Date(dateStr)) / 3600000;
  return diffHours > 24;
}

function fmtDate(dateStr) {
  const d    = new Date(dateStr);
  const days = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];
  return `${days[d.getDay()]}, ${d.getDate()}/${d.getMonth() + 1} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function pad(n) {
  return String(n).padStart(2, '0');
}

function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}
