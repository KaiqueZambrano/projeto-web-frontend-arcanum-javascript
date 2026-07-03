/* ============================================================
   Arcanum — Fichas de RPG
   app.js  · lógica completa de CRUD frontend com localStorage
   ============================================================ */

'use strict';

/* ──────────────────────────────────────────────────────────
   1. BANCO DE DADOS EM MEMÓRIA (localStorage)
   ────────────────────────────────────────────────────────── */
var DB_KEY = 'arcanum_db';

var SEED = {
  nextId: { usuarios: 3, personagens: 6, habilidades: 5, itens: 6, historico: 4, modificadores: 3 },
  usuarios: [
    { id: 1, nome: 'Kaique Zambrano', email: 'kaique@email.com', senha: '********', criado_em: '01/01/2025' },
    { id: 2, nome: 'Maria Oliveira',  email: 'maria@email.com',  senha: '********', criado_em: '14/02/2025' }
  ],
  personagens: [
    { id: 1, nome: 'Aelindra Starweave',   raca: 'Elfo',      classe: 'Mago',      nivel: 12, alinhamento: 'Neutro Bom',    hp_atual: 72,  hp_max: 100, ep_atual: 36, ep_max: 60,  sexo: 'Feminino',  usuario_id: 1, descricao: 'Elfa maga de alta patente, discípula do Arquimago Elarian. Especialista em magias de evocação e transmutação.', criado_em: '10/05/2025' },
    { id: 2, nome: 'Thorgrim Stonebeard',  raca: 'Anão',      classe: 'Guerreiro', nivel: 8,  alinhamento: 'Leal Neutro',  hp_atual: 115, hp_max: 128, ep_atual: 0,  ep_max: 0,   sexo: 'Masculino', usuario_id: 1, descricao: 'Guerreiro anão de montanha, herdeiro do clã Stonebeard.', criado_em: '22/06/2025' },
    { id: 3, nome: 'Sylara Nightwhisper',  raca: 'Meio-Elfo', classe: 'Ladino',    nivel: 6,  alinhamento: 'Caótico Neutro',hp_atual: 27,  hp_max: 60,  ep_atual: 0,  ep_max: 0,   sexo: 'Feminino',  usuario_id: 1, descricao: 'Ladina meio-elfa especialista em furtividade e roubo.', criado_em: '01/07/2025' },
    { id: 4, nome: 'Baldric Swiftfoot',    raca: 'Halfling',  classe: 'Bardo',     nivel: 5,  alinhamento: 'Caótico Bom',  hp_atual: 38,  hp_max: 42,  ep_atual: 20, ep_max: 30,  sexo: 'Masculino', usuario_id: 2, descricao: 'Bardo halfling viajante, conhecido por suas histórias fantásticas.', criado_em: '14/02/2025' },
    { id: 5, nome: 'Seraphiel',            raca: 'Humano',    classe: 'Paladino',  nivel: 10, alinhamento: 'Leal Bom',     hp_atual: 90,  hp_max: 110, ep_atual: 0,  ep_max: 0,   sexo: 'Masculino', usuario_id: 2, descricao: 'Paladino humano consagrado ao deus da luz, Solarius.', criado_em: '14/02/2025' }
  ],
  habilidades: [
    { id: 1, nome: 'Bola de Fogo',      tipo: 'Magia',      rank: 3, personagem_id: 1, requisitos: 'INT 15', efeitos: 'Lança uma esfera de fogo que explode em área de 6m. 8d6 de dano de fogo. Salvaguarda de DES CD 17 para metade do dano.' },
    { id: 2, nome: 'Estilo de Combate', tipo: 'Habilidade', rank: 2, personagem_id: 2, requisitos: '',       efeitos: 'Habilidade passiva que concede +2 de bônus em rolagens de ataque com a arma escolhida.' },
    { id: 3, nome: 'Furtividade',       tipo: 'Perícia',    rank: 4, personagem_id: 3, requisitos: 'DES 14', efeitos: 'Permite mover-se sem ser detectado. Bônus de +5 em testes de Furtividade.' },
    { id: 4, nome: 'Cone de Gelo',      tipo: 'Magia',      rank: 2, personagem_id: 1, requisitos: 'INT 17', efeitos: 'Projeta um cone de frio de 9m. 8d8 de dano de frio. Salvaguarda de CON CD 17 para metade do dano.' }
  ],
  itens: [
    { id: 1, nome: 'Machado de Guerra Rúnico', tipo: 'Arma',       quantidade: 1, personagem_id: 2, descricao: 'Machado encantado com runas anãs. +2d6 de dano para criaturas de fogo.',         efeito: '+2d6 de dano de fogo contra elementais. Brilha fracamente em presença de criaturas do plano elemental.' },
    { id: 2, nome: 'Armadura de Placas +1',    tipo: 'Armadura',   quantidade: 1, personagem_id: 2, descricao: 'CA 18 (+1 encantado). Resistência a dano cortante.',                            efeito: 'CA 18. Resistência a dano cortante. Reduz dano físico em 1.' },
    { id: 3, nome: 'Poção de Cura Superior',   tipo: 'Poção',      quantidade: 3, personagem_id: 3, descricao: 'Restaura 4d4+4 pontos de vida ao consumir.',                                    efeito: 'Restaura 4d4+4 HP quando consumida (ação bônus).' },
    { id: 4, nome: 'Tiara do Intelecto',       tipo: 'Item Mágico', quantidade: 1, personagem_id: 1, descricao: 'Define Inteligência para 19. Bônus de +2 em testes de Arcanismo.',             efeito: 'Define INT para 19. +2 em testes de Arcanismo.' },
    { id: 5, nome: 'Adaga Sombria',            tipo: 'Arma',       quantidade: 2, personagem_id: 3, descricao: '+2d6 de dano furtivo. Invisível em luz fraca.',                                efeito: '+2d6 de dano furtivo. Em luz fraca, torna-se quase invisível ao olho nu.' }
  ],
  historico: [
    { id: 1, personagem_id: 1, titulo: 'Criação do Personagem',                          data: '10 Mai 2025', xp_ganho: 0,    nivel_novo: 1,  nota: 'Aelindra Starweave criada. Background: Sábia. Nível inicial 1. Primeiros passos em Neverwinter.' },
    { id: 2, personagem_id: 1, titulo: 'Ruínas de Thornhall',                            data: '02 Jun 2025', xp_ganho: 3200, nivel_novo: null, nota: 'Exploração das ruínas amaldiçoadas. Encontrou a Tiara do Intelecto. +3.200 XP distribuídos entre o grupo.' },
    { id: 3, personagem_id: 1, titulo: 'Conquista Nível 12 — Segredo do Arquimago',      data: '15 Jul 2025', xp_ganho: 5000, nivel_novo: 12, nota: 'Após derrotar o lich Malachar e recuperar o Grimório Eterno, Aelindra atingiu o décimo-segundo nível. +5.000 XP. Aprendeu a magia Dedo da Morte.' }
  ],
  modificadores: [
    { id: 1, personagem_id: 1, atributo: 'Inteligência', valor: 2,  origem: 'item',       nome_origem: 'Tiara do Intelecto' },
    { id: 2, personagem_id: 1, atributo: 'Destreza',     valor: 1,  origem: 'habilidade', nome_origem: 'Reflexos Aprimorados' }
  ],
  atributos: {
    1: { forca: 10, destreza: 16, constituicao: 13, inteligencia: 20, sabedoria: 14, carisma: 11 },
    2: { forca: 18, destreza: 12, constituicao: 16, inteligencia: 9,  sabedoria: 11, carisma: 8  },
    3: { forca: 10, destreza: 18, constituicao: 12, inteligencia: 13, sabedoria: 14, carisma: 15 },
    4: { forca: 9,  destreza: 15, constituicao: 11, inteligencia: 14, sabedoria: 12, carisma: 18 },
    5: { forca: 16, destreza: 12, constituicao: 14, inteligencia: 11, sabedoria: 15, carisma: 16 }
  }
};

