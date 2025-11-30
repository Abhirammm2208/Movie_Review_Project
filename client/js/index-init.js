// Page initialization module - runs after TMDB is loaded
function setAuthUI(){
  const authed = API.isAuthed();
  document.getElementById('loginLink').style.display = authed? 'none':'inline';
  document.getElementById('registerLink').style.display = authed? 'none':'inline';
  document.getElementById('logoutBtn').style.display = authed? 'inline-flex':'none';
}

async function onLogout(){
  await API.signout();
  setAuthUI();
}

function reviewItem(r){
  const div = document.createElement('div');
  div.className = 'card review';
  const who = (r.reviewer && r.reviewer.username) ? r.reviewer.username : 'Anonymous';
  const initials = who.trim().slice(0,2).toUpperCase();
  div.innerHTML = `
    <div class="row" style="gap:12px">
      <div style="width:40px;height:40px;border-radius:999px;background:#0b1220;border:1px solid #23324a;display:flex;align-items:center;justify-content:center;font-weight:700;color:#60a5fa">${initials}</div>
      <div class="badge">${Number(r.rating).toFixed(1)}/10</div>
    </div>
    <div>
      <div class="muted">by ${escapeHtml(who)}</div>
      <div>${escapeHtml(r.reviewText)}</div>
    </div>
  `;
  return div;
}

function escapeHtml(text){
  const map = { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

async function search(){
  const movie = document.getElementById('movieInput').value.trim();
  if(!movie){ alert('Please enter a movie name'); return; }
  const resultsCard = document.getElementById('resultsCard');
  resultsCard.style.display = 'block';
  document.getElementById('resultTitle').textContent = `Reviews for "${movie}"`;
  document.getElementById('apiBase').textContent = API.base || '(proxy via /api)';
  const posterEl = document.getElementById('resultPoster');
  if(posterEl){
    posterEl.style.display = 'none';
    try{ const p = window.TMDB && window.TMDB.searchMovie ? await window.TMDB.searchMovie(movie) : null; if(p){ posterEl.src = p; posterEl.style.display = 'block'; } }catch(e){}
  }
  const list = document.getElementById('reviews');
  list.innerHTML = '<div class="muted">Loading…</div>';
  
  // Scroll to results section
  setTimeout(() => {
    resultsCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
  
  try{
    const reviews = await API.listReviews(movie);
    list.innerHTML = '';
    if(!reviews || reviews.length===0){
      list.innerHTML = '<div class="muted">No reviews yet. Be the first!</div>';
      return;
    }
    reviews.forEach(r => list.appendChild(reviewItem(r)));
  }catch(e){
    list.innerHTML = `<div class="error">${escapeHtml(e.message)}</div>`;
  }
}

function initFromQuery(){
  const params = new URLSearchParams(location.search);
  const m = params.get('movie');
  if(m){
    document.getElementById('movieInput').value = m;
    search();
  }
}

// Quick review form logic
let selectedRating = 0;
let currentMovieName = '';

function setupQuickReviewForm(){
  const ratingBtns = document.querySelectorAll('.rating-btn');
  const addReviewBtn = document.getElementById('addReviewBtn');
  const quickForm = document.getElementById('quickReviewForm');
  const cancelBtn = document.getElementById('cancelQuickReview');
  const submitBtn = document.getElementById('submitQuickReview');
  
  // Rating scale selection
  ratingBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      selectedRating = parseInt(btn.dataset.rating);
      ratingBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      document.getElementById('selectedRating').textContent = selectedRating;
    });
  });
  
  // Show form
  addReviewBtn.addEventListener('click', () => {
    if(!API.isAuthed()){
      const back = encodeURIComponent(location.href);
      location.href = `./login.html?back=${back}`;
      return;
    }
    quickForm.style.display = 'block';
    currentMovieName = document.getElementById('movieInput').value.trim();
    document.getElementById('quickReviewText').value = '';
    selectedRating = 0;
    ratingBtns.forEach(b => b.classList.remove('selected'));
    document.getElementById('selectedRating').textContent = '-';
    setTimeout(() => quickForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
  });
  
  // Cancel
  cancelBtn.addEventListener('click', () => {
    quickForm.style.display = 'none';
  });
  
  // Submit review
  submitBtn.addEventListener('click', async () => {
    const reviewText = document.getElementById('quickReviewText').value.trim();
    const msg = document.getElementById('quickReviewMsg');
    
    if(!selectedRating){
      msg.className = 'error';
      msg.textContent = 'Please select a rating';
      return;
    }
    if(reviewText.length < 30){
      msg.className = 'error';
      msg.textContent = 'Review must be at least 30 characters';
      return;
    }
    
    msg.className = 'muted';
    msg.textContent = 'Submitting...';
    
    try{
      await API.addReview({
        movieName: currentMovieName,
        rating: selectedRating,
        reviewText: reviewText
      });
      msg.className = 'success';
      msg.textContent = 'Review submitted! Refreshing...';
      quickForm.style.display = 'none';
      // Refresh reviews
      setTimeout(() => search(), 500);
    }catch(err){
      msg.className = 'error';
      msg.textContent = escapeHtml(err.message);
    }
  });
}

document.getElementById('searchBtn').addEventListener('click', search);
document.getElementById('logoutBtn').addEventListener('click', onLogout);
setAuthUI();
initFromQuery();
setupQuickReviewForm();

// Featured movies with images
const FEATURED = [
  'Inception','Interstellar','The Dark Knight','Avatar','Titanic',
  'Jurassic Park','The Matrix','Gladiator','Forrest Gump','The Godfather'
];

async function renderFeatured(){
  const grid = document.getElementById('featured');
  if(!grid) return;
  grid.innerHTML = '';
  for(const title of FEATURED.slice(0,10)){
    const card = document.createElement('div');
    card.className = 'card';
    let imgSrc = `https://placehold.co/300x450?text=${encodeURIComponent(title)}`;
    try { 
      const tmdbPoster = window.TMDB && window.TMDB.searchMovie ? await window.TMDB.searchMovie(title) : null; 
      if(tmdbPoster) imgSrc = tmdbPoster; 
    } catch(e){}
    card.innerHTML = `
      <div class="grid" style="grid-template-columns:140px 1fr;align-items:center">
        <img src="${imgSrc}" alt="${escapeHtml(title)} cover" style="width:140px;height:auto;border-radius:8px;border:1px solid #23324a" />
        <div>
          <h3 style="margin:0 0 8px 0">${escapeHtml(title)}</h3>
          <div class="row">
            <button class="btn primary">View reviews</button>
            <a class="btn" href="./add-review.html?movie=${encodeURIComponent(title)}">Add review</a>
          </div>
        </div>
      </div>
    `;
    card.querySelector('.btn.primary').addEventListener('click', ()=>{
      document.getElementById('movieInput').value = title;
      search();
    });
    grid.appendChild(card);
  }
}

renderFeatured();
