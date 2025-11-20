// ----------------- Project data (add as many pages per project as you like) -----------------
const projects = {
  project1: {
    title: "Slugorithm",
    pages: [
      { type: "image", src: "images/ocean.jpg", caption:"Ocean — watercolor study" },
      { type: "image", src: "images/ocean-detail.jpg", caption:"Detail" },
      { type: "text", content: "<h3>Process</h3><p>Brush studies + palette choices.</p>" }
    ]
  },
  project2: {
    title: "Forest Illustration",
    pages: [
      { type: "image", src: "images/forest.jpg" },
      { type: "image", src: "images/forest-2.jpg" },
      { type: "text", content: "<p>Ink sketches & composition notes.</p>" }
    ]
  },
  project3: {
    title: "Mountain Scene",
    pages: [
      { type: "image", src: "images/mountain.jpg" },
      { type: "text", content: "<p>Color studies.</p>" }
    ]
  },
  project4: {
    title: "Sunset Painting",
    pages: [
      { type: "image", src: "images/sunset.jpg" },
      { type: "image", src: "images/sunset-2.jpg" }
    ]
  },
  project5: {
    title: "Cityscape",
    pages: [
      { type: "image", src: "images/city.jpg" },
      { type: "text", content: "<p>Digital passes and thumbnails.</p>" }
    ]
  },
  project6: {
    title: "Flower Study",
    pages: [
      { type: "image", src: "images/flower.jpg" },
      { type: "image", src: "images/flower-2.jpg" }
    ]
  },
  project7: {
    title: "Sketchbook Studies",
    pages: [
      { type: "image", src: "images/sketch.jpg" },
      { type: "text", content: "<p>Journal pages and notes.</p>" }
    ]
  },
  project8: {
    title: "Figurative Painting",
    pages: [
      { type: "image", src: "images/figure.jpg" },
      { type: "image", src: "images/figure-2.jpg" }
    ]
  }
};

// ----------------- DOM refs -----------------
const bookWrappers = document.querySelectorAll('.book-wrapper');
const viewer = document.getElementById('bookViewer');
const bookScene = document.querySelector('.book-scene');
const prevBtn = document.getElementById('prevPage');
const nextBtn = document.getElementById('nextPage');
const closeBtn = document.getElementById('closeViewer');
// lamp elements
const lampToggle = document.getElementById('lampToggle');
const bodyEl = document.body;

let current = {
  projectKey: null,
  pageIndex: 0,
  clonedBook: null,
  pageElements: []
};

// Utility: create a DOM node from HTML string
function createNode(html){
  const tpl = document.createElement('template');
  tpl.innerHTML = html.trim();
  return tpl.content.firstChild;
}

// Build a cloned book object for the viewer and its pages
function buildClonedBook(projectKey){
  const meta = projects[projectKey];
  if(!meta) return null;

  // large cloned book container
  const clone = document.createElement('div');
  clone.className = 'cloned-book';

  // front face
  const front = document.createElement('div');
  front.className = 'front';
  front.innerHTML = `<div style="padding:18px; text-align:center;"><strong>${meta.title}</strong></div>`;
  clone.appendChild(front);

  // back
  const back = document.createElement('div');
  back.className = 'back';
  clone.appendChild(back);

  // spread (left+right pages area)
  const spread = document.createElement('div');
  spread.className = 'spread';

  // create initial page elements (two-facing spread) and stack
  const pageEls = [];
  const pages = meta.pages || [];

  // We'll create a flow of page pairs. Each "page" element is half of spread (50% width).
  pages.forEach((p, idx) => {
    const page = document.createElement('div');
    page.className = 'page';
    page.dataset.pageIndex = idx;
    if(p.type === 'image'){
      const img = document.createElement('img');
      img.src = p.src;
      img.alt = p.caption || meta.title || '';
      page.appendChild(img);
    } else {
      page.innerHTML = p.content || '';
    }
    // The page exists as a right-side sheet initially.
    pageEls.push(page);
  });

  // To show a two-page spread we will build left and right halves dynamically.
  // We'll create a container that holds visible left and right halves; JS will manage which pages are shown.
  const visibleLeft = document.createElement('div');
  visibleLeft.className = 'page left';
  visibleLeft.style.width = '50%';
  visibleLeft.style.pointerEvents = 'auto';
  visibleLeft.style.display = 'flex';
  visibleLeft.style.alignItems = 'center';
  visibleLeft.style.justifyContent = 'center';
  visibleLeft.style.padding = '18px';
  visibleLeft.style.boxSizing = 'border-box';

  const visibleRight = document.createElement('div');
  visibleRight.className = 'page right';
  visibleRight.style.width = '50%';
  visibleRight.style.pointerEvents = 'auto';
  visibleRight.style.display = 'flex';
  visibleRight.style.alignItems = 'center';
  visibleRight.style.justifyContent = 'center';
  visibleRight.style.padding = '18px';
  visibleRight.style.boxSizing = 'border-box';

  spread.appendChild(visibleLeft);
  spread.appendChild(visibleRight);

  clone.appendChild(spread);

  return { clone, front, back, spread, pageEls, visibleLeft, visibleRight };
}

