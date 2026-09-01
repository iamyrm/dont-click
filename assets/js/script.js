(function () {
  // ---- set tomorrow's date ----
  function getTomorrowDate() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    return tomorrow;
  }

  function formatDate(date) {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  const dateDisplay = document.getElementById("dateDisplay");
  const tomorrowDate = getTomorrowDate();
  dateDisplay.textContent = formatDate(tomorrowDate);

  // ---- No button dodge ----
  const card = document.getElementById("inviteCard");
  const boxGroup = document.getElementById("boxGroup");
  const noBtn = document.getElementById("noBtn");
  const placeholder = document.querySelector(".no-placeholder");
  const yesItem = document.getElementById("yesItem");

  function placeNoAtStart() {
    const groupRect = boxGroup.getBoundingClientRect();
    const phRect = placeholder.getBoundingClientRect();
    noBtn.style.left = phRect.left - groupRect.left + "px";
    noBtn.style.top = phRect.top - groupRect.top + "px";
  }

  function dodgeNoButton() {
    const groupRect = boxGroup.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();

    const padding = 12;
    const minLeft = cardRect.left - groupRect.left + padding;
    const maxLeft = cardRect.right - groupRect.left - btnRect.width - padding;
    const minTop = cardRect.top - groupRect.top + padding;
    const maxTop = cardRect.bottom - groupRect.top - btnRect.height - padding;

    const randomLeft = minLeft + Math.random() * Math.max(0, maxLeft - minLeft);
    const randomTop = minTop + Math.random() * Math.max(0, maxTop - minTop);

    noBtn.style.left = randomLeft + "px";
    noBtn.style.top = randomTop + "px";
  }

  noBtn.addEventListener("pointerenter", (e) => {
    if (e.pointerType === "mouse") dodgeNoButton();
  });
  noBtn.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    dodgeNoButton();
  });
  noBtn.addEventListener(
    "touchstart",
    (e) => {
      e.preventDefault();
      dodgeNoButton();
    },
    { passive: false },
  );

  window.addEventListener("load", placeNoAtStart);
  window.addEventListener("resize", placeNoAtStart);

  // ---- Yes flow ----
  const popupScreen = document.getElementById("popupScreen");
  const stageYes = document.getElementById("stageYes");
  const stageCycle = document.getElementById("stageCycle");
  const closeBtn = document.getElementById("closeBtn");
  let cycleTimer = null;

  function spawnTrailHearts() {
    const road = document.getElementById("road");
    const hearts = ["💗", "💕", "✨"];
    for (let i = 0; i < 5; i++) {
      (function (i) {
        setTimeout(
          function () {
            const h = document.createElement("span");
            h.className = "trail-heart";
            h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            h.style.left = 8 + Math.random() * 20 + "%";
            road.appendChild(h);
            setTimeout(() => h.remove(), 1300);
          },
          1400 + i * 260,
        );
      })(i);
    }
  }

  function showCycleStage() {
    stageYes.classList.remove("active");
    stageCycle.classList.remove("active");
    void stageCycle.offsetWidth;
    stageCycle.classList.add("active");

    const cyclistImg = stageCycle.querySelector(".cyclist");
    cyclistImg.style.animation = "none";
    void cyclistImg.offsetWidth;
    cyclistImg.style.animation = "";

    setInterval(spawnTrailHearts, 1500);
  }

  function openPopup() {
    card.style.opacity = "0";
    card.style.transform = "translateY(-50%) scale(0.9)";

    stageYes.classList.add("active");
    stageCycle.classList.remove("active");
    popupScreen.classList.add("active");
    document.body.style.overflow = "hidden";

    confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
    setTimeout(
      () => confetti({ particleCount: 100, spread: 70, origin: { y: 0.7 } }),
      500,
    );
    setTimeout(
      () => confetti({ particleCount: 80, spread: 60, origin: { y: 0.8 } }),
      1100,
    );

    cycleTimer = setTimeout(showCycleStage, 4000);
  }

  function finalState() {
    // close popup
    popupScreen.classList.remove("active");
    document.body.style.overflow = "";
    if (cycleTimer) {
      clearTimeout(cycleTimer);
      cycleTimer = null;
    }

    // apply final state: hide everything except the final content
    document.body.classList.add("final-state");

    // blast a little confetti for fun
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.5 } });
  }

  // ---- final cat click: redirect ----
  document.getElementById("finalCat").addEventListener("click", function () {
    window.location.href = "https://iamyrm.github.io/dont-click/";
  });

  yesItem.addEventListener("click", openPopup);
  closeBtn.addEventListener("click", finalState);
})();
