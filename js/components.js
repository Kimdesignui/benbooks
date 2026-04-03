// ===================================================
//  BenBooks – Shared Components (components.js)
//  Render Header & Footer dùng chung cho mọi trang
// ===================================================

/**
 * Render header vào #app-header
 * @param {Object} options
 * @param {boolean} options.showPhone - Hiển thị SĐT thay nút Tài khoản
 */
function renderHeader(options = {}) {
  const container = document.getElementById('app-header');
  if (!container) return;

  const showPhone = options.showPhone || false;

  const accountHtml = showPhone
    ? '<span class="header-phone-display"><i class="bi bi-person-circle me-1"></i> +84944640034</span>'
    : '<a href="#" class="btn-tai-khoan" id="headerAccount"><i class="bi bi-person-circle me-1"></i> Tài khoản</a>';

  container.innerHTML = `
    <header class="bb-header">
      <div class="container-fluid bb-container">
        <div class="header-inner">
          <!-- LEFT: Logo -->
          <div class="header-left">
            <a href="index.html" class="header-logo d-flex align-items-center text-decoration-none">
              <img src="assets/img/benbooks-logo.svg" alt="BenBooks" class="header-logo-img">
            </a>
          </div>
          <!-- CENTER: Search -->
          <div class="header-center">
            <div class="header-search input-group">
              <input type="text" class="form-control" placeholder="Nhập từ khoá tìm kiếm" id="searchInput">
              <button class="btn btn-search" type="button"><i class="bi bi-search"></i></button>
            </div>
          </div>
          <!-- RIGHT: Actions -->
          <div class="header-right">
            <div class="header-hotline d-none d-lg-flex align-items-center gap-2 me-3">
              <i class="bi bi-telephone-fill text-brand"></i>
              <div>
                <div class="hotline-label">Hotline:</div>
                <div class="hotline-number">0382832993</div>
              </div>
            </div>
            <button class="btn btn-goi-cuoc me-2"><img src="assets/img/vip-icon.svg" alt="VIP" class="vip-icon"> Gói Cước</button>
            ${accountHtml}
          </div>
        </div>
      </div>
    </header>`;
}

/**
 * Render footer vào #app-footer
 */
function renderFooter() {
  const container = document.getElementById('app-footer');
  if (!container) return;

  container.innerHTML = `
    <footer class="bb-footer">
      <div class="container-fluid bb-container">

        <!-- Row 1: 4 info columns -->
        <div class="row g-4">
          <!-- Company info -->
          <div class="col-lg-4 col-md-6">
            <h6 class="footer-heading">Công ty cổ phần Văn hoá và Bản quyền Benito</h6>
            <p class="footer-sub">(Hoạt động từ 8h - 17h, Thứ 2 - Thứ 7)</p>
            <p><i class="bi bi-geo-alt me-1"></i> 28D2 Khu giãn dân Yên Phúc, Hà Đông, Hà Nội</p>
            <p><i class="bi bi-telephone me-1"></i> Hotline: <strong>0888 080 290</strong></p>
            <p><i class="bi bi-envelope me-1"></i> Email: haianh.pham@benitovn.com</p>
            <p><i class="bi bi-card-text me-1"></i> Mã số thuế: 0109653575</p>
          </div>
          <!-- Hỗ trợ KH -->
          <div class="col-lg-3 col-md-6">
            <h6 class="footer-heading">Hỗ trợ khách hàng</h6>
            <p><a href="#">Hướng dẫn đọc sách ebook</a></p>
            <p><a href="#">Hướng dẫn thuê sách ebook</a></p>
            <p><a href="#">Hướng dẫn đăng ký tài khoản</a></p>
          </div>
          <!-- Chính sách -->
          <div class="col-lg-3 col-md-6">
            <h6 class="footer-heading">Chính sách - điều khoản</h6>
            <p><a href="#">Chính sách bảo mật</a></p>
            <p><a href="#">Điều khoản sử dụng</a></p>
          </div>
          <!-- Về chúng tôi -->
          <div class="col-lg-2 col-md-6">
            <h6 class="footer-heading">Về chúng tôi</h6>
            <p><a href="#">Giới thiệu</a></p>
            <p><a href="#">Liên hệ</a></p>
          </div>
        </div>

        <!-- Row 2: App badges (left) + BCT (right) -->
        <div class="footer-badges">
          <div class="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <!-- App downloads -->
            <div class="d-flex flex-wrap align-items-center gap-4">
              <a href="#" title="Tải ứng dụng iOS">
                <img src="assets/img/download-ios.svg" alt="App Store" class="footer-badge-img">
              </a>
              <a href="#" title="Tải ứng dụng Android">
                <img src="assets/img/download-chplay.svg" alt="Google Play" class="footer-badge-img">
              </a>
            </div>
            <!-- BCT badge -->
            <img src="assets/img/bo-cong-thuong.png" alt="Đã thông báo Bộ Công Thương" class="bct-img">
          </div>
        </div>

      </div>

      <!-- Copyright bar -->
      <div class="footer-bottom">
        Copyright \u00A9 2021 - Benito. All rights reserved.
      </div>
    </footer>`;
}
