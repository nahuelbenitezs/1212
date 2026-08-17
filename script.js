const scene = document.getElementById('scene');
const fx = document.getElementById('fx');
const progressFill = document.getElementById('progressFill');
const progressDots = document.getElementById('progressDots');
const soundToggle = document.getElementById('soundToggle');
const floatingHearts = document.getElementById('floatingHearts');
const rainHost = document.getElementById('stickerRain');

const state = { step: 0, sound: false, tarot: new Set(), pins: new Set(), pets: 0, stars: 0, audio: null };
const TOTAL_STEPS = 9;

function initFloatingHearts() {
  const hearts = ['💕','💗','💖','✨','🌸','💫'];
  for (let i = 0; i < 15; i++) {
    const h = document.createElement('div');
    h.className = 'floating-heart';
    h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    h.style.left = Math.random() * 100 + '%';
    h.style.animationDelay = Math.random() * 8 + 's';
    h.style.animationDuration = (6 + Math.random() * 4) + 's';
    floatingHearts.appendChild(h);
  }
}
function initProgressDots() {
  progressDots.innerHTML = '';
  for (let i = 0; i < TOTAL_STEPS; i++) {
    const d = document.createElement('div');
    d.className = 'progress-dot';
    progressDots.appendChild(d);
  }
}
function updateProgress(step) {
  state.step = step;
  progressFill.style.width = (step / (TOTAL_STEPS - 1)) * 100 + '%';
  progressDots.querySelectorAll('.progress-dot').forEach((d, i) => d.classList.toggle('active', i <= step));
}
function particles(emojis = ['💕','✨','🌸'], count = 12) {
  fx.innerHTML = '';
  const arr = Array.isArray(emojis) ? emojis : [emojis];
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.textContent = arr[Math.floor(Math.random() * arr.length)];
    p.style.left = '50%'; p.style.top = '50%';
    p.style.setProperty('--x', ((Math.random() - .5) * 300) + 'px');
    p.style.setProperty('--y', ((Math.random() - .5) * 300) + 'px');
    p.style.setProperty('--r', (Math.random() * 360) + 'deg');
    p.style.animationDelay = (Math.random() * .2) + 's';
    fx.appendChild(p);
  }
  setTimeout(() => fx.innerHTML = '', 1500);
}
function stickerRain(emoji = '💕', count = 20) {
  for (let i = 0; i < count; i++) {
    const s = document.createElement('div');
    s.className = 'sticker';
    s.textContent = emoji;
    s.style.left = Math.random() * 100 + '%';
    s.style.animationDelay = Math.random() * .5 + 's';
    rainHost.appendChild(s);
    setTimeout(() => s.remove(), 2500);
  }
}
function toast(msg, icon = '✨') {
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = '<span>' + icon + '</span><span>' + msg + '</span>';
  document.getElementById('toastHost').appendChild(el);
  setTimeout(() => el.remove(), 2500);
}
function ping(freq = 600) {
  if (!state.sound) return;
  try {
    if (!state.audio) initAudio();
    const ctx = state.audio.ctx;
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = 'sine'; o.frequency.value = freq;
    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(.1, ctx.currentTime + .02);
    g.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .3);
    o.connect(g).connect(state.audio.master);
    o.start(); o.stop(ctx.currentTime + .3);
  } catch (e) {}
}
function initAudio() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  const ctx = new AC();
  const master = ctx.createGain(); master.gain.value = .05; master.connect(ctx.destination);
  state.audio = { ctx, master };
}
soundToggle.addEventListener('click', () => {
  state.sound = !state.sound;
  soundToggle.textContent = state.sound ? '🔊' : '🔇';
  if (state.sound) { initAudio(); if (state.audio.ctx.state === 'suspended') state.audio.ctx.resume(); toast('Sonido activado', '🎵'); ping(800); }
  else toast('Sonido desactivado', '🔇');
});
function createButton(text, onClick, className = 'btn-primary') {
  const b = document.createElement('button');
  b.className = 'btn ' + className;
  b.type = 'button';
  b.textContent = text;
  b.addEventListener('click', e => { e.preventDefault(); ping(700); onClick(); });
  return b;
}

