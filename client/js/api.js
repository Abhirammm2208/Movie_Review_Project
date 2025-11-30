// Basic API client for the Movie Review backend
import '../css/styles.css';
(function(){
  const DEFAULT_BASE = 'http://localhost:5000';
  const stored = localStorage.getItem('API_BASE_URL');
  const isViteDev = ['5173','5174'].includes(location.port);
  // In Vite dev, always use relative paths to hit the proxy
  const base = isViteDev
    ? ''
    : (window.API_BASE_URL || stored || ((location.origin && location.origin !== 'null' && location.origin !== 'file://') ? location.origin : '') || DEFAULT_BASE).replace(/\/$/, '');

  function getToken(){return localStorage.getItem('TOKEN')||''}
  function setToken(t){ if(t) localStorage.setItem('TOKEN', t) }
  function clearToken(){ localStorage.removeItem('TOKEN') }
  function isAuthed(){ return !!getToken() }

  async function api(path, opts={}){
    const url = (base ? base : '') + path;
    const headers = Object.assign({'Content-Type':'application/json'}, opts.headers||{});
    if(opts.auth && getToken()) headers['Authorization'] = `Bearer ${getToken()}`;
    const res = await fetch(url, Object.assign({}, opts, { headers }));
    let data; try { data = await res.json() } catch(e){ data = null }
    if(!res.ok){
      const msg = (data && (data.msg || (data.errors && data.errors[0] && data.errors[0].msg))) || `Request failed (${res.status})`;
      throw new Error(msg);
    }
    return data;
  }

  // Auth endpoints
  async function signin(email, password){
    const data = await api('/api/auth/signin',{method:'POST', body: JSON.stringify({email,password})});
    if(data && data.token) setToken(data.token);
    return data;
  }
  async function signup(fullName, username, email, password){
    const data = await api('/api/auth/signup',{method:'POST', body: JSON.stringify({fullName,username,email,password})});
    if(data && data.token) setToken(data.token);
    return data;
  }
  async function signout(){
    try { await api('/api/auth/signout',{method:'POST'}); } catch(e){}
    clearToken();
  }

  // Reviews
  async function listReviews(movieName){
    const safe = encodeURIComponent(movieName.trim());
    return api(`/api/reviews/${safe}`, { method:'GET' });
  }
  async function addReview({movieName, rating, reviewText}){
    return api('/api/reviews', { method:'POST', auth:true, body: JSON.stringify({movieName, rating: Number(rating), reviewText})});
  }

  // Expose globally for simplicity
  window.API = {
    base,
    getToken, setToken, clearToken, isAuthed,
    signin, signup, signout,
    listReviews, addReview
  };
})();
