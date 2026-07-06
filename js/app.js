/**
 * ImageCompress Pro - Central Workspace Infrastructure Application Orchestrator
 */

import { UI } from "./ui.js";
import { CompressionEngine } from "./compressor.js";

class WorkspaceApp {
  constructor() {
    this.pipelineItems = [];
    this.activeTheme = "dark";
    this.initDOMReferences();
    this.bindEvents();
    this.setupInteractivity();
  }

  initDOMReferences() {
    this.dropZone = document.getElementById("dropzone");
    this.fileInput = document.getElementById("file-input");
    this.workspaceLayout = document.getElementById("workspace-layout");
    this.pipelineList = document.getElementById("pipeline-list");
    this.queueSummary = document.getElementById("queue-summary");
    this.btnExecuteAll = document.getElementById("btn-execute-all");
    this.btnResetAll = document.getElementById("btn-reset-all");
    this.btnDownloadAll = document.getElementById("btn-download-all");
    this.themeToggle = document.getElementById("theme-toggle");
    this.qualitySlider = document.getElementById("param-quality");
    this.qualityVal = document.getElementById("quality-val");

    // Advanced resize component node matching configurations
    this.toggleResize = document.getElementById("toggle-resize");
    this.resizeSuboptions = document.getElementById("resize-suboptions");

    // Direct component elements reference maps for splitting preview inspector targets
    this.comparisonStage = document.getElementById("comparison-stage");
    this.inspectBeforeImg = document.getElementById("inspect-before-img");
    this.inspectAfterImg = document.getElementById("inspect-after-img");
    this.inspectAfterLayer = document.getElementById("inspect-after-layer");
    this.inspectHandle = document.getElementById("inspect-handle");
    this.splitViewBox = document.getElementById("split-view-box");
    this.btnCloseInspector = document.getElementById("btn-close-inspector");
  }