function renderIntro() {
  updateProgress(0);
  scene.innerHTML = '<div class="screen"><div class="hero-heart">💕</div><h1 class="title title-large">12:12</h1><p class="subtitle">Flor × Nahuel — round 2</p><p class="subtitle">pediste un deseo a las 11:11… y se cumplió 🥺</p><div class="photo-frame"><img src="assets/portada.jpg" alt="Nosotros y Almita"><div class="photo-sticker">🐶</div></div><div class="text-center"><button class="btn btn-primary" id="startBtn">Entrar al deseo ✨</button></div></div>';
  document.getElementById('startBtn').addEventListener('click', () => { ping(800); particles(['💕','✨','🌸'], 15); setTimeout(renderTarot, 300); });
}

const tarotCards = [
  { id:'sirena', img:'assets/tarot-sirena.jpg', name:'La Sirena', txt:'“Si pudiera elegir un animal místico, sería una sirena”, me dijiste. Ya lo sos: me atrapaste.' },
  { id:'hogar', img:'assets/tarot-hogar.jpg', name:'El Hogar', txt:'“Contigo me siento en casa.” No quiero visitar tu corazón, Flor: quiero vivir ahí.' },
  { id:'estrella', img:'assets/tarot-estrella.jpg', name:'La Estrella', txt:'Vos sos mi deseo cumplido. El de las 11:11, el de siempre.' },
  { id:'sol', emoji:'☀️', name:'El Sol', txt:'“Voy a ser tu vitamina D.” Vos hacés fotosíntesis, yo la hago contigo.' },
  { id:'luna', emoji:'🌙', name:'La Luna', txt:'Cuido tu sueño: ASMR, mantita, y nadie que te despierte.' }
];
function renderTarot() {
  updateProgress(1);
  scene.innerHTML = '<div class="screen"><h2 class="title">Las cartas</h2><p class="subtitle">Vos las leés, pero hoy te las leo yo. Tocálas todas: ninguna se queda sin dar vuelta.</p><div class="tarot-grid">' + tarotCards.map(t => '<button class="tcard' + (state.tarot.has(t.id) ? ' flip' : '') + '" data-t="' + t.id + '"><span class="back">✦</span><span class="face">' + (t.img ? '<img src="' + t.img + '" alt="' + t.name + '">' : '<span class="emoji">' + t.emoji + '</span>') + '</span></button>').join('') + '</div><div class="tarot-result" id="tarotResult"></div><div class="text-center" id="nextBtn"></div></div>';
  document.querySelectorAll('.tcard').forEach(c => c.addEventListener('click', () => {
    if (c.classList.contains('flip')) return;
    c.classList.add('flip');
    const t = tarotCards.find(x => x.id === c.dataset.t);
    state.tarot.add(t.id);
    ping(650); particles(['🔮','✨'], 8);
    document.getElementById('tarotResult').insertAdjacentHTML('beforeend', '<div class="tarot-line"><b>' + t.name + ':</b> ' + t.txt + '</div>');
    if (state.tarot.size === tarotCards.length) document.getElementById('nextBtn').appendChild(createButton('Seguir →', renderRewind));
  }));
  if (state.tarot.size === tarotCards.length) document.getElementById('nextBtn').appendChild(createButton('Seguir →', renderRewind));
}

