document.addEventListener('DOMContentLoaded', function() {
  // Detect current tab's URL and fill the site field
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const tab = tabs[0];
    const url = new URL(tab.url);
    document.getElementById('site').value = url.hostname;
  });
  
  document.getElementById('passwordForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const site = document.getElementById('site').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const passwordEntry = { site, username, password };

    chrome.storage.local.get({ passwords: [] }, function(result) {
      const passwords = result.passwords;
      passwords.push(passwordEntry);
      chrome.storage.local.set({ passwords: passwords }, function() {
        alert('Password saved!');
        document.getElementById('passwordForm').reset();
      });
    });
  });

  document.getElementById('viewPasswords').addEventListener('click', function() {
    chrome.storage.local.get({ passwords: [] }, function(result) {
      const passwords = result.passwords;
      const passwordList = document.getElementById('passwordList');
      passwordList.innerHTML = '';

      passwords.forEach(function(passwordEntry) {
        const div = document.createElement('div');
        div.textContent = `Site: ${passwordEntry.site}, Username: ${passwordEntry.username}, Password: ${passwordEntry.password}`;
        passwordList.appendChild(div);
      });
    });
  });

  document.getElementById('generatePassword').addEventListener('click', function() {
    const password = generateRandomPassword(10);
    document.getElementById('password').value = password;

    // Copiar al portapapeles
    navigator.clipboard.writeText(password).then(function() {
      alert('Generated password copied to clipboard!');
    }, function(err) {
      console.error('Could not copy text: ', err);
    });
  });

  document.getElementById('togglePassword').addEventListener('click', function() {
    const passwordField = document.getElementById('password');
    const passwordType = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', passwordType);
    this.textContent = passwordType === 'password' ? 'Show' : 'Hide';
  });

  function generateRandomPassword(length) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }
});
