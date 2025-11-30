function escapeHtml(text){
  const map = { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

document.getElementById('regForm').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const fullName = document.getElementById('fullName').value.trim();
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const msg = document.getElementById('msg');
  msg.textContent = 'Creating account…';
  try{
    await API.signup(fullName, username, email, password);
    msg.className = 'success';
    msg.textContent = 'Account created! Redirecting…';
    setTimeout(()=> location.href = './index.html', 500);
  }catch(err){
    msg.className = 'error';
    msg.textContent = escapeHtml(err.message);
  }
});

document.getElementById('apiBase').textContent = API.base || '(proxy via /api)';
