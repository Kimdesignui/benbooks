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
        <div class="row align-items-center g-3">
          <!-- Logo -->
          <div class="col-auto">
            <a href="homepage.html" class="header-logo d-flex align-items-center text-decoration-none">
              <img src="assets/img/BenBooks Logo.svg" alt="BenBooks" class="header-logo-img">
            </a>
          </div>
          <!-- Search -->
          <div class="col">
            <div class="header-search input-group">
              <input type="text" class="form-control" placeholder="Nhập từ khoá tìm kiếm" id="searchInput">
              <button class="btn btn-search" type="button"><i class="bi bi-search"></i></button>
            </div>
          </div>
          <!-- Hotline -->
          <div class="col-auto d-none d-lg-block">
            <div class="header-hotline d-flex align-items-center gap-2">
              <i class="bi bi-telephone-fill text-brand"></i>
              <div>
                <div class="hotline-label">Hotline:</div>
                <div class="hotline-number">0382832993</div>
              </div>
            </div>
          </div>
          <!-- Gói Cước -->
          <div class="col-auto">
            <button class="btn btn-goi-cuoc"><i class="bi bi-gift-fill me-1"></i> Gói Cước</button>
          </div>
          <!-- Tài khoản / SĐT -->
          <div class="col-auto">
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
        <div class="row g-4">
          <div class="col-lg-3 col-md-6">
            <h6>Công ty cổ phần Văn hoá và Bản quyền Benito</h6>
            <p>(Hoạt động từ 8h - 17h, Thứ 2 - Thứ 7)</p>
            <p><i class="bi bi-geo-alt me-1"></i> 28D2 Khu giãn dân Yên Phúc, Hà Đông, Hà Nội</p>
            <p><i class="bi bi-telephone me-1"></i> Hotline: <strong>0888 080 290</strong></p>
            <p><i class="bi bi-envelope me-1"></i> Email: haianh.pham@benitovn.com</p>
            <p><i class="bi bi-card-text me-1"></i> Mã số thuế: 0109653575</p>
          </div>
          <div class="col-lg-2 col-md-6">
            <h6>Hỗ trợ khách hàng</h6>
            <p><a href="#">Hướng dẫn đọc sách ebook</a></p>
            <p><a href="#">Hướng dẫn thuê sách ebook</a></p>
            <p><a href="#">Hướng dẫn đăng ký tài khoản</a></p>
          </div>
          <div class="col-lg-2 col-md-6">
            <h6>Chính sách - điều khoản</h6>
            <p><a href="#">Chính sách bảo mật</a></p>
            <p><a href="#">Điều khoản sử dụng</a></p>
          </div>
          <div class="col-lg-2 col-md-6">
            <h6>Về chúng tôi</h6>
            <p><a href="#">Giới thiệu</a></p>
            <p><a href="#">Liên hệ</a></p>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="d-flex gap-3 mb-3">
              <div>
                <small class="d-block mb-1">Tải ứng dụng IOS:</small>
                <div class="d-flex align-items-center gap-2">
                  <div class="qr-placeholder"><small>QR</small></div>
                  <div style="background:#000;color:#fff;padding:6px 12px;border-radius:6px;font-size:11px;"><i class="bi bi-apple"></i> App Store</div>
                </div>
              </div>
              <div>
                <small class="d-block mb-1">Tải ứng dụng Android:</small>
                <div class="d-flex align-items-center gap-2">
                  <div class="qr-placeholder"><small>QR</small></div>
                  <div style="background:#000;color:#fff;padding:6px 12px;border-radius:6px;font-size:11px;"><i class="bi bi-google-play"></i> Google Play</div>
                </div>
              </div>
            </div>
            <div class="d-flex align-items-center gap-2">
              <div style="background:#fff;color:#1a73e8;padding:6px 10px;border-radius:6px;font-size:11px;font-weight:600;">
                <i class="bi bi-patch-check-fill"></i> ĐÃ THÔNG BÁO<br><small>BỘ CÔNG THƯƠNG</small>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        Copyright © 2021 - Benito. All rights reserved.
      </div>
    </footer>`;
}