// Show the viewer by cloning the book and animating open states
function openBook(projectKey){
  const built = buildClonedBook(projectKey);
  if(!built) return;
  // Clear existing scene
  bookScene.innerHTML = '';
  bookScene.appendChild(built.clone);

  current.projectKey = projectKey;
  current.pageIndex = 0;
  current.clonedBook = built;
  current.pageElements = built.pageEls;

  // Fit first spread
  renderSpread();

  // animate: initial pulled position — start with rotated closed (mimic grabbing spine)
  built.clone.style.transform = 'scale(0.9) translateX(-60px) rotateY(-12deg)';
  built.clone.style.transition = 'transform .45s cubic-bezier(.2,.8,.2,1)';

  // after tiny delay, swing out and open front cover animation
  requestAnimationFrame(()=> {
    setTimeout(()=> {
      // mimic pulling book out (translate and scale)
      built.clone.style.transform = 'scale(1) translateX(0px) rotateY(0deg)';
      // then animate the front flap open: simulate by rotating the front element
      built.front.style.transition = 'transform 0.68s cubic-bezier(.17,.67,.35,1.35)';
      built.front.style.transform = 'rotateY(-160deg) translateX(-6px)'; // open enough to reveal spread
    }, 140);
  });

  // show viewer element
  viewer.classList.remove('hidden');
  viewer.setAttribute('aria-hidden','false');
}

// renderSpread: shows a left/right page depending on current.pageIndex
function renderSpread(){
  const meta = projects[current.projectKey];
  const pages = meta.pages || [];
  const leftIndex = current.pageIndex - 1; // left page index (previous)
  const rightIndex = current.pageIndex; // right page index

  const { visibleLeft, visibleRight } = current.clonedBook;
  visibleLeft.innerHTML = '';
  visibleRight.innerHTML = '';

  // helper to fill side
  function fillSide(container, idx){
    if(idx < 0 || idx >= pages.length){
      container.innerHTML = '<div style="opacity:.2">—</div>';
      return;
    }
    const p = pages[idx];
    if(p.type === 'image'){
      const img = document.createElement('img');
      img.src = p.src;
      img.style.maxWidth = '100%'; img.style.maxHeight = '100%';
      container.appendChild(img);
    } else {
      container.innerHTML = p.content || '';
    }
  }

  // left is previous page
  fillSide(visibleLeft, leftIndex);
  fillSide(visibleRight, rightIndex);

  // update control states
  prevBtn.disabled = (current.pageIndex <= 0);
  nextBtn.disabled = (current.pageIndex >= (pages.length - 1));
}

// flip page animation — we animate the right side flipping to left
function nextPage(){
  const pages = projects[current.projectKey].pages;
  if(current.pageIndex >= pages.length - 1) return;

  const { visibleRight } = current.clonedBook;

  // create a temporary page element that visually flips
  const flip = visibleRight.cloneNode(true);
  flip.style.position = 'absolute';
  flip.style.left = '50%';
  flip.style.top = '0';
  flip.style.width = '50%';
  flip.style.transformOrigin = 'left center';
  flip.style.backfaceVisibility = 'hidden';
  flip.style.zIndex = 50;
  current.clonedBook.clone.appendChild(flip);

  // animate flip
  requestAnimationFrame(() => {
    flip.style.transition = 'transform .65s cubic-bezier(.2,.7,.2,1)';
    flip.style.transform = 'rotateY(-180deg)';
  });

  // after animation, increment index and cleanup
  setTimeout(() => {
    current.pageIndex++;
    renderSpread();
    flip.remove();
  }, 700);
}

