// ===================================================
//  BenBooks – App Controller (app.js)
//  Multi-page: URL-based navigation, page-specific init
// ===================================================

// ── State ──
let currentBookId = null;
let currentBooks = [];
let currentPage = 1;
let currentSortType = 'popular';
const itemsPerPage = 30;

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;

  // Render shared components (Header + Footer)
  if (document.getElementById('app-header')) {
    const showPhone = (page === 'login');
    renderHeader({ showPhone: showPhone });
  }
  if (document.getElementById('app-footer')) {
    renderFooter();
  }

  // Scroll-to-top button visibility
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });
  }

  // Page-specific init
  switch (page) {
    case 'homepage':
      initHomepage();
      break;
    case 'login':
      initLogin();
      break;
    case 'book-detail':
      initBookDetail();
      break;
  }
});


// ═══════════════════════════════════════════════════
//  PAGE: HOMEPAGE
// ═══════════════════════════════════════════════════

function initHomepage() {
  // 1) Check login state — show SMS overlay if not logged in
  const isLoggedIn = sessionStorage.getItem('benbooks_logged_in');
  const smsOverlay = document.getElementById('smsOverlay');

  if (!isLoggedIn && smsOverlay) {
    // Check URL params — if modal=welcome, user just logged in
    const params = new URLSearchParams(window.location.search);
    if (params.get('modal') === 'welcome') {
      sessionStorage.setItem('benbooks_logged_in', 'true');
    } else if (!params.get('modal')) {
      // Not logged in and no modal param → show SMS
      smsOverlay.style.display = 'block';
    }
  }

  // 2) Check URL params for modals
  try {
    const params = new URLSearchParams(window.location.search);
    const modalParam = params.get('modal');

    if (modalParam === 'activate') {
      setTimeout(() => {
        const el = document.getElementById('modalActivate');
        if (el) new bootstrap.Modal(el).show();
      }, 500);
    } else if (modalParam === 'welcome') {
      setTimeout(() => {
        const el = document.getElementById('modalWelcome');
        if (el) new bootstrap.Modal(el).show();
      }, 500);
    }
  } catch (e) {
    console.error('Modal init error:', e);
  }

  // 2) Render sidebar
  try {
    renderSidebar('sidebarHomepage', true);
  } catch (e) {
    console.error('Sidebar render error:', e);
  }

  // 3) Init book grid with all books
  try {
    filterBooksHomepage('all', null);
  } catch (e) {
    console.error('Book grid render error:', e);
  }
}

// Close welcome modal → stay on homepage (clean URL)
function closeWelcomeModal() {
  const modalEl = document.getElementById('modalWelcome');
  const modal = bootstrap.Modal.getInstance(modalEl);
  if (modal) modal.hide();
  // Clean URL params
  window.history.replaceState({}, '', 'index.html');
}


// ═══════════════════════════════════════════════════
//  PAGE: LOGIN
// ═══════════════════════════════════════════════════

function initLogin() {
  // Focus on code input
  const codeInput = document.getElementById('loginCode');
  if (codeInput) {
    setTimeout(() => codeInput.focus(), 300);
  }
}

function handleLogin(e) {
  e.preventDefault();
  const code = document.getElementById('loginCode').value.trim();
  const btn = document.getElementById('btnLogin');

  if (!code) {
    shakeElement(document.getElementById('loginCode'));
    return;
  }

  // Loading state
  btn.classList.add('btn-loading');
  btn.disabled = true;

  setTimeout(() => {
    // Redirect to homepage with welcome modal
    window.location.href = 'index.html?modal=welcome';
  }, 1500);
}


// ═══════════════════════════════════════════════════
//  PAGE: BOOK DETAIL
// ═══════════════════════════════════════════════════

function initBookDetail() {
  const params = new URLSearchParams(window.location.search);
  const bookId = parseInt(params.get('id'));
  const book = BOOKS.find(b => b.id === bookId);

  if (!book) {
    // Fallback: redirect to homepage
    window.location.href = 'index.html';
    return;
  }

  currentBookId = bookId;

  // Update page title
  document.title = `${book.title} – BenBooks`;

  // Render detail
  renderBookDetail(book);

  // Render sidebars
  renderSidebar('sidebarDetail', true);
  // renderTopicsSidebar('sidebarTopics');
}

// Navigate to book detail
function openBookDetail(bookId) {
  window.location.href = 'book-detail.html?id=' + bookId;
}


