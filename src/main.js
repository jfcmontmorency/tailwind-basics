import './style.css';
import { levels as basesLevels } from './levels-bases.js';
import { levels as layoutLevels } from './levels-layout.js';
import { levels as responsiveLevels } from './levels-responsive.js';

// Registre des étapes du parcours. "levels" est réassigné à l'étape active
// par setActiveTrack(), pour que le reste du code (renderLevel,
// checkAnswer...) reste écrit une seule fois, indépendamment de l'étape.
const tracks = {
  bases: {
    number: '1',
    endTitle: 'les Bases',
    levels: basesLevels,
    endMessage: (n) => `Tu maîtrises maintenant les ${n} bases de Tailwind CSS. Reviens à l'accueil pour découvrir la suite du parcours : Layout et Responsive.`
  },
  layout: {
    number: '2',
    endTitle: 'le Layout',
    levels: layoutLevels,
    endMessage: (n) => `Tu maîtrises maintenant les ${n} briques du Layout (Flexbox, Grid). Reviens à l'accueil pour découvrir la suite du parcours : Responsive.`
  },
  responsive: {
    number: '3',
    endTitle: 'le Responsive',
    levels: responsiveLevels,
    endMessage: (n) => `Tu maîtrises maintenant les ${n} briques du Responsive (sm, md, lg, xl). Tu as terminé tout le parcours Tailwind CSS 4 !`
  }
};

// Classes de base toujours présentes sur les boîtes d'exercice, même quand
// leur className est entièrement réécrit par renderLevel()/oninput.
const BOX_BASE = 'max-w-full';
const FEEDBACK_BASE = 'mt-3 text-sm text-center min-h-[1.4rem]';

let currentTrackId = 'bases';
let levels = tracks[currentTrackId].levels;
let currentLevel = 0;
let solved = false;
let solvedLevels = new Array(levels.length).fill(false);
// Distinct de "tous les niveaux résolus" (solvedLevels.every) : ne devient
// true qu'après un clic explicite sur "Terminer" (endGame()). Sert à décider,
// au refresh, si on doit montrer l'écran de fin ou rester sur le niveau en
// cours - sinon résoudre le dernier niveau suffirait à afficher l'écran de
// fin au prochain refresh, même sans avoir cliqué "Terminer".
let trackFinished = false;

function setActiveTrack(trackId) {
  currentTrackId = trackId;
  levels = tracks[trackId].levels;
}

// ===================== PROGRESSION (localStorage) =====================
// Forme stockée : { activeTrack, bases: {currentLevel, solvedLevels, completed}, layout: {...} }
const STORAGE_KEY = 'tw4_progress';

function loadAllProgress() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return data && typeof data === 'object' ? data : {};
  } catch (e) {
    return {};
  }
}

function loadTrackProgress(trackId) {
  const saved = loadAllProgress()[trackId];
  if (!saved || !Array.isArray(saved.solvedLevels) || saved.solvedLevels.length !== tracks[trackId].levels.length) return null;
  return saved;
}