const rewindSteps = [
  { who:'me', text:'Re random, pero me dio curiosidad la última foto. Qué libro estabas leyendo ahí? 👀' },
  { who:'her', text:'Jajajaa muy random si' },
  { who:'her', text:'Este dolor no es mío, de Mark Wolynn 😯' },
  { who:'me', text:'No lo tenía. Qué fue lo que te hizo elegir ese?' },
  { choice: [
    { label:'Me lo recomendó una clienta y me lo prestó 🥰', reply:'Ahh mirá, entonces te lo vendió bien tu clienta jajaja. Ahora me dio curiosidad a mí también.' },
    { label:'Me pareció bastante interesante el contenido ✨', reply:'No lo leí, pero vi un par de capítulos de la serie de costado… parecía dejar un buen mensaje.' }
  ]},
  { who:'her', text:'Pero es prestado el libro, no es mío. Yo tengo otros 😌' },
  { who:'me', text:'Y así fue: una pregunta random, un libro prestado… y yo que ya no pude dejar de escribirte. 💌' }
];
function addBubble(who, text) {
  const chat = document.getElementById('chatBox');
  if (!chat) return;
  const m = document.createElement('div');
  m.className = 'msg ' + who;
  m.innerHTML = '<span class="who">' + (who === 'her' ? 'Flor' : 'Nahuel') + '</span>' + text;
  chat.appendChild(m);
  chat.scrollTop = chat.scrollHeight;
}
function playChat(i) {
  const chat = document.getElementById('chatBox');
  if (!chat) return;
  if (i >= rewindSteps.length) {
    chat.insertAdjacentHTML('beforeend', '<div class="msg me">Pensar que todo este camino empezó por pura curiosidad por un libro 📖</div>');
    document.getElementById('nextBtn').appendChild(createButton('Hornear recuerdos →', renderReceta));
    return;
  }
  const s = rewindSteps[i];
  const ty = document.createElement('div');
  ty.className = 'msg her typing'; ty.textContent = '···';
  chat.appendChild(ty); chat.scrollTop = chat.scrollHeight;
  setTimeout(() => {
    ty.remove();
    if (s.choice) {
      const btns = [];
      s.choice.forEach(op => {
        const b = document.createElement('button');
        b.className = 'msg-choice'; b.textContent = op.label;
        b.addEventListener('click', () => {
          btns.forEach(x => x.remove());
          addBubble('her', op.label); addBubble('me', op.reply);
          ping(700);
          setTimeout(() => playChat(i + 1), 500);
        });
        btns.push(b); chat.appendChild(b);
      });
      chat.scrollTop = chat.scrollHeight;
      return;
    }
    addBubble(s.who, s.text);
    ping(600);
    setTimeout(() => playChat(i + 1), 650);
  }, 700);
}
function renderRewind() {
  updateProgress(2);
  scene.innerHTML = '<div class="screen"><h2 class="title">Un libro 📖</h2><p class="subtitle">16 de julio, 2:54 PM. Así empezó todo: tocá el chat para revivirlo.</p><div class="chat-box" id="chatBox"></div><div class="text-center" id="nextBtn"></div></div>';
  playChat(0);
}

const ings = [
  { id:'harina', e:'🌾', n:'harina', m:'La base, como nosotros: algo sólido que se sostiene solo.' },
  { id:'canela', e:'🤎', n:'canela', m:'El toque que lo hace único. Como vos.' },
  { id:'azucar', e:'🍬', n:'azúcar', m:'Dulce, pero en su medida. Como tus gomitas.' },
  { id:'manteca', e:'🧈', n:'manteca', m:'Para que todo se una. Como cuando te abrazo.' },
  { id:'amor', e:'💗', n:'ingrediente secreto', m:'“Le puse mi ingrediente especial hecho con el corazón.”' }
];
function renderReceta() {
  updateProgress(3);
  scene.innerHTML = '<div class="screen"><h2 class="title">Rolls de canela 🥐</h2><p class="subtitle">Agregá los ingredientes en cualquier orden. El último ya sabés cuál es.</p><div class="bowl"><div class="mix" id="mix"></div><p class="handwritten" id="mixMsg">bowl vacío… metele 🥄</p></div><div class="ing-row">' + ings.map(x => '<button class="ing" data-i="' + x.id + '">' + x.e + ' ' + x.n + '</button>').join('') + '</div><div class="text-center" id="nextBtn"></div></div>';
  document.querySelectorAll('.ing').forEach(b => b.addEventListener('click', () => {
    if (b.classList.contains('done')) return;
    const x = ings.find(y => y.id === b.dataset.i);
    b.classList.add('done');
    document.getElementById('mix').textContent += x.e + ' ';
    document.getElementById('mixMsg').textContent = x.m;
    toast(x.m, x.e); ping(600 + Math.random() * 200); particles([x.e, '✨'], 8);
    if (document.querySelectorAll('.ing.done').length === ings.length) {
      document.getElementById('nextBtn').innerHTML = '<div class="photo-frame" style="max-width:260px"><img src="assets/rolls.jpg" alt="rolls"></div><p class="handwritten mt-16">“algún día los hacemos juntitos” 🥹</p>';
      document.getElementById('nextBtn').appendChild(createButton('Viajar por Montevideo →', renderMapa));
    }
  }));
}