  bindEvents() {
    // Theme initialization toggle tracking routines
    this.themeToggle.addEventListener("click", () => this.switchTheme());

    // File browser selection input proxy connectors
    this.dropZone.addEventListener("click", () => this.fileInput.click());
    this.fileInput.addEventListener("change", (e) =>
      this.handleFileBlobs(e.target.files),
    );

    // System Drag and drop dragover state mapping event handlers
    this.dropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      this.dropZone.classList.add("drag-over");
    });
    this.dropZone.addEventListener("dragleave", () =>
      this.dropZone.classList.remove("drag-over"),
    );
    this.dropZone.addEventListener("drop", (e) => {
      e.preventDefault();
      this.dropZone.classList.remove("drag-over");
      this.handleFileBlobs(e.dataTransfer.files);
    });

    // Native clipboard operational injection monitoring logic
    window.addEventListener("paste", (e) => {
      if (e.clipboardData && e.clipboardData.files.length > 0) {
        this.handleFileBlobs(e.clipboardData.files);
        UI.showToast("Image pasted from clipboard.", "success");
      }
    });

    // Parameters visual display value reactive modifications mappings
    this.qualitySlider.addEventListener(
      "input",
      (e) => (this.qualityVal.textContent = `${e.target.value}%`),
    );
    this.toggleResize.addEventListener("change", (e) => {
      this.resizeSuboptions.classList.toggle("hidden-sub", !e.target.checked);
    });

    // Workflow action trigger registrations
    this.btnExecuteAll.addEventListener("click", () =>
      this.compressAllPipelineItems(),
    );
    this.btnResetAll.addEventListener("click", () =>
      this.clearWorkspacePipelineState(),
    );
    this.btnDownloadAll.addEventListener("click", () =>
      this.triggerGlobalZipDownloadFallback(),
    );
    this.btnCloseInspector.addEventListener("click", () =>
      this.comparisonStage.classList.add("hidden"),
    );

    // Keyboard navigation listeners
    this.dropZone.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") this.fileInput.click();
    });

    // Structural responsive navigation drawer bindings block
    const navToggle = document.querySelector(".mobile-nav-toggle");
    const navMenu = document.querySelector(".nav-menu");
    if (navToggle && navMenu) {
      navToggle.addEventListener("click", () => {
        const isActive = navMenu.classList.toggle("mobile-active");
        navToggle.setAttribute("aria-expanded", isActive);
      });
    }

    // Structural Accordion system monitoring interface bindings initialization
    document.querySelectorAll(".accordion-trigger").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const isExpanded = trigger.getAttribute("aria-expanded") === "true";
        const panel = document.getElementById(
          trigger.getAttribute("aria-controls"),
        );

        trigger.setAttribute("aria-expanded", !isExpanded);
        if (panel) {
          panel.hidden = isExpanded;
          panel.style.maxHeight = isExpanded ? null : `${panel.scrollHeight}px`;
        }
      });
    });

    // Back to top structural node configuration management hook layout
    const topBtn = document.getElementById("btn-back-to-top");
    if (topBtn) {
      topBtn.addEventListener("click", () =>
        window.scrollTo({ top: 0, behavior: "smooth" }),
      );
    }
  }

  setupInteractivity() {
    // Enforce application baseline system skin context color map
    document.documentElement.setAttribute("data-theme", this.activeTheme);

    // Add modular dynamic button mouse tracking click bubble wave animations
    document.body.addEventListener("click", (e) => {
      const element = e.target.closest(".ripple");
      if (element) {
        const circle = document.createElement("span");
        const dimension = Math.max(element.clientWidth, element.clientHeight);
        const rect = element.getBoundingClientRect();

        circle.style.width = circle.style.height = `${dimension}px`;
        circle.style.left = `${e.clientX - rect.left - dimension / 2}px`;
        circle.style.top = `${e.clientY - rect.top - dimension / 2}px`;
        circle.classList.add("ripple-effect");

        element.appendChild(circle);
        setTimeout(() => circle.remove(), 600);
      }
    });

    // Split slider interactive image view layer drag event setup handles
    let isDraggingSlider = false;
    const moveSlider = (clientX) => {
      const boxRect = this.splitViewBox.getBoundingClientRect();
      let positionRatio = (clientX - boxRect.left) / boxRect.width;
      if (positionRatio < 0) positionRatio = 0;
      if (positionRatio > 1) positionRatio = 1;

      const fixedPercentage = positionRatio * 100;
      this.inspectAfterLayer.style.width = `${fixedPercentage}%`;
      this.inspectHandle.style.left = `${fixedPercentage}%`;
      this.inspectHandle.setAttribute(
        "aria-valuenow",
        Math.round(fixedPercentage),
      );
    };

    this.inspectHandle.addEventListener(
      "mousedown",
      () => (isDraggingSlider = true),
    );
    window.addEventListener("mouseup", () => (isDraggingSlider = false));
    window.addEventListener("mousemove", (e) => {
      if (isDraggingSlider) moveSlider(e.clientX);
    });

    // Touch systems binding configuration handlers
    this.inspectHandle.addEventListener(
      "touchstart",
      () => (isDraggingSlider = true),
    );
    window.addEventListener("touchend", () => (isDraggingSlider = false));
    window.addEventListener("touchmove", (e) => {
      if (isDraggingSlider && e.touches[0]) moveSlider(e.touches[0].clientX);
    });
  }

  switchTheme() {
    this.activeTheme = this.activeTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", this.activeTheme);
    UI.showToast(
      `Switched to standard ${this.activeTheme} theme view.`,
      "info",
    );
  }

  handleFileBlobs(files) {
    if (!files || files.length === 0) return;

    let attachedCount = 0;
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxFileBytes = 50 * 1024 * 1024; // 50MB constraint bound block limit

    Array.from(files).forEach((file) => {
      if (!validTypes.includes(file.type)) {
        UI.showToast(`Invalid format omitted: ${file.name}`, "error");
        return;
      }
      if (file.size > maxFileBytes) {
        UI.showToast(
          `File scale profile bounds exceeded (>50MB): ${file.name}`,
          "error",
        );
        return;
      }

      const assetRecord = {
        id: Date.now() + Math.random().toString(36).substr(2, 5),
        file: file,
        resultBlob: null,
      };

      this.pipelineItems.push(assetRecord);
      attachedCount++;

      UI.renderPipelineCard(assetRecord, this.pipelineList, {
        onRemove: (id) => this.removePipelineAssetItem(id),
        onInspect: (id) => this.launchVisualInspectorStage(id),
      });
    });

    if (attachedCount > 0) {
      this.workspaceLayout.classList.remove("hidden");
      this.syncQueueMetadataTotals();
      UI.showToast(
        `Added ${attachedCount} assets to processing array.`,
        "success",
      );
    }
  }

  removePipelineAssetItem(id) {
    this.pipelineItems = this.pipelineItems.filter((item) => item.id !== id);
    const DOMNode = document.getElementById(`asset-node-${id}`);
    if (DOMNode) DOMNode.remove();

    this.syncQueueMetadataTotals();
    if (this.pipelineItems.length === 0) {
      this.workspaceLayout.classList.add("hidden");
      this.comparisonStage.classList.add("hidden");
    }
  }

  clearWorkspacePipelineState() {
    this.pipelineItems = [];
    this.pipelineList.innerHTML = "";
    this.workspaceLayout.classList.add("hidden");
    this.comparisonStage.classList.add("hidden");
    this.btnDownloadAll.classList.add("hidden");
    this.syncQueueMetadataTotals();
    UI.showToast("Workspace clearing complete.", "info");
  }

  syncQueueMetadataTotals() {
    const remainingCount = this.pipelineItems.filter(
      (item) => !item.resultBlob,
    ).length;
    if (remainingCount > 0) {
      this.queueSummary.textContent = `${remainingCount} assets staging compilation`;
      this.btnDownloadAll.classList.add("hidden");
    } else if (this.pipelineItems.length > 0) {
      this.queueSummary.textContent =
        "All batch assets successfully processed.";
      this.btnDownloadAll.classList.remove("hidden");
    } else {
      this.queueSummary.textContent =
        "Queue configuration block completely empty.";
    }
  }

  async compressAllPipelineItems() {
    const qualityVal = parseInt(this.qualitySlider.value, 10);
    const formatVal = document.getElementById("param-format").value;
    const resizeEnabled = this.toggleResize.checked;
    const widthVal =
      parseInt(document.getElementById("param-width").value, 10) || null;
    const heightVal =
      parseInt(document.getElementById("param-height").value, 10) || null;
    const maintainAspect = document.getElementById("param-aspect").checked;

    const runtimeConfig = {
      quality: qualityVal,
      format: formatVal,
      resizeEnabled: resizeEnabled,
      width: widthVal,
      height: heightVal,
      maintainAspect: maintainAspect,
    };

    UI.showToast("Batch optimization processing executed...", "info");

    // Process loop mapping sequentially to protect system resources and baseline system bounds
    for (const item of this.pipelineItems) {
      if (item.resultBlob) continue; // Skip already compressed assets in queue updates

      const barFill = document.getElementById(`prog-bar-${item.id}`);

      try {
        item.resultBlob = await CompressionEngine.processImage(
          item.file,
          runtimeConfig,
          (tick) => {
            if (barFill) barFill.style.width = `${tick}%`;
          },
        );
        UI.updateCardWithResults(item);
      } catch (err) {
        console.error(err);
        UI.showToast(
          `Asset conversion processing error state layout: ${item.file.name}`,
          "error",
        );
      }
    }

    this.syncQueueMetadataTotals();
    UI.showToast("Batch pipeline sweep complete.", "success");
  }

  launchVisualInspectorStage(id) {
    const targetAsset = this.pipelineItems.find((item) => item.id === id);
    if (!targetAsset || !targetAsset.resultBlob) return;

    this.inspectBeforeImg.src = URL.createObjectURL(targetAsset.file);
    this.inspectAfterImg.src = URL.createObjectURL(targetAsset.resultBlob);

    // Reset split sliders cleanly to neutral middle positions
    this.inspectAfterLayer.style.width = "50%";
    this.inspectHandle.style.left = "50%";

    this.comparisonStage.classList.remove("hidden");
    this.comparisonStage.scrollIntoView({ behavior: "smooth" });
  }

  triggerGlobalZipDownloadFallback() {
    // Sequentially download assets locally when external frameworks like JSZip are restricted
    UI.showToast(
      "Executing sequential download downloads loop standard...",
      "success",
    );
    this.pipelineItems.forEach((item) => {
      if (item.resultBlob) {
        const abstractAnchor = document.createElement("a");
        abstractAnchor.href = URL.createObjectURL(item.resultBlob);
        abstractAnchor.download = UI.generateFileName(
          item.file.name,
          item.resultBlob.type,
        );
        document.body.appendChild(abstractAnchor);
        abstractAnchor.click();
        document.body.removeChild(abstractAnchor);
      }
    });
  }
}

// Initial system application launch orchestration lifecycle anchor
document.addEventListener("DOMContentLoaded", () => {
  window.AppInstance = new WorkspaceApp();
});