// ═══════════════════════════════════════════════════
//  RENDERERS
// ═══════════════════════════════════════════════════

// ── Book Card ──
function renderBookCard(book) {
  const typeClass = book.type === 'Audio' ? 'tag-audio' : 'tag-ebook';
  // Yêu cầu: Bật hết tag Hội Viên lên và ẩn tên tác giả, giá sách đi
  const isVipOverride = true;

  const typeIcon = book.type === 'Audio'
    ? '<img src="assets/img/audio-tag.svg" alt="" class="tag-icon">'
    : '<img src="assets/img/ebook-tag.svg" alt="" class="tag-icon">';

  // Tag Hội viên
  const vipTag = isVipOverride
    ? `<div class="book-vip-tag"><img src="assets/img/tag-hoi-vien.svg" alt="Hội viên" class="vip-tag-img"></div>`
    : '';

  // Ẩn tên tác giả và giá nếu có tag hội viên (chỉ hiện khi không có tag)
  const authorHtml = !isVipOverride
    ? `<div class="book-author">${book.author}</div>`
    : '';

  const priceHtml = (!isVipOverride && book.price)
    ? `<div class="book-price">${book.price}</div>`
    : '';

  const coverStyle = book.coverImage
    ? `background-image:url('${book.coverImage}');background-size:cover;background-repeat:no-repeat;background-position:center;`
    : `background:${book.coverColor};`;

  return `
    <div class="bb-book-card-col">
      <div class="bb-book-card" onclick="openBookDetail(${book.id})">
        <div class="book-cover-wrap" style="${coverStyle}">
          <span class="book-type-tag ${typeClass}">${typeIcon} ${book.type}</span>
          ${vipTag}
          ${book.coverImage ? '' : `<div class="d-flex align-items-center justify-content-center h-100" style="font-size:4rem;opacity:0.12;"><i class="bi bi-book"></i></div>`}
        </div>
        <div class="book-info">
          <div class="book-title">${book.title}</div>
          ${authorHtml}
          ${priceHtml}
        </div>
      </div>
    </div>`;
}

function renderBookGrid(containerId, books) {
  const container = document.getElementById(containerId);
  if (!container) return;
  // Flexbox row wraps 5-column cards
  container.innerHTML = `<div class="bb-books-row">${books.map(renderBookCard).join('')}</div>`;
}

function renderBookScroll(containerId, books) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = `<div class="bb-books-scroll">${books.map(renderBookCard).join('')}</div>`;
}

function scrollSection(containerId, direction) {
  const container = document.getElementById(containerId);
  const scrollEl = container?.querySelector('.bb-books-scroll');
  if (scrollEl) scrollEl.scrollBy({ left: direction * 600, behavior: 'smooth' });
}

// ── Sidebar ──
function renderSidebar(containerId, expanded) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let html = '';

  CATEGORIES.forEach((cat, ci) => {
    html += '<div class="bb-sidebar-block">';
    html += `<div class="sidebar-title">${cat.title}</div>`;
    html += `<div class="accordion accordion-flush" id="sidebarAcc${containerId}${ci}">`;
    cat.items.forEach((item, ii) => {
      const collapseId = `collapse_${containerId}_${ci}_${ii}`;
      const isFirst = ii === 0;
      html += `
        <div class="accordion-item border-0">
          <h2 class="accordion-header">
            <button class="accordion-button ${isFirst ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}">
              <span class="text-truncate d-inline-block" style="max-width: 85%;">${item.name}</span>
            </button>
          </h2>
          <div id="${collapseId}" class="accordion-collapse collapse ${isFirst ? 'show' : ''}" data-bs-parent="#sidebarAcc${containerId}${ci}">
            <div class="accordion-body">
              ${item.children.map(c => `<a href="#" class="sidebar-link">└ ${c}</a>`).join('')}
            </div>
          </div>
        </div>`;
    });
    html += '</div></div>';
  });

  // Extended sections for expanded sidebar
  if (expanded) {
    // Chủ đề
    html += '<div class="bb-sidebar-block">';
    html += '<div class="sidebar-title">CHỦ ĐỀ</div>';
    html += '<ul class="topic-list">';
    TOPICS.forEach((t, i) => {
      const hiddenCls = i >= 7 ? 'd-none hidden-item' : '';
      html += `<li class="${hiddenCls}"><a href="#">${t}</a></li>`;
    });
    if (TOPICS.length > 7) {
      html += `<li><a href="#" class="see-more text-decoration-none" onclick="toggleSeeMore(event, this)">Xem thêm <i class="bi bi-chevron-down"></i></a></li>`;
    }
    html += `</ul></div>`;

    // Tác giả
    /*
    html += '<div class="bb-sidebar-block">';
    html += '<div class="sidebar-title">TÁC GIẢ</div>';
    html += '<ul class="topic-list">';
    AUTHORS_LIST.forEach(a => {
      html += `<li><a href="#">${a}</a></li>`;
    });
    html += `<li><a href="#" class="see-more">Xem thêm <i class="bi bi-chevron-down"></i></a></li></ul></div>`;
    */

    // Độ tuổi
    html += '<div class="bb-sidebar-block">';
    html += '<div class="sidebar-title">ĐỘ TUỔI</div>';
    html += '<ul class="topic-list">';
    const AGE_GROUPS = ['Dưới 6 tuổi', '6 - 10 tuổi', '10 - 15 tuổi', 'Trên 15 tuổi'];
    AGE_GROUPS.forEach(age => {
      html += `<li><a href="#">${age}</a></li>`;
    });
    html += '</ul></div>';

    // Ngôn ngữ
    html += '<div class="bb-sidebar-block">';
    html += '<div class="sidebar-title">THEO NGÔN NGỮ</div>';
    html += '<ul class="topic-list">';
    LANGUAGES.forEach(l => {
      html += `<li><a href="#">${l}</a></li>`;
    });
    html += '</ul></div>';
  }

  container.innerHTML = html;
}

