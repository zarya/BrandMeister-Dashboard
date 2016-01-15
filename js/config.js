function saveSettings(){
  localStorage.setItem('datetime', $('#datetime').is(':checked'));
  window.location.reload();
}

function loadSettings() {
    if (localStorage.getItem('todos') != undefined)
        config['timedate'] = localStorage.getItem('todos');
}