function prevPage(){
  if(current.pageIndex <= 0) return;

  // flipping back visually: create temp left-side flip
  const { visibleLeft } = current.clonedBook;
  const flip = visibleLeft.cloneNode(true);
  flip.style.position = 'absolute';
  flip.style.left = '0';
  flip.style.top = '0';
  flip.style.width = '50%';
  flip.style.transformOrigin = 'right center';
  flip.style.backfaceVisibility = 'hidden';
  flip.style.zIndex = 50;
  current.clonedBook.clone.appendChild(flip);

  requestAnimationFrame(() => {
    flip.style.transition = 'transform .65s cubic-bezier(.2,.7,.2,1)';
    flip.style.transform = 'rotateY(180deg)';
  });

  setTimeout(() => {
    current.pageIndex--;
    renderSpread();
    flip.remove();
  }, 700);
}

// close animation: animate cover closing then scale back and hide viewer
function closeViewer(){
  if(!current.clonedBook) return;

  // 1) close the cover slowly first
  current.clonedBook.front.style.transition = 'transform .65s cubic-bezier(.2,.7,.2,1)';
  current.clonedBook.front.style.transform = '';

  // 2) after cover closes, ease the full book back like a physical put-away
  setTimeout(()=>{
    current.clonedBook.clone.style.transition = 'transform .55s cubic-bezier(.2,.7,.2,1)';
    current.clonedBook.clone.style.transform = 'scale(.94) translateX(20px) rotateY(6deg)';
  }, 300);

  // 3) remove viewer AFTER that is settled (much more natural)
  setTimeout(()=> {
    viewer.classList.add('hidden');
    viewer.setAttribute('aria-hidden','true');
    bookScene.innerHTML = '';
    current = { projectKey:null, pageIndex:0, clonedBook:null, pageElements:[] };
  }, 900);
}


// Wire shelf click handlers: pick a book, pull it out and open
bookWrappers.forEach(wrapper => {
  wrapper.addEventListener('click', (e) => {
  if(current.projectKey) return;

  const key = wrapper.dataset.project;
  if(!projects[key]) return;

  const book = wrapper.querySelector('.book');

  // small pull out from shelf animation
  book.style.transition = 'transform .45s cubic-bezier(.17,.67,.35,1.35)';
  book.style.transform = 'translateZ(40px) rotateY(-8deg) scale(1.1)';

  // wait then open the cloned one
  setTimeout(() => {
    openBook(key);

    // restore shelf book after open
    book.style.transform = '';
  }, 380);
})
});



// control buttons
nextBtn.addEventListener('click', nextPage);
prevBtn.addEventListener('click', prevPage);
closeBtn.addEventListener('click', closeViewer);

// keyboard shortcuts
document.addEventListener('keydown', (ev) => {
  if(!current.projectKey) return;
  if(ev.key === 'ArrowRight') nextPage();
  if(ev.key === 'ArrowLeft') prevPage();
  if(ev.key === 'Escape') closeViewer();
});

// Lamp toggle behavior: toggles a class on body to apply lighting styles
if(lampToggle){
  // restore previous lamp state if present
  const saved = localStorage.getItem('lampOn');
  if(saved === 'true') bodyEl.classList.add('lamp-on');

  lampToggle.addEventListener('click', (e) => {
    const on = bodyEl.classList.toggle('lamp-on');
    lampToggle.setAttribute('aria-pressed', on ? 'true' : 'false');
    // animate tiny button press visual by toggling a class on the element
    if(on) lampToggle.classList.add('on'); else lampToggle.classList.remove('on');
    localStorage.setItem('lampOn', on ? 'true' : 'false');
  });
}
