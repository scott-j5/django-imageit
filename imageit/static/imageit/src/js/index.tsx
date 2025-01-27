type FileInputChangeCallback = (input: HTMLInputElement, files: FileList | null) => void;

class DragAndDropFileHandler {
  private fileInputs: NodeListOf<HTMLInputElement>;

  constructor(
    fileInputSelector: string,
    onFileChangeCallback: FileInputChangeCallback
  ) {
    this.fileInputs = document.querySelectorAll<HTMLInputElement>(fileInputSelector);

    if (!this.fileInputs.length) {
      throw new Error(`No file input fields found with selector "${fileInputSelector}"`);
    }

    this.initDragAndDrop(onFileChangeCallback);
  }

  private initDragAndDrop(onFileChangeCallback: FileInputChangeCallback) {
    this.fileInputs.forEach((fileInput) => {
      const wrapper = fileInput.closest('.imageit-container');

      if (!wrapper) {
        console.warn('File input is not inside a wrapper with the `.imageit-container` class.');
        return;
      }

      // Drag and drop event listeners
      wrapper.addEventListener('dragover', (e: DragEvent) => {
        e.preventDefault();
        wrapper.classList.add('imageit-drag-active'); // Add styling class
      });

      wrapper.addEventListener('dragleave', () => {
        wrapper.classList.remove('imageit-drag-active'); // Remove styling class
      });

      wrapper.addEventListener('drop', (e: DragEvent) => {
        e.preventDefault();
        wrapper.classList.remove('imageit-drag-active'); // Remove styling class

        const files = e.dataTransfer?.files; // Access dataTransfer safely
        if (files) {
          fileInput.files = files; // Assign files to the input
          fileInput.dispatchEvent(new Event('change')); // Trigger change event
        }
      });

      // Listen for changes in the file input
      fileInput.addEventListener('change', () => {
        onFileChangeCallback(fileInput, fileInput.files);
      });

      // Allow click on wrapper to trigger file input
      wrapper.addEventListener('click', () => fileInput.click());
    });
  }
}

window.addEventListener("DOMContentLoaded", function(){
    // Instantiate the DragAndDropFileHandler
    new DragAndDropFileHandler('input[type="file"]', (input, files) => {
        console.log(`File input "${input.name}" changed.`);
        if (files) {
        console.log('Files:', Array.from(files));
        } else {
        console.log('No files selected.');
        }
    });
});