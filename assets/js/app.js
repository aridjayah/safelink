function generateLink() {
  const url = document.getElementById('inputUrl').value;
  if (!url) return alert('Please enter a valid URL');

  const encoded = btoa(url);
  const safeLink = window.location.origin + window.location.pathname + 'go.html?data=' + encoded;

  document.getElementById('result').classList.remove('d-none');
  document.getElementById('outputUrl').value = safeLink;
}

function copyLink() {
  const output = document.getElementById('outputUrl');
  output.select();
  document.execCommand('copy');
  alert('Copied!');
}

// ================= Waiting Page =================

let countdown = 10;

if (window.location.pathname.includes('go.html')) {
  const timer = setInterval(() => {
    countdown--;
    const el = document.getElementById('countdown');
    if (el) el.innerText = `Wait ${countdown} seconds...`;

    if (countdown <= 0) {
      clearInterval(timer);
      document.getElementById('continueBtn').classList.remove('d-none');
      document.getElementById('countdown').innerText = 'Ready! Click continue';
    }
  }, 1000);
}

function goToLink() {
  const params = new URLSearchParams(window.location.search);
  const data = params.get('data');
  if (!data) return alert('Invalid link');

  const url = atob(data);
  window.location.href = url;
}