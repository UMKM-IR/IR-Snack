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


  /* Formulir kontak: kirim tanpa pindah halaman + cadangan WhatsApp */
  var form = document.getElementById("contact-form");
  if (form) {
    var status = document.getElementById("form-status");
    var btn = document.getElementById("submit-btn");
    var waBtn = document.getElementById("wa-btn");

    function show(msg, ok) {
      status.hidden = false;
      status.textContent = msg;
      status.className = "form-status " + (ok ? "ok" : "err");
    }

    function openWA() {
      var f = form.elements;
      var text = "Halo IR Snack,\n\nNama: " + f.name.value +
        "\nEmail: " + f.email.value +
        "\nSubjek: " + f.subject.value +
        "\n\n" + f.message.value;
      window.open("https://wa.me/" + form.getAttribute("data-wa") + "?text=" + encodeURIComponent(text), "_blank", "noopener");
    }

    if (waBtn) {
      waBtn.addEventListener("click", function () {
        if (!form.reportValidity()) return;
        openWA();
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      if (form.elements._honey && form.elements._honey.value) return;

      var original = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Mengirim...";
      status.hidden = true;

      var url = form.action.replace("formsubmit.co/", "formsubmit.co/ajax/");
      fetch(url, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form)
      })
        .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
        .then(function (res) {
          if (res.ok && String(res.d.success) === "true") {
            show("Terima kasih! Pesan Anda sudah terkirim. Tim kami akan segera menghubungi Anda.", true);
            form.reset();
          } else {
            throw new Error(res.d && res.d.message);
          }
        })
        .catch(function () {
          show("Pesan belum bisa terkirim. Silakan coba lagi atau gunakan tombol \"Kirim via WhatsApp\".", false);
        })
        .then(function () {
          btn.disabled = false;
          btn.textContent = original;
        });
    });
  }

  /* Animasi muncul saat scroll */
  window.addEventListener("load", function () {
    if (window.AOS) {
      AOS.init({ duration: 700, easing: "ease-out-cubic", once: true, offset: 60 });
    }
  });
})();
