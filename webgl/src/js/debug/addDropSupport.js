export const addDropSupport = (mCB) => {
	const dropArea = window;
  
	const preventDefaults = (e) => {
		e.preventDefault();
		e.stopPropagation();
  };
  
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
		dropArea.addEventListener(eventName, preventDefaults, false);
	});

	const handleDrop = (e) => {
		const dt = e.dataTransfer;
		const files = dt.files;
		const file = files[0];

		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onloadend = () => {
			const img = document.createElement('img');

			img.onload = () => {
				if (mCB) {
					mCB(img);
				}
			};
			img.src = reader.result;
		};
	};

	dropArea.addEventListener('drop', handleDrop, false);
};

