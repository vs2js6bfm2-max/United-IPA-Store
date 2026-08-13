/* ============================================
   United IPA商店 · 交互脚本
   ============================================ */

(function () {
  'use strict';

  const APPS = [
    { title: 'Lumen · 光度', cat: '摄影', date: '2026.08.10', desc: '用光线作画的摄影应用，极简界面下藏着专业级的色彩调校工具。', dl: 12384 },
    { title: 'Nimbus · 云端', cat: '效率', date: '2026.08.05', desc: '纯净无广告的云笔记，支持 Markdown，端到端加密保护。', dl: 8902 },
    { title: 'Sonic · 声波', cat: '音乐', date: '2026.08.12', desc: '无损音质播放器，专为音乐发烧友设计的精致播放器。', dl: 3210 },
    { title: 'Atlas · 图集', cat: '工具', date: '2026.08.12', desc: '优雅的相册管理工具，智能分类与轻量编辑一应俱全。', dl: 5620 },
    { title: 'Prism · 棱镜', cat: '效率', date: '2026.08.10', desc: '专注时间追踪器，用数据看见你如何使用每一刻时间。', dl: 4180 },
    { title: 'Echo · 回声', cat: '社交', date: '2026.08.08', desc: '基于声音的社交网络，让交流回归最原始的声音质感。', dl: 6740 },
    { title: 'Loop · 循环', cat: '音乐', date: '2026.08.05', desc: '极简节拍器与音乐练习辅助工具，界面纯净如水。', dl: 2890 },
    { title: 'Meridian · 子午线', cat: '阅读', date: '2026.08.03', desc: '沉浸式阅读器，支持 EPUB/PDF，排版精致。', dl: 9430 },
    { title: 'Canvas · 画布', cat: '摄影', date: '2026.07.28', desc: '专业级绘画应用，压感与图层表现均属上乘。', dl: 7150 },
    { title: 'Kernel · 内核', cat: '开发', date: '2026.07.25', desc: '专为开发者设计的代码编辑器，支持多种语言高亮。', dl: 4260 },
    { title: 'Gather · 聚合', cat: '效率', date: '2026.07.22', desc: '信息聚合器，将分散的阅读内容汇聚成一片宁静之地。', dl: 5120 },
    { title: 'Orbit · 轨道', cat: '游戏', date: '2026.07.20', desc: '一款关于太空与孤独的独立游戏，画面与叙事俱佳。', dl: 15200 },
    { title: 'Beacon · 信标', cat: '工具', date: '2026.07.18', desc: '极简的指南针与地图工具，离线也能精准定位。', dl: 3470 },
    { title: 'Harbor · 港湾', cat: '生活', date: '2026.07.15', desc: '城市生活指南，发现身边那些低调而美好的小店。', dl: 2980 },
    { title: 'Mosaic · 马赛克', cat: '摄影', date: '2026.07.12', desc: '将照片转化为艺术马赛克的创意应用，算法优雅。', dl: 4610 },
    { title: 'Quill · 羽毛笔', cat: '效率', date: '2026.07.08', desc: '手写笔记应用，还原纸笔的触感与自由。', dl: 8200 },
    { title: 'Horizon · 地平线', cat: '阅读', date: '2026.07.05', desc: '精选每日阅读，编辑团队精心挑选的深度文章。', dl: 6340 },
    { title: 'Tempest · 暴风雨', cat: '游戏', date: '2026.07.02', desc: ' Roguelike 卡牌游戏，策略深度与节奏感兼备。', dl: 11800 },
  ];

  const PAGE_SIZE = 6;
  let displayedCount = 0;
  let currentFilter = 'all';
  let currentTag = null;
  let searchQuery = '';

  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const navbar = document.getElementById('navbar');
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');
  const cardGrid = document.getElementById('cardGrid');
  const totalCount = document.getElementById('totalCount');
  const filterTabs = document.querySelector('.filter-tabs');
  const searchInput = document.getElementById('searchInput');
  const loadMoreBtn = document.getElementById('loadMore');
  const tagList = document.querySelector('.tag-list');

  function initTheme() {
    const saved = localStorage.getItem('ipa-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    html.setAttribute('data-theme', theme);
  }

  themeToggle.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('ipa-theme', next);
  });

  initTheme();

  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  function formatNumber(n) {
    return n.toLocaleString('zh-CN');
  }

  function cardTemplate(app) {
    return `
      <article class="card" data-cat="${app.cat}">
        <div class="card-head">
          <h3 class="card-title">${app.title}</h3>
          <span class="card-cat">${app.cat}</span>
        </div>
        <p class="card-time">${app.date}</p>
        <p class="card-desc">${app.desc}</p>
        <div class="card-foot">
          <span class="card-dl">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            ${formatNumber(app.dl)}
          </span>
          <a href="#" class="card-link">下载 →</a>
        </div>
      </article>
    `;
  }

  function getFilteredApps() {
    let apps = APPS;
    if (currentFilter !== 'all') {
      apps = apps.filter(a => a.cat === currentFilter);
    }
    if (currentTag) {
      apps = apps.filter(a => a.cat === currentTag);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      apps = apps.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.cat.toLowerCase().includes(q) ||
        a.desc.toLowerCase().includes(q)
      );
    }
    return apps;
  }

  function render(reset = false) {
    if (reset) {
      cardGrid.innerHTML = '';
      displayedCount = 0;
    }
    const apps = getFilteredApps();
    totalCount.textContent = apps.length;

    const nextBatch = apps.slice(displayedCount, displayedCount + PAGE_SIZE);
    nextBatch.forEach(app => {
      cardGrid.insertAdjacentHTML('beforeend', cardTemplate(app));
    });
    displayedCount += nextBatch.length;

    if (displayedCount >= apps.length) {
      loadMoreBtn.style.display = 'none';
    } else {
      loadMoreBtn.style.display = '';
    }

    observeNewCards();
  }

  filterTabs.addEventListener('click', (e) => {
    const tab = e.target.closest('.tab');
    if (!tab) return;
    filterTabs.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentFilter = tab.dataset.filter;
    currentTag = null;
    clearTags();
    render(true);
  });

  tagList.addEventListener('click', (e) => {
    const tag = e.target.closest('.tag');
    if (!tag) return;

    if (tag.classList.contains('active')) {
      tag.classList.remove('active');
      currentTag = null;
    } else {
      tagList.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      currentTag = tag.dataset.tag;
      filterTabs.querySelectorAll('.tab').forEach(t => {
        t.classList.toggle('active', t.dataset.filter === currentTag);
      });
      currentFilter = currentTag;
    }
    render(true);
  });

  function clearTags() {
    tagList.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
  }

  let searchTimer;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      searchQuery = e.target.value.trim();
      render(true);
    }, 250);
  });

  loadMoreBtn.addEventListener('click', () => render(false));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  function observeNewCards() {
    document.querySelectorAll('.reveal:not(.visible), .card:not(.visible)').forEach(el => {
      revealObserver.observe(el);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  });

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = parseInt(getComputedStyle(html).getPropertyValue('--nav-h')) || 64;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight + 1;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  render(true);
})();
