// InkVerse - Interactive Manga & Manhwa Reader Engine

class MangaReader {
  constructor() {
    this.currentItem = null;
    this.currentChapter = 1;
    this.zoomLevel = 100;
    this.readerMode = "vertical"; // 'vertical' for manhwa webtoon, 'paged' for manga
    this.initListeners();
  }

  initListeners() {
    // Reader control buttons
    const closeBtn = document.getElementById("reader-close-btn");
    const zoomInBtn = document.getElementById("reader-zoom-in");
    const zoomOutBtn = document.getElementById("reader-zoom-out");
    const modeToggleBtn = document.getElementById("reader-mode-toggle");
    const prevChapterBtn = document.getElementById("reader-prev-chapter");
    const nextChapterBtn = document.getElementById("reader-next-chapter");

    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.close());
    }

    if (zoomInBtn) {
      zoomInBtn.addEventListener("click", () => {
        this.zoomLevel = Math.min(180, this.zoomLevel + 15);
        this.applyZoom();
      });
    }

    if (zoomOutBtn) {
      zoomOutBtn.addEventListener("click", () => {
        this.zoomLevel = Math.max(70, this.zoomLevel - 15);
        this.applyZoom();
      });
    }

    if (modeToggleBtn) {
      modeToggleBtn.addEventListener("click", () => {
        this.readerMode = this.readerMode === "vertical" ? "paged" : "vertical";
        modeToggleBtn.textContent = this.readerMode === "vertical" ? "Webtoon Scroll" : "Page Flip";
        this.renderPanels();
      });
    }

    if (prevChapterBtn) {
      prevChapterBtn.addEventListener("click", () => {
        if (this.currentChapter > 1) {
          this.currentChapter--;
          this.updateChapterUI();
        }
      });
    }

    if (nextChapterBtn) {
      nextChapterBtn.addEventListener("click", () => {
        if (this.currentItem && this.currentChapter < (this.currentItem.chapters || 50)) {
          this.currentChapter++;
          this.updateChapterUI();
        }
      });
    }

    // Keyboard navigation
    window.addEventListener("keydown", (e) => {
      const readerModal = document.getElementById("reader-modal");
      if (readerModal && !readerModal.classList.contains("hidden")) {
        if (e.key === "Escape") this.close();
        if (e.key === "ArrowLeft") prevChapterBtn?.click();
        if (e.key === "ArrowRight") nextChapterBtn?.click();
      }
    });
  }

  open(item, chapter = 1) {
    this.currentItem = item;
    this.currentChapter = chapter;
    this.readerMode = item.type === "manhwa" ? "vertical" : "vertical";
    this.zoomLevel = 100;

    const titleEl = document.getElementById("reader-title");
    const typeBadge = document.getElementById("reader-type-badge");
    const modeBtn = document.getElementById("reader-mode-toggle");

    if (titleEl) titleEl.textContent = item.title;
    if (typeBadge) {
      typeBadge.textContent = item.type.toUpperCase();
      typeBadge.className = `text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
        item.type === "manhwa" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
      }`;
    }
    if (modeBtn) {
      modeBtn.textContent = this.readerMode === "vertical" ? "Webtoon Scroll" : "Page Flip";
    }

    this.updateChapterUI();
    this.renderPanels();

    const modal = document.getElementById("reader-modal");
    if (modal) {
      modal.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    }
    app.showToast(`Opening ${item.title} - Chapter ${this.currentChapter}`, "info");
  }

  close() {
    const modal = document.getElementById("reader-modal");
    if (modal) {
      modal.classList.add("hidden");
      document.body.style.overflow = "";
    }
  }

  updateChapterUI() {
    const currentChapterEl = document.getElementById("reader-current-chapter");
    if (currentChapterEl) {
      currentChapterEl.textContent = `Ch. ${this.currentChapter}`;
    }
    this.renderPanels();
  }

  applyZoom() {
    const container = document.getElementById("reader-panels-container");
    if (container) {
      container.style.width = `${this.zoomLevel}%`;
    }
    const zoomText = document.getElementById("reader-zoom-level");
    if (zoomText) zoomText.textContent = `${this.zoomLevel}%`;
  }

  renderPanels() {
    const container = document.getElementById("reader-panels-container");
    if (!container || !this.currentItem) return;

    // Use panels from data or rich preview images
    const panels = this.currentItem.previewPanels && this.currentItem.previewPanels.length > 0 
      ? this.currentItem.previewPanels 
      : [this.currentItem.cover, this.currentItem.banner];

    container.innerHTML = `
      <div class="space-y-4 max-w-3xl mx-auto py-6">
        <div class="text-center py-4 border-b border-slate-800 text-slate-400 text-xs">
          <p class="font-display font-semibold text-white text-base">${this.currentItem.title}</p>
          <p>Chapter ${this.currentChapter} • Official Digital Reader Edition</p>
          <p class="text-[11px] text-purple-400 mt-1">Scroll down to continue reading</p>
        </div>

        ${panels.map((src, idx) => `
          <div class="relative overflow-hidden rounded-xl shadow-2xl border border-slate-800 bg-slate-900 group">
            <img src="${src}" alt="Panel ${idx + 1}" class="w-full h-auto object-cover transition duration-300 group-hover:scale-[1.01]" loading="lazy">
            <div class="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded text-[10px] text-slate-400 font-mono">
              Panel ${idx + 1}/${panels.length}
            </div>
          </div>
        `).join('')}

        <!-- Next chapter prompt -->
        <div class="text-center py-10 bg-slate-900/60 rounded-2xl border border-slate-800/80 p-6 space-y-3">
          <p class="text-emerald-400 font-semibold text-sm">🎉 You have completed Chapter ${this.currentChapter}!</p>
          <p class="text-slate-400 text-xs max-w-md mx-auto">
            Enjoying this series? Add it to your favorites or order the physical collector's edition!
          </p>
          <div class="flex items-center justify-center gap-3 pt-2">
            <button onclick="reader.currentChapter++; reader.updateChapterUI();" class="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition shadow-lg shadow-purple-600/30 flex items-center gap-2">
              Next Chapter (${this.currentChapter + 1})
              <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    lucide.createIcons();
    this.applyZoom();
  }
}

const reader = new MangaReader();