const pins = [
  { id:'parada', e:'🚌', x:12, y:74, m:'Esperé 30 minutos y me pareció nada. Por vos, espero lo que haga falta.' },
  { id:'telizzia', e:'🐱', x:30, y:50, m:'Gatitos, merienda y vos riéndote. Plan perfecto.' },
  { id:'bbc', e:'🍣', x:47, y:68, m:'Mi primer sushi de verdad fue con vos. Si no me gustaba, vos te comías mi parte.' },
  { id:'mirador', e:'🌅', x:63, y:42, m:'El atardecer, y ese “te amo” que se te escapó mirando el horizonte. Inolvidable.' },
  { id:'academia', e:'💃', x:78, y:60, m:'Tu primera clase de baile. Yo ya te imaginaba bailando y sonriendo.' },
  { id:'casa', e:'🏠', x:88, y:28, m:'Magariños Cervantes 1338. La casa del futuro, con Almita en la puerta.' }
];
function renderMapa() {
  updateProgress(4);
  scene.innerHTML = '<div class="screen"><h2 class="title">Montevideo 💗</h2><p class="subtitle">Seis lugares que ya son nuestros. Tocá los corazones del mapa.</p><div class="map"><img src="assets/mapa.jpg" alt="mapa">' + pins.map(p => '<button class="pin" data-p="' + p.id + '" style="left:' + p.x + '%;top:' + p.y + '%">' + p.e + '</button>').join('') + '</div><p class="handwritten text-center mt-16" id="mapCount">lugares: 0/6</p><div class="text-center" id="nextBtn"></div></div>';
  document.querySelectorAll('.pin').forEach(b => b.addEventListener('click', () => {
    if (b.classList.contains('found')) return;
    const p = pins.find(y => y.id === b.dataset.p);
    state.pins.add(p.id); b.classList.add('found');
    ping(650); particles(['💗','✨'], 8); toast(p.m, p.e);
    document.getElementById('mapCount').textContent = 'lugares: ' + state.pins.size + '/6';
    if (state.pins.size === pins.length) document.getElementById('nextBtn').appendChild(createButton('Pasar el filtro →', renderAbue));
  }));
}

