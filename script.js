const field = document.getElementById('field');
const formationSelect = document.getElementById('formationSelect');
const addPlayerBtn = document.getElementById('addPlayerBtn');
const resetBtn = document.getElementById('resetBtn');

const players = [];

function savePlayers() {
  const data = players.map(p => ({
    first: p.first,
    last: p.last,
    pos: p.pos,
    x: parseFloat(p.el.style.left),
    y: parseFloat(p.el.style.top)
  }));
  localStorage.setItem('lineup', JSON.stringify(data));
}

function loadPlayers() {
  const data = JSON.parse(localStorage.getItem('lineup') || 'null');
  if (!data) return false;
  clearPlayers();
  data.forEach(d => createPlayer(d));
  return true;
}

function createPlayer({first = 'שם', last = 'משפחה', pos = 'עמדה', x = 50, y = 90}) {
  const el = document.createElement('div');
  el.className = 'player';
  el.style.left = `${x}%`;
  el.style.top = `${y}%`;
  el.innerHTML = `
    <span class="fname">${first}</span>
    <span class="lname">${last}</span>
    <span class="pos">${pos}</span>`;
  field.appendChild(el);
  const player = {first, last, pos, el};
  players.push(player);
  makeDraggable(player);

  el.ondblclick = () => {
    const newFirst = prompt('שם פרטי:', player.first);
    const newLast = prompt('שם משפחה:', player.last);
    const newPos = prompt('עמדה / תפקיד:', player.pos);
    if (newFirst !== null) player.first = newFirst;
    if (newLast !== null) player.last = newLast;
    if (newPos !== null) player.pos = newPos;
    el.querySelector('.fname').textContent = player.first;
    el.querySelector('.lname').textContent = player.last;
    el.querySelector('.pos').textContent = player.pos;
    savePlayers();
  };
}

function makeDraggable(player) {
  const el = player.el;
  let offsetX, offsetY, dragging = false;
  el.addEventListener('pointerdown', e => {
    dragging = true;
    el.setPointerCapture(e.pointerId);
    const rect = el.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
  });
  el.addEventListener('pointermove', e => {
    if (!dragging) return;
    const fieldRect = field.getBoundingClientRect();
    const newX = ((e.clientX - fieldRect.left - offsetX) / fieldRect.width) * 100;
    const newY = ((e.clientY - fieldRect.top - offsetY) / fieldRect.height) * 100;
    el.style.left = `${Math.min(Math.max(newX, 0), 100)}%`;
    el.style.top = `${Math.min(Math.max(newY, 0), 100)}%`;
  });
  el.addEventListener('pointerup', () => {
    dragging = false;
    savePlayers();
  });
}

const formations = {
  '4-4-2': [
    ['שוער', '', 'GK', 50, 97],
    ['מגן', 'שמאל', 'LB', 15, 78], ['בלם', '1', 'CB', 35, 78], ['בלם', '2', 'CB', 65, 78], ['מגן', 'ימין', 'RB', 85, 78],
    ['קשר', 'שמאל', 'LM', 15, 55], ['קשר', 'אמצע', 'CM', 37, 55], ['קשר', 'אמצע', 'CM', 63, 55], ['קשר', 'ימין', 'RM', 85, 55],
    ['חלוץ', '1', 'ST', 30, 30], ['חלוץ', '2', 'ST', 70, 30]
  ],
  '4-3-3': [
    ['שוער', '', 'GK', 50, 97],
    ['מגן', 'שמאל', 'LB', 15, 78], ['בלם', '1', 'CB', 35, 78], ['בלם', '2', 'CB', 65, 78], ['מגן', 'ימין', 'RB', 85, 78],
    ['קשר', 'שמאל', 'CM', 25, 57], ['קשר', 'אמצע', 'CM', 50, 57], ['קשר', 'ימין', 'CM', 75, 57],
    ['חלוץ', 'שמאל', 'LW', 15, 34], ['חלוץ', 'אמצע', 'CF', 50, 28], ['חלוץ', 'ימין', 'RW', 85, 34]
  ],
  '3-5-2': [
    ['שוער', '', 'GK', 50, 97],
    ['בלם', 'שמאל', 'CB', 25, 78], ['בלם', 'אמצע', 'CB', 50, 78], ['בלם', 'ימין', 'CB', 75, 78],
    ['כנף', 'שמאל', 'LM', 15, 57], ['קשר', '1', 'CM', 35, 52], ['קשר', '2', 'CM', 50, 45], ['קשר', '3', 'CM', 65, 52], ['כנף', 'ימין', 'RM', 85, 57],
    ['חלוץ', '1', 'ST', 35, 28], ['חלוץ', '2', 'ST', 65, 28]
  ],
  '5-3-2': [
    ['שוער', '', 'GK', 50, 97],
    ['כנף', 'שמאל', 'LWB', 10, 78], ['בלם', '1', 'CB', 30, 78], ['בלם', '2', 'CB', 50, 78], ['בלם', '3', 'CB', 70, 78], ['כנף', 'ימין', 'RWB', 90, 78],
    ['קשר', 'שמאל', 'CM', 25, 55], ['קשר', 'אמצע', 'CM', 50, 55], ['קשר', 'ימין', 'CM', 75, 55],
    ['חלוץ', '1', 'ST', 35, 28], ['חלוץ', '2', 'ST', 65, 28]
  ]
};

function applyFormation(name) {
  clearPlayers();
  formations[name].forEach(arr => createPlayer({
    first: arr[0],
    last: arr[1],
    pos: arr[2],
    x: arr[3],
    y: arr[4]
  }));
  savePlayers();
}

function clearPlayers() {
  players.forEach(p => p.el.remove());
  players.length = 0;
}

formationSelect.onchange = () => applyFormation(formationSelect.value);
addPlayerBtn.onclick = () => { createPlayer({first: 'שם', last: 'משפחה', pos: 'עמדה', x: 50, y: 50}); savePlayers(); };
resetBtn.onclick = () => { localStorage.removeItem('lineup'); applyFormation(formationSelect.value); };

document.addEventListener('DOMContentLoaded', () => {
  if (!loadPlayers()) {
    applyFormation(formationSelect.value);
  }
});
