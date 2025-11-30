function setAuthUI(){
  const authed = API.isAuthed();
  document.getElementById('loginLink').style.display = authed? 'none':'inline';
  document.getElementById('logoutBtn').style.display = authed? 'inline-flex':'none';
}

async function onLogout(){ await API.signout(); setAuthUI(); }

function escapeHtml(text){
  const map = { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

function ensureAuth(){
  if(!API.isAuthed()){
    const back = encodeURIComponent('./add-review.html');
    location.href = `./login.html?back=${back}`;
  }
}

document.getElementById('revForm').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const movieName = document.getElementById('movieName').value.trim();
  const rating = document.getElementById('rating').value;
  const reviewText = document.getElementById('reviewText').value.trim();
  const msg = document.getElementById('msg');
  document.getElementById('apiBase').textContent = API.base;
  msg.textContent = 'Submitting…';
  try{
    await API.addReview({movieName, rating, reviewText});
    msg.className = 'success';
    msg.textContent = 'Review added! Redirecting…';
    setTimeout(()=> location.href = `./index.html?movie=${encodeURIComponent(movieName)}` , 600);
  }catch(err){
    msg.className = 'error';
    msg.textContent = escapeHtml(err.message);
  }
});

document.getElementById('logoutBtn').addEventListener('click', onLogout);
setAuthUI();
ensureAuth();
document.getElementById('apiBase').textContent = API.base;