function dbLoad() {
  try {
    var raw = localStorage.getItem(DB_KEY);
    return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(SEED));
  } catch (e) {
    return JSON.parse(JSON.stringify(SEED));
  }
}

function dbSave(db) {
  try { localStorage.setItem(DB_KEY, JSON.stringify(db)); } catch (e) {}
}

function nextId(db, col) {
  db.nextId[col] = (db.nextId[col] || 0) + 1;
  return db.nextId[col];
}

var db = dbLoad();


/* ──────────────────────────────────────────────────────────
   2. UTILITÁRIOS
   ────────────────────────────────────────────────────────── */
function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
function qsa(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

function escHtml(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function hoje() {
  var d = new Date();
  var meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  return d.getDate() + ' ' + meses[d.getMonth()] + ' ' + d.getFullYear();
}

function hojeSlash() {
  var d = new Date();
  var dd = String(d.getDate()).padStart(2,'0');
  var mm = String(d.getMonth()+1).padStart(2,'0');
  return dd + '/' + mm + '/' + d.getFullYear();
}

function mod(valor) {
  var m = Math.floor((valor - 10) / 2);
  return (m >= 0 ? '+' : '') + m;
}

function xpParaNivel(nivel) {
  var tabela = [0,300,900,2700,6500,14000,23000,34000,48000,64000,85000,100000,120000,140000,165000,195000,225000,265000,305000,355000];
  return tabela[Math.min(nivel, tabela.length - 1)] || 0;
}

function calcXpTotal(charId) {
  return db.historico.filter(function(h){ return h.personagem_id === charId; })
    .reduce(function(acc, h){ return acc + (h.xp_ganho || 0); }, 0);
}

function nomeUsuario(uid) {
  var u = db.usuarios.find(function(u){ return u.id === uid; });
  return u ? u.nome.split(' ')[0] : '—';
}

function nomePersonagem(pid) {
  var p = db.personagens.find(function(p){ return p.id === pid; });
  return p ? p.nome : '—';
}

function classIcon(classe) {
  var m = {Bárbaro:'⚔',Bardo:'🎵',Clérigo:'✝',Druida:'🌿',Guerreiro:'🛡',Ladino:'🗡',Mago:'🔮',Monge:'☯',Paladino:'⚜',Patrulheiro:'🏹',Bruxo:'👁',Feiticeiro:'✨'};
  return m[classe] || '⚔';
}

function tipoItemIcon(tipo) {
  var m = {'Arma':'⚔','Armadura':'🛡','Poção':'⚗','Item Mágico':'✦'};
  return m[tipo] || '📦';
}

function tipoItemClass(tipo) {
  var m = {'Arma':'type-weapon','Armadura':'type-armor','Poção':'type-potion','Item Mágico':'type-magic'};
  return m[tipo] || 'type-weapon';
}

function rankLabel(rank) {
  var r = ['','I','II','III','IV','V'];
  return 'Rank ' + (r[rank] || rank);
}

function navigate(hash) {
  window.location.hash = hash;
}

function showToast(msg, tipo) {
  var existing = qs('#arcanum-toast');
  if (existing) existing.remove();

  var toast = document.createElement('div');
  toast.id = 'arcanum-toast';
  toast.setAttribute('role','status');
  toast.setAttribute('aria-live','polite');
  toast.style.cssText = [
    'position:fixed','bottom:90px','left:50%','transform:translateX(-50%)',
    'background:' + (tipo === 'erro' ? 'var(--crimson)' : 'var(--gold-dim)'),
    'color:var(--text)','border:1px solid ' + (tipo === 'erro' ? 'var(--crim-lt)' : 'var(--gold)'),
    'border-radius:6px','padding:10px 20px','font-family:Cinzel,serif',
    'font-size:12px','letter-spacing:.06em','z-index:500',
    'box-shadow:0 6px 24px rgba(0,0,0,.5)','white-space:nowrap'
  ].join(';');
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(function(){ toast.remove(); }, 2600);
}


/* ──────────────────────────────────────────────────────────
   3. DASHBOARD
   ────────────────────────────────────────────────────────── */
function renderDashboard() {
  // Stats
  var sU = qs('#stat-usuarios');
  var sP = qs('#stat-personagens');
  var sH = qs('#stat-habilidades');
  var sI = qs('#stat-itens');
  if (sU) sU.textContent = db.usuarios.length;
  if (sP) sP.textContent = db.personagens.length;
  if (sH) sH.textContent = db.habilidades.length;
  if (sI) sI.textContent = db.itens.length;

  // Tabela de personagens recentes
  var tbody = qs('#dashboard-recent-chars tbody');
  if (!tbody) return;
  var recentes = db.personagens.slice().reverse().slice(0, 5);
  tbody.innerHTML = recentes.map(function(p) {
    var hpPct = p.hp_max > 0 ? Math.round((p.hp_atual / p.hp_max) * 100) : 0;
    return '<tr data-char-id="' + p.id + '">' +
      '<td><strong>' + escHtml(p.nome) + '</strong></td>' +
      '<td><span class="badge badge-class">' + escHtml(p.classe) + '</span></td>' +
      '<td><span class="level">' + p.nivel + '</span></td>' +
      '<td class="td-muted">' + escHtml(nomeUsuario(p.usuario_id)) + '</td>' +
      '<td><div class="bar-wrap">' +
        '<div class="bar-track"><div class="bar-fill bar-hp" style="width:' + hpPct + '%" aria-label="' + p.hp_atual + ' de ' + p.hp_max + ' HP"></div></div>' +
        '<span class="bar-txt">' + p.hp_atual + '/' + p.hp_max + '</span>' +
      '</div></td>' +
    '</tr>';
  }).join('');
}


/* ──────────────────────────────────────────────────────────
   4. PERSONAGENS
   ────────────────────────────────────────────────────────── */
function renderPersonagens(filtroNome, filtroClasse, filtroRaca) {
  var tbody = qs('#personagens-tbody');
  var count = qs('#personagens-count');
  if (!tbody) return;

  var lista = db.personagens.filter(function(p) {
    var ok = true;
    if (filtroNome)   ok = ok && p.nome.toLowerCase().includes(filtroNome.toLowerCase());
    if (filtroClasse) ok = ok && p.classe === filtroClasse;
    if (filtroRaca)   ok = ok && p.raca === filtroRaca;
    return ok;
  });

  if (count) count.textContent = lista.length + ' personagem' + (lista.length !== 1 ? 's' : '');

  tbody.innerHTML = lista.map(function(p) {
    var hpPct = p.hp_max > 0 ? Math.round((p.hp_atual / p.hp_max) * 100) : 0;
    var epPct = p.ep_max > 0 ? Math.round((p.ep_atual / p.ep_max) * 100) : 0;
    var epBar = p.ep_max > 0
      ? '<div class="bar-wrap"><div class="bar-track"><div class="bar-fill bar-ep" style="width:' + epPct + '%"></div></div><span class="bar-txt">' + p.ep_atual + '/' + p.ep_max + '</span></div>'
      : '<span class="td-muted">—</span>';
    return '<tr data-char-id="' + p.id + '" data-usuario-id="' + p.usuario_id + '">' +
      '<td><strong>' + escHtml(p.nome) + '</strong></td>' +
      '<td><span class="badge badge-race">' + escHtml(p.raca) + '</span></td>' +
      '<td><span class="badge badge-class">' + escHtml(p.classe) + '</span></td>' +
      '<td><span class="level">' + p.nivel + '</span></td>' +
      '<td><span class="badge badge-align">' + escHtml(p.alinhamento || '—') + '</span></td>' +
      '<td><div class="bar-wrap"><div class="bar-track"><div class="bar-fill bar-hp" style="width:' + hpPct + '%"></div></div><span class="bar-txt">' + p.hp_atual + '/' + p.hp_max + '</span></div></td>' +
      '<td>' + epBar + '</td>' +
      '<td class="td-muted">' + escHtml(nomeUsuario(p.usuario_id)) + '</td>' +
      '<td class="td-muted">' + escHtml(p.criado_em || '—') + '</td>' +
      '<td><div style="display:flex;gap:6px">' +
        '<a href="#modal-editar-personagem" class="btn-icon" title="Editar" aria-label="Editar ' + escHtml(p.nome) + '" data-action="editar-personagem" data-id="' + p.id + '">✎</a>' +
        '<a href="#modal-ver-personagem" class="btn-icon" title="Detalhes" aria-label="Ver ' + escHtml(p.nome) + '" data-action="ver-personagem" data-id="' + p.id + '">◎</a>' +
        '<a href="#modal-confirmar-delete-char" class="btn-icon btn-danger" title="Excluir" aria-label="Excluir ' + escHtml(p.nome) + '" data-action="excluir-personagem" data-id="' + p.id + '">✕</a>' +
      '</div></td>' +
    '</tr>';
  }).join('') || '<tr><td colspan="10" class="empty"><div class="empty-ico">⚔</div><div class="empty-txt">Nenhum personagem encontrado</div></td></tr>';
}

function preencherFormEditarPersonagem(id) {
  var p = db.personagens.find(function(p){ return p.id === id; });
  if (!p) return;
  qs('#ep-id').value      = p.id;
  qs('#ep-nome').value    = p.nome;
  setSelectVal('#ep-sexo', p.sexo || '');
  setSelectVal('#ep-raca', p.raca);
  setSelectVal('#ep-classe', p.classe);
  qs('#ep-nivel').value   = p.nivel;
  setSelectVal('#ep-alinhamento', p.alinhamento || '');
  qs('#ep-hp-atual').value = p.hp_atual;
  qs('#ep-hp-max').value   = p.hp_max;
  qs('#ep-ep-atual').value = p.ep_atual || 0;
  qs('#ep-ep-max').value   = p.ep_max  || 0;
  qs('#ep-descricao').value = p.descricao || '';
}

function preencherModalVerPersonagem(id) {
  var p = db.personagens.find(function(p){ return p.id === id; });
  if (!p) return;
  var modal = qs('#modal-ver-personagem');

  modal.querySelector('.char-name').textContent = p.nome;
  modal.querySelector('.portrait-frame').textContent = p.nome.charAt(0).toUpperCase();
  modal.querySelector('.char-meta').innerHTML =
    escHtml(p.raca) + ' · ' + escHtml(p.classe) + ' · Nível ' + p.nivel + '<br>' +
    escHtml(p.alinhamento || '—') + '<br>' +
    'Jogador: ' + escHtml(nomeUsuario(p.usuario_id));

  var dstats = qsa('.dstat', modal);
  if (dstats[0]) dstats[0].querySelector('.dstat-n').textContent = p.hp_atual;
  if (dstats[1]) dstats[1].querySelector('.dstat-n').textContent = p.hp_max;
  if (dstats[2]) dstats[2].querySelector('.dstat-n').textContent = p.ep_atual || 0;
  if (dstats[3]) dstats[3].querySelector('.dstat-n').textContent = p.nivel;

  // Atributos
  var attrs = db.atributos[p.id] || { forca:10, destreza:10, constituicao:10, inteligencia:10, sabedoria:10, carisma:10 };
  var attrNames = ['FOR','DES','CON','INT','SAB','CAR'];
  var attrKeys  = ['forca','destreza','constituicao','inteligencia','sabedoria','carisma'];
  var hexes = qsa('.attr-hex', modal);
  hexes.forEach(function(hex, i) {
    if (!attrKeys[i]) return;
    var v = attrs[attrKeys[i]];
    var nameEl = hex.querySelector('.attr-hex-name');
    var valEl  = hex.querySelector('.attr-hex-val');
    var modEl  = hex.querySelector('.attr-hex-mod');
    if (nameEl) nameEl.textContent = attrNames[i];
    if (valEl)  valEl.textContent  = v;
    if (modEl)  modEl.textContent  = mod(v);
  });

  // Habilidades
  var habs = db.habilidades.filter(function(h){ return h.personagem_id === p.id; });
  var habDiv = modal.querySelector('.fsec + div');
  if (habDiv && habDiv.querySelector('.skill-rank')) {
    habDiv.innerHTML = habs.length
      ? habs.map(function(h){ return '<span class="skill-rank" style="margin-right:6px">' + escHtml(h.nome) + ' ' + rankLabel(h.rank) + '</span>'; }).join('')
      : '<span class="td-muted">Nenhuma habilidade</span>';
    var fsecH = modal.querySelectorAll('.fsec')[1];
    if (fsecH) fsecH.textContent = '✦ Habilidades (' + habs.length + ')';
  }

  // Itens
  var itens = db.itens.filter(function(it){ return it.personagem_id === p.id; });
  var fsecs = qsa('.fsec', modal);
  var itensDiv = fsecs[2] ? fsecs[2].nextElementSibling : null;
  if (itensDiv) {
    itensDiv.innerHTML = itens.length
      ? itens.map(function(it){ return '<span class="badge badge-type" style="margin-right:6px">' + escHtml(it.nome) + '</span>'; }).join('')
      : '<span class="td-muted">Nenhum item</span>';
    fsecs[2].textContent = '⚗ Inventário (' + itens.length + ' ' + (itens.length === 1 ? 'item' : 'itens') + ')';
  }

  // Descrição
  var descDiv = modal.querySelector('[style*="font-style:italic"]');
  if (descDiv) descDiv.textContent = '"' + (p.descricao || '') + '"';

  // Botão editar dentro do modal
  var btnEdit = modal.querySelector('a[href="#modal-editar-personagem"]');
  if (btnEdit) btnEdit.setAttribute('data-id', p.id);

  modal.setAttribute('data-char-id', p.id);
}

function criarPersonagem(dados) {
  var id = nextId(db, 'personagens');
  var usuario = db.usuarios.find(function(u){ return u.id == dados.usuario_id; });
  db.personagens.push({
    id: id,
    nome: dados.nome,
    raca: dados.raca,
    classe: dados.classe,
    nivel: parseInt(dados.nivel) || 1,
    alinhamento: dados.alinhamento || '',
    hp_atual: parseInt(dados.pontos_vida) || 0,
    hp_max: parseInt(dados.pontos_vida) || 0,
    ep_atual: parseInt(dados.pontos_energia) || 0,
    ep_max: parseInt(dados.pontos_energia) || 0,
    sexo: dados.sexo || '',
    usuario_id: parseInt(dados.usuario_id),
    descricao: dados.descricao || '',
    criado_em: hojeSlash()
  });
  db.atributos[id] = { forca:10, destreza:10, constituicao:10, inteligencia:10, sabedoria:10, carisma:10 };
  dbSave(db);
  refreshSelects();
}

function atualizarPersonagem(dados) {
  var p = db.personagens.find(function(p){ return p.id == dados.id; });
  if (!p) return;
  p.nome        = dados.nome;
  p.raca        = dados.raca;
  p.classe      = dados.classe;
  p.nivel       = parseInt(dados.nivel) || p.nivel;
  p.alinhamento = dados.alinhamento || '';
  p.hp_atual    = parseInt(dados.hp_atual) || 0;
  p.hp_max      = parseInt(dados.hp_max) || p.hp_max;
  p.ep_atual    = parseInt(dados.ep_atual) || 0;
  p.ep_max      = parseInt(dados.ep_max) || 0;
  p.sexo        = dados.sexo || '';
  p.descricao   = dados.descricao || '';
  dbSave(db);
  refreshSelects();
}

function excluirPersonagem(id) {
  db.personagens = db.personagens.filter(function(p){ return p.id !== id; });
  db.habilidades = db.habilidades.filter(function(h){ return h.personagem_id !== id; });
  db.itens       = db.itens.filter(function(it){ return it.personagem_id !== id; });
  db.historico   = db.historico.filter(function(h){ return h.personagem_id !== id; });
  db.modificadores = db.modificadores.filter(function(m){ return m.personagem_id !== id; });
  delete db.atributos[id];
  dbSave(db);
  refreshSelects();
}


/* ──────────────────────────────────────────────────────────
   5. USUÁRIOS
   ────────────────────────────────────────────────────────── */
function renderUsuarios(filtroNome) {
  var tbody = qs('#usuarios-tbody');
  var count = qs('#usuarios-count');
  if (!tbody) return;

  var lista = db.usuarios.filter(function(u) {
    return !filtroNome || u.nome.toLowerCase().includes(filtroNome.toLowerCase()) || u.email.toLowerCase().includes(filtroNome.toLowerCase());
  });

  if (count) count.textContent = lista.length + ' usuário' + (lista.length !== 1 ? 's' : '');

  tbody.innerHTML = lista.map(function(u) {
    var numChars = db.personagens.filter(function(p){ return p.usuario_id === u.id; }).length;
    var iniciais = u.nome.split(' ').slice(0,2).map(function(n){ return n[0]; }).join('').toUpperCase();
    return '<tr data-user-id="' + u.id + '">' +
      '<td><div style="display:flex;align-items:center;gap:10px">' +
        '<div class="hdr-avatar" style="width:30px;height:30px;font-size:11px;flex-shrink:0">' + escHtml(iniciais) + '</div>' +
        '<strong>' + escHtml(u.nome) + '</strong>' +
      '</div></td>' +
      '<td class="td-muted">' + escHtml(u.email) + '</td>' +
      '<td class="td-muted">' + numChars + '</td>' +
      '<td class="td-muted">' + escHtml(u.criado_em || '—') + '</td>' +
      '<td><div style="display:flex;gap:6px">' +
        '<a href="#modal-editar-usuario" class="btn-icon" title="Editar" aria-label="Editar ' + escHtml(u.nome) + '" data-action="editar-usuario" data-id="' + u.id + '">✎</a>' +
        '<a href="#modal-confirmar-delete-usuario" class="btn-icon btn-danger" title="Excluir" aria-label="Excluir ' + escHtml(u.nome) + '" data-action="excluir-usuario" data-id="' + u.id + '">✕</a>' +
      '</div></td>' +
    '</tr>';
  }).join('') || '<tr><td colspan="5" class="empty"><div class="empty-ico">👤</div><div class="empty-txt">Nenhum usuário encontrado</div></td></tr>';
}

function preencherFormEditarUsuario(id) {
  var u = db.usuarios.find(function(u){ return u.id === id; });
  if (!u) return;
  qs('#eu-id').value    = u.id;
  qs('#eu-nome').value  = u.nome;
  qs('#eu-email').value = u.email;
  qs('#eu-senha-nova').value = '';
}

function criarUsuario(dados) {
  if (!dados.nome || !dados.email) return false;
  var id = nextId(db, 'usuarios');
  db.usuarios.push({ id: id, nome: dados.nome, email: dados.email, senha: dados.senha || '****', criado_em: hojeSlash() });
  dbSave(db);
  refreshSelects();
  return true;
}

function atualizarUsuario(dados) {
  var u = db.usuarios.find(function(u){ return u.id == dados.id; });
  if (!u) return;
  u.nome  = dados.nome;
  u.email = dados.email;
  if (dados.senha_nova && dados.senha_nova.trim().length >= 8) u.senha = dados.senha_nova;
  dbSave(db);
  refreshSelects();
}

function excluirUsuario(id) {
  db.usuarios = db.usuarios.filter(function(u){ return u.id !== id; });
  dbSave(db);
  refreshSelects();
}


/* ──────────────────────────────────────────────────────────
   6. ATRIBUTOS
   ────────────────────────────────────────────────────────── */
var attrKeys  = ['forca','destreza','constituicao','inteligencia','sabedoria','carisma'];
var attrNames = ['Força','Destreza','Constituição','Inteligência','Sabedoria','Carisma'];

function renderAtributos(charId) {
  if (!charId) {
    qs('#attr-hexes') && (qs('#attr-hexes').setAttribute('aria-label','Selecione um personagem'));
    return;
  }
  var p = db.personagens.find(function(p){ return p.id === charId; });
  if (!p) return;

  var attrs = db.atributos[charId] || {};
  var hexes = qs('#attr-hexes');
  if (hexes) hexes.setAttribute('aria-label', 'Atributos de ' + p.nome);

  attrKeys.forEach(function(key) {
    var v = attrs[key] || 10;
    // soma modificadores
    var totalMod = db.modificadores
      .filter(function(m){ return m.personagem_id === charId && m.atributo === attrNames[attrKeys.indexOf(key)]; })
      .reduce(function(acc, m){ return acc + m.valor; }, 0);
    var total = v + totalMod;
    var valEl = qs('#attr-' + key + '-val');
    var modEl = qs('#attr-' + key + '-mod');
    if (valEl) valEl.textContent = total;
    if (modEl) modEl.textContent = mod(total);
  });

  renderModificadores(charId);
}

function renderModificadores(charId) {
  var tbody = qs('#modificadores-tbody');
  if (!tbody) return;

  var attrs = db.atributos[charId] || {};
  var mods = db.modificadores.filter(function(m){ return m.personagem_id === charId; });

  // Agrupa por atributo
  var grupos = {};
  mods.forEach(function(m) {
    if (!grupos[m.atributo]) grupos[m.atributo] = [];
    grupos[m.atributo].push(m);
  });

  tbody.innerHTML = Object.keys(grupos).map(function(attr) {
    var key = attrNames.indexOf(attr);
    var base = attrs[attrKeys[key]] || 10;
    var itensM = grupos[attr].filter(function(m){ return m.origem === 'item'; });
    var habsM  = grupos[attr].filter(function(m){ return m.origem === 'habilidade'; });
    var somaItens = itensM.reduce(function(a,m){ return a + m.valor; }, 0);
    var somaHabs  = habsM.reduce(function(a,m){ return a + m.valor; }, 0);
    var total = base + somaItens + somaHabs;

    var labelItem = itensM.length ? (somaItens >= 0 ? '+' : '') + somaItens + ' (' + itensM.map(function(m){ return m.nome_origem; }).join(', ') + ')' : '+0';
    var labelHab  = habsM.length  ? (somaHabs  >= 0 ? '+' : '') + somaHabs  + ' (' + habsM.map(function(m){ return m.nome_origem; }).join(', ') + ')' : '+0';

    var ids = grupos[attr].map(function(m){ return m.id; });
    return '<tr data-attr="' + escHtml(attr) + '">' +
      '<td>' + escHtml(attr) + '</td>' +
      '<td>' + base + '</td>' +
      '<td class="td-muted">' + escHtml(labelItem) + '</td>' +
      '<td class="td-muted">' + escHtml(labelHab) + '</td>' +
      '<td><strong style="color:var(--gold)">' + total + '</strong></td>' +
      '<td><div style="display:flex;gap:6px">' +
        ids.map(function(mid) {
          return '<a href="#modal-confirmar-delete-mod" class="btn-icon btn-danger" title="Excluir mod." aria-label="Excluir modificador" data-action="excluir-mod" data-id="' + mid + '">✕</a>';
        }).join('') +
      '</div></td>' +
    '</tr>';
  }).join('') || '<tr><td colspan="6" class="empty"><div class="empty-txt">Nenhum modificador</div></td></tr>';
}

function preencherFormAtributos(charId) {
  var attrs = db.atributos[charId] || {};
  qs('#ea-char-id').value = charId;
  attrKeys.forEach(function(key) {
    var el = qs('#ea-' + key);
    if (el) el.value = attrs[key] || 10;
  });
}

function salvarAtributos(dados) {
  var charId = parseInt(dados.personagem_id);
  if (!charId) return;
  if (!db.atributos[charId]) db.atributos[charId] = {};
  attrKeys.forEach(function(key) {
    var v = parseInt(dados[key]);
    if (!isNaN(v)) db.atributos[charId][key] = Math.min(30, Math.max(1, v));
  });
  dbSave(db);
}

function criarModificador(dados) {
  var charId = parseInt(qs('#attr-select-personagem').value);
  if (!charId) return false;
  var id = nextId(db, 'modificadores');
  db.modificadores.push({
    id: id,
    personagem_id: charId,
    atributo: dados.atributo,
    valor: parseInt(dados.valor) || 0,
    origem: dados.origem,
    nome_origem: dados.nome_origem || ''
  });
  dbSave(db);
  return true;
}

function excluirModificador(id) {
  db.modificadores = db.modificadores.filter(function(m){ return m.id !== id; });
  dbSave(db);
}


/* ──────────────────────────────────────────────────────────
   7. HABILIDADES & MAGIAS
   ────────────────────────────────────────────────────────── */
function renderHabilidades(filtroNome, filtroTipo, filtroChar) {
  var container = qs('#habilidades-list');
  if (!container) return;

  var lista = db.habilidades.filter(function(h) {
    var ok = true;
    if (filtroNome)  ok = ok && h.nome.toLowerCase().includes(filtroNome.toLowerCase());
    if (filtroTipo)  ok = ok && h.tipo === filtroTipo;
    if (filtroChar)  ok = ok && h.personagem_id === parseInt(filtroChar);
    return ok;
  });

  container.innerHTML = lista.map(function(h) {
    var ico = h.tipo === 'Magia' ? '🔮' : h.tipo === 'Perícia' ? '🗡' : '⚔';
    return '<div class="skill-item" data-skill-id="' + h.id + '" data-tipo="' + escHtml(h.tipo) + '" data-char-id="' + h.personagem_id + '">' +
      '<span class="skill-ico" aria-hidden="true">' + ico + '</span>' +
      '<div>' +
        '<div class="skill-name">' + escHtml(h.nome) + '</div>' +
        '<div class="skill-meta">' + escHtml(h.tipo) + ' · ' + escHtml(nomePersonagem(h.personagem_id)) + (h.requisitos ? ' · Req: ' + escHtml(h.requisitos) : '') + '</div>' +
      '</div>' +
      '<span class="skill-rank">' + rankLabel(h.rank) + '</span>' +
      '<div style="display:flex;gap:6px">' +
        '<a href="#modal-editar-habilidade" class="btn-icon" title="Editar" aria-label="Editar ' + escHtml(h.nome) + '" data-action="editar-skill" data-id="' + h.id + '">✎</a>' +
        '<a href="#modal-confirmar-delete-skill" class="btn-icon btn-danger" title="Excluir" aria-label="Excluir ' + escHtml(h.nome) + '" data-action="excluir-skill" data-id="' + h.id + '">✕</a>' +
      '</div>' +
    '</div>';
  }).join('') || '<div class="empty"><div class="empty-ico">✦</div><div class="empty-txt">Nenhuma habilidade encontrada</div></div>';
}

function preencherFormEditarHabilidade(id) {
  var h = db.habilidades.find(function(h){ return h.id === id; });
  if (!h) return;
  qs('#eh-id').value = h.id;
  qs('#eh-nome').value = h.nome;
  setSelectVal('#eh-tipo', h.tipo);
  setSelectVal('#eh-rank', String(h.rank));
  qs('#eh-requisitos').value = h.requisitos || '';
  qs('#eh-efeitos').value = h.efeitos || '';
}

function criarHabilidade(dados) {
  if (!dados.nome) return false;
  var id = nextId(db, 'habilidades');
  db.habilidades.push({
    id: id,
    nome: dados.nome,
    tipo: dados.tipo,
    rank: parseInt(dados.rank) || 1,
    personagem_id: parseInt(dados.personagem_id) || 0,
    requisitos: dados.requisitos || '',
    efeitos: dados.efeitos || ''
  });
  dbSave(db);
  return true;
}

function atualizarHabilidade(dados) {
  var h = db.habilidades.find(function(h){ return h.id == dados.id; });
  if (!h) return;
  h.nome       = dados.nome;
  h.tipo       = dados.tipo;
  h.rank       = parseInt(dados.rank) || h.rank;
  h.requisitos = dados.requisitos || '';
  h.efeitos    = dados.efeitos || '';
  dbSave(db);
}

function excluirHabilidade(id) {
  db.habilidades = db.habilidades.filter(function(h){ return h.id !== id; });
  dbSave(db);
}


/* ──────────────────────────────────────────────────────────
   8. INVENTÁRIO
   ────────────────────────────────────────────────────────── */
function renderInventario(filtroNome, filtroTipo, filtroChar) {
  var grid = qs('#inventario-grid');
  if (!grid) return;

  var lista = db.itens.filter(function(it) {
    var ok = true;
    if (filtroNome)  ok = ok && it.nome.toLowerCase().includes(filtroNome.toLowerCase());
    if (filtroTipo)  ok = ok && it.tipo === filtroTipo;
    if (filtroChar)  ok = ok && it.personagem_id === parseInt(filtroChar);
    return ok;
  });

  grid.innerHTML = lista.map(function(it) {
    var ico = tipoItemIcon(it.tipo);
    var cls = tipoItemClass(it.tipo);
    return '<div class="inv-card" data-item-id="' + it.id + '" data-tipo="' + escHtml(it.tipo) + '" data-char-id="' + it.personagem_id + '">' +
      '<div class="inv-card-type ' + cls + '">' + ico + ' ' + escHtml(it.tipo) + '</div>' +
      '<div class="inv-card-name">' + escHtml(it.nome) + '</div>' +
      '<div class="inv-card-desc">' + escHtml(it.descricao || '') + '</div>' +
      '<div class="inv-card-foot">' +
        '<span class="inv-qty">Qtd: ' + it.quantidade + '</span>' +
        '<div style="display:flex;gap:5px">' +
          '<a href="#modal-editar-item" class="btn-icon btn-sm" title="Editar" aria-label="Editar ' + escHtml(it.nome) + '" data-action="editar-item" data-id="' + it.id + '">✎</a>' +
          '<a href="#modal-confirmar-delete-item" class="btn-icon btn-danger btn-sm" title="Excluir" aria-label="Excluir ' + escHtml(it.nome) + '" data-action="excluir-item" data-id="' + it.id + '">✕</a>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('') || '<div class="empty" style="grid-column:1/-1"><div class="empty-ico">⚗</div><div class="empty-txt">Nenhum item encontrado</div></div>';
}

function preencherFormEditarItem(id) {
  var it = db.itens.find(function(it){ return it.id === id; });
  if (!it) return;
  qs('#ei-id').value         = it.id;
  qs('#ei-nome').value       = it.nome;
  setSelectVal('#ei-tipo', it.tipo);
  qs('#ei-quantidade').value = it.quantidade;
  qs('#ei-descricao').value  = it.descricao  || '';
  qs('#ei-efeito').value     = it.efeito || '';
}

function criarItem(dados) {
  if (!dados.nome) return false;
  var id = nextId(db, 'itens');
  db.itens.push({
    id: id,
    nome: dados.nome,
    tipo: dados.tipo,
    quantidade: parseInt(dados.quantidade) || 1,
    personagem_id: parseInt(dados.personagem_id) || 0,
    descricao: dados.descricao || '',
    efeito: dados.efeito || ''
  });
  dbSave(db);
  return true;
}

function atualizarItem(dados) {
  var it = db.itens.find(function(it){ return it.id == dados.id; });
  if (!it) return;
  it.nome       = dados.nome;
  it.tipo       = dados.tipo;
  it.quantidade = parseInt(dados.quantidade) || it.quantidade;
  it.descricao  = dados.descricao  || '';
  it.efeito     = dados.efeito || '';
  dbSave(db);
}

function excluirItem(id) {
  db.itens = db.itens.filter(function(it){ return it.id !== id; });
  dbSave(db);
}


/* ──────────────────────────────────────────────────────────
   9. HISTÓRICO & EVOLUÇÃO
   ────────────────────────────────────────────────────────── */
function renderHistorico(charId) {
  var timeline = qs('#historico-timeline');
  if (!timeline) return;

  if (!charId) {
    timeline.innerHTML = '<div class="empty"><div class="empty-ico">📜</div><div class="empty-txt">Selecione um personagem</div></div>';
    return;
  }

  var entradas = db.historico.filter(function(h){ return h.personagem_id === charId; }).slice().reverse();

  // XP box
  var p = db.personagens.find(function(p){ return p.id === charId; });
  var xpTotal = calcXpTotal(charId);
  var xpNivel = xpParaNivel(p ? p.nivel : 1);
  var xpProx  = xpParaNivel(p ? p.nivel + 1 : 2);
  var pct = xpProx > xpNivel ? Math.min(100, Math.round(((xpTotal - xpNivel) / (xpProx - xpNivel)) * 100)) : 100;

  if (qs('#xp-box')) {
    qs('#xp-box').setAttribute('data-char-id', charId);
    if (qs('#hist-xp-total')) qs('#hist-xp-total').textContent = xpTotal.toLocaleString('pt-BR') + ' XP';
    var xpLbl = qs('.xp-lbl');
    if (xpLbl && p) xpLbl.textContent = 'Progresso para Nível ' + (p.nivel + 1);
    if (qs('#hist-xp-prog')) qs('#hist-xp-prog').textContent = xpTotal.toLocaleString('pt-BR') + ' / ' + xpProx.toLocaleString('pt-BR') + ' XP';
    if (qs('#hist-xp-bar'))  { qs('#hist-xp-bar').style.width = pct + '%'; qs('#hist-xp-bar').setAttribute('aria-label', pct + '% do nível'); }
    var charHead = qs('#xp-box [style*="Cinzel"]');
    if (charHead && p) charHead.textContent = p.nome;
    var charSub = qs('#xp-box [style*="color:var(--text-2)"]');
    if (charSub && p) charSub.textContent = p.classe + ' · ' + p.raca + ' · Nível ' + p.nivel;
  }

  timeline.innerHTML = entradas.map(function(h) {
    return '<div class="tl-item" data-entry-id="' + h.id + '" data-char-id="' + h.personagem_id + '">' +
      '<div class="tl-dot" aria-hidden="true"></div>' +
      '<div class="tl-date">' + escHtml(h.data || '—') + '</div>' +
      '<div class="tl-box">' +
        '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px">' +
          '<div>' +
            '<div class="tl-ttl">' + escHtml(h.titulo) + (h.xp_ganho ? ' <span style="color:var(--gold);font-size:11px">+' + h.xp_ganho.toLocaleString('pt-BR') + ' XP</span>' : '') + '</div>' +
            '<div class="tl-txt">' + escHtml(h.nota || '') + '</div>' +
          '</div>' +
          '<div style="display:flex;gap:5px;flex-shrink:0">' +
            '<a href="#modal-editar-entrada-historico" class="btn-icon btn-sm" title="Editar" aria-label="Editar entrada" data-action="editar-historico" data-id="' + h.id + '">✎</a>' +
            '<a href="#modal-confirmar-delete-hist" class="btn-icon btn-danger btn-sm" title="Excluir" aria-label="Excluir entrada" data-action="excluir-historico" data-id="' + h.id + '">✕</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('') || '<div class="empty"><div class="empty-ico">📜</div><div class="empty-txt">Nenhuma entrada registrada</div></div>';
}

function preencherFormEditarHistorico(id) {
  var h = db.historico.find(function(h){ return h.id === id; });
  if (!h) return;
  qs('#eeh-id').value    = h.id;
  qs('#eeh-xp').value    = h.xp_ganho || 0;
  qs('#eeh-nivel').value = h.nivel_novo || '';
  qs('#eeh-titulo').value = h.titulo;
  qs('#eeh-nota').value  = h.nota || '';
}

function criarHistorico(dados) {
  if (!dados.titulo) return false;
  var id = nextId(db, 'historico');
  db.historico.push({
    id: id,
    personagem_id: parseInt(dados.personagem_id),
    titulo: dados.titulo,
    data: hoje(),
    xp_ganho: parseInt(dados.xp_ganho) || 0,
    nivel_novo: dados.nivel_novo ? parseInt(dados.nivel_novo) : null,
    nota: dados.nota || ''
  });
  // Se subiu de nível, atualiza o personagem
  if (dados.nivel_novo) {
    var p = db.personagens.find(function(p){ return p.id === parseInt(dados.personagem_id); });
    if (p) p.nivel = parseInt(dados.nivel_novo);
  }
  dbSave(db);
  return true;
}

function atualizarHistorico(dados) {
  var h = db.historico.find(function(h){ return h.id == dados.id; });
  if (!h) return;
  h.titulo    = dados.titulo;
  h.xp_ganho  = parseInt(dados.xp_ganho) || 0;
  h.nivel_novo = dados.nivel_novo ? parseInt(dados.nivel_novo) : null;
  h.nota      = dados.nota || '';
  dbSave(db);
}

function excluirHistorico(id) {
  db.historico = db.historico.filter(function(h){ return h.id !== id; });
  dbSave(db);
}


/* ──────────────────────────────────────────────────────────
   10. ATUALIZAÇÃO DE SELECTS (manter sincronizados)
   ────────────────────────────────────────────────────────── */
function setSelectVal(sel, val) {
  var el = qs(sel);
  if (!el) return;
  for (var i = 0; i < el.options.length; i++) {
    if (el.options[i].value === String(val) || el.options[i].text === String(val)) {
      el.selectedIndex = i;
      return;
    }
  }
}

function populateCharSelects() {
  var opts = '<option value="">— Selecione um personagem —</option>' +
    db.personagens.map(function(p){ return '<option value="' + p.id + '">' + escHtml(p.nome) + ' (' + escHtml(p.classe) + ', Nv.' + p.nivel + ')</option>'; }).join('');
  var shortOpts = '<option value="">—</option>' +
    db.personagens.map(function(p){ return '<option value="' + p.id + '">' + escHtml(p.nome) + '</option>'; }).join('');

  var allOpts = '<option value="">Todos os personagens</option>' +
    db.personagens.map(function(p){ return '<option value="' + p.id + '">' + escHtml(p.nome) + '</option>'; }).join('');

  var selects = ['#attr-select-personagem','#hist-select-personagem'];
  selects.forEach(function(s){ var el = qs(s); if(el) el.innerHTML = opts; });

  var shortSelects = ['#nh-personagem','#ni-personagem','#neh-personagem'];
  shortSelects.forEach(function(s){ var el = qs(s); if(el) el.innerHTML = shortOpts; });

  var filterSelects = ['#filter-char-hab','#filter-char-inv'];
  filterSelects.forEach(function(s){ var el = qs(s); if(el) el.innerHTML = allOpts; });
}

function populateUserSelects() {
  var opts = '<option value="">— Selecione —</option>' +
    db.usuarios.map(function(u){ return '<option value="' + u.id + '">' + escHtml(u.nome) + '</option>'; }).join('');
  var el = qs('#np-usuario');
  if (el) el.innerHTML = opts;
}

function refreshSelects() {
  populateCharSelects();
  populateUserSelects();
}


/* ──────────────────────────────────────────────────────────
   11. FORMULÁRIOS — coleta de dados
   ────────────────────────────────────────────────────────── */
function coletarForm(formEl) {
  var dados = {};
  var inputs = formEl.querySelectorAll('input,select,textarea');
  inputs.forEach(function(el) {
    if (el.name) dados[el.name] = el.value;
  });
  return dados;
}

function validarForm(formEl) {
  var ok = true;
  var required = formEl.querySelectorAll('[required]');
  required.forEach(function(el) {
    el.style.borderColor = '';
    if (!el.value.trim()) {
      el.style.borderColor = 'var(--crim-lt)';
      ok = false;
    }
  });
  return ok;
}

function resetForm(formEl) {
  formEl.reset();
  formEl.querySelectorAll('[required]').forEach(function(el){ el.style.borderColor = ''; });
}


/* ──────────────────────────────────────────────────────────
   12. CONTROLLER PRINCIPAL — eventos
   ────────────────────────────────────────────────────────── */

// Estado global para deletes pendentes
var deleteTarget = { type: null, id: null };
// Estado para filtros ativos
var filtros = {
  personagens: { nome: '', classe: '', raca: '' },
  usuarios: { nome: '' },
  habilidades: { nome: '', tipo: '', char: '' },
  inventario: { nome: '', tipo: '', char: '' }
};
// Personagem selecionado em Atributos/Histórico
var charAtributos = null;
var charHistorico = null;

// ── Clique geral (delegação de eventos)
document.addEventListener('click', function(e) {
  var el = e.target.closest('[data-action]');
  if (!el) return;
  var action = el.getAttribute('data-action');
  var id = el.getAttribute('data-id') ? parseInt(el.getAttribute('data-id')) : null;

  switch (action) {

    // Personagens
    case 'editar-personagem':
      preencherFormEditarPersonagem(id);
      break;
    case 'ver-personagem':
      preencherModalVerPersonagem(id);
      break;
    case 'excluir-personagem':
      deleteTarget = { type: 'personagem', id: id };
      qs('#btn-confirm-delete-char') && qs('#btn-confirm-delete-char').setAttribute('data-id', id);
      break;

    // Usuários
    case 'editar-usuario':
      preencherFormEditarUsuario(id);
      break;
    case 'excluir-usuario':
      deleteTarget = { type: 'usuario', id: id };
      qs('#btn-confirm-delete-user') && qs('#btn-confirm-delete-user').setAttribute('data-id', id);
      break;

    // Habilidades
    case 'editar-skill':
      preencherFormEditarHabilidade(id);
      break;
    case 'excluir-skill':
      deleteTarget = { type: 'habilidade', id: id };
      qs('#btn-confirm-delete-skill') && qs('#btn-confirm-delete-skill').setAttribute('data-id', id);
      break;

    // Itens
    case 'editar-item':
      preencherFormEditarItem(id);
      break;
    case 'excluir-item':
      deleteTarget = { type: 'item', id: id };
      qs('#btn-confirm-delete-item') && qs('#btn-confirm-delete-item').setAttribute('data-id', id);
      break;

    // Histórico
    case 'editar-historico':
      preencherFormEditarHistorico(id);
      break;
    case 'excluir-historico':
      deleteTarget = { type: 'historico', id: id };
      qs('#btn-confirm-delete-hist') && qs('#btn-confirm-delete-hist').setAttribute('data-id', id);
      break;

    // Modificadores
    case 'excluir-mod':
      deleteTarget = { type: 'modificador', id: id };
      qs('#btn-confirm-delete-mod') && qs('#btn-confirm-delete-mod').setAttribute('data-id', id);
      break;

    // Atributos
    case 'editar-atributos':
      if (charAtributos) preencherFormAtributos(charAtributos);
      break;
    case 'salvar-atributos':
      if (charAtributos) {
        var dados = {};
        attrKeys.forEach(function(k){
          var el = qs('#attr-' + k + '-val');
          dados[k] = el ? parseInt(el.textContent) : 10;
        });
        dados.personagem_id = charAtributos;
        salvarAtributos(dados);
        renderAtributos(charAtributos);
        showToast('✔ Atributos salvos');
      }
      break;
  }
});

// ── Botões de CONFIRMAR DELETE
function bindConfirmDelete(btnId, fn, successMsg, afterFn) {
  var btn = qs(btnId);
  if (!btn) return;
  btn.addEventListener('click', function() {
    var id = deleteTarget.id;
    if (!id) return;
    fn(id);
    afterFn && afterFn();
    navigate(btn.closest('.modal-bg').id.replace('modal-confirmar-delete-','#sec-').replace('char','personagens').replace('usuario','usuarios').replace('skill','habilidades').replace('item','inventario').replace('hist','historico').replace('mod','atributos'));
    showToast(successMsg);
    deleteTarget = { type: null, id: null };
  });
}

bindConfirmDelete('#btn-confirm-delete-char', excluirPersonagem, '✕ Personagem excluído', function(){
  renderPersonagens(filtros.personagens.nome, filtros.personagens.classe, filtros.personagens.raca);
  renderDashboard();
});
bindConfirmDelete('#btn-confirm-delete-user', excluirUsuario, '✕ Usuário excluído', function(){
  renderUsuarios(filtros.usuarios.nome);
  renderDashboard();
});
bindConfirmDelete('#btn-confirm-delete-skill', excluirHabilidade, '✕ Habilidade excluída', function(){
  renderHabilidades(filtros.habilidades.nome, filtros.habilidades.tipo, filtros.habilidades.char);
  renderDashboard();
});
bindConfirmDelete('#btn-confirm-delete-item', excluirItem, '✕ Item excluído', function(){
  renderInventario(filtros.inventario.nome, filtros.inventario.tipo, filtros.inventario.char);
  renderDashboard();
});
bindConfirmDelete('#btn-confirm-delete-hist', excluirHistorico, '✕ Entrada excluída', function(){
  renderHistorico(charHistorico);
});
bindConfirmDelete('#btn-confirm-delete-mod', excluirModificador, '✕ Modificador excluído', function(){
  renderAtributos(charAtributos);
});

// ── Submits de formulários
document.addEventListener('submit', function(e) {
  e.preventDefault();
  var form = e.target;
  var action = form.getAttribute('data-action');
  if (!action) return;

  if (!validarForm(form)) {
    showToast('Preencha todos os campos obrigatórios (*)', 'erro');
    return;
  }

  var dados = coletarForm(form);

  switch (action) {

    case 'criar-personagem':
      criarPersonagem(dados);
      renderPersonagens(filtros.personagens.nome, filtros.personagens.classe, filtros.personagens.raca);
      renderDashboard();
      resetForm(form);
      navigate('#sec-personagens');
      showToast('✔ Personagem criado com sucesso!');
      break;

    case 'atualizar-personagem':
      atualizarPersonagem(dados);
      renderPersonagens(filtros.personagens.nome, filtros.personagens.classe, filtros.personagens.raca);
      renderDashboard();
      navigate('#sec-personagens');
      showToast('✔ Personagem atualizado!');
      break;

    case 'criar-usuario':
      if (dados.senha !== dados.senha_confirmacao) { showToast('As senhas não coincidem', 'erro'); return; }
      criarUsuario(dados);
      renderUsuarios(filtros.usuarios.nome);
      renderDashboard();
      resetForm(form);
      navigate('#sec-usuarios');
      showToast('✔ Usuário criado com sucesso!');
      break;

    case 'atualizar-usuario':
      atualizarUsuario(dados);
      renderUsuarios(filtros.usuarios.nome);
      navigate('#sec-usuarios');
      showToast('✔ Usuário atualizado!');
      break;

    case 'atualizar-atributos':
      salvarAtributos(dados);
      renderAtributos(parseInt(dados.personagem_id));
      navigate('#sec-atributos');
      showToast('✔ Atributos salvos!');
      break;

    case 'criar-modificador':
      if (!criarModificador(dados)) { showToast('Selecione um personagem primeiro', 'erro'); return; }
      renderAtributos(charAtributos);
      resetForm(form);
      navigate('#sec-atributos');
      showToast('✔ Modificador adicionado!');
      break;

    case 'criar-habilidade':
      criarHabilidade(dados);
      renderHabilidades(filtros.habilidades.nome, filtros.habilidades.tipo, filtros.habilidades.char);
      renderDashboard();
      resetForm(form);
      navigate('#sec-habilidades');
      showToast('✔ Habilidade criada!');
      break;

    case 'atualizar-habilidade':
      atualizarHabilidade(dados);
      renderHabilidades(filtros.habilidades.nome, filtros.habilidades.tipo, filtros.habilidades.char);
      navigate('#sec-habilidades');
      showToast('✔ Habilidade atualizada!');
      break;

    case 'criar-item':
      criarItem(dados);
      renderInventario(filtros.inventario.nome, filtros.inventario.tipo, filtros.inventario.char);
      renderDashboard();
      resetForm(form);
      navigate('#sec-inventario');
      showToast('✔ Item adicionado ao inventário!');
      break;

    case 'atualizar-item':
      atualizarItem(dados);
      renderInventario(filtros.inventario.nome, filtros.inventario.tipo, filtros.inventario.char);
      navigate('#sec-inventario');
      showToast('✔ Item atualizado!');
      break;

    case 'criar-historico':
      criarHistorico(dados);
      renderHistorico(parseInt(dados.personagem_id));
      resetForm(form);
      navigate('#sec-historico');
      showToast('✔ Entrada registrada!');
      break;

    case 'atualizar-historico':
      atualizarHistorico(dados);
      renderHistorico(charHistorico);
      navigate('#sec-historico');
      showToast('✔ Entrada atualizada!');
      break;
  }
});

// ── Filtros e buscas
function bindSearch(inputId, fn) {
  var el = qs(inputId);
  if (!el) return;
  el.addEventListener('input', fn);
}

function bindChange(selId, fn) {
  var el = qs(selId);
  if (!el) return;
  el.addEventListener('change', fn);
}

bindSearch('#search-personagens', function() {
  filtros.personagens.nome = this.value;
  renderPersonagens(filtros.personagens.nome, filtros.personagens.classe, filtros.personagens.raca);
});
bindChange('#filter-classe', function() {
  filtros.personagens.classe = this.value;
  renderPersonagens(filtros.personagens.nome, filtros.personagens.classe, filtros.personagens.raca);
});
bindChange('#filter-raca', function() {
  filtros.personagens.raca = this.value;
  renderPersonagens(filtros.personagens.nome, filtros.personagens.classe, filtros.personagens.raca);
});

bindSearch('#search-usuarios', function() {
  filtros.usuarios.nome = this.value;
  renderUsuarios(filtros.usuarios.nome);
});

bindSearch('#search-habilidades', function() {
  filtros.habilidades.nome = this.value;
  renderHabilidades(filtros.habilidades.nome, filtros.habilidades.tipo, filtros.habilidades.char);
});
bindChange('#filter-tipo-hab', function() {
  filtros.habilidades.tipo = this.value;
  renderHabilidades(filtros.habilidades.nome, filtros.habilidades.tipo, filtros.habilidades.char);
});
bindChange('#filter-char-hab', function() {
  filtros.habilidades.char = this.value;
  renderHabilidades(filtros.habilidades.nome, filtros.habilidades.tipo, filtros.habilidades.char);
});

bindSearch('#search-inventario', function() {
  filtros.inventario.nome = this.value;
  renderInventario(filtros.inventario.nome, filtros.inventario.tipo, filtros.inventario.char);
});
bindChange('#filter-tipo-item', function() {
  filtros.inventario.tipo = this.value;
  renderInventario(filtros.inventario.nome, filtros.inventario.tipo, filtros.inventario.char);
});
bindChange('#filter-char-inv', function() {
  filtros.inventario.char = this.value;
  renderInventario(filtros.inventario.nome, filtros.inventario.tipo, filtros.inventario.char);
});

// ── Seletor de personagem em Atributos
bindChange('#attr-select-personagem', function() {
  charAtributos = this.value ? parseInt(this.value) : null;
  renderAtributos(charAtributos);
});

// ── Seletor de personagem em Histórico
bindChange('#hist-select-personagem', function() {
  charHistorico = this.value ? parseInt(this.value) : null;
  renderHistorico(charHistorico);
});

// ── Modal de perfil (apenas fecha, sem funcionalidade de login real)
var modalPerfil = qs('#modal-perfil');
if (modalPerfil) {
  modalPerfil.addEventListener('click', function(e) {
    if (e.target === this) navigate('#sec-dashboard');
  });
}


/* ──────────────────────────────────────────────────────────
   13. RENDERIZAÇÃO INICIAL
   ────────────────────────────────────────────────────────── */
(function init() {
  refreshSelects();
  renderDashboard();
  renderPersonagens();
  renderUsuarios();
  renderHabilidades();
  renderInventario();
  renderHistorico(null);
  renderAtributos(null);

  // Avatar e nome no header
  var u = db.usuarios[0];
  if (u) {
    var iniciais = u.nome.split(' ').slice(0,2).map(function(n){ return n[0]; }).join('').toUpperCase();
    var avatar = qs('#hdr-avatar');
    var userName = qs('#hdr-username');
    if (avatar)   avatar.textContent = iniciais;
    if (userName) userName.textContent = u.nome;
  }
})();
