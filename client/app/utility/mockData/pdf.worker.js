import { GlobalWorkerOptions } from 'pdfjs-dist';

// Use the correct worker path for the updated version
GlobalWorkerOptions.workerSrc = require('pdfjs-dist/build/pdf.worker.entry');