function renderTopicsSidebar(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let html = '<div class="bb-sidebar-block"><div class="sidebar-title">CHỦ ĐỀ</div>';
  html += '<ul class="topic-list">';
  TOPICS.forEach((t, i) => {
    const hiddenCls = i >= 7 ? 'd-none hidden-item' : '';
    html += `<li class="${hiddenCls}"><a href="#">${t}</a></li>`;
  });
  if (TOPICS.length > 7) {
    html += `<li><a href="#" class="see-more text-decoration-none" onclick="toggleSeeMore(event, this)">Xem thêm <i class="bi bi-chevron-down"></i></a></li>`;
  }
  html += `</ul></div>`;
  container.innerHTML = html;
}

window.toggleSeeMore = function(e, btn) {
  e.preventDefault();
  const list = btn.closest('ul');
  const hiddenItems = list.querySelectorAll('.hidden-item');
  const isExpanded = btn.getAttribute('data-expanded') === 'true';

  hiddenItems.forEach(item => {
    item.classList.toggle('d-none');
  });

  if (isExpanded) {
    btn.innerHTML = 'Xem thêm <i class="bi bi-chevron-down"></i>';
    btn.setAttribute('data-expanded', 'false');
  } else {
    btn.innerHTML = 'Thu gọn <i class="bi bi-chevron-up"></i>';
    btn.setAttribute('data-expanded', 'true');
  }
};