function saveProgress() {
  try {
    const all = loadAllProgress();
    all.activeTrack = currentTrackId;
    all[currentTrackId] = {
      currentLevel,
      solvedLevels,
      completed: solvedLevels.every(Boolean),
      finished: trackFinished
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (e) { }
}

function startGame(trackId) {
  setActiveTrack(trackId);
  const saved = loadTrackProgress(trackId);
  // Reprend une partie en cours, sauf si elle était déjà terminée (on la
  // rejoue alors depuis le début).
  if (saved && !saved.completed) {
    currentLevel = saved.currentLevel;
    solvedLevels = saved.solvedLevels;
  } else {
    currentLevel = 0;
    solvedLevels = new Array(levels.length).fill(false);
  }
  trackFinished = false;
  document.getElementById('screen-intro').classList.add('hidden');
  document.getElementById('screen-game').classList.remove('hidden');
  renderLevel();
}

function goHome() {
  document.getElementById('screen-game').classList.add('hidden');
  document.getElementById('screen-end').classList.add('hidden');
  document.getElementById('screen-intro').classList.remove('hidden');
  document.getElementById('progress-bar').value = 0;
  renderHome();
}

// Permet de reparcourir les niveaux déjà réussis (réponses pré-remplies, état
// "déjà réussi") sans réinitialiser la progression, pour qui ne veut pas tout
// recommencer mais juste consulter ses résultats.
function reviewResults(trackId) {
  setActiveTrack(trackId);
  const saved = loadTrackProgress(trackId);
  currentLevel = 0;
  solvedLevels = saved ? saved.solvedLevels : new Array(levels.length).fill(false);
  trackFinished = false;
  document.getElementById('screen-intro').classList.add('hidden');
  document.getElementById('screen-game').classList.remove('hidden');
  renderLevel();
}

// Reflète, sur la page d'accueil, l'avancement d'une étape donnée.
function renderTrackCard(trackId) {
  const btn = document.getElementById(`step-${trackId}-btn`);
  if (!btn) return;
  const reviewBtn = document.getElementById(`step-${trackId}-review-btn`);
  const badge = document.getElementById(`step-${trackId}-badge`);
  const total = tracks[trackId].levels.length;
  const saved = loadTrackProgress(trackId);
  const solvedCount = saved ? saved.solvedLevels.filter(Boolean).length : 0;

  if (solvedCount === total) {
    btn.textContent = 'Recommencer ↻';
    badge.textContent = '✓';
    badge.className = 'badge badge-success badge-lg';
    reviewBtn.classList.remove('hidden');
  } else if (solvedCount > 0) {
    btn.textContent = 'Continuer →';
    badge.textContent = tracks[trackId].number;
    badge.className = 'badge badge-primary badge-lg';
    reviewBtn.classList.add('hidden');
  } else {
    btn.textContent = 'Commencer →';
    badge.textContent = tracks[trackId].number;
    badge.className = 'badge badge-primary badge-lg';
    reviewBtn.classList.add('hidden');
  }
}

function renderHome() {
  Object.keys(tracks).forEach(renderTrackCard);
}

// Affiche, pour un niveau, une ou plusieurs "règles" de syntaxe : la
// syntaxe elle-même en mono, une note d'explication, et un lien cliquable
// vers la doc Tailwind officielle correspondante.
const EXTERNAL_LINK_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/></svg>';

function renderRules(rules) {
  const container = document.getElementById('level-explanation');
  container.replaceChildren();
  rules.forEach(rule => {
    const row = document.createElement('div');
    row.className = 'flex items-center gap-1.5';

    const label = document.createElement(rule.syntax ? 'code' : 'span');
    label.className = rule.syntax
      ? 'font-mono bg-primary/10 text-primary px-2 py-1 rounded text-sm'
      : 'text-sm text-base-content/70';
    label.textContent = rule.syntax || rule.note;
    row.appendChild(label);

    if (rule.docsUrl) {
      const tooltipText = `Documentation pour ${rule.label}`;
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.setAttribute('data-tip', tooltipText);

      const link = document.createElement('a');
      link.href = rule.docsUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.className = 'btn btn-ghost btn-xs btn-circle text-base-content/50';
      link.setAttribute('aria-label', tooltipText);
      link.innerHTML = EXTERNAL_LINK_ICON;
      tooltip.appendChild(link);
      row.appendChild(tooltip);
    }

    container.appendChild(row);
  });
}

// ===================== NIVEAUX "RESPONSIVE" (vrai <iframe> redimensionnable) =====================
// Un media query Tailwind (sm:/md:/lg:/xl:) ne réagit qu'à la largeur RÉELLE
// du viewport. Simuler ça en rejouant le cascade CSS en JS est fragile (voir
// git history - un premier essai s'est fait piéger par l'ordre interne du CSS
// compilé). La solution robuste : un vrai <iframe>, avec son propre viewport,
// dont on contrôle la largeur - les media queries s'y appliquent alors
// nativement, sans aucune logique à réinventer.
const BREAKPOINT_PX = { sm: 640, md: 768, lg: 1024, xl: 1280 };
const IFRAME_HEIGHT = 310; // le contenu est zoomé 2x (voir renderResponsiveIframeBox), donc plus haut
const RESPONSIVE_IFRAME_IDS = ['responsive-iframe-target', 'responsive-iframe-user'];

// Récupère une fois le CSS de la page (balises <style> injectées par Vite en
// dev, <link rel="stylesheet"> une fois buildé) pour l'embarquer dans le
// document de l'iframe, qui n'hérite d'aucun style du document parent.
let cachedPageStylesHtml = null;
function getPageStylesHtml() {
  if (cachedPageStylesHtml !== null) return cachedPageStylesHtml;
  let html = '';
  document.querySelectorAll('head style').forEach(style => {
    html += `<style>${style.textContent}</style>`;
  });
  document.querySelectorAll('head link[rel="stylesheet"]').forEach(link => {
    html += `<link rel="stylesheet" href="${link.href}">`;
  });
  cachedPageStylesHtml = html;
  return html;
}

// Construit le HTML d'une seule boîte : texte simple, ou plusieurs "puces"
// enfants (niveaux qui montrent un changement de LAYOUT, ex: flex-col →
// lg:flex-row - un seul élément ne montrerait rien).
function buildResponsiveBodyHtml(lvl, classes) {
  if (lvl.children) {
    const chips = lvl.children.map(child => {
      const isObj = typeof child === 'object';
      const cls = (isObj && child.classes) || lvl.childClasses;
      const label = isObj ? child.label : child;
      return `<div class="${cls}">${label}</div>`;
    }).join('');
    return `<div class="${classes.join(' ')}">${chips}</div>`;
  }
  return `<div class="${classes.join(' ')}">${lvl.content}</div>`;
}

// Cible et version de l'utilisateur sont chacune dans leur PROPRE iframe
// (empilées dans le HTML, une étiquette au-dessus de chaque), plutôt qu'un
// seul iframe contenant les deux - plus lisible, et prépare le terrain pour
// des niveaux de mise en page où chaque côté a besoin de sa propre largeur.
function renderResponsiveIframeBox(iframeId, lvl, classes) {
  const iframe = document.getElementById(iframeId);
  if (!iframe) return;
  const theme = document.documentElement.getAttribute('data-theme') || 'light';
  const isUser = iframeId === 'responsive-iframe-user';
  // Le fond en diagonales doit être sur le <body> DE L'IFRAME, pas sur son
  // conteneur dans la page parente : l'iframe est opaque et de la même
  // taille que ce conteneur, donc un fond posé dessus serait entièrement
  // caché derrière. Même motif que #preview-box-target/#preview-box-user
  // (voir style.css) ; animé seulement côté "Ta version".
  // Le contenu est zoomé 2x pour compenser le scale(0.5) de l'iframe entière
  // (sinon le texte serait deux fois trop petit). On utilise `zoom`, pas
  // `transform`, car zoom recalcule vraiment la mise en page (le texte se
  // ré-enroule correctement) sans avoir à deviner/compenser une largeur.
  // Le root font-size, lui, n'est volontairement pas touché : les breakpoints
  // Tailwind sont définis en rem, donc le changer déplacerait sm/md/lg/xl.
  const stripeColor = isUser ? 'var(--color-primary)' : 'var(--color-base-content)';
  iframe.srcdoc = `<!DOCTYPE html><html data-theme="${theme}"><head><meta charset="utf-8">${getPageStylesHtml()}
    <style>
      html {
        margin:0; padding:14px;
        min-height: 100vh;
        --stripe-d: 80px; 
        --stripe-angle: 45deg;
        background-image: repeating-linear-gradient(var(--stripe-angle),
          color-mix(in srgb, ${stripeColor} 6%, transparent) 0,
          color-mix(in srgb, ${stripeColor} 6%, transparent) calc(var(--stripe-d)/2),
          color-mix(in srgb, ${stripeColor} 4%, transparent) calc(var(--stripe-d)/2),
          color-mix(in srgb, ${stripeColor} 4%, transparent) var(--stripe-d));
        background-size: calc(var(--stripe-d) / sin(var(--stripe-angle))) 100%;
        ${isUser ? 'animation: bg-scroll 1s linear infinite;' : ''}
      }
      .rp-content { zoom: 2; }
    </style></head>
    <body class="text-base-content">
      <div class="rp-content">${buildResponsiveBodyHtml(lvl, classes)}</div>
    </body></html>`;
}

function renderResponsivePreview(lvl, targetClasses, userClasses) {
  renderResponsiveIframeBox('responsive-iframe-target', lvl, targetClasses);
  renderResponsiveIframeBox('responsive-iframe-user', lvl, userClasses);
  updateResponsiveScale();
}

// Le conteneur ("main") est plus étroit que la largeur max du slider
// (1300px) : plutôt qu'un scale dynamique qui reste à 1 (taille réelle) puis
// rétrécit brutalement une fois la largeur de la carte dépassée, on utilise
// une échelle CONSTANTE (0.5, donc 1300px slider → 650px visuel) - la preview
// grandit/rétrécit alors de façon fluide et linéaire avec le slider.
const RESPONSIVE_SCALE = 0.5;

function updateResponsiveScale() {
  const slider = document.getElementById('responsive-slider');
  const width = Number(slider.value);

  RESPONSIVE_IFRAME_IDS.forEach(id => {
    const iframe = document.getElementById(id);
    if (!iframe) return;
    const wrap = iframe.parentElement;
    // wrap.parentElement (pas wrap lui-même, qu'on redimensionne ici) sert de
    // référence stable pour la largeur réellement disponible - filet de
    // sécurité si la fenêtre est plus étroite que prévu (mobile).
    const available = wrap.parentElement.clientWidth;
    const scale = Math.min(RESPONSIVE_SCALE, available / width);

    iframe.style.width = width + 'px';
    iframe.style.height = IFRAME_HEIGHT + 'px';
    iframe.style.transform = `scale(${scale})`;
    wrap.style.width = (width * scale) + 'px';
    wrap.style.height = (IFRAME_HEIGHT * scale) + 'px';
  });

  const activeBp = Object.entries(BREAKPOINT_PX).filter(([, px]) => width >= px).pop();
  document.getElementById('responsive-width-label').textContent = activeBp ? `${width}px · ${activeBp[0]} actif` : `${width}px`;
}

document.getElementById('responsive-slider')?.addEventListener('input', updateResponsiveScale);
window.addEventListener('resize', () => {
  if (!document.getElementById('responsive-preview-section').classList.contains('hidden')) updateResponsiveScale();
});

// Remplit une boîte d'exercice : texte simple (niveaux "Bases", un seul
// élément à styliser), ou plusieurs "puces" enfants (niveaux "Layout", l'effet
// flex/grid n'est visible qu'avec plusieurs éléments). Les niveaux
// "Responsive" ne passent pas par ici, voir renderResponsiveIframe().
function renderBoxContent(el, lvl) {
  el.replaceChildren();
  if (lvl.children) {
    lvl.children.forEach(child => {
      const chip = document.createElement('div');
      const isObj = typeof child === 'object';
      chip.className = (isObj && child.classes) || lvl.childClasses;
      chip.textContent = isObj ? child.label : child;
      el.appendChild(chip);
    });
  } else {
    el.textContent = lvl.content;
  }
}

function renderLevel() {
  const lvl = levels[currentLevel];
  solved = solvedLevels[currentLevel];

  document.getElementById('level-counter').textContent = `Niveau ${currentLevel + 1} / ${levels.length}`;
  const topicEl = document.getElementById('level-topic');
  topicEl.textContent = lvl.topic;
  topicEl.className = 'badge badge-lg badge-primary';

  document.getElementById('level-title').textContent = lvl.title;
  renderRules(lvl.rules);

  const input = document.getElementById('class-input');
  input.value = solved ? lvl.required.join(' ') : '';

  const exerciseGrid = document.getElementById('exercise-grid');
  const responsiveSection = document.getElementById('responsive-preview-section');

  if (lvl.breakpoint) {
    exerciseGrid.classList.add('hidden');
    responsiveSection.classList.remove('hidden');
    const targetClasses = (lvl.contentClasses + ' ' + lvl.required.join(' ')).trim().split(/\s+/).filter(Boolean);
    const userClasses = (lvl.contentClasses + (input.value ? ' ' + input.value : '')).trim().split(/\s+/).filter(Boolean);
    renderResponsivePreview(lvl, targetClasses, userClasses);
  } else {
    exerciseGrid.classList.remove('hidden');
    responsiveSection.classList.add('hidden');
    const targetBox = document.getElementById('target-box');
    targetBox.className = BOX_BASE + ' ' + lvl.contentClasses + ' ' + lvl.required.join(' ');
    renderBoxContent(targetBox, lvl);

    const userBox = document.getElementById('user-box');
    userBox.className = BOX_BASE + ' ' + lvl.contentClasses + (input.value ? ' ' + input.value : '');
    renderBoxContent(userBox, lvl);
  }
  input.focus();

  const feedback = document.getElementById('feedback');
  if (solved) {
    feedback.textContent = '✅ Niveau déjà réussi.';
    feedback.className = FEEDBACK_BASE + ' text-success';
  } else {
    feedback.textContent = '';
    feedback.className = FEEDBACK_BASE;
  }

  updateActionButton();
  updatePrevButton();
  updateProgress();
  saveProgress();

  // Le CSS est précompilé au build (voir style.css) : plus de JIT au runtime,
  // donc plus besoin de debounce ici, la preview se met à jour instantanément.
  // Ré-écrire iframe.srcdoc recharge tout le document (dont ~300 Ko de CSS) :
  // pas cher une fois, mais on debounce quand même pour éviter de le faire à
  // chaque frappe pendant une saisie rapide.
  let responsiveDebounce;
  input.oninput = () => {
    const typed = input.value.trim().split(/\s+/).filter(Boolean);
    if (lvl.breakpoint) {
      clearTimeout(responsiveDebounce);
      responsiveDebounce = setTimeout(() => {
        // Seule "Ta version" change en tapant, la cible reste fixe : pas
        // besoin de recharger les deux iframes.
        const userClasses = (lvl.contentClasses + (typed.length ? ' ' + typed.join(' ') : '')).trim().split(/\s+/).filter(Boolean);
        renderResponsiveIframeBox('responsive-iframe-user', lvl, userClasses);
      }, 150);
    } else {
      const userBox = document.getElementById('user-box');
      userBox.className = BOX_BASE + ' ' + lvl.contentClasses + (typed.length ? ' ' + typed.join(' ') : '');
    }
  };
}

function updateActionButton() {
  const btn = document.getElementById('action-btn');
  if (solved) {
    const isLastLevel = currentLevel === levels.length - 1;
    btn.textContent = isLastLevel ? 'Terminer' : 'Niveau suivant →';
    btn.className = 'btn btn-primary ml-auto';
  } else {
    btn.textContent = 'Vérifier ✅';
    btn.className = 'btn btn-success ml-auto';
  }
}

function handleAction() {
  if (solved) {
    nextLevel();
  } else {
    checkAnswer();
  }
}

function updatePrevButton() {
  document.getElementById('prev-btn').disabled = currentLevel === 0;
}

function prevLevel() {
  if (currentLevel > 0) {
    currentLevel--;
    renderLevel();
  }
}

// Détermine la "famille" d'une classe Tailwind (ex: p-4 et p-6 sont dans la
// même famille "spacing:p", mais m-4 est dans une autre famille "spacing:m").
// Sert à distinguer une classe INEXACTE (bonne famille, mauvaise valeur)
// d'une classe ERRONÉE (famille qui ne correspond à rien d'attendu).
function classifyFamily(cls) {
  // Un préfixe de breakpoint (ex: "md:") fait partie de l'identité de la
  // famille : "md:text-xl" et "lg:text-xl" ne sont PAS interchangeables (bon
  // utilitaire, mauvais breakpoint = classe erronée, pas juste inexacte).
  const bpMatch = cls.match(/^(sm|md|lg|xl|2xl):(.+)$/);
  const prefix = bpMatch ? bpMatch[1] + ':' : '';
  const base = bpMatch ? bpMatch[2] : cls;

  let m;
  if ((m = base.match(/^(p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml)-([\d.]+|auto)$/))) {
    return prefix + 'spacing:' + m[1];
  }
  if (/^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl)$/.test(base)) return prefix + 'text-size';
  if (/^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/.test(base)) return prefix + 'font-weight';
  if (/^rounded(-(none|sm|md|lg|xl|2xl|3xl|full))?$/.test(base)) return prefix + 'rounded';
  if (/^border(-(0|2|4|8))?$/.test(base)) return prefix + 'border-width';
  if (/^shadow(-(sm|md|lg|xl|2xl|none))?$/.test(base)) return prefix + 'shadow';
  if (/^bg-(white|black|[a-z]+-\d{2,3})$/.test(base)) return prefix + 'bg-color';
  if (/^text-(white|black|[a-z]+-\d{2,3})$/.test(base)) return prefix + 'text-color';
  if (/^border-(white|black|[a-z]+-\d{2,3})$/.test(base)) return prefix + 'border-color';
  if ((m = base.match(/^(gap|gap-x|gap-y)-([\d.]+)$/))) return prefix + 'gap:' + m[1];
  if (/^(flex|grid|block|inline-block|inline|inline-flex|inline-grid|hidden)$/.test(base)) return prefix + 'display';
  if (/^flex-(row|row-reverse|col|col-reverse)$/.test(base)) return prefix + 'flex-direction';
  if (/^justify-(start|center|end|between|around|evenly)$/.test(base)) return prefix + 'justify-content';
  if (/^items-(start|center|end|stretch|baseline)$/.test(base)) return prefix + 'align-items';
  if (/^grid-cols-\d+$/.test(base)) return prefix + 'grid-cols';
  return prefix + 'other:' + base;
}

function checkAnswer() {
  const lvl = levels[currentLevel];
  const input = document.getElementById('class-input');
  const typed = [...new Set(input.value.trim().split(/\s+/).filter(Boolean))];

  // 1) Classes exactement correctes retirées des deux côtés
  const requiredLeft = lvl.required.filter(c => !typed.includes(c));
  const typedLeft = typed.filter(c => !lvl.required.includes(c));

  // 2) Parmi ce qu'il reste, on associe par famille : même famille que
  //    requise mais valeur différente = INEXACTE (on nomme la classe tapée).
  //    Sinon = ERRONÉE (idem). Les classes requises non couvertes restent
  //    MANQUANTES, mais sans nommer laquelle : ce serait donner la réponse
  //    (voir showHint() pour ça).
  const requiredLeftFamilies = requiredLeft.map(classifyFamily);
  const usedRequiredIdx = new Set();
  const inexact = [];
  const erroneous = [];

  typedLeft.forEach(tc => {
    const fam = classifyFamily(tc);
    const idx = requiredLeftFamilies.findIndex((f, i) => f === fam && !usedRequiredIdx.has(i));
    if (idx !== -1) {
      usedRequiredIdx.add(idx);
      inexact.push(tc);
    } else {
      erroneous.push(tc);
    }
  });

  const missingCount = requiredLeft.filter((c, i) => !usedRequiredIdx.has(i)).length;

  const feedback = document.getElementById('feedback');

  if (inexact.length === 0 && erroneous.length === 0 && missingCount === 0) {
    feedback.textContent = '✅ Exact ! Bravo, tu peux passer au niveau suivant.';
    feedback.className = FEEDBACK_BASE + ' text-success';
    if (!solved) {
      solved = true;
      solvedLevels[currentLevel] = true;
      saveProgress();
      launchConfetti();
    }
    updateActionButton();
  } else {
    const parts = [];
    if (erroneous.length > 0) {
      parts.push(`${erroneous.map(c => `« ${c} »`).join(', ')} ${erroneous.length > 1 ? 'sont erronées' : 'est erronée'}`);
    }
    if (inexact.length > 0) {
      parts.push(`${inexact.map(c => `« ${c} »`).join(', ')} ${inexact.length > 1 ? 'sont inexactes' : 'est inexacte'}`);
    }
    if (missingCount > 0) {
      parts.push(`il manque ${missingCount > 1 ? `${missingCount} classes` : 'une classe'}`);
    }
    feedback.textContent = '❌ ' + parts.join(', ') + '.';
    feedback.className = FEEDBACK_BASE + ' text-error animate-[shake_0.4s_ease]';
  }
}

function showHint() {
  const lvl = levels[currentLevel];
  const feedback = document.getElementById('feedback');
  feedback.className = FEEDBACK_BASE + ' italic text-secondary';
  feedback.replaceChildren();
  // Une vague : chaque lettre est son propre <span>, la classe .wavy
  // (l'animation) est ajoutée avec un délai croissant pour créer l'effet.
  lvl.hint.split('').forEach((ch, i) => {
    const span = document.createElement('span');
    span.textContent = ch;
    feedback.appendChild(span);
    setTimeout(() => span.classList.add('wavy'), i * 30 + 150);
  });
}

function nextLevel() {
  if (currentLevel < levels.length - 1) {
    currentLevel++;
    renderLevel();
  } else {
    endGame();
  }
}

function endGame() {
  trackFinished = true;
  document.getElementById('screen-game').classList.add('hidden');
  document.getElementById('screen-end').classList.remove('hidden');
  document.getElementById('end-title').textContent = `Bravo, tu as terminé ${tracks[currentTrackId].endTitle} !`;
  // document.getElementById('end-message').textContent = tracks[currentTrackId].endMessage(levels.length);
  document.getElementById('progress-bar').value = 100;
  saveProgress();
  launchConfetti();
}

function updateProgress() {
  const pct = Math.round((currentLevel / levels.length) * 100);
  const bar = document.getElementById('progress-bar');
  bar.value = pct;
  bar.className = 'progress progress-primary w-full h-1.5 rounded-none block';
}

function launchConfetti() {
  const emojis = ['🎉', '✨', '🎈', '⭐', '💫', '🎊', '🌟', '💥'];
  const count = 200;
  for (let i = 0; i < count; i++) {
    const span = document.createElement('span');
    span.className = 'fixed top-[-2rem] pointer-events-none z-50 animate-[fall_var(--dur,1.6s)_ease-in_forwards]';
    span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    span.style.left = Math.random() * 100 + 'vw';
    span.style.fontSize = (1 + Math.random() * 1.4) + 'rem';
    span.style.setProperty('--drift', (Math.random() * 240 - 120) + 'px');
    span.style.setProperty('--rot', (Math.random() * 900 - 450) + 'deg');
    span.style.setProperty('--dur', (1.1 + Math.random() * 1.4) + 's');
    span.style.animationDelay = (Math.random() * 0.5) + 's';
    document.body.appendChild(span);
    setTimeout(() => span.remove(), 3200);
  }
}

// Entrée clavier = vérifier / niveau suivant
document.getElementById('class-input')?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleAction();
});

