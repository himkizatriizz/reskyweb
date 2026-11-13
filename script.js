(() => {
  const faultData = {
    normal: {
      title: "Patahan Normal",
      desc: "Blok batuan saling menjauh. Blok di atas bidang patahan turun relatif terhadap blok di bawahnya. Umum terjadi di zona tarikan (ekstensi).",
      points: [
        "Gerakan: saling menjauh",
        "Zona tipikal: rift valley",
        "Contoh: Patahan di sepanjang Mid-Atlantic Ridge",
      ],
    },
    reverse: {
      title: "Patahan Naik (Reverse)",
      desc: "Blok batuan saling mendekat karena gaya tekan. Blok di atas bidang patahan terdorong naik. Sering terjadi di zona subduksi.",
      points: [
        "Gerakan: saling mendekat / saling dorong",
        "Zona tipikal: batas konvergen",
        "Contoh: banyak gempa besar di zona subduksi",
      ],
    },
    strike: {
      title: "Patahan Geser (Strike-slip)",
      desc: "Blok batuan bergeser mendatar sejajar bidang patahan. Tidak ada kenaikan atau penurunan signifikan.",
      points: [
        "Gerakan: horizontal / mendatar",
        "Zona tipikal: transform fault",
        "Contoh: San Andreas Fault, California",
      ],
    },
  };

  const tabs = document.querySelectorAll(".fault-tab");
  const diagram = document.getElementById("faultDiagram");
  const titleEl = document.getElementById("faultTitle");
  const descEl = document.getElementById("faultDesc");
  const pointsEl = document.getElementById("faultPoints");

  function setFault(key) {
    const data = faultData[key];
    if (!data) return;

    tabs.forEach((tab) => {
      const active = tab.dataset.fault === key;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });

    diagram.dataset.mode = key;
    titleEl.textContent = data.title;
    descEl.textContent = data.desc;
    pointsEl.innerHTML = data.points.map((p) => `<li>${p}</li>`).join("");
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => setFault(tab.dataset.fault));
  });

  setFault("normal");

  const stress = document.getElementById("stress");
  const stressValue = document.getElementById("stressValue");
  const strainFill = document.getElementById("strainFill");
  const simStage = document.getElementById("simStage");
  const simStatus = document.getElementById("simStatus");
  const releaseBtn = document.getElementById("releaseBtn");
  const THRESHOLD = 80;

  function updateStressUI() {
    const value = Number(stress.value);
    stressValue.textContent = `${value}%`;
    strainFill.style.width = `${value}%`;

    simStage.classList.remove("is-released");
    simStage.classList.toggle("is-strained", value >= 45 && value < THRESHOLD);

    if (value < 45) {
      simStatus.textContent = "Tegangan masih tertahan. Naikkan hingga mendekati batas.";
    } else if (value < THRESHOLD) {
      simStatus.textContent = "Tegangan meningkat. Batuan mulai terdeformasi.";
    } else {
      simStatus.textContent = "Batas kekuatan batuan hampir tercapai. Siap melepaskan energi.";
    }
  }

  stress.addEventListener("input", updateStressUI);
  updateStressUI();

  releaseBtn.addEventListener("click", () => {
    const value = Number(stress.value);

    if (value < THRESHOLD) {
      simStatus.textContent = `Belum cukup. Naikkan tegangan minimal ${THRESHOLD}% agar patahan lepas.`;
      simStage.classList.remove("is-released");
      return;
    }

    simStage.classList.remove("is-strained");
    simStage.classList.add("is-released");
    simStatus.textContent =
      "Patahan bergerak! Energi terlepas sebagai gelombang seismik — gempa terjadi.";

    window.setTimeout(() => {
      stress.value = "20";
      updateStressUI();
    }, 1800);
  });

  const quiz = document.getElementById("quiz");
  const feedback = document.getElementById("quizFeedback");
  const options = quiz.querySelectorAll(".quiz-options button");

  options.forEach((btn) => {
    btn.addEventListener("click", () => {
      const correct = btn.dataset.correct === "true";

      options.forEach((b) => {
        b.disabled = true;
        if (b.dataset.correct === "true") b.classList.add("is-correct");
      });

      if (!correct) btn.classList.add("is-wrong");

      feedback.hidden = false;
      feedback.textContent = correct
        ? "Benar. Guncangan yang kita rasakan berasal dari gelombang seismik."
        : "Belum tepat. Jawaban yang benar: gelombang seismik dari pelepasan energi patahan.";
      feedback.style.color = correct ? "#2f4f3e" : "#c45c26";
    });
  });

  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");

  navToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  const steps = document.querySelectorAll(".step");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.35 }
    );
    steps.forEach((step) => io.observe(step));
  }
})();