// ── Book Detail ──
function renderBookDetail(book) {
  // Breadcrumb
  const breadcrumb = document.getElementById('breadcrumbTitle');
  if (breadcrumb) breadcrumb.textContent = book.title;

  // 1. Render Cover & Badge Ebook/Audio (CỘT TRÁI)
  const detailBadgeType = document.getElementById('detailBadgeType');
  const detailCoverImage = document.getElementById('detailCoverImage');
  const detailThumbsList = document.getElementById('detailThumbsList');

  if (detailBadgeType) {
    const tagClass = book.type === 'Audio' ? 'text-info border-info' : 'text-primary border-primary';
    const tagIcon = book.type === 'Audio' ? 'bi-volume-up' : 'bi-phone-vibrate';
    detailBadgeType.innerHTML = `<span class="badge rounded-pill bg-white ${tagClass} px-3 py-2 d-flex align-items-center gap-1 border shadow-sm">
                                  <i class="bi ${tagIcon}"></i> ${book.type}
                                </span>`;
  }

  if (detailCoverImage) {
    detailCoverImage.innerHTML = book.coverImage
      ? `<img src="${book.coverImage}" alt="${book.title}" class="book-cover-img shadow-sm w-100 h-100 object-fit-contain">`
      : `<div class="w-100 h-100 d-flex align-items-center justify-content-center" style="background:${book.coverColor};"><i class="bi bi-book fs-1 text-white"></i></div>`;
  }

  // Render Thumbnail (3 thumbs giả lập dựa trên bìa gốc)
  if (detailThumbsList) {
    const thumbBg = book.coverImage
      ? `<img src="${book.coverImage}" class="w-100 h-100 object-fit-cover">`
      : `<div class="w-100 h-100" style="background:${book.coverColor};"></div>`;
      
    const tryIcon = book.type === 'Audio' ? 'nghe-thu.svg' : 'doc-thu.svg';
    const tryLabel = book.type === 'Audio' ? 'Nghe thử' : 'Đọc thử';

    detailThumbsList.innerHTML = `
      <div class="thumb-item active border-brand border-2 p-0">${thumbBg}</div>
      <div class="thumb-item">${thumbBg}</div>
      <div class="thumb-item">${thumbBg}</div>
      <div class="thumb-item dark-overlay position-relative">
        ${thumbBg}
        <div class="overlay-text text-tini-12 text-white text-center position-absolute top-50 start-50 translate-middle w-100 lh-sm">Xem thêm<br>hình ảnh</div>
      </div>
      <!-- Nút Đọc/Nghe thử -->
      <div class="thumb-action-box text-center cursor-pointer border rounded d-flex flex-column align-items-center justify-content-center bg-white" onclick="window.open('https://sachbanquyen.com.vn/doc-thu/23314', '_blank')">
        <img src="assets/img/${tryIcon}" alt="${tryLabel}" class="mb-1" style="height: 24px;">
        <span class="text-tini-12 text-dark-text">${tryLabel}</span>
      </div>`;
  }

  // 2. Render Info (CỘT PHẢI)
  const detailInfoMain = document.getElementById('detailInfoMain');
  if (detailInfoMain) {
    const starsHtml = '<i class="bi bi-star-fill text-warning"></i>'.repeat(Math.floor(book.rating));

    detailInfoMain.innerHTML = `
      <h1 class="text-h1-booktitle-26-b text-dark-text mb-2 lh-sm">
        [${book.type}] ${book.title}
      </h1>
      ${book.subtitle ? `<p class="text-h4-20-b text-dark-text mb-4">${book.subtitle}</p>` : '<p class="mb-4"></p>'}

      <!-- Rating & Stats -->
      <div class="d-flex align-items-center gap-3 mb-4 text-small-14 text-dark-text">
        <div class="d-flex align-items-center">
          <span class="fw-bold me-1">${book.rating}</span>
          <div class="text-warning d-flex gap-1">${starsHtml}</div>
        </div>
        <div class="vr text-hidden"></div>
        <div><span class="fw-bold">${book.views.toLocaleString()}</span> Lượt xem</div>
        <div class="vr text-hidden"></div>
        <div><span class="fw-bold">${book.editions.toLocaleString()}</span> Đã bán</div>
        <div class="ms-auto">
          <button class="btn btn-light rounded-circle btn-sm p-2 shadow-sm d-flex align-items-center justify-content-center" style="width:36px; height:36px;"><i class="bi bi-share-fill text-dark-text"></i></button>
        </div>
      </div>

      <!-- Meta Info -->
      <table class="table table-borderless table-sm w-auto mb-4 text-body-16-r">
        <tbody>
          <tr>
            <td class="text-hidden pe-4 py-2">Danh mục:</td>
            <td class="py-2">
              ${book.categories.map(c => `<a href="#" class="text-light-brown text-decoration-none me-2">${c}</a>`).join('')}
            </td>
          </tr>
          <tr>
            <td class="text-hidden pe-4 py-2">Gói cước:</td>
            <td class="py-2 title-hoi-vien text-brand">HỘI VIÊN</td>
          </tr>
        </tbody>
      </table>

      <hr class="mb-4" style="border-color: #E8E0CE;">

      <!-- Format Selector -->
      <div class="format-selector mb-5">
        <p class="text-body-16-m text-dark-text mb-3">Chọn loại</p>
        <div class="d-flex gap-3 flex-wrap">
          <div class="format-box text-center p-2 rounded ${book.bookType === 'Sách in' ? 'active bg-brand-light border-brand' : 'border-light'}">
            <img src="assets/img/sach-in.svg" alt="Sách in" class="mb-2" style="height:32px; ${book.bookType !== 'Sách in' ? 'filter: grayscale(1);' : ''}">
            <div class="text-small-14 ${book.bookType === 'Sách in' ? 'text-dark-text' : 'text-hidden'}">Sách in</div>
          </div>
          <div class="format-box text-center p-2 rounded ${book.type === 'Ebook' ? 'active bg-brand-light border-brand' : 'border-light'}">
            <img src="assets/img/ebook.svg" alt="Ebook" class="mb-2" style="height:32px; ${book.type !== 'Ebook' ? 'filter: grayscale(1);' : ''}">
            <div class="text-small-14 ${book.type === 'Ebook' ? 'text-dark-text' : 'text-hidden'}">Ebook</div>
          </div>
          <div class="format-box text-center p-2 rounded ${book.type === 'Audio' ? 'active bg-brand-light border-brand' : 'border-light'}">
            <img src="assets/img/audio-tag.svg" alt="Audio" class="mb-2" style="height:32px; ${book.type !== 'Audio' ? 'filter: grayscale(1);' : ''}">
            <div class="text-small-14 ${book.type === 'Audio' ? 'text-dark-text' : 'text-hidden'}">Audio</div>
          </div>
          <div class="format-box text-center p-2 rounded border-light">
            <img src="assets/img/multi-books.svg" alt="Sách tương tác" class="mb-2" style="height:32px; filter: grayscale(1);">
            <div class="text-small-14 text-hidden lh-sm">Sách<br>tương tác</div>
          </div>
        </div>
      </div>

      <button class="btn btn-brand w-100 py-3 text-btn-xl-18-b shadow-sm rounded-3">Đọc ngay</button>
    `;
  }

  // ── Related books (within col-9) ──
  const related = BOOKS.filter(b => b.id !== book.id && b.genre === book.genre).slice(0, 10);
  renderBookScroll('relatedBooksGrid', related.length > 0 ? related : BOOKS.filter(b => b.id !== book.id).slice(0, 10));

  // ── Suggested books (full-width section) ──
  const suggested = BOOKS.filter(b => b.id !== book.id).slice(0, 12);
  renderBookScroll('suggestedBooksGrid', suggested);
}


