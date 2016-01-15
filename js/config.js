function saveSettings(){
  localStorage.setItem('datetime', $('#datetime').is(':checked'));
  window.location.reload();
}
