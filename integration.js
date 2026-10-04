'use strict';

(function () {
  const scriptCache = new Map();
  const loadedScripts = new Set();
  const animationModules = new Map();
  const regions = { desa: 'village', hutan: 'forest', api: 'fireland', beku: 'frozen', kastil: 'castle' };
  let regionSelect = () => {};
  let activeBoss = null;
  let activeAnimation = null;
  let introCanvas = null;
  let mapLoaded = false;

  async function runAttachedPageScript(path, canvas, active = true) {
    if (!scriptCache.has(path)) {
      scriptCache.set(path, fetch(path)
        .then(response => {
          if (!response.ok) throw new Error(`Asset tidak dapat dimuat: ${path}`);
          return response.text();
        })
        .then(html => {
          const page = new DOMParser().parseFromString(html, 'text/html');
          const source = [...page.scripts].map(script => script.textContent).find(text => text.trim());
          if (!source) throw new Error(`Script tidak ditemukan di ${path}`);
          return source;
        }));
    }
    const source = await scriptCache.get(path);
    if (canvas) {
      let module = animationModules.get(path);
      if (!module) {
        let isActive = false;
        let framePending = false;
        let nextFrame = null;
        const scheduleFrame = callback => {
          nextFrame = callback;
          if (!isActive || framePending) return;
          framePending = true;
          window.requestAnimationFrame(time => {
            framePending = false;
            if (isActive) callback(time);
          });
        };
        const scopedDocument = new Proxy(document, {
          get(target, property, receiver) {
            if (property === 'getElementById') {
              return id => id === 'c' || id === 'wolf' ? canvas : target.getElementById(id);
            }
            const value = Reflect.get(target, property, target);
            return typeof value === 'function' ? value.bind(target) : value;
          },
          set(target, property, value) {
            if (property === 'title') return true;
            return Reflect.set(target, property, value, target);
          }
        });
        module = {
          canvas,
          setActive(value) {
            isActive = value;
            if (isActive && nextFrame && !framePending) scheduleFrame(nextFrame);
          }
        };
        animationModules.set(path, module);
        module.setActive(active);
        try {
          new Function('document', 'requestAnimationFrame', source)(scopedDocument, scheduleFrame);
        } catch (error) {
          animationModules.delete(path);
          throw error;
        }
        return module;
      }
      module.setActive(active);
      return module;
    }
    if (!loadedScripts.has(path)) {
      new Function(source)();
      loadedScripts.add(path);
    }
    return null;
  }

  function applyMapState(id, status) {
    const assetId = Object.keys(regions).find(key => regions[key] === id);
    if (assetId && window.NUMERA_MAP) window.NUMERA_MAP.setState(assetId, status);
  }

  async function loadMap(onSelect) {
    regionSelect = onSelect || regionSelect;
    if (mapLoaded) return;
    try {
      await runAttachedPageScript('karakter/Peta Topografi Numeria — NUMERA (1).html');
      document.querySelector('.map-canvas')?.classList.add('topography-active');
      document.getElementById('nds')?.addEventListener('click', event => {
        const node = event.target.closest('.nd');
        const index = node ? [...event.currentTarget.children].indexOf(node) : -1;
        const id = regions[Object.keys(regions)[index]];
        if (id) regionSelect(id);
      });
      mapLoaded = true;
      window.dispatchEvent(new CustomEvent('numera:map-ready'));
    } catch (error) {
      console.error('Gagal mengintegrasikan peta topografi.', error);
    }
  }

  function setModuleActive(path, isActive) {
    const module = animationModules.get(path);
    if (module) module.setActive(isActive);
  }

  function hideBossAnimation() {
    if (activeAnimation) setModuleActive(activeAnimation, false);
    activeAnimation = null;
    activeBoss = null;
  }

  function suspendBossAnimation() {
    if (activeAnimation) setModuleActive(activeAnimation, false);
  }

  function resumeBossAnimation() {
    if (activeAnimation) setModuleActive(activeAnimation, true);
  }

  async function showIntroAnimation(isNullifier, fallbackIcon) {
    const host = document.getElementById('intro-char-art');
    if (!host) return;
    const path = 'karakter/Nullifier — Prolog (∞).html';
    if (!isNullifier) {
      if (activeAnimation === path) {
        setModuleActive(path, false);
        activeAnimation = null;
        activeBoss = null;
      }
      if (introCanvas) introCanvas.style.display = 'none';
      let fallback = host.querySelector('.intro-fallback');
      if (!fallback) {
        fallback = document.createElement('span');
        fallback.className = 'intro-fallback';
        host.appendChild(fallback);
      }
      fallback.style.display = '';
      fallback.textContent = fallbackIcon || '';
      host.dataset.animation = 'off';
      return;
    }
    if (activeAnimation && activeAnimation !== path) setModuleActive(activeAnimation, false);
    activeAnimation = path;
    let fallback = host.querySelector('.intro-fallback');
    if (!fallback) {
      fallback = document.createElement('span');
      fallback.className = 'intro-fallback';
      host.replaceChildren(fallback);
    }
    if (!introCanvas) {
      introCanvas = document.createElement('canvas');
      introCanvas.className = 'intro-boss-canvas';
      introCanvas.setAttribute('aria-label', 'Animasi prolog Nullifier');
    }
    if (introCanvas.parentElement !== host) host.appendChild(introCanvas);
    introCanvas.style.display = 'block';
    fallback.style.display = 'none';
    host.dataset.animation = 'on';
    try {
      await runAttachedPageScript(path, introCanvas);
    } catch (error) {
      console.error('Gagal mengintegrasikan animasi prolog Nullifier.', error);
      introCanvas.style.display = 'none';
      fallback.style.display = '';
      fallback.textContent = fallbackIcon || '⚡';
    }
  }

  async function showBossAnimation(bossId, fallbackIcon) {
    const art = document.getElementById('boss-art');
    if (!art) return;
    if (activeAnimation) setModuleActive(activeAnimation, false);
    activeBoss = bossId;
    const assets = {
      forest_boss: 'karakter/BOSS 1 — NAGA _ NUMERA.html',
      fire_boss: 'karakter/BOSS 2 — ULAR _ NUMERA (1).html',
      frozen_boss: 'karakter/serigala-boss-animasi.html',
      final_boss: 'karakter/Nullifier — Wujud Boss (Null).html'
    };
    const path = assets[bossId];
    art.classList.toggle('animated-boss', Boolean(path));
    let fallback = art.querySelector('.boss-fallback');
    if (!fallback) {
      fallback = document.createElement('span');
      fallback.className = 'boss-fallback';
      art.appendChild(fallback);
    }
    art.querySelectorAll('[data-boss-animation]').forEach(canvas => { canvas.style.display = 'none'; });
    if (!path) {
      fallback.style.display = '';
      fallback.textContent = fallbackIcon || '👹';
      return;
    }

    let canvas = art.querySelector(`[data-boss-animation="${bossId}"]`);
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.className = 'boss-animation-canvas';
      canvas.dataset.bossAnimation = bossId;
      canvas.setAttribute('aria-label', `Animasi boss ${bossId}`);
      art.appendChild(canvas);
    }
    canvas.style.display = 'block';
    activeAnimation = path;
    fallback.textContent = fallbackIcon || '👹';
    fallback.style.display = 'none';
    try {
      const module = await runAttachedPageScript(path, canvas);
      module.canvas.style.width = '100%';
      module.canvas.style.height = '100%';
      if (bossId === 'frozen_boss') module.canvas.style.transform = 'scaleX(-1)';
    } catch (error) {
      console.error(`Gagal mengintegrasikan animasi ${bossId}.`, error);
      canvas.style.display = 'none';
      fallback.style.display = '';
      fallback.textContent = fallbackIcon || '👹';
    }
  }

  function animateBoss(state) {
    if (activeBoss === 'frozen_boss' && window.WolfBoss) {
      const wolfState = { idle: 'idle', hit: 'hit', attack: 'attack', defeat: 'defeat' }[state] || 'idle';
      window.WolfBoss.setState(wolfState);
    } else if (activeBoss && state !== 'idle') {
      animationModules.get(activeAnimation)?.canvas.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    }
  }

  window.addEventListener('numera:map-ready', () => {
    document.querySelectorAll('[data-map-region]').forEach(element => {
      element.addEventListener('click', () => regionSelect(element.dataset.mapRegion));
    });
  });

  window.NumeraAssets = { loadMap, setMapState: applyMapState, showIntroAnimation, showBossAnimation,
    hideBossAnimation, suspendBossAnimation, resumeBossAnimation, animateBoss };
})();