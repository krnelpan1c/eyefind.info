// hist storage and autocomplete
const searchInput = document.getElementById('searchInput');
const autocompleteList = document.getElementById('autocomplete-list');
const HISTORY_KEY = 'eyefind_search_history';

function getHistory() {
  const history = localStorage.getItem(HISTORY_KEY);
  return history ? JSON.parse(history) : [];
}

function saveToHistory(query) {
  if (!query) return;
  let history = getHistory();
  // Remove if already exists to move it to top
  history = history.filter(item => item !== query);
  history.unshift(query);
  // Keep only last 10 entries
  history = history.slice(0, 10);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function showSuggestions(val) {
  if (!autocompleteList) return;
  const history = getHistory();
  autocompleteList.innerHTML = '';
  if (!val) return false;

  const matches = history.filter(item =>
    item.toLowerCase().includes(val.toLowerCase())
  );

  matches.forEach(match => {
    const b = document.createElement('div');
    // Highlight the portion that matches
    const index = match.toLowerCase().indexOf(val.toLowerCase());
    b.innerHTML = match.substr(0, index);
    b.innerHTML += "<strong>" + match.substr(index, val.length) + "</strong>";
    b.innerHTML += match.substr(index + val.length);
    b.innerHTML += "<input type='hidden' value='" + match + "'>";

    b.addEventListener('click', function (e) {
      searchInput.value = this.getElementsByTagName('input')[0].value;
      closeAllLists();
      performSearch(searchInput.value);
    });
    autocompleteList.appendChild(b);
  });
}

function performSearch(searchQuery) {
  if (searchQuery !== '') {
    saveToHistory(searchQuery);
    // check if url or domain
    const isFullUrl = /^https?:\/\//i.test(searchQuery);
    const isDomain = !searchQuery.includes(' ') && searchQuery.includes('.') && !searchQuery.startsWith('.') && !searchQuery.endsWith('.') && searchQuery.split('.').pop().length >= 2;
    const isLocalhost = /^localhost(:\d+)?(\/.*)?$/i.test(searchQuery);

    if (isFullUrl) {
      window.open(searchQuery, '_self');
    } else if (isDomain || isLocalhost) {
      window.open(`http://${searchQuery}`, '_self');
    } else {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_self');
    }
  }
}

function closeAllLists(elmnt) {
  const x = document.getElementsByClassName('autocomplete-items');
  for (let i = 0; i < x.length; i++) {
    if (elmnt != x[i] && elmnt != searchInput) {
      x[i].innerHTML = '';
    }
  }
}

let currentFocus = -1;

if (searchInput) {
  searchInput.addEventListener('input', function (e) {
    showSuggestions(this.value);
  });

  searchInput.addEventListener('keydown', function (e) {
    let x = document.getElementById("autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) { // Down
      currentFocus++;
      addActive(x);
    } else if (e.keyCode == 38) { // Up
      currentFocus--;
      addActive(x);
    } else if (e.keyCode == 13) { // Enter
      if (currentFocus > -1) {
        if (x) x[currentFocus].click();
      } else {
        performSearch(this.value);
      }
    }
  });

  // Re-map the original enter listener to use performSearch
  searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      // Handled by keydown for autocomplete selection
    }
  });
}

function addActive(x) {
  if (!x) return false;
  removeActive(x);
  if (currentFocus >= x.length) currentFocus = 0;
  if (currentFocus < 0) currentFocus = (x.length - 1);
  x[currentFocus].classList.add("autocomplete-active");
}

function removeActive(x) {
  for (let i = 0; i < x.length; i++) {
    x[i].classList.remove("autocomplete-active");
  }
}

document.addEventListener('click', function (e) {
  closeAllLists(e.target);
});

//day of the week
function updateClock() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const now = new Date();
  const dayIndex = now.getDay();
  const currentDay = days[dayIndex];

  const dayElement = document.getElementById('current-day');
  if (dayElement) {
    dayElement.textContent = currentDay;
  }
}

// location randomization
const gtaLocations = [
  'Vinewood Hills', 'Del Perro', 'Rockford Plaza', 'Vespucci Beach', 'Mission Row', 'Strawberry', 'Pillbox Hill', 'Downtown', 'Sandy Shores', 'Grapeseed', 'Paleto Bay', 'Mirror Park', 'Little Seoul', 'Davis', 'Rancho', 'La Mesa', 'Cypress Flats', 'Elysian Island', 'Los Santos International Airport', 'Pacific Bluffs', 'Chumash', 'Richman', 'Morningwood', 'Great Chaparral', 'Grand Senora Desert', 'Alamo Sea', 'Tongva Hills', 'Banham Canyon', 'Zancudo River', 'Mount Chiliad', 'Mount Josiah', 'Mount Gordo', 'Braddock Pass', 'Raton Canyon', 'Palomino Highlands', 'Tataviam Mountains'
];