// ═══════════════════════════════════════════════════
//  FILTER & PAGINATION (Homepage)
// ═══════════════════════════════════════════════════

function filterBooksHomepage(type, btn) {
  if (btn) {
    btn.closest('.bb-filter-tabs').querySelectorAll('.btn').forEach(b => {
      b.classList.remove('btn-filter-active');
      b.classList.add('btn-filter');
    });
    btn.classList.remove('btn-filter');
    btn.classList.add('btn-filter-active');
  }

  const booksWithCover = BOOKS.filter(b => b.coverImage && b.coverImage.trim() !== '');
  currentBooks = type === 'all' ? [...booksWithCover] : booksWithCover.filter(b => b.type === type);

  const countEl = document.getElementById('bookCount');
  if (countEl) countEl.textContent = currentBooks.length;

  applyCurrentSort();
  renderPage(1);
}

function sortBooks(event, sortType, btn) {
  if (event) event.preventDefault();

  currentSortType = sortType;
  const sortBar = btn?.closest('.bb-sort-bar');
  if (sortBar) {
    sortBar.querySelectorAll('a').forEach(link => link.classList.remove('active'));
    btn.classList.add('active');
  }

  applyCurrentSort();
  renderPage(1);
}

function applyCurrentSort() {
  currentBooks.sort((a, b) => {
    if (a.isVip && !b.isVip) return -1;
    if (!a.isVip && b.isVip) return 1;

    switch (currentSortType) {
      case 'views':
        return (b.views || 0) - (a.views || 0);
      case 'newest':
        return (b.yearPublished || 0) - (a.yearPublished || 0);
      case 'price': {
        const priceA = parseInt((a.price || '0').replace(/\D/g, ''), 10) || 0;
        const priceB = parseInt((b.price || '0').replace(/\D/g, ''), 10) || 0;
        return priceA - priceB;
      }
      case 'popular':
      default:
        return (b.editions || 0) - (a.editions || 0);
    }
  });
}