const quiz = [
  { q:'La abue: “Decime, nena… ¿este chico te cuida?”', o:[
    { t:'Me cuida hasta cuando no se lo pido', ok:true },
    { t:'A veces se olvida', fix:'¡Esa no, abue! Me cuida siempre: el tecito, el abrigo, el “avisame cuando llegues”. 🥹' },
    { t:'Me reta todo el día', fix:'¡No, abue! Retarme con amor no es retarme. 🤭' } ]},
  { q:'La abue: “¿Y sabe hacer algo rico, o pide delivery?”', o:[
    { t:'Delivery siempre', fix:'¡Esa no! Hace rolls de canela con un “ingrediente secreto” que no me olvido más. 🥐' },
    { t:'Rolls de canela hechos con amor', ok:true },
    { t:'Un mate lavado', fix:'¡No, abue! Hasta el mate me lo cebó… en el corazón. 😌' } ]},
  { q:'La abue: “¿Y te va a hacer feliz, nena?”', o:[
    { t:'Lo vamos a ver con el tiempo', fix:'¡Esa no! Ya me hace feliz. Todos los días, sin falta. 💕' },
    { t:'No sé', fix:'¡No! Me hace reír hasta cuando estoy cansada. Eso ya es felicidad. 🥰' },
    { t:'Ya me hace feliz', ok:true } ]}
];
let qi = 0;
function showQ() {
  const box = document.getElementById('quizBox');
  if (!box) return;
  if (qi >= quiz.length) {
    box.innerHTML = '<div class="text-center"><div class="stamp">VISTO BUENO DE LA ABUE ✔</div><p class="subtitle mt-16">El día que me conozca, le llevo el block de maní más grande que exista y le prometo cuidarte toda la vida. — Nahuel 🥰</p></div>';
    document.getElementById('nextBtn').appendChild(createButton('Mimar a Almita →', renderAlmita));
    return;
  }
  const q = quiz[qi];
  box.innerHTML = '<p class="handwritten text-center mb-16">' + q.q + '</p>' + q.o.map((op, i) => '<button class="qopt" data-q="' + i + '">' + op.t + '</button>').join('');
  box.querySelectorAll('.qopt').forEach(b => b.addEventListener('click', () => {
    const op = q.o[+b.dataset.q]; // 👈 CORREGIDO (agregado el .o)
    
    if (!op.ok) { 
        toast(op.fix, '💬'); 
        ping(400); 
        return; 
    }
    
    ping(700); 
    particles(['👵','💗','✨'], 8);
    qi++; 
    showQ();
}));
}
function renderAbue() {
  updateProgress(5); qi = 0;
  scene.innerHTML = '<div class="screen"><h2 class="title">El filtro de la abue 👵</h2><p class="subtitle">Imaginate que tu abue me pone a prueba. La que responde sos vos, porque vos ya sabés cómo soy.</p><div class="quiz" id="quizBox"></div><div class="text-center" id="nextBtn"></div></div>';
  showQ();
}

const dogMsgs = ['wag wag 🐾','¡baile del pimpollo!','guau guau','cola infinita','mimos nivel máximo','Almita feliz'];
function renderAlmita() {
  updateProgress(6); state.pets = 0;
  scene.innerHTML = '<div class="screen"><h2 class="title">Almita 🐶</h2><p class="subtitle">Sí, es una perra. Tocá para mimarla hasta 10 y ganarte el baile del pimpollo.</p><div class="dog-stage" id="dog"><img src="assets/almita.jpg" alt="Almita"></div><div class="meter"><i id="petBar"></i></div><p class="handwritten text-center mt-16" id="petTxt">mimos: 0/10</p><div class="text-center" id="nextBtn"></div></div>';
  document.getElementById('dog').addEventListener('click', () => {
    if (state.pets >= 10) return;
    state.pets++;
    document.getElementById('petBar').style.width = (state.pets * 10) + '%';
    document.getElementById('petTxt').textContent = 'mimos: ' + state.pets + '/10';
    toast(dogMsgs[state.pets % dogMsgs.length], '🐶');
    ping(600 + state.pets * 30); particles(['🐾','💗'], 6);
    if (state.pets >= 10) {
      document.getElementById('dog').classList.add('dance');
      document.getElementById('nextBtn').innerHTML = '<div class="photo-frame" style="max-width:260px"><img src="assets/almita-real.jpg" alt="Almita real"></div><p class="handwritten mt-16">…y así de hermosa es en la vida real 🥹💕</p>';
      document.getElementById('nextBtn').appendChild(createButton('Dibujar el futuro →', renderConst));
    }
  });
}

