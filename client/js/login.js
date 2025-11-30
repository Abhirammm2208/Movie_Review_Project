function escapeHtml(text){
  const map = { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

document.getElementById('loginForm').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const msg = document.getElementById('msg');
  msg.textContent = 'Signing in…';
  try{
    await API.signin(email,password);
    msg.className = 'success';
    msg.textContent = 'Signed in! Redirecting…';
    const back = new URLSearchParams(location.search).get('back') || './index.html';
    setTimeout(()=> location.href = back, 400);
  }catch(err){
    msg.className = 'error';
    msg.textContent = escapeHtml(err.message);
  }
});

// Show API base and ensure proxy in dev
document.getElementById('apiBase').textContent = API.base || '(proxy via /api)';