// ===================== MODE SOMBRE (switch daisyUI "toggle") =====================
// Même principe que la case à cocher cachée + curseur glissant d'un toggle
// CSS classique, mais via le composant natif daisyUI (pas de CSS maison) : la
// case pilote directement l'état, son changement (onchange) applique le thème.
function toggleTheme() {
  const checkbox = document.getElementById('theme-toggle');
  const next = checkbox.checked ? 'dracula' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  try { localStorage.setItem('theme', next); } catch (e) { }
}

function syncThemeToggle() {
  const checkbox = document.getElementById('theme-toggle');
  if (!checkbox) return;
  checkbox.checked = document.documentElement.getAttribute('data-theme') === 'dracula';
}

syncThemeToggle();

// ===================== REPRISE DE PARTIE =====================
(function resumeProgress() {
  const all = loadAllProgress();
  const trackId = all.activeTrack;
  if (!trackId || !tracks[trackId]) return;
  const saved = loadTrackProgress(trackId);
  if (!saved) return;
  setActiveTrack(trackId);
  solvedLevels = saved.solvedLevels;
  currentLevel = Math.min(saved.currentLevel, levels.length - 1);
  trackFinished = !!saved.finished;
  document.getElementById('screen-intro').classList.add('hidden');
  if (saved.finished) {
    document.getElementById('screen-end').classList.remove('hidden');
    document.getElementById('end-title').textContent = `Bravo, tu as terminé ${tracks[trackId].endTitle} !`;
    // document.getElementById('end-message').textContent = tracks[trackId].endMessage(levels.length);
    document.getElementById('progress-bar').value = 100;
  } else {
    document.getElementById('screen-game').classList.remove('hidden');
    renderLevel();
  }
})();

renderHome();

// Les gestionnaires onclick="..." du HTML ont besoin de ces fonctions en
// global : un script de module n'expose rien sur `window` par défaut.
window.startGame = startGame;
window.goHome = goHome;
window.reviewResults = reviewResults;
window.prevLevel = prevLevel;
window.showHint = showHint;
window.handleAction = handleAction;
window.toggleTheme = toggleTheme;
