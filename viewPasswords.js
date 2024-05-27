document.addEventListener('DOMContentLoaded', function() {
    let passwords = [];
  
    function renderPasswords() {
      const passwordList = document.getElementById('passwordList');
      passwordList.innerHTML = '';
  
      passwords.forEach(function(passwordEntry, index) {
        const div = document.createElement('div');
        div.innerHTML = `
          Site: <input type="text" class="site" value="${passwordEntry.site}" readonly>
          Username: <input type="text" class="username" value="${passwordEntry.username}">
          Password: <input type="text" class="password" value="${passwordEntry.password}">
          <button class="save" data-index="${index}">Save</button>
          <button class="delete" data-index="${index}">Delete</button>
          <hr>
        `;
        passwordList.appendChild(div);
      });
    }
  
    chrome.storage.local.get({ passwords: [] }, function(result) {
      passwords = result.passwords;
      renderPasswords();
    });
  
    document.getElementById('exportCSV').addEventListener('click', function() {
      const csvContent = 'data:text/csv;charset=utf-8,' +
        passwords.map(entry => Object.values(entry).join(',')).join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'passwords.csv');
      document.body.appendChild(link);
      link.click();
    });
  
    document.getElementById('goBack').addEventListener('click', function() {
      window.close();
    });
  
    document.getElementById('passwordList').addEventListener('click', function(event) {
      const target = event.target;
  
      if (target.classList.contains('save')) {
        const index = parseInt(target.getAttribute('data-index'));
        const site = this.getElementsByClassName('site')[index].value;
        const username = this.getElementsByClassName('username')[index].value;
        const password = this.getElementsByClassName('password')[index].value;
  
        passwords[index] = { site, username, password };
        chrome.storage.local.set({ passwords: passwords }, function() {
          renderPasswords();
          alert('Password information saved successfully!');
        });
      } else if (target.classList.contains('delete')) {
        const index = parseInt(target.getAttribute('data-index'));
        passwords.splice(index, 1);
        chrome.storage.local.set({ passwords: passwords }, function() {
          renderPasswords();
        });
      }
    });
  });
  