// ----------------- Project data (add as many pages per project as you like) -----------------
const projects = {
  project1: {
    title: "Slugorithm",
    pages: [
      { type: "text", content: "</h3><p>This project is a reimagined version of Snake created as a class project and my first full-scale game developed using GDevelop and its event-based coding system. The player takes on the role of a social media user building an online community, where each segment of the snake represents a follower. </p>" },
      { type: "text", content: "<p>The 'content' the player chooses to engage with affect community growth and 'trust'. As influence increases, the game becomes more challenging. The algorithm introduces new challenges such as negativity or brain rot. Plus, managing followers requires greater responsibility! </p>" },
      { type: "text", content: "<p>Visual effects such as screen distortion represent the impact of negativity within the community. Slugorithm (inspired by UCSC's slug mascot + algorithm) uses classic Snake mechanics as a metaphor for the instability and responsibility that come with influence in online spaces.</p>" },
      { type: "text", content: "<p>The Process: Story-boarding</p>" },
      { type: "image", src: "images/storyboarding.png", caption:"<p>The process: story-boarding</p>" },
      { type: "text", content: "<p>Final game outcome: </p>" },
      { type: "image", src: "images/slug1.png", caption:"Game" },
      { type: "image", src: "images/slug2.png", caption:"Detail" },
      { type: "image", src: "images/slug3.png", caption:"Detail" },
      { type: "text", content: "<p> Available to play here!: https://gd.games/instant-builds/64a754e9-4c10-4a31-ac48-e8a6c630e7ce</p>" }
    ]
  },
  project2: {
    title: "Minecraft Research",
    pages: [
      { type: "text", content: "<h3>Minecraft Research Project</h3>" },
      { type: "text", content: "<p>Designed algorithms for procedural city generation in Minecraft using amulet, improving the efficiency of large-scale world-building tasks. Contributed to multiple building designs, with a primary focus on the design and implementation of a café structure. </p>" },
      { type: "text", content: "<p>Developed Python scripts to automate the placement of buildings and infrastructure, significantly reducing manual labor and enhancing the overall design process. Collaborated with a team to ensure cohesive architectural styles and functional layouts within the generated cityscape. </p>" },
      { type: "image", src: "images/code.png", caption:"Minecraft procedural city generation project" },
      { type: "text", content: "<p>Cafe progress - ongoing </p>" },
      { type: "image", src: "images/cafe.png" },
    ]
  },
  project3: {
    title: "Cloudy Clues",
    pages: [
      { type: "text", content: "<h3>Cloudy Clues</h3>" },
      { type: "text", content: "<p>Cloudy Clues is an AI-driven guessing game developed by a team of 2 (Erin Kim & Tyler Benavides) during the first Supercell Hackathon. Players identify objects generated in real time by an AI character, Ms. Pea, using a text-to-3D pipeline powered by Gemini Flash 2.0, Hyper3D, and Rodin AI, built in Godot.</p>" },
      { type: "text", content: "<p>The project demonstrates a novel approach to real-time, AI-generated 3D content in games, with future work focused on achieving faster, fully real-time text-to-3D generation for more interactive and personalized gameplay.</p>" },
      { type: "text", content: "<p>Game screenshots: </p>" },
      { type: "image", src: "images/cloudy3.png", caption:"Game screenshot" },
      { type: "image", src: "images/cloudy1.png", caption:"Game screenshot" },
      { type: "image", src: "images/cloudy2.png", caption:"Game screenshot" },
      { type: "text", content: "<p>Source on Github https://github.com/Razorboot/reAIm2</p>" },
      {type: "text", content: "<p>Demo video link https://www.youtube.com/watch?v=fo8PREw6jJ0</p>" },
      {type: "text", content: "<p>Play here https://tybena.itch.io/cloudy-clues</p>" },
      { type: "image", src: "images/supercell.JPG", caption:"Hackathon team photo" }
    ]
  },
  project4: {
    title: "Sunset Painting",
    pages: [
      { type: "image", src: "images/me.jpg" },
      { type: "image", src: "images/.jpg" }
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
    title: "Sketchbook",
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
  // restore previous lamp state if present, default to ON
  const saved = localStorage.getItem('lampOn');
  const isOn = (saved === null) ? true : (saved === 'true');
  
  if(isOn) {
    bodyEl.classList.add('lamp-on');
    lampToggle.setAttribute('aria-pressed', 'true');
  }

  const lampShade = document.querySelector('.lamp-shade');
  
  // Pull string interaction
  let startY = 0;
  let isDragging = false;
  let hasPulled = false;

  lampToggle.addEventListener('pointerdown', (e) => {
    isDragging = true;
    startY = e.clientY;
    hasPulled = false;
    lampToggle.style.transition = 'none';
  });

  lampToggle.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const deltaY = e.clientY - startY;
    if (deltaY > 0 && deltaY < 50) {
      lampToggle.style.transform = `translateX(calc(-50% + 20px)) translateY(${deltaY}px)`;
      // Toggle when pulled down enough
      if (deltaY > 25 && !hasPulled) {
        hasPulled = true;
        const on = bodyEl.classList.toggle('lamp-on');
        lampToggle.setAttribute('aria-pressed', on ? 'true' : 'false');
        localStorage.setItem('lampOn', on ? 'true' : 'false');
        
        // trigger shimmy animation when turning on
        if(on && lampShade) {
          lampShade.classList.add('shimmy');
          setTimeout(() => lampShade.classList.remove('shimmy'), 500);
        }
      }
    }
  });

  lampToggle.addEventListener('pointerup', () => {
    isDragging = false;
    lampToggle.style.transition = 'transform 0.2s ease-out';
    lampToggle.style.transform = 'translateX(calc(-50% + 20px))';
  });

  lampToggle.addEventListener('pointercancel', () => {
    isDragging = false;
    lampToggle.style.transition = 'transform 0.2s ease-out';
    lampToggle.style.transform = 'translateX(calc(-50% + 20px))';
  });

  // Fallback click for tap
  lampToggle.addEventListener('click', (e) => {
    if (!hasPulled) {
      const on = bodyEl.classList.toggle('lamp-on');
      lampToggle.setAttribute('aria-pressed', on ? 'true' : 'false');
      localStorage.setItem('lampOn', on ? 'true' : 'false');
      
      if(on && lampShade) {
        lampShade.classList.add('shimmy');
        setTimeout(() => lampShade.classList.remove('shimmy'), 500);
      }
    }
  });
}
