type ImageitInputChangeCallback = (input: HTMLInputElement, files: FileList | null) => void;

class ImageitInputHandler {
    private fileInputs: NodeListOf<HTMLInputElement>;

    constructor(fileInputSelector: string, onFileChangeCallback: ImageitInputChangeCallback){
        this.fileInputs = document.querySelectorAll<HTMLInputElement>(fileInputSelector);
        if (!this.fileInputs.length) {
            throw new Error(`No file input fields found with selector "${fileInputSelector}"`);
        }
        this.initInputs(onFileChangeCallback);
    }

    private initInputs(onFileChangeCallback: ImageitInputChangeCallback) {
        this.fileInputs.forEach((fileInput) => {
            const wrapper = fileInput.closest('.imageit-container');
            if (!wrapper) {
                console.warn('File input is not inside a wrapper with the `.imageit-container` class.');
                return;
            }

            this.initListeners(fileInput, wrapper, onFileChangeCallback);
        });
    }

    //Add listeners to each imageit widget to listen for drag events, clicks. Changes to file inputs trigger ImageitInputChangeCallback
    private initListeners(fileInput:HTMLInputElement, wrapper:Element, onFileChangeCallback: ImageitInputChangeCallback){
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
            const files = fileInput.files;
            if (files && this.validateFiles(files, fileInput)) {
                onFileChangeCallback(fileInput, files);
            } else {
                console.error('File validation failed.');
                fileInput.value = ''; // Clear the input if validation fails
            }
        });

        // Allow click on wrapper to trigger file input
        wrapper.addEventListener('click', () => fileInput.click());
    }

    private validateFiles(files: FileList, fileInput: HTMLInputElement): boolean {
        const maxFileSize = +fileInput.getAttribute('data-max_upload_size'); 
        const maxFileSizeBytes = maxFileSize * 1024 * 1024; // 5 MB
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!allowedTypes.includes(file.type)) {
            console.error(`File type not allowed: ${file.type}`);
            return false;
            }
            if (file.size > maxFileSizeBytes) {
            console.error(`File size exceeds ${maxFileSize}MB limit: ${file.size/1024/1024}MB`);
            return false;
            }
        }
        return true; // All files pass validation
    }

    private render(){

    }
}

class ImageitInput {
    constructor(fileInputSelector: HTMLInputElement){
        this.fileInputs = document.querySelectorAll<HTMLInputElement>(fileInputSelector);
        if (!this.fileInputs.length) {
            throw new Error(`No file input fields found with selector "${fileInputSelector}"`);
        }
        this.initInputs(onFileChangeCallback);
    }

    // Retrieve any initial files from the form
    retrieveInitial(){
        
    }
}

window.addEventListener("DOMContentLoaded", function(){
    // Instantiate the ImageitInputHandler
    new ImageitInputHandler('input[type="file"].imageit-file-selector', (input, files) => {
        console.log(`File input "${input.name}" changed.`);
        if (files) {
            console.log('Files:', Array.from(files));
        } else {
            console.log('No files selected.');
        }
    });
});