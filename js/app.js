// ===================================================
//  BenBooks – App Controller (app.js)
//  Multi-page: URL-based navigation, page-specific init
// ===================================================

// ── State ──
let currentBookId = null;
let currentBooks = [];
let currentPage = 1;
const itemsPerPage = 30;

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;

  // Render shared components (Header + Footer)
  if (document.getElementById('app-header')) {
    const showPhone = (page === 'login' || page === 'homepage' || page === 'book-detail');
    renderHeader({ showPhone: showPhone });
  }
  if (document.getElementById('app-footer')) {
    renderFooter();
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
  // Render sidebar (expanded – full categories, topics, authors, languages)
  renderSidebar('sidebarHomepage', true);

  // Init book grid with all books
  filterBooksHomepage('all', null);

  // Check URL params for modals
  const params = new URLSearchParams(window.location.search);
  const modalParam = params.get('modal');

  if (modalParam === 'activate') {
    setTimeout(() => {
      const modal = new bootstrap.Modal(document.getElementById('modalActivate'));
      modal.show();
    }, 300);
  } else if (modalParam === 'welcome') {
    setTimeout(() => {
      const modal = new bootstrap.Modal(document.getElementById('modalWelcome'));
      modal.show();
    }, 300);
  }
}

// Close welcome modal → stay on homepage (clean URL)
function closeWelcomeModal() {
  const modalEl = document.getElementById('modalWelcome');
  const modal = bootstrap.Modal.getInstance(modalEl);
  if (modal) modal.hide();
  // Clean URL params
  window.history.replaceState({}, '', 'homepage.html');
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
    window.location.href = 'homepage.html?modal=welcome';
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
    window.location.href = 'homepage.html';
    return;
  }

  currentBookId = bookId;

  // Update page title
  document.title = `${book.title} – BenBooks`;

  // Render detail
  renderBookDetail(book);

  // Render sidebars
  renderSidebar('sidebarDetail', false);
  renderTopicsSidebar('sidebarTopics');
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
  const typeIcon = book.type === 'Audio'
    ? '<i class="bi bi-headphones tag-icon"></i>'
    : '<i class="bi bi-book tag-icon"></i>';

  const vipTag = book.isVip
    ? `<div class="book-vip-tag"><img src="assets/img/tag-hoi-vien.svg" alt="Hội viên"></div>`
    : '';

  return `
    <div class="col-6 col-sm-4 col-md-4 col-lg-auto" style="flex:0 0 20%;max-width:20%;">
      <div class="bb-book-card" onclick="openBookDetail(${book.id})">
        <div class="book-cover-wrap" style="${book.coverImage ? `background-image:url('${book.coverImage}');background-size:cover;background-position:center;` : `background:${book.coverColor};`}">
          <span class="book-type-tag ${typeClass}">${typeIcon} ${book.type}</span>
          ${vipTag}
          ${book.coverImage ? '' : `<div class="d-flex align-items-center justify-content-center h-100" style="font-size:4rem;opacity:0.12;"><i class="bi bi-book"></i></div>`}
        </div>
        <div class="book-info">
          <div class="book-title">${book.title}</div>
        </div>
      </div>
    </div>`;
}

function renderBookGrid(containerId, books) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = books.map(renderBookCard).join('');
}

// ── Sidebar ──
function renderSidebar(containerId, expanded) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let html = '';

  CATEGORIES.forEach((cat, ci) => {
    html += `<div class="sidebar-title">${cat.title}</div>`;
    html += `<div class="accordion accordion-flush" id="sidebarAcc${containerId}${ci}">`;
    cat.items.forEach((item, ii) => {
      const collapseId = `collapse_${containerId}_${ci}_${ii}`;
      const isFirst = ii === 0;
      html += `
        <div class="accordion-item border-0">
          <h2 class="accordion-header">
            <button class="accordion-button ${isFirst ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}">
              ${item.name}
            </button>
          </h2>
          <div id="${collapseId}" class="accordion-collapse collapse ${isFirst ? 'show' : ''}" data-bs-parent="#sidebarAcc${containerId}${ci}">
            <div class="accordion-body">
              ${item.children.map(c => `<a href="#" class="sidebar-link">└ ${c}</a>`).join('')}
            </div>
          </div>
        </div>`;
    });
    html += '</div>';
  });

  // Extended sections for expanded sidebar
  if (expanded) {
    // Chủ đề
    html += '<div class="sidebar-title">CHỦ ĐỀ</div>';
    html += '<ul class="topic-list">';
    TOPICS.forEach(t => {
      html += `<li><a href="#">${t}</a></li>`;
    });
    html += `<li><a href="#" class="see-more">Xem thêm ›</a></li></ul>`;

    // Tác giả
    html += '<div class="sidebar-title">TÁC GIẢ</div>';
    html += '<ul class="topic-list">';
    AUTHORS_LIST.forEach(a => {
      html += `<li><a href="#">${a}</a></li>`;
    });
    html += `<li><a href="#" class="see-more">Xem thêm ›</a></li></ul>`;

    // Ngôn ngữ
    html += '<div class="sidebar-title">THEO NGÔN NGỮ</div>';
    html += '<ul class="topic-list">';
    LANGUAGES.forEach(l => {
      html += `<li><a href="#">${l}</a></li>`;
    });
    html += '</ul>';
  }

  container.innerHTML = html;
}

