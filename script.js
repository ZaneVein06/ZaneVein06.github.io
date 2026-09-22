

(function () {
  "use strict";

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }


  function fadeInPage() {
    window.requestAnimationFrame(function () {
      document.body.classList.add("loaded");
    });
  }

  function animateWords(selector, baseDelay) {
    var el = document.querySelector(selector);
    if (!el) return;
    var text = el.textContent;
    var words = text.trim().split(/\s+/);
    el.textContent = "";
    words.forEach(function (word, i) {
      var span = document.createElement("span");
      span.className = "word";
      span.style.animationDelay = (baseDelay || 0) + i * 0.09 + "s";
      span.textContent = word + (i < words.length - 1 ? "\u00A0" : "");
      el.appendChild(span);
    });
  }

  function createFloaters(containerId, opts) {
    var container = document.getElementById(containerId);
    if (!container) return;
    opts = opts || {};
    var count = opts.count || 18;
    var behavior = opts.behavior || "rise";
    var sizeMin = opts.sizeMin || 3;
    var sizeMax = opts.sizeMax || 7;
    var durMin = opts.durMin || 5;
    var durMax = opts.durMax || 11;

    for (var i = 0; i < count; i++) {
      var p = document.createElement("div");
      p.className = "particle particle--" + behavior + (opts.extraClass ? " " + opts.extraClass : "");
      var size = rand(sizeMin, sizeMax);
      p.style.width = size + "px";
      p.style.height = size + "px";
      p.style.left = rand(0, 100) + "%";
      p.style.top = behavior === "rise" ? rand(40, 95) + "%" : rand(5, 95) + "%";
      p.style.setProperty("--drift-x", rand(-40, 40) + "px");
      p.style.animationDuration = rand(durMin, durMax) + "s";
      p.style.animationDelay = rand(0, durMax) + "s";
      container.appendChild(p);
    }
  }


  function startPetals(containerId, opts) {
    var container = document.getElementById(containerId);
    if (!container) return;
    opts = opts || {};
    var maxOnScreen = opts.max || 14;
    var spawnMs = opts.spawnMs || 900;
    var durMin = opts.durMin || 6;
    var durMax = opts.durMax || 11;
    var active = 0;

    function spawn() {
      if (active >= maxOnScreen) return;
      active++;
      var petal = document.createElement("div");
      petal.className = "petal";
      var size = rand(10, 18);
      petal.style.width = size + "px";
      petal.style.height = size * 1.3 + "px";
      petal.style.left = rand(0, 100) + "%";
      petal.style.setProperty("--sway", rand(-60, 60) + "px");
      var dur = rand(durMin, durMax);
      petal.style.animationDuration = dur + "s";
      container.appendChild(petal);
      petal.addEventListener("animationend", function () {
        petal.remove();
        active--;
      });
    }

    for (var i = 0; i < 6; i++) {
      setTimeout(spawn, i * 300);
    }
    setInterval(spawn, spawnMs);
  }


  function startButterflies(containerId, opts) {
    var container = document.getElementById(containerId);
    if (!container) return;
    opts = opts || {};
    var emojis = opts.emojis || ["\uD83E\uDD8B"];
    var count = opts.count || 3;
    for (var i = 0; i < count; i++) {
      var b = document.createElement("div");
      b.className = "butterfly";
      b.textContent = emojis[i % emojis.length];
      b.style.top = rand(10, 70) + "%";
      b.style.animationDuration = rand(9, 15) + "s";
      b.style.animationDelay = rand(0, 10) + "s";
      container.appendChild(b);
    }
  }


  function startFairies(containerId, opts) {
    var container = document.getElementById(containerId);
    if (!container) return;
    opts = opts || {};
    var emojis = opts.emojis || ["\uD83E\uDDDA"];
    var count = opts.count || 2;
    for (var i = 0; i < count; i++) {
      var f = document.createElement("div");
      f.className = "fairy";
      f.textContent = emojis[i % emojis.length];
      f.style.top = rand(8, 65) + "%";
      f.style.animationDuration = rand(11, 17) + "s";
      f.style.animationDelay = (i === 0 ? rand(0, 1.5) : rand(2, 9)) + "s";
      container.appendChild(f);
    }
  }

   
  function startSparkles(containerId, opts) {
    var container = document.getElementById(containerId);
    if (!container) return;
    opts = opts || {};
    var emojis = opts.emojis || ["\u2728", "\uD83C\uDF1F"];
    var count = opts.count || 14;
    for (var i = 0; i < count; i++) {
      var s = document.createElement("div");
      s.className = "sparkle";
      s.textContent = emojis[i % emojis.length];
      s.style.left = rand(0, 100) + "%";
      s.style.top = rand(0, 100) + "%";
      s.style.animationDuration = rand(2.5, 5) + "s";
      s.style.animationDelay = rand(0, 3) + "s";
      container.appendChild(s);
    }
  }


  function setupReveal(btnId, boxId, opts) {
    var btn = document.getElementById(btnId);
    var box = document.getElementById(boxId);
    if (!btn || !box) return;
    opts = opts || {};
    var opened = false;

    btn.addEventListener("click", function () {
      if (opened) return;
      opened = true;

      if (btn.classList.contains("seal-btn")) {
        btn.classList.add("cracked");
        setTimeout(function () {
          btn.style.display = "none";
        }, 550);
      } else {
        btn.classList.add("is-hidden");
      }

      box.removeAttribute("hidden");
      void box.offsetHeight;
      box.classList.add("revealed");
      box.setAttribute("aria-hidden", "false");

      box.scrollIntoView({ behavior: "smooth", block: "center" });

      if (typeof opts.onOpen === "function") opts.onOpen();
    });
  }

  function setupAudioPlayer(playBtnId, audioId) {
    var btn = document.getElementById(playBtnId);
    var audio = document.getElementById(audioId);
    if (!btn || !audio) return;

    var trackInfo = btn.parentElement ? btn.parentElement.querySelector(".track-info") : null;
    var originalTitle = trackInfo ? trackInfo.querySelector(".track-title") : null;
    var originalTitleText = originalTitle ? originalTitle.textContent : "";
    var loading = false;

    function showMessage(text) {
      btn.setAttribute("title", text);
      if (originalTitle) originalTitle.textContent = text;
    }

    function restoreMessage() {
      if (originalTitle) originalTitle.textContent = originalTitleText;
    }

    audio.addEventListener("error", function () {
      loading = false;
      btn.disabled = false;
      btn.classList.remove("is-loading");
      var code = audio.error ? audio.error.code : null;
      var codeText = { 1: "abortado", 2: "error de red", 3: "no se pudo decodificar", 4: "formato/ruta no soportada" }[code] || "desconocido";
      console.error("Audio: no se pudo cargar (" + codeText + ", código " + code + "). src activo:", audio.currentSrc);
      showMessage("No se pudo cargar el audio (" + codeText + ")");
    });

    audio.addEventListener("stalled", function () {
      showMessage("Cargando audio lento, espera un momento...");
    });

    audio.addEventListener("playing", function () {
      restoreMessage();
    });

    audio.addEventListener("ended", function () {
      btn.textContent = "\u25B6";
      btn.classList.remove("is-playing");
      btn.setAttribute("aria-label", "Reproducir música");
    });

    btn.addEventListener("click", function () {
      console.log("Audio: click detectado. paused =", audio.paused, "readyState =", audio.readyState);
      if (loading) return;

      if (audio.paused) {
        loading = true;
        btn.classList.add("is-loading");

        if (audio.readyState === 0) {
          audio.load();
        }

        var playPromise = audio.play();
        if (playPromise && typeof playPromise.then === "function") {
          playPromise
            .then(function () {
              loading = false;
              btn.classList.remove("is-loading");
              btn.textContent = "\u23F8";
              btn.classList.add("is-playing");
              btn.setAttribute("aria-label", "Pausar música");
            })
            .catch(function (err) {
              loading = false;
              btn.classList.remove("is-loading");
              console.error("Audio: play() rechazado:", err && err.name, err && err.message);
              showMessage("No se pudo reproducir el audio");
            });
        } else {
          loading = false;
          btn.classList.remove("is-loading");
          btn.textContent = "\u23F8";
          btn.classList.add("is-playing");
        }
      } else {
        audio.pause();
        btn.textContent = "\u25B6";
        btn.classList.remove("is-playing");
        btn.setAttribute("aria-label", "Reproducir música");
      }
    });
  }


  window.GiftExperience = {
    fadeInPage: fadeInPage,
    animateWords: animateWords,
    createFloaters: createFloaters,
    startPetals: startPetals,
    startButterflies: startButterflies,
    startFairies: startFairies,
    startSparkles: startSparkles,
    setupReveal: setupReveal,
    setupAudioPlayer: setupAudioPlayer,
  };

  document.addEventListener("DOMContentLoaded", fadeInPage);
})();
