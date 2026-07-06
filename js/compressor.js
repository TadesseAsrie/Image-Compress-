/**
 * ImageCompress Pro - Core Canvas Processing Engine
 * Handles low-level array manipulation, rendering pipelines, and compression vectors.
 */

export class CompressionEngine {
  /**
   * Executes local canvas compression using native parameter scaling.
   * @param {File} file Raw binary file asset from stream interface.
   * @param {Object} options Quality and resizing rules data structure map.
   * @param {Function} progressCallback Stream tick progression reporting callback.
   * @returns {Promise<Blob>} Standard blob structural layout output.
   */
  static async processImage(file, options, progressCallback) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();

        img.onload = () => {
          try {
            progressCallback(30);

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            let targetWidth = img.width;
            let targetHeight = img.height;

            // Handle physical resolution configuration rules scaling
            if (options.resizeEnabled) {
              if (options.width && options.height) {
                targetWidth = options.width;
                targetHeight = options.height;
              } else if (options.width) {
                targetWidth = options.width;
                targetHeight = options.maintainAspect
                  ? Math.round(img.height * (options.width / img.width))
                  : img.height;
              } else if (options.height) {
                targetHeight = options.height;
                targetWidth = options.maintainAspect
                  ? Math.round(img.width * (options.height / img.height))
                  : img.width;
              }
            }

            canvas.width = targetWidth;
            canvas.height = targetHeight;

            // Execute graphics composite operations pipeline drawing
            if (ctx) {
              // Retain clear canvas bounds alpha transparency space structures if applicable
              if (options.format === "image/jpeg") {
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(0, 0, targetWidth, targetHeight);
              }
              ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
            }

            progressCallback(70);

            // Resolve programmatic format conversion mappings
            let outputType =
              options.format === "auto" ? file.type : options.format;
            // Enforce system fail-safe overrides for format limitations
            if (
              outputType !== "image/jpeg" &&
              outputType !== "image/png" &&
              outputType !== "image/webp"
            ) {
              outputType = "image/jpeg";
            }

            const qualityScale = options.quality / 100;

            canvas.toBlob(
              (blob) => {
                if (blob) {
                  progressCallback(100);
                  resolve(blob);
                } else {
                  reject(new Error("Canvas export empty error state reached"));
                }
              },
              outputType,
              qualityScale,
            );
          } catch (err) {
            reject(err);
          }
        };

        img.onerror = () =>
          reject(new Error("Asset decoding image element generation fault"));
        img.src = e.target.result;
      };

      reader.onerror = () =>
        reject(new Error("File stream physical structural read fault"));
      reader.readAsDataURL(file);
    });
  }
}
