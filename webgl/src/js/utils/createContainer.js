const createContainer = (options) => {
  let container;
	if (options.container) {
		container = document.createElement('div');
		container.className = 'webgl';
		options.container.appendChild(container);
	} else {
		container = document.querySelector('.webgl');
		options.container = container;
  }
  
  return container;
};


export { createContainer };