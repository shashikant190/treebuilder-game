// Updated jQuery loading at the top of preload.js
const loadJQuery = async () => {
    const jquery = document.createElement('script');
    jquery.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
    
    const jqueryUI = document.createElement('script');
    jqueryUI.src = 'https://code.jquery.com/ui/1.13.1/jquery-ui.min.js';
  
    // Append first then await loading
    document.head.appendChild(jquery);
    document.head.appendChild(jqueryUI);
  
    await Promise.all([
      new Promise(resolve => jquery.onload = resolve),
      new Promise(resolve => jqueryUI.onload = resolve)
    ]);
  };
  
  await loadJQuery(); // Load jQuery before anything else
  
  // Rest of your existing preload.js code remains the same
  let resolvedAssets = 0;
  let totalAssets = 0;
  let hasInitialized = false;
  const htmlCache = new Map();
  const viewModules = new Map();
  
  // ... rest of the file unchanged ...

// Asset configuration
const assets = {
  images: [
    '/assets/utilities/play.png',
    '/assets/utilities/about.png',
    '/assets/utilities/close.png',
    '/assets/mango/mango-bark.jpg',
    '/assets/bg.png',
    '/assets/utilities/GameOverRed.png',
    '/assets/utilities/restart.png',
    '/assets/utilities/menu.png',
    '/assets/almond/almond-bark.jpg',
    '/assets/tamarind/tamarind-bark.jpg',
    '/assets/raintree/raintree-bark.jpg',
    '/assets/gulmohar/gulmohar-bark.jpg',
    '/assets/mango/mango-mainimg.png',
    '/assets/mango/mango-main-barkimg.png',
    '/assets/mango/mango-main-leaveimg.png',
    '/assets/mango/mango-main-fruitimg.png',
    '/assets/mango/mango-main-flowerimg.png',
    '/assets/mango/mango-leave.jpg',
    '/assets/almond/almond-leave.jpg',
    '/assets/tamarind/tamarind-leave.jpg',
    '/assets/raintree/raintree-leave.jpg',
    '/assets/gulmohar/gulmohar-leave.jpg',
    '/assets/mango/mango-fruit.jpg',
    '/assets/almond/almond-fruit.jpg',
    '/assets/tamarind/tamarind-fruit.jpg',
    '/assets/raintree/raintree-fruit.jpg',
    '/assets/gulmohar/gulmohar-fruit.jpg',
    '/assets/mango/mango-flower.jpg',
    '/assets/almond/almond-flower.jpg',
    '/assets/tamarind/tamarind-flower.jpg',
    '/assets/raintree/raintree-flower.jpg',
    '/assets/gulmohar/gulmohar-flower.jpg',
    '/assets/tamarind/tamarind-mainimg.png',
    '/assets/almond/almond-mainimg.png',
    '/assets/gulmohar/gulmohar-mainimg.png',
    '/assets/raintree/raintree-mainimg.png',
    '/assets/mango/mango-silhouette.png',
    '/assets/tamarind/tamarind-silhoutte.png',
    '/assets/almond/almond-silhouette.png',
    '/assets/gulmohar/gulmohar-silhouette.png',
    '/assets/raintree/raintree-silhouette.png'
  ],
  videos: [
    '/assets/utilities/bgPageGame2.mp4'
  ],
  html: [
    '/html/mangocontainer.html',
    '/html/tamarindcontainer.html',
    '/html/almondcontainer.html',
    '/html/gulmoharcontainer.html',
    '/html/raintreecontainer.html'
  ],
  css: [
    '/css/index.css',
    '/css/mangocontainer.css',
    '/css/tamarindcontainer.css',
    '/css/almondcontainer.css',
    '/css/gulmoharcontainer.css',
    '/css/raintreecontainer.css'
  ],
  js: [
    '/js/mangocontainer.js',
    '/js/tamarindcontainer.js',
    '/js/almondcontainer.js',
    '/js/gulmoharcontainer.js',
    '/js/raintreecontainer.js'
  ]
};

// Calculate total assets
Object.values(assets).forEach(arr => totalAssets += arr.length);

function updateProgress(progress) {
  const progressBar = document.querySelector('.loading-progress');
  const progressText = document.querySelector('.loading-text');
  const safeProgress = Math.min(progress, 100);
  
  if (progressBar) {
    progressBar.style.width = `${safeProgress}%`;
  }
  if (progressText) {
    progressText.textContent = `Loading... ${Math.round(safeProgress)}%`;
  }
}

async function loadImage(src) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = img.onerror = () => {
      resolvedAssets++;
      updateProgress((resolvedAssets / totalAssets) * 100);
      resolve();
    };
    img.src = src;
  });
}

async function loadVideo(src) {
  return new Promise(resolve => {
    const video = document.createElement('video');
    video.onloadeddata = video.onerror = () => {
      resolvedAssets++;
      updateProgress((resolvedAssets / totalAssets) * 100);
      resolve();
    };
    video.src = src;
    video.load();
  });
}

async function loadHTML(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    htmlCache.set(url, html);
  } catch (error) {
    console.error('HTML load error:', url, error);
  } finally {
    resolvedAssets++;
    updateProgress((resolvedAssets / totalAssets) * 100);
  }
}

async function loadJS(url) {
  try {
    const module = await import(url);
    viewModules.set(url, module);
  } catch (error) {
    console.error('JS load error:', url, error);
  } finally {
    resolvedAssets++;
    updateProgress((resolvedAssets / totalAssets) * 100);
  }
}

async function loadCSS(url) {
  return new Promise(resolve => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    link.dataset.spa = 'true';
    link.onload = link.onerror = () => {
      link.disabled = true;
      resolvedAssets++;
      updateProgress((resolvedAssets / totalAssets) * 100);
      resolve();
    };
    document.head.appendChild(link);
  });
}

async function loadAssets() {
  // Load CSS first
  await Promise.all(assets.css.map(loadCSS));
  
  // Load other assets in parallel
  await Promise.allSettled([
    ...assets.images.map(loadImage),
    ...assets.videos.map(loadVideo),
    ...assets.html.map(loadHTML),
    ...assets.js.map(loadJS)
  ]);
}

function initializeSPA() {
  document.getElementById('loading-screen').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  
  window.addEventListener('spa-navigate', (event) => {
    loadView(event.detail.path);
  });

  setupNavigation();
  setupModals();
}

function setupNavigation() {
  document.getElementById('playBtn')?.addEventListener('click', () => {
    loadView('/html/mangocontainer.html');
  });

  document.getElementById('instructionsBtn')?.addEventListener('click', () => {
    document.getElementById('rulesModal').style.display = 'block';
    document.body.classList.add('no-scroll');
  });

  document.getElementById('quitBtn')?.addEventListener('click', () => {
    document.getElementById('quitConfirmationModal').style.display = 'block';
  });

  document.getElementById('yesQuitBtn')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('spa-navigate', { detail: { path: '/' }}));
  });

  document.getElementById('noQuitBtn')?.addEventListener('click', () => {
    document.getElementById('quitConfirmationModal').style.display = 'none';
  });

  document.getElementById('closeModal')?.addEventListener('click', () => {
    document.getElementById('rulesModal').style.display = 'none';
    document.body.classList.remove('no-scroll');
  });
}

function setupModals() {
  // Add any additional modal initialization here
}

function loadView(viewPath) {
  try {
    const app = document.getElementById('app');
    app.innerHTML = htmlCache.get(viewPath) || '<div>Error loading view</div>';
    
    // Enable correct CSS
    const cssPath = viewPath.replace('/html/', '/css/').replace('.html', '.css');
    document.querySelectorAll('link[data-spa]').forEach(link => {
      link.disabled = !link.href.endsWith(cssPath);
    });

    // Initialize JS module
    const jsPath = viewPath.replace('/html/', '/js/').replace('.html', '.js');
    const module = viewModules.get(jsPath);
    if (module?.init) module.init();
    
  } catch (error) {
    console.error('View load error:', error);
    window.dispatchEvent(new CustomEvent('spa-navigate', { detail: { path: '/' }}));
  }
}

// Start initialization
(async function() {
  try {
    await loadAssets();
    if (!hasInitialized) {
      hasInitialized = true;
      initializeSPA();
    }
  } catch (error) {
    console.error('Initialization error:', error);
    document.getElementById('loading-screen').style.display = 'none';
    document.getElementById('app').style.display = 'block';
  }
})();

// Error handling fallback
window.addEventListener('error', (event) => {
  console.error('Critical error:', event.error);
  if (!hasInitialized) {
    document.getElementById('loading-screen').style.display = 'none';
    document.getElementById('app').style.display = 'block';
  }
});