// currentPage 判定
const currentPage = location.pathname.split("/").pop();
console.info("currentPage=", currentPage);

// フェードインアニメーション
const fadeElems = document.querySelectorAll(".fade-in");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
});
fadeElems.forEach((el) => observer.observe(el));


// -----------------------------------------------------
// ❗ アコーディオンは存在する場合のみ動かす
// -----------------------------------------------------
document.querySelectorAll(".accordion-button").forEach((button) => {
  button.addEventListener("click", () => {
    const content = button.nextElementSibling;
    const arrow = button.querySelector(".accordion-arrow");
    if (content) content.classList.toggle("open");
    if (arrow) arrow.classList.toggle("open");
  });
});


// スムーススクロール
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});


// -----------------------------------------------------
// ❗ frontdoor と room だけでセッションチェック
// -----------------------------------------------------
if (currentPage === "room.html" || currentPage === "frontdoor.html") {
  window.addEventListener("DOMContentLoaded", () => {
    fetch("https://passhash-auth.onrender.com/ping").catch(() => {});
    fetch("https://session-auth-gj7i.onrender.com/ping").catch(() => {});

    fetch("https://session-auth-gj7i.onrender.com/session-check", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated === true) {
          window.location.href = "room.html";
        }
      })
      .catch(() => {});
  });
}


// -----------------------------------------------------
// ❗ submitDestination（フォームがあるページでのみ）
// -----------------------------------------------------
function submitDestination() {
  const place = document.getElementById("destination");
  const btn = document.querySelector(".submit-btn");
  const successMsg = document.getElementById("successMessage");

  if (!place || !btn || !successMsg) return;  // ← 安全対策

  const value = place.value;

  if (!value.trim()) {
    alert("旅先を入力してください！");
    return;
  }

  const btnText = btn.querySelector(".btn-text");
  if (btnText) btnText.textContent = "送信中...";
  btn.disabled = true;

  fetch("https://script.google.com/.../exec", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "destination=" + encodeURIComponent(value),
  })
    .then((res) => res.text())
    .then(() => {
      successMsg.textContent = "✓ 送信完了！ご意見ありがとうございます。";
      successMsg.style.display = "block";
      place.value = "";
      setTimeout(() => (successMsg.style.display = "none"), 3000);
    })
    .finally(() => {
      if (btnText) btnText.textContent = "送信する";
      btn.disabled = false;
    });
}


// -----------------------------------------------------
// passwordInput があるときだけイベント追加
// -----------------------------------------------------
const pwInput = document.getElementById("passwordInput");
if (pwInput) {
  pwInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") checkPassword();
  });
}


// -----------------------------------------------------
// ハンバーガーメニュー（要素があるときだけ）
// -----------------------------------------------------
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

if (hamburger && navMenu) {
  hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    navMenu.classList.toggle("open");
  });

  document.addEventListener("click", (e) => {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
      navMenu.classList.remove("open");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") navMenu.classList.remove("open");
  });

  document.querySelectorAll(".nav-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
    });
  });
}
