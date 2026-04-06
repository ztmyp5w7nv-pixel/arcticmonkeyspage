const tracks = [
  {
    file: "sarkı1.mp3",
    title: "505",
    album: "Favourite Worst Nightmare",
    atmosphere: "Gece sürüşü",
    description: "Uzakta kalan birine döner gibi başlayan, duygusu giderek büyüyen kapanış etkisi."
  },
  {
    file: "sarkı2.mp3",
    title: "Do I Wanna Know?",
    album: "AM",
    atmosphere: "Düşük ışık",
    description: "Ağır riff, düşük tempo ve iç konuşma hissiyle modern gece klasiği."
  },
  {
    file: "sarkı3.mp3",
    title: "I Wanna Be Yours",
    album: "AM",
    atmosphere: "Kadife yakınlık",
    description: "Minimal ama etkileyici yürüyüşüyle romantik ve karizmatik bir geç saat parçası."
  },
  {
    file: "sarkı4.mp3",
    title: "Arabella",
    album: "AM",
    atmosphere: "Galaktik karizma",
    description: "Sertliği ve stil sahibi tavrıyla sahne ışığını anında yükselten güçlü seçim."
  },
  {
    file: "sarkı5.mp3",
    title: "R U Mine?",
    album: "AM",
    atmosphere: "Yüksek nabız",
    description: "Daha keskin, daha hızlı ve doğrudan; kalabalığı ayağa kaldıran enerji."
  },
  {
    file: "sarkı6.mp3",
    title: "Snap Out of It",
    album: "AM",
    atmosphere: "Parlak ama karanlık",
    description: "Dans ettiren ritmiyle daha hafif görünen ama hâlâ geceye ait olan kıvrak bir parça."
  },
  {
    file: "sarkı7.mp3",
    title: "Fluorescent Adolescent",
    album: "Favourite Worst Nightmare",
    atmosphere: "Nostaljik telaş",
    description: "Gençliğin parlaklığını hafif buruk bir tatla birleştiren hızlı klasik."
  },
  {
    file: "sarkı8.mp3",
    title: "Why’d You Only Call Me When You’re High?",
    album: "AM",
    atmosphere: "Saat çok geç",
    description: "Mesajlar, belirsizlik ve şehir sonrası boşluk hissiyle tam bir gece yarısı kaydı."
  },
  {
    file: "sarkı9.mp3",
    title: "Brianstorm",
    album: "Favourite Worst Nightmare",
    atmosphere: "Patlayıcı açılış",
    description: "Keskin davullar ve ani yükselişlerle kontrolsüz enerjiye göz kırpan sert karakter."
  },
  {
    file: "sarkı10.mp3",
    title: "Teddy Picker",
    album: "Favourite Worst Nightmare",
    atmosphere: "Sivri zekâ",
    description: "Alaycı tonu ve dinamik yapısıyla grubun hızlı, canlı ve sarsıcı tarafını taşır."
  }
];

