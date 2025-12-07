const fadeElems = document.querySelectorAll(".fade-in");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.1 }
);

fadeElems.forEach((el) => observer.observe(el));

document.querySelectorAll(".accordion-button").forEach((button) => {
  button.addEventListener("click", () => {
    const content = button.nextElementSibling;
    const arrow = button.querySelector(".accordion-arrow");
    content.classList.toggle("open");
    arrow.classList.toggle("open");
  });
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

function submitDestination() {
  const place = document.getElementById("destination").value;
  const btn = document.querySelector(".submit-btn");
  const btnText = btn.querySelector(".btn-text");
  const successMsg = document.getElementById("successMessage");

  if (!place.trim()) {
    alert("旅先を入力してください！");
    return;
  }

  btnText.textContent = "送信中...";
  btn.disabled = true;

  fetch(
    "https://script.google.com/macros/s/AKfycbwfWtaFVzUhNU006rhCmnT1lLGggio0tTtfeLnHlKRF__ztkRHz7bJ3gOT-HNWPrSF5/exec",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "destination=" + encodeURIComponent(place),
    }
  )
    .then((res) => res.text())
    .then((text) => {
      successMsg.textContent = "✓ 送信完了！ご意見ありがとうございます。";
      successMsg.style.display = "block";
      document.getElementById("destination").value = "";

      setTimeout(() => {
        successMsg.style.display = "none";
      }, 3000);
    })
    .catch((err) => {
      console.error("送信エラー:", err);
      alert("通信エラーが発生しました。もう一度お試しください。");
    })
    .finally(() => {
      btnText.textContent = "送信する";
      btn.disabled = false;
    });
}

function submitFeedback() {
  const feedback = document.getElementById("feedback").value;
  const btn = document.querySelectorAll(".submit-btn")[1];
  const btnText = btn.querySelector(".btn-text-feedback");
  const successMsg = document.getElementById("feedbackSuccess");

  if (!feedback.trim()) {
    alert("感想または質問を入力してください！");
    return;
  }

  btnText.textContent = "送信中...";
  btn.disabled = true;

  setTimeout(() => {
    successMsg.textContent = "✓ 送信完了！ご意見ありがとうございます。";
    successMsg.style.display = "block";
    document.getElementById("feedback").value = "";

    setTimeout(() => {
      successMsg.style.display = "none";
    }, 3000);

    btnText.textContent = "送信する";
    btn.disabled = false;
  }, 1000);
}

document
  .querySelectorAll('.checklist-item input[type="checkbox"]')
  .forEach((checkbox) => {
    const id = checkbox.id;
    const saved = localStorage.getItem(id);
    if (saved === "true") {
      checkbox.checked = true;
    }

    checkbox.addEventListener("change", () => {
      localStorage.setItem(id, checkbox.checked);
    });
  });

function checkPassword() {
  const input = document.getElementById("passwordInput").value;

  fetch("https://passhash-auth.onrender.com/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password: input }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.result === "success") {
        document.getElementById("room-auth").style.display = "none";
        document.getElementById("room-table").style.display = "block";
      } else {
        alert("パスワードが違います");
      }
    })
    .catch((err) => {
      console.error("認証エラー:", err);
      alert("通信エラーが発生しました。時間をおいて再度お試しください。");
    });
}
document
  .getElementById("destination")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      submitDestination();
    }
  });

const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

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
  if (e.key === "Escape") {
    navMenu.classList.remove("open");
  }
});

document.querySelectorAll(".nav-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
  });
});