function renderPage(page) {
  currentPage = page;
  const start = (page - 1) * itemsPerPage;
  const paginated = currentBooks.slice(start, start + itemsPerPage);
  renderBookGrid('bookGrid', paginated);
  renderPagination();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderPagination() {
  const totalPages = Math.ceil(currentBooks.length / itemsPerPage);
  const container = document.getElementById('paginationNav');
  if (!container) return;
  if (totalPages <= 1) { container.innerHTML = ''; return; }

  const p = currentPage;
  let html = '';

  // First + Prev
  html += `<li class="page-item ${p === 1 ? 'disabled' : ''}"><a class="page-link" href="#" onclick="event.preventDefault(); renderPage(1)"><i class="bi bi-chevron-double-left"></i></a></li>`;
  html += `<li class="page-item ${p === 1 ? 'disabled' : ''}"><a class="page-link" href="#" onclick="event.preventDefault(); if(${p}>1) renderPage(${p-1})"><i class="bi bi-chevron-left"></i></a></li>`;

  // Page numbers with ellipsis
  const pages = [];
  pages.push(1);
  if (p > 3) pages.push('...');
  for (let i = Math.max(2, p - 1); i <= Math.min(totalPages - 1, p + 1); i++) pages.push(i);
  if (p < totalPages - 2) pages.push('...');
  if (totalPages > 1) pages.push(totalPages);

  pages.forEach(pg => {
    if (pg === '...') {
      html += `<li class="page-item page-item-ellipsis"><span class="page-link">...</span></li>`;
    } else {
      html += `<li class="page-item ${p === pg ? 'active' : ''}"><a class="page-link" href="#" onclick="event.preventDefault(); renderPage(${pg})">${pg}</a></li>`;
    }
  });

  // Next + Last
  html += `<li class="page-item ${p === totalPages ? 'disabled' : ''}"><a class="page-link" href="#" onclick="event.preventDefault(); if(${p}<${totalPages}) renderPage(${p+1})"><i class="bi bi-chevron-right"></i></a></li>`;
  html += `<li class="page-item ${p === totalPages ? 'disabled' : ''}"><a class="page-link" href="#" onclick="event.preventDefault(); renderPage(${totalPages})"><i class="bi bi-chevron-double-right"></i></a></li>`;

  container.innerHTML = html;
}


// ═══════════════════════════════════════════════════
//  DESCRIPTION TOGGLE
// ═══════════════════════════════════════════════════

function toggleDescription(e) {
  e.preventDefault();
  const desc = document.getElementById('detailDescription');
  const link = e.target.closest('.see-more-link');
  if (desc.style.maxHeight === 'none') {
    desc.style.maxHeight = '200px';
    link.innerHTML = '<i class="bi bi-chevron-down"></i> Xem thêm ▼';
  } else {
    desc.style.maxHeight = 'none';
    link.innerHTML = '<i class="bi bi-chevron-up"></i> Thu gọn ▲';
  }
}

function submitComment(btn) {
  const textarea = btn.closest('.comment-form')?.querySelector('textarea');
  if (!textarea || !textarea.value.trim()) {
    if (textarea) shakeElement(textarea);
    return;
  }

  textarea.value = '';
  const originalText = btn.textContent;
  btn.textContent = 'Đã gửi ✓';
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = originalText;
    btn.disabled = false;
  }, 2000);
}

async function pasteLoginCode() {
  try {
    const text = await navigator.clipboard.readText();
    const codeInput = document.getElementById('loginCode');
    if (codeInput) {
      codeInput.value = text.trim();
      codeInput.focus();
    }
  } catch (error) {
    console.error('Clipboard read error:', error);
    const codeInput = document.getElementById('loginCode');
    if (codeInput) {
      codeInput.focus();
      codeInput.placeholder = 'Dán mã thủ công (Ctrl+V)';
    }
  }
}


// ═══════════════════════════════════════════════════
//  UTILITIES
// ═══════════════════════════════════════════════════

function closeSmsOverlay() {
  const overlay = document.getElementById('smsOverlay');
  if (overlay) overlay.style.display = 'none';
}

function showActivateModal() {
  setTimeout(() => {
    const el = document.getElementById('modalActivate');
    if (el) new bootstrap.Modal(el).show();
  }, 300);
}

function shakeElement(el) {
  el.style.transition = 'transform 0.1s ease';
  el.style.transform = 'translateX(-4px)';
  setTimeout(() => { el.style.transform = 'translateX(4px)'; }, 100);
  setTimeout(() => { el.style.transform = 'translateX(-4px)'; }, 200);
  setTimeout(() => { el.style.transform = 'translateX(4px)'; }, 300);
  setTimeout(() => { el.style.transform = 'translateX(0)'; el.style.borderColor = '#dc3545'; }, 400);
  setTimeout(() => { el.style.borderColor = ''; }, 1500);
}