const stars = [
  { x:30, y:160, t:'Spider-Man sin spoilers' },
  { x:90, y:80, t:'Café Haus en 10 pasos' },
  { x:150, y:140, t:'Cena mexicana juntos' },
  { x:210, y:60, t:'Masterclass en noviembre' },
  { x:270, y:120, t:'Conocer a la abue' },
  { x:330, y:50, t:'Mil rolls más' }
];
function renderConst() {
  updateProgress(7); state.stars = 0;
  scene.innerHTML = '<div class="screen"><h2 class="title">La constelación ✨</h2><p class="subtitle">Uní las estrellas en orden (1 a 6). Cada una es un plan contigo.</p><div class="const"><svg viewBox="0 0 360 200">' + stars.map((s, i) => { const n = stars[i + 1] || s; return '<line class="cline" id="cl' + i + '" x1="' + s.x + '" y1="' + s.y + '" x2="' + n.x + '" y2="' + n.y + '"/>'; }).join('') + stars.map((s, i) => '<g class="cstar" data-s="' + i + '"><circle cx="' + s.x + '" cy="' + s.y + '" r="12"/><text x="' + (s.x - 4) + '" y="' + (s.y + 4) + '">' + (i + 1) + '</text></g>').join('') + '</svg></div><div class="text-center" id="nextBtn"></div></div>';
  document.querySelectorAll('.cstar').forEach(g => g.addEventListener('click', () => {
    const i = +g.dataset.s;
    if (i !== state.stars) { toast('Seguí el orden ✨', '⭐'); return; }
    g.classList.add('lit');
    if (i > 0) document.getElementById('cl' + (i - 1)).classList.add('on');
    state.stars++;
    ping(650); particles(['⭐','✨'], 6); toast(stars[i].t, '⭐');
    if (state.stars === stars.length) {
      const l5 = document.getElementById('cl5'); if (l5) l5.classList.add('on');
      scene.innerHTML = '<div class="screen"><h2 class="title">Se dibujó sola 🌌</h2><p class="subtitle">Como nosotros: sin planearlo, quedó hermosa.</p><div class="text-center" id="nextBtn"></div></div>';
      document.getElementById('nextBtn').appendChild(createButton('Abrir el sobre →', renderFinal));
    }
  }));
}

function renderFinal() {
  updateProgress(8);
  scene.innerHTML = '<div class="screen"><h2 class="title">Un sobre 💌</h2><p class="subtitle">Tocá el corazon.</p><div class="envelope" id="env"><div class="wax">♡</div><p class="handwritten mt-16">para Flor, de parte de Nahuel (y Almita)</p></div><div id="envOut"></div></div>';
  document.getElementById('env').addEventListener('click', () => {
    ping(800); particles(['💌','💗','✨'], 20); stickerRain('💕', 20);
    document.getElementById('envOut').innerHTML = '<div class="photo-frame" style="max-width:280px"><img src="assets/nosotros.jpg" alt="nosotros"><div class="photo-sticker">💗</div></div><div class="tarot-result"><div class="tarot-line">No sé cuántos deseos vaya a pedir de ahora en más. voy a pedir seguir caminando contigo. — Nahuel</div><div class="tarot-line">Y yo también te elijo, en todas las versiones. 🤭</div></div><div class="coupons">' + ['🫂 Un abrazote gigante (sin vencimiento)','😘 Metralleta de besitos','🍣 Salida de sushi (vos elegís el lugar)','🎬 Noche de peli sin spoilers','🥐 Rolls caseros “hechos con amor”'].map((c, i) => '<div class="coupon" id="cp' + i + '">' + c + '<br><button data-c="' + i + '">CANJEAR EN LA VIDA REAL</button></div>').join('') + '</div><div class="text-center mt-24" id="nextBtn"></div>';
    document.querySelectorAll('[data-c]').forEach(b => b.addEventListener('click', () => {
      const cp = document.getElementById('cp' + b.dataset.c);
      cp.classList.add('used');
      cp.querySelector('button').textContent = 'CANJEADO ✔ (te lo debo)';
      toast('Cupón canjeado. Se cobra en persona. 😌', '🎟️');
      ping(700); particles(['🎟️',''], 8);
    }));
    document.getElementById('nextBtn').appendChild(createButton('Volver a jugar ↺', () => { state.tarot.clear(); state.pins.clear(); state.pets = 0; state.stars = 0; renderIntro(); }, 'btn-secondary'));
  });
}

initFloatingHearts();
initProgressDots();
renderIntro();