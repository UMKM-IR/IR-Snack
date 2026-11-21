/* IR Snack - script utama */
(function () {
  "use strict";

  var body = document.body;
  var header = document.getElementById("header");

  /* Bayangan header saat halaman di-scroll */
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle("scrolled", y > 8);
    var top = document.getElementById("scroll-top");
    if (top) top.classList.toggle("show", y > 400);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("load", onScroll);

  /* Menu mobile */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("mainNav");

  function setNav(open) {
    body.classList.toggle("nav-open", open);
    if (!toggle) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
    var icon = toggle.querySelector("i");
    if (icon) {
      icon.classList.toggle("bi-list", !open);
      icon.classList.toggle("bi-x-lg", open);
    }
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setNav(!body.classList.contains("nav-open"));
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setNav(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setNav(false);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 992) setNav(false);
    });
  }

  /* Tombol kembali ke atas */
  var topBtn = document.getElementById("scroll-top");
  if (topBtn) {
    topBtn.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* Filter produk (halaman Produk) */
  var filterBtns = document.querySelectorAll(".filter-btn");
  var items = document.querySelectorAll(".produk-item");

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var f = btn.getAttribute("data-filter");
      filterBtns.forEach(function (b) {
        b.classList.toggle("active", b === btn);
        b.setAttribute("aria-pressed", String(b === btn));
      });
      items.forEach(function (it) {
        var show =
          f === "all" ||
          it.getAttribute("data-cat") === f ||
          (f === "pedas" && it.getAttribute("data-pedas") === "1");
        it.hidden = !show;
      });
    });
  });

  /* Pilih kategori dari tautan (mis. produk.html#jamur) */
  if (filterBtns.length && location.hash) {
    var target = document.querySelector('.filter-btn[data-filter="' + location.hash.slice(1) + '"]');
    if (target) target.click();
  }

  /* Hitung lama berdiri secara otomatis */
  document.querySelectorAll("[data-years-since]").forEach(function (el) {
    var since = parseInt(el.getAttribute("data-years-since"), 10);
    if (since) el.textContent = String(new Date().getFullYear() - since);
  });

  /* Tahun di footer */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = String(new Date().getFullYear());

  /* Animasi muncul saat scroll */
  window.addEventListener("load", function () {
    if (window.AOS) {
      AOS.init({ duration: 700, easing: "ease-out-cubic", once: true, offset: 60 });
    }
  });
})();