document.addEventListener("DOMContentLoaded", () => {
  const audio = new Audio();
  audio.preload = "metadata";
  audio.volume = 0.72;

  const state = {
    currentIndex: 0,
    isPlaying: false,
    isShuffle: false,
    repeatMode: "all",
    history: [],
    hasAutoplayAttempted: false
  };

  const repeatLabels = {
    all: "Liste",
    one: "Tek",
    off: "Kapalı"
  };

  const elements = {
    radioBar: document.querySelector(".radio-bar"),
    playButton: document.querySelector('[data-control="play"]'),
    prevButton: document.querySelector('[data-control="prev"]'),
    nextButton: document.querySelector('[data-control="next"]'),
    shuffleButton: document.querySelector('[data-control="shuffle"]'),
    repeatButton: document.querySelector('[data-control="repeat"]'),
    repeatBadge: document.getElementById("repeatBadge"),
    progressBar: document.getElementById("progressBar"),
    volumeBar: document.getElementById("volumeBar"),
    trackTitle: document.getElementById("trackTitle"),
    trackMeta: document.getElementById("trackMeta"),
    trackCounter: document.getElementById("trackCounter"),
    playbackStatus: document.getElementById("playbackStatus"),
    currentTime: document.getElementById("currentTime"),
    totalTime: document.getElementById("totalTime"),
    statusNote: document.getElementById("statusNote"),
    assistiveStatus: document.getElementById("assistiveStatus"),
    songGrid: document.getElementById("songGrid"),
    heroPlayButton: document.querySelector('[data-player-action="play"]'),
    menuToggle: document.querySelector(".menu-toggle"),
    siteNav: document.getElementById("siteNav"),
    radioRoot: document.getElementById("radyo"),
    siteHeader: document.querySelector(".site-header"),
    lightbox: document.getElementById("lightbox"),
    lightboxImage: document.getElementById("lightboxImage"),
    lightboxCaption: document.getElementById("lightboxCaption"),
    lightboxClose: document.querySelector(".lightbox-close")
  };

  function formatTime(value) {
    if (!Number.isFinite(value) || value < 0) {
      return "0:00";
    }

    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60)
      .toString()
      .padStart(2, "0");

    return `${minutes}:${seconds}`;
  }

  function setStatus(message) {
    elements.statusNote.textContent = message;
    elements.assistiveStatus.textContent = message;
  }

  function paintRange(rangeElement, valueAsPercent) {
    rangeElement.style.setProperty("--fill", `${valueAsPercent}%`);
  }

  function getTrack(index) {
    return tracks[index];
  }

  function renderSongCards() {
    const markup = tracks
      .map((track, index) => {
        const order = String(index + 1).padStart(2, "0");

        return `
          <article class="song-card" data-track-index="${index}" data-order="${order}" data-reveal>
            <div class="song-card__topline">
              <span class="song-card__tag">${track.album}</span>
              <span class="song-card__meta">${track.atmosphere}</span>
            </div>
            <div class="song-card__copy">
              <h3>${track.title}</h3>
              <p>${track.description}</p>
            </div>
            <div class="song-card__footer">
              <button class="song-card__button" type="button" data-play-track="${index}">
                Bu parçayı çal
              </button>
            </div>
          </article>
        `;
      })
      .join("");

    elements.songGrid.innerHTML = markup;
  }

  function updateLayoutOffsets() {
    const root = document.documentElement;
    const radioRect = elements.radioRoot.getBoundingClientRect();
    const headerRect = elements.siteHeader.getBoundingClientRect();

    root.style.setProperty("--radio-height", `${Math.ceil(radioRect.height)}px`);
    root.style.setProperty("--header-top", `${Math.ceil(radioRect.bottom + 12)}px`);
    root.style.setProperty("--content-offset", `${Math.ceil(headerRect.bottom + 18)}px`);
  }

  function updateModeButtons() {
    elements.shuffleButton.classList.toggle("is-active", state.isShuffle);
    elements.shuffleButton.setAttribute("aria-pressed", String(state.isShuffle));
    elements.repeatButton.classList.toggle("is-active", state.repeatMode !== "off");
    elements.repeatButton.setAttribute("aria-pressed", String(state.repeatMode !== "off"));
    elements.repeatBadge.textContent = repeatLabels[state.repeatMode];
  }

  function updateTrackUI() {
    const track = getTrack(state.currentIndex);

    elements.trackTitle.textContent = track.title;
    elements.trackMeta.textContent = `${track.album} • ${track.atmosphere}`;
    elements.trackCounter.textContent = `${String(state.currentIndex + 1).padStart(2, "0")} / ${String(
      tracks.length
    ).padStart(2, "0")}`;

    document.querySelectorAll(".song-card").forEach((card) => {
      const isActive = Number(card.dataset.trackIndex) === state.currentIndex;
      card.classList.toggle("is-active", isActive);
    });
  }

  function updatePlaybackUI() {
    elements.radioBar.classList.toggle("is-playing", state.isPlaying);
    elements.playButton.setAttribute("aria-label", state.isPlaying ? "Duraklat" : "Oynat");
    elements.playbackStatus.textContent = state.isPlaying ? "Şimdi çalıyor" : "Duraklatıldı";
  }

  function updateProgressUI() {
    elements.currentTime.textContent = formatTime(audio.currentTime);
    elements.totalTime.textContent = formatTime(audio.duration);

    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      const progress = Math.round((audio.currentTime / audio.duration) * 1000);
      elements.progressBar.value = String(progress);
      paintRange(elements.progressBar, progress / 10);
    } else {
      elements.progressBar.value = "0";
      paintRange(elements.progressBar, 0);
    }
  }

  function loadTrack(index, options = {}) {
    const normalizedIndex = ((index % tracks.length) + tracks.length) % tracks.length;
    const track = getTrack(normalizedIndex);

    state.currentIndex = normalizedIndex;
    audio.src = encodeURI(track.file);
    audio.load();

    elements.progressBar.value = "0";
    elements.currentTime.textContent = "0:00";
    elements.totalTime.textContent = "0:00";
    paintRange(elements.progressBar, 0);

    updateTrackUI();

    if (options.autoplay) {
      attemptPlay(true);
    } else {
      updatePlaybackUI();
      setStatus(`${track.title} hazır. Çalmak için oynat düğmesine basabilirsin.`);
    }
  }

  function handleAudioError() {
    state.isPlaying = false;
    updatePlaybackUI();

    const track = getTrack(state.currentIndex);
    setStatus(
      `${track.file} yüklenemedi. MP3 dosyasını proje klasörüne eklediğinde bu parça oynatılacaktır.`
    );
  }

  function attemptPlay(userInitiated = false) {
    const track = getTrack(state.currentIndex);
    const playPromise = audio.play();

    if (!playPromise || typeof playPromise.then !== "function") {
      state.isPlaying = true;
      updatePlaybackUI();
      setStatus(`${track.title} çalıyor.`);
      return;
    }

    playPromise
      .then(() => {
        state.isPlaying = true;
        updatePlaybackUI();
        setStatus(`${track.title} çalıyor.`);
      })
      .catch(() => {
        state.isPlaying = false;
        updatePlaybackUI();

        if (userInitiated) {
          setStatus(`${track.title} başlatılamadı. Dosyanın varlığını ve tarayıcı izinlerini kontrol et.`);
        } else {
          setStatus("Tarayıcı otomatik oynatmayı engelledi. Oynat düğmesiyle yayını başlatabilirsin.");
        }
      });
  }

  function playTrack(index) {
    if (index !== state.currentIndex) {
      state.history.push(state.currentIndex);
    }

    loadTrack(index, { autoplay: true });
  }

  function getRandomIndex() {
    if (tracks.length === 1) {
      return 0;
    }

    let nextIndex = state.currentIndex;

    while (nextIndex === state.currentIndex) {
      nextIndex = Math.floor(Math.random() * tracks.length);
    }

    return nextIndex;
  }

  function nextTrack(fromEnded = false) {
    if (fromEnded && state.repeatMode === "one") {
      audio.currentTime = 0;
      attemptPlay(true);
      return;
    }

    if (!fromEnded) {
      state.history.push(state.currentIndex);
    }

    if (state.isShuffle) {
      loadTrack(getRandomIndex(), { autoplay: state.isPlaying || fromEnded });
      return;
    }

    const isLastTrack = state.currentIndex === tracks.length - 1;

    if (isLastTrack) {
      if (state.repeatMode === "off" && fromEnded) {
        state.isPlaying = false;
        updatePlaybackUI();
        setStatus("Liste sonuna gelindi.");
        audio.currentTime = 0;
        updateProgressUI();
        return;
      }

      loadTrack(0, { autoplay: state.isPlaying || fromEnded });
      return;
    }

    loadTrack(state.currentIndex + 1, { autoplay: state.isPlaying || fromEnded });
  }

  function previousTrack() {
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      updateProgressUI();
      return;
    }

    if (state.isShuffle && state.history.length > 0) {
      const previousIndex = state.history.pop();
      loadTrack(previousIndex, { autoplay: state.isPlaying });
      return;
    }

    loadTrack(state.currentIndex - 1, { autoplay: state.isPlaying });
  }

  function togglePlay() {
    if (state.isPlaying) {
      audio.pause();
      return;
    }

    attemptPlay(true);
  }

  function bindPlayerEvents() {
    elements.playButton.addEventListener("click", togglePlay);
    elements.prevButton.addEventListener("click", previousTrack);
    elements.nextButton.addEventListener("click", () => nextTrack(false));

    elements.shuffleButton.addEventListener("click", () => {
      state.isShuffle = !state.isShuffle;
      updateModeButtons();
      setStatus(state.isShuffle ? "Karışık çalma açık." : "Karışık çalma kapalı.");
    });

    elements.repeatButton.addEventListener("click", () => {
      const modes = ["all", "one", "off"];
      const currentModeIndex = modes.indexOf(state.repeatMode);
      state.repeatMode = modes[(currentModeIndex + 1) % modes.length];
      updateModeButtons();
      setStatus(`Tekrar modu: ${repeatLabels[state.repeatMode]}.`);
    });

    elements.progressBar.addEventListener("input", (event) => {
      if (!Number.isFinite(audio.duration) || audio.duration <= 0) {
        return;
      }

      const nextTime = (Number(event.target.value) / 1000) * audio.duration;
      audio.currentTime = nextTime;
      updateProgressUI();
    });

    elements.volumeBar.addEventListener("input", (event) => {
      audio.volume = Number(event.target.value) / 100;
      paintRange(elements.volumeBar, Number(event.target.value));
      setStatus(`Ses seviyesi %${Math.round(audio.volume * 100)} olarak ayarlandı.`);
    });

    elements.songGrid.addEventListener("click", (event) => {
      const playTrigger = event.target.closest("[data-play-track]");

      if (!playTrigger) {
        return;
      }

      const index = Number(playTrigger.dataset.playTrack);
      playTrack(index);
    });

    if (elements.heroPlayButton) {
      elements.heroPlayButton.addEventListener("click", () => {
        attemptPlay(true);
      });
    }

    audio.addEventListener("timeupdate", updateProgressUI);
    audio.addEventListener("loadedmetadata", updateProgressUI);
    audio.addEventListener("play", () => {
      state.isPlaying = true;
      updatePlaybackUI();
    });
    audio.addEventListener("pause", () => {
      state.isPlaying = false;
      updatePlaybackUI();

      if (!audio.ended) {
        setStatus("Yayın duraklatıldı.");
      }
    });
    audio.addEventListener("ended", () => nextTrack(true));
    audio.addEventListener("error", handleAudioError);
  }

  function bindNavigation() {
    if (!elements.menuToggle || !elements.siteNav) {
      return;
    }

    elements.menuToggle.addEventListener("click", () => {
      const isOpen = elements.menuToggle.getAttribute("aria-expanded") === "true";
      elements.menuToggle.setAttribute("aria-expanded", String(!isOpen));
      elements.siteNav.classList.toggle("is-open", !isOpen);
    });

    elements.siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        elements.menuToggle.setAttribute("aria-expanded", "false");
        elements.siteNav.classList.remove("is-open");
      });
    });
  }

  function bindRevealObserver() {
    const revealElements = document.querySelectorAll("[data-reveal]");

    if (!("IntersectionObserver" in window)) {
      revealElements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -6% 0px" }
    );

    revealElements.forEach((element) => observer.observe(element));
  }

  function bindLightbox() {
    if (!elements.lightbox || !elements.lightboxImage || !elements.lightboxCaption) {
      return;
    }

    document.querySelectorAll(".gallery-button").forEach((button) => {
      button.addEventListener("click", () => {
        const src = button.dataset.lightboxSrc;
        const alt = button.dataset.lightboxAlt || "";

        if (!src || typeof elements.lightbox.showModal !== "function") {
          return;
        }

        elements.lightboxImage.src = src;
        elements.lightboxImage.alt = alt;
        elements.lightboxCaption.textContent = alt;
        elements.lightbox.showModal();
      });
    });

    elements.lightboxClose.addEventListener("click", () => {
      elements.lightbox.close();
    });

    elements.lightbox.addEventListener("click", (event) => {
      const dialogDimensions = elements.lightbox.getBoundingClientRect();
      const clickedInsideDialog =
        event.clientX >= dialogDimensions.left &&
        event.clientX <= dialogDimensions.right &&
        event.clientY >= dialogDimensions.top &&
        event.clientY <= dialogDimensions.bottom;

      if (!clickedInsideDialog) {
        elements.lightbox.close();
      }
    });
  }

  function bindImageFallbacks() {
    document.querySelectorAll("img").forEach((image) => {
      image.addEventListener("error", () => {
        const fallbackContainer = image.closest(".gallery-card, .hero-media, .member-media");

        if (fallbackContainer) {
          fallbackContainer.classList.add("is-fallback");
        }
      });
    });
  }

  function attemptAutoplay() {
    if (state.hasAutoplayAttempted) {
      return;
    }

    state.hasAutoplayAttempted = true;
    attemptPlay(false);
  }

  renderSongCards();
  bindPlayerEvents();
  bindNavigation();
  bindRevealObserver();
  bindLightbox();
  bindImageFallbacks();
  updateModeButtons();
  updateTrackUI();
  updatePlaybackUI();
  loadTrack(0);
  updateLayoutOffsets();
  paintRange(elements.volumeBar, Number(elements.volumeBar.value));

  window.addEventListener("resize", updateLayoutOffsets);

  if ("ResizeObserver" in window) {
    const resizeObserver = new ResizeObserver(() => updateLayoutOffsets());
    resizeObserver.observe(elements.radioRoot);
    resizeObserver.observe(elements.siteHeader);
  }

  window.requestAnimationFrame(() => {
    document.body.classList.add("is-ready");
    updateLayoutOffsets();
  });

  window.setTimeout(attemptAutoplay, 700);
});
