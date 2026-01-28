
console.log("PONTUAL v5.0 PRO");

// Navegação por abas
document.querySelectorAll('.sidebar button').forEach(btn => {
 btn.onclick = () => {
  document.getElementById('content').innerHTML =
   `<h2>${btn.innerText}</h2><p>Funcionalidade ativa.</p>`;
 };
});

// Service Worker PWA
if('serviceWorker' in navigator){
 navigator.serviceWorker.register('sw.js');
}
