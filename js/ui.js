/**
 * ImageCompress Pro - Modern UI Interface & Component Lifecycle State Controller
 */

export class UI {
  /**
   * Spawns transient programmatic alerts into notification container.
   * @param {string} msg Text string description to present.
   * @param {string} type System status configuration mode class name.
   */
  static showToast(msg, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast-msg toast-${type}`;
    toast.textContent = msg;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(20px)";
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  /**
   * Generates a structural visual markup row configuration inside target element collection.
   * @param {Object} item Global pipeline asset dictionary element model.
   * @param {HTMLElement} container Target view container node block.
   * @param {Object} eventHandlers Function mapping for interactive element clicks.
   */
  static renderPipelineCard(item, container, eventHandlers) {
    const card = document.createElement("div");
    card.className = "pipeline-card";
    card.id = `asset-node-${item.id}`;

    const readableOrigSize = (item.file.size / 1024 / 1024).toFixed(2);
    const fileExtension = item.file.name.split(".").pop().toUpperCase();

    card.innerHTML = `
            <div class="card-main-row">
                <img class="thumb-preview" id="thumb-preview-${item.id}" src="#" alt="Asset thumb">
                <div class="asset-meta">
                    <div class="asset-title" title="${item.file.name}">${item.file.name}</div>
                    <div class="asset-info-row">
                        <span>Format: <strong>${fileExtension}</strong></span>
                        <span>Weight: <strong>${readableOrigSize} MB</strong></span>
                        <span id="dim-node-${item.id}">Dim: --</span>
                    </div>
                </div>
                <div class="card-actions-area">
                    <button class="btn btn-secondary btn-inspect hidden" id="btn-inspect-${item.id}">Inspect</button>
                    <a class="btn btn-success btn-download hidden" id="btn-dl-${item.id}">Download</a>
                    <button class="btn btn-danger btn-remove" id="btn-rm-${item.id}">Remove</button>
                </div>
            </div>
            <div class="progress-container" id="prog-wrap-${item.id}">
                <div class="progress-bar-fill" id="prog-bar-${item.id}"></div>
            </div>
            <div class="results-matrix-box hidden" id="results-matrix-${item.id}"></div>
        `;

    container.appendChild(card);

    // Fetch object geometry dimensions smoothly using standard async loads
    const imgInstance = new Image();
    imgInstance.onload = () => {
      const dimSpan = document.getElementById(`dim-node-${item.id}`);
      if (dimSpan)
        dimSpan.textContent = `Dim: ${imgInstance.width}x${imgInstance.height}px`;
      const visualThumb = document.getElementById(`thumb-preview-${item.id}`);
      if (visualThumb) visualThumb.src = imgInstance.src;
    };
    imgInstance.src = URL.createObjectURL(item.file);

    // Map operational button actions to structural execution closures
    document
      .getElementById(`btn-rm-${item.id}`)
      .addEventListener("click", () => eventHandlers.onRemove(item.id));
    document
      .getElementById(`btn-inspect-${item.id}`)
      .addEventListener("click", () => eventHandlers.onInspect(item.id));
  }

  /**
   * Updates individual list layout visual items to fully structural metric presentation display layouts.
   * @param {Object} item Targeted asset operational record object context.
   */
  static updateCardWithResults(item) {
    const progressWrapper = document.getElementById(`prog-wrap-${item.id}`);
    if (progressWrapper) progressWrapper.classList.add("hidden");

    const matrix = document.getElementById(`results-matrix-${item.id}`);
    if (!matrix || !item.resultBlob) return;

    const originalKB = item.file.size / 1024;
    const compressedKB = item.resultBlob.size / 1024;
    const ratio = (originalKB / compressedKB).toFixed(1);
    const percentageSaved = Math.max(
      0,
      Math.round(((originalKB - compressedKB) / originalKB) * 100),
    );

    matrix.innerHTML = `
            <div class="metric-tile">
                <span>Optimized Size</span>
                <strong>${compressedKB.toFixed(1)} KB</strong>
            </div>
            <div class="metric-tile saved-accent">
                <span>Size Savings</span>
                <strong>-${percentageSaved}%</strong>
            </div>
            <div class="metric-tile">
                <span>Ratio</span>
                <strong>${ratio}:1</strong>
            </div>
            <div class="metric-tile">
                <span>Status</span>
                <strong style="color:var(--success-color)">Success</strong>
            </div>
        `;
    matrix.classList.remove("hidden");

    // Toggle action buttons visibility flags
    const inspectBtn = document.getElementById(`btn-inspect-${item.id}`);
    if (inspectBtn) inspectBtn.classList.remove("hidden");

    const downloadLink = document.getElementById(`btn-dl-${item.id}`);
    if (downloadLink) {
      downloadLink.href = URL.createObjectURL(item.resultBlob);
      downloadLink.download = UI.generateFileName(
        item.file.name,
        item.resultBlob.type,
      );
      downloadLink.classList.remove("hidden");
    }
  }

  /**
   * Formats target filenames appropriately with appended system optimization labels.
   * @param {string} baseName Raw original incoming asset file title.
   * @param {string} mimeType Targeted system format configuration signature.
   * @returns {string} Sanitized clean file string output target title.
   */
  static generateFileName(baseName, mimeType) {
    const baseWithoutExtension =
      baseName.substring(0, baseName.lastIndexOf(".")) || baseName;
    let extension = "jpg";
    if (mimeType === "image/png") extension = "png";
    if (mimeType === "image/webp") extension = "webp";
    return `${baseWithoutExtension}-optimized.${extension}`;
  }
}