function randomizeLocation() {
  const locationElement = document.querySelector('.location');
  if (locationElement) {
    const randomIndex = Math.floor(Math.random() * gtaLocations.length);
    locationElement.textContent = gtaLocations[randomIndex];
  }
}

//featured websites randomization
const featuredSites = [
  'ammu-nation.jpg', 'arena-war.jpg', 'baby-name-generator.jpg', 'children-of-the-mountain.jpg', 'classic-vinewood.jpg', 'diamond-casino.jpg', 'docktease.jpg', 'ego-chaser.jpg', 'eilitas.jpg', 'hammerstein.jpg', 'himplants.jpg', 'jack-howitzer.jpg', 'los-santos-customs.jpg', 'ls-water-power.jpg', 'my-divine-within.jpg', 'pow-cleanse.jpg', 'prop-43.jpg', 'psychic-shoutout.jpg', 'reupublican-space-rangers.jpg', 'sue-murry.jpg', 'superautos.jpg', 'the-altruists.jpg', 'toilet-cleaner.jpg', 'vinewood-logline.jpg', 'warstock.jpg', 'your-dead-family.jpg'
];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function randomizeFeatured() {
  const images = document.querySelectorAll('.eyefind-featured__websites img');
  if (images.length === 0) return;

  // Detect path based on location
  const isSubpage = window.location.pathname.includes('/html/');
  const featuredSitesDir = isSubpage ? '../assets/img/featured-sites/' : './assets/img/featured-sites/';

  const shuffledSites = shuffle([...featuredSites]);

  images.forEach((img, index) => {
    if (shuffledSites[index]) {
      const site = shuffledSites[index];
      img.src = `${featuredSitesDir}${site}`;
      img.alt = site.split('.')[0].replace(/-/g, ' ');
    }
  });
}

const homeContent = document.getElementById('home-content');
const subpageContent = document.getElementById('subpage-content');
const featuredSitesSection = document.querySelector('.eyefind-featured');

async function loadSubpage(url) {
  if (!subpageContent || !homeContent) return;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const content = doc.querySelector('.main-container');

    if (content) {
      // Fix paths in the loaded content
      const elementsWithSrc = content.querySelectorAll('[src]');
      elementsWithSrc.forEach(el => {
        const src = el.getAttribute('src');
        if (src && src.startsWith('../')) {
          el.setAttribute('src', src.replace('../', './'));
        }
      });

      const elementsWithHref = content.querySelectorAll('[href]');
      elementsWithHref.forEach(el => {
        const href = el.getAttribute('href');
        if (href && href.startsWith('../')) {
          el.setAttribute('href', href.replace('../', './'));
        } else if (href === './index.html' || href === '../index.html') {
          el.addEventListener('click', (e) => {
            e.preventDefault();
            showHome();
            history.pushState({ home: true }, '', './index.html');
          });
        }
      });

      subpageContent.innerHTML = content.innerHTML;
      homeContent.style.display = 'none';
      subpageContent.style.display = 'flex';
      
      // Hide featured sites in category pages
      if (featuredSitesSection) {
        featuredSitesSection.style.display = 'none';
      }

      // Focus search input and scroll to top
      if (searchInput) searchInput.focus();
      window.scrollTo(0, 0);

      // Update featured sites randomization (though hidden, keeping it for data consistency)
      randomizeFeatured();
    }
  } catch (error) {
    console.error('Error loading subpage:', error);
    showHome();
  }
}

function showHome() {
  if (homeContent && subpageContent) {
    homeContent.style.display = 'flex';
    subpageContent.style.display = 'none';
    subpageContent.innerHTML = '';
    
    // Show featured sites on home page
    if (featuredSitesSection) {
      featuredSitesSection.style.display = 'block';
    }

    window.scrollTo(0, 0);
    randomizeFeatured();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (searchInput) {
    searchInput.focus();
  }
  updateClock();
  setInterval(updateClock, 1000);
  randomizeLocation();
  randomizeFeatured();

  // Check if we should load a subpage from URL
  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get('page');
  if (page) {
    loadSubpage(`./html/${page}.html`);
  }

  // Category links navigation
  const categoryLinks = document.querySelectorAll('.categories--link');
  categoryLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      const pageName = href.split('/').pop().replace('.html', '');
      loadSubpage(href);
      history.pushState({ page: pageName }, '', `?page=${pageName}`);
    });
  });

  // Logo link navigation
  const logoLink = document.querySelector('.header-content__media a');
  if (logoLink) {
    logoLink.addEventListener('click', (e) => {
      e.preventDefault();
      showHome();
      history.pushState({ home: true }, '', './index.html');
    });
  }

  // Handle back/forward buttons
  window.addEventListener('popstate', (e) => {
    if (e.state && e.state.page) {
      loadSubpage(`./html/${e.state.page}.html`);
    } else {
      showHome();
    }
  });
});