function renderTopicsSidebar(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let html = '<div class="sidebar-title">CHỦ ĐỀ</div>';
  html += '<ul class="topic-list">';
  TOPICS.forEach(t => {
    html += `<li><a href="#">${t}</a></li>`;
  });
  html += `<li><a href="#" class="see-more">Xem thêm ›</a></li></ul>`;
  container.innerHTML = html;
}

// ── Book Detail ──
function renderBookDetail(book) {
  // Breadcrumb
  const breadcrumb = document.getElementById('breadcrumbTitle');
  if (breadcrumb) breadcrumb.textContent = book.title;

  // Cover
  const detailCover = document.getElementById('detailCover');
  if (detailCover) {
    detailCover.innerHTML = `
      <div style="${book.coverImage ? `background-image:url('${book.coverImage}');background-size:cover;background-position:center;` : `background:${book.coverColor};`}aspect-ratio:3/4;display:flex;align-items:center;justify-content:center;border-radius:var(--radius-md);position:relative;">
        <span class="book-type-tag ${book.type === 'Audio' ? 'tag-audio' : 'tag-ebook'}">
          <i class="bi bi-${book.type === 'Audio' ? 'headphones' : 'book'} tag-icon"></i> ${book.type}
        </span>
        ${book.isVip ? '<div class="book-vip-tag"><img src="assets/img/tag-hoi-vien.svg" alt="Hội viên"></div>' : ''}
        ${book.coverImage ? '' : '<i class="bi bi-book" style="font-size:5rem;opacity:0.15;"></i>'}
      </div>`;
  }

  // Thumbs
  const thumbs = document.getElementById('detailThumbs');
  if (thumbs) {
    let thumbsHtml = '';
    for (let i = 0; i < 5; i++) {
      thumbsHtml += `<div style="width:56px;height:70px;${book.coverImage ? `background-image:url('${book.coverImage}');background-size:cover;background-position:center;` : `background:${book.coverColor};`}border-radius:4px;border:2px solid ${i === 0 ? 'var(--c-brand)' : 'var(--c-border-light)'};cursor:pointer;display:flex;align-items:center;justify-content:center;">${book.coverImage ? '' : '<i class="bi bi-image" style="opacity:0.2"></i>'}</div>`;
    }
    thumbs.innerHTML = thumbsHtml;
  }

  // Info
  const info = document.getElementById('detailInfo');
  if (info) {
    const starsHtml = '⭐'.repeat(Math.floor(book.rating));

    let priceHtml = '';
    let actionsHtml = '';
    let benefitsHtml = '';

    if (book.isVip) {
      priceHtml = `<div class="mb-3">Gói cước: <span class="goi-cuoc-badge">HỘI VIÊN</span></div>`;
      actionsHtml = `<button class="btn btn-brand btn-lg w-100 py-3 text-btn-xl-18-b">Đọc ngay</button>`;
    } else {
      priceHtml = `<div class="book-price mb-2">Giá có thuế: <span class="price-amount">${book.price}</span></div>`;
      actionsHtml = `
        <div class="d-flex gap-2 mb-3">
          <button class="btn btn-brand btn-lg flex-fill text-btn-xl-18-b">Mua ngay</button>
          <button class="btn btn-outline-brand btn-lg flex-fill text-btn-xl-18-b">Thêm vào giỏ</button>
        </div>`;
      benefitsHtml = `
        <ul class="benefits-list">
          <li>Cam kết sách 100% bản quyền</li>
          <li>Trả hàng, phiếu hoàn tiền gốc (giá trị)</li>
          <li>Có khung tưởng niệm một cách dễ dàng</li>
          <li>Đổi trả 203 dễ dàng, sẵn sàng giao miễng phí (+2,000VNĐ)</li>
          <li>Có khung: 22,005</li>
        </ul>`;
    }

    info.innerHTML = `
      <h1 class="text-h1-booktitle-26-b">[${book.type}] ${book.title}</h1>
      ${book.subtitle ? `<div class="subtitle">${book.subtitle}</div>` : ''}
      <div class="rating-row">
        <span class="stars">${starsHtml}</span>
        <span>${book.rating}</span>
        <span class="text-hidden">|</span>
        <span>Lượt xem: <b>${book.views.toLocaleString()}</b></span>
        <span class="text-hidden">|</span>
        <span><b>${book.editions.toLocaleString()}</b> bản</span>
      </div>
      <div class="category-tags mb-2">
        <span>Danh mục: </span>
        ${book.categories.map(c => `<a href="#">${c}</a>`).join(', ')}
      </div>
      ${priceHtml}
      <div class="mb-2">
        <span class="text-small-14 text-hidden">Chọn loại: </span>
        <select class="form-select form-select-sm d-inline-block w-auto" style="font-size:13px;">
          <option>Tất cả</option>
        </select>
      </div>
      <div class="format-chooser">
        <div class="format-item active">
          <span class="format-icon"><i class="bi bi-tablet-landscape"></i></span>
          Kindle
        </div>
        <div class="format-item">
          <span class="format-icon"><i class="bi bi-headphones"></i></span>
          Audio
        </div>
        <div class="format-item">
          <span class="format-icon"><i class="bi bi-book"></i></span>
          Reading
        </div>
      </div>
      ${actionsHtml}
      <ul class="nav format-tabs mb-2">
        <li class="nav-item"><a class="nav-link active" href="#">Bản in</a></li>
        <li class="nav-item"><a class="nav-link" href="#">Ebook</a></li>
        <li class="nav-item"><a class="nav-link" href="#">PDF</a></li>
      </ul>
      ${benefitsHtml}`;
  }

  // Author section
  const authorSection = document.getElementById('authorSection');
  if (authorSection) {
    const initials = book.author.split(' ').map(w => w[0]).join('').slice(0, 2);
    authorSection.innerHTML = `
      <div class="author-section">
        <div class="author-avatar">${initials}</div>
        <div class="author-info">
          <div class="author-name">${book.author}</div>
          <div class="author-meta"><span class="badge bg-brand-light text-brand">${book.authorBooks} sách</span></div>
        </div>
        <div class="ms-auto text-end">
          <div class="text-small-14"><i class="bi bi-building me-1"></i> ${book.publisherFull}</div>
          <div class="text-tini-12 text-hidden"><i class="bi bi-clock me-1"></i> Đăng sách mới nhất: 14 ngày</div>
        </div>
      </div>`;
  }

  // Publishing info
  const pubInfo = document.getElementById('publishingInfo');
  if (pubInfo) {
    pubInfo.innerHTML = `
      <div class="section-title">THÔNG TIN XUẤT BẢN</div>
      <dl>
        <dt><i class="bi bi-book me-1"></i> Nhà XB</dt><dd>${book.publisher}</dd>
        <dt><i class="bi bi-person me-1"></i> Người dịch</dt><dd>${book.author}</dd>
        <dt><i class="bi bi-calendar me-1"></i> Năm XB</dt><dd>${book.yearPublished}</dd>
        <dt><i class="bi bi-tag me-1"></i> Loại sách</dt><dd>${book.bookType}</dd>
        <dt><i class="bi bi-rulers me-1"></i> Kích thước</dt><dd>${book.size || 'N/A'}</dd>
        <dt><i class="bi bi-file-earmark me-1"></i> Số trang</dt><dd>${book.pages || 'N/A'}</dd>
        <dt><i class="bi bi-layers me-1"></i> Dạng sách</dt><dd>${book.type}</dd>
        <dt><i class="bi bi-globe me-1"></i> Ngôn ngữ</dt><dd>${book.language}</dd>
        <dt><i class="bi bi-upc me-1"></i> Mã ISBN</dt><dd>${book.isbn || 'N/A'}</dd>
        ${book.maISBN ? `<dt><i class="bi bi-upc-scan me-1"></i> Mã ISBIN 02</dt><dd>${book.maISBN}</dd>` : ''}
      </dl>`;
  }

  // Description
  const desc = document.getElementById('detailDescription');
  if (desc) {
    desc.innerHTML = `<p>${book.description.replace(/\n\n/g, '</p><p>')}</p>`;
  }

  // TOC
  const toc = document.getElementById('detailToc');
  if (toc) {
    toc.innerHTML = book.chapters.map(ch =>
      `<li class="list-group-item text-small-14"><i class="bi bi-list-ul me-2 text-brand"></i>${ch}</li>`
    ).join('');
  }

  // Comments
  const commentsList = document.getElementById('commentsList');
  if (commentsList) {
    if (book.comments.length > 0) {
      commentsList.innerHTML = book.comments.map(c => `
        <div class="comment-item">
          <div class="comment-avatar">${c.user[0]}</div>
          <div class="comment-content">
            <div class="comment-user">${c.user} ${c.badge ? `<span class="comment-badge">${c.badge}</span>` : ''}</div>
            <div class="comment-time">${c.time}</div>
            <div class="comment-text">${c.text}</div>
            <a href="#" class="comment-reply-btn"><i class="bi bi-reply me-1"></i> Trả lời</a>
            ${c.reply ? `<div class="comment-reply"><small class="text-hidden">${c.reply.time}</small><p class="mb-0 text-small-14">${c.reply.text || ''}</p></div>` : ''}
          </div>
        </div>`).join('');
    } else {
      commentsList.innerHTML = '<p class="text-hidden text-small-14">Chưa có bình luận nào.</p>';
    }
  }

  // VIP Info Box
  const vipBox = document.getElementById('vipInfoBox');
  if (vipBox) {
    if (book.isVip) {
      vipBox.innerHTML = `
        <div class="vip-icon">V</div>
        <p>Bạn có 1 bộ sưu tập sách đã hết hạn 10/9/24, sách mới, sách cũ, tương lai... Bản sách hết thời gian...</p>
        <button class="btn btn-outline-brand btn-sm w-100">Trở thành hội viên</button>`;
    } else {
      vipBox.innerHTML = `
        <div class="vip-icon">V</div>
        <p>Bạn có 1 bộ sưu tập 11,000 ebook sách mới, sách cũ, tương lai... Trên 6 sách ở thể loại benbooks</p>
        <button class="btn btn-outline-brand btn-sm w-100">Trở thành hội viên</button>`;
    }
  }

  // Related books
  const related = BOOKS.filter(b => b.id !== book.id && b.genre === book.genre).slice(0, 6);
  renderBookGrid('relatedBooksGrid', related.length > 0 ? related : BOOKS.filter(b => b.id !== book.id).slice(0, 6));

  // Suggested books
  const suggested = BOOKS.filter(b => b.id !== book.id).slice(0, 6);
  renderBookGrid('suggestedBooksGrid', suggested);
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

  currentBooks = type === 'all' ? [...BOOKS] : BOOKS.filter(b => b.type === type);

  const countEl = document.getElementById('bookCount');
  if (countEl) countEl.textContent = currentBooks.length;

  renderPage(1);
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
  const paginationContainer = document.getElementById('paginationNav');
  if (!paginationContainer) return;

  if (totalPages <= 1) {
    paginationContainer.innerHTML = '';
    return;
  }

  let html = `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}"><a class="page-link" href="#" onclick="event.preventDefault(); if(${currentPage} > 1) renderPage(${currentPage - 1})"><i class="bi bi-chevron-left"></i></a></li>`;

  for (let i = 1; i <= totalPages; i++) {
    html += `<li class="page-item ${currentPage === i ? 'active' : ''}"><a class="page-link" href="#" onclick="event.preventDefault(); renderPage(${i})">${i}</a></li>`;
  }

  html += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}"><a class="page-link" href="#" onclick="event.preventDefault(); if(${currentPage} < ${totalPages}) renderPage(${currentPage + 1})"><i class="bi bi-chevron-right"></i></a></li>`;

  paginationContainer.innerHTML = html;
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


// ═══════════════════════════════════════════════════
//  UTILITIES
// ═══════════════════════════════════════════════════

function shakeElement(el) {
  el.style.transition = 'transform 0.1s ease';
  el.style.transform = 'translateX(-4px)';
  setTimeout(() => { el.style.transform = 'translateX(4px)'; }, 100);
  setTimeout(() => { el.style.transform = 'translateX(-4px)'; }, 200);
  setTimeout(() => { el.style.transform = 'translateX(4px)'; }, 300);
  setTimeout(() => { el.style.transform = 'translateX(0)'; el.style.borderColor = '#dc3545'; }, 400);
  setTimeout(() => { el.style.borderColor = ''; }, 1500);
}
