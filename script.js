// ================== NAVIGATION ==================
const tabs = document.querySelectorAll('.nav a');
const contents = document.querySelectorAll('.tab-content');
const rightSection = document.getElementById('rightSection');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

// ================== MODAL ==================
const modal = document.getElementById("videoModal");
const btn = document.getElementById("openModal");
const span = document.querySelector(".close");

// ------------------ Tab functionality ------------------
tabs.forEach(tab => {
  tab.addEventListener('mouseenter', () => rightSection.classList.add('flipped'));
  tab.addEventListener('mouseleave', () => rightSection.classList.remove('flipped'));

  tab.addEventListener('click', e => {
    e.preventDefault();
    const targetTab = document.getElementById(tab.dataset.tab);
    if (!targetTab) return;

    // Switch active tab
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // Switch active content
    contents.forEach(content => content.classList.remove('active'));
    targetTab.classList.add('active');

    // ðŸ”¹ Update --color-secondary dynamically
    if (tab.dataset.color) {
      document.documentElement.style.setProperty('--color-secondary', tab.dataset.color);
    }
  });
});

// ------------------ Search functionality ------------------
function handleSearch() {
  const query = searchInput.value.toLowerCase().trim();
  if (!query) return;

  // Remove old highlights
  document.querySelectorAll('.highlight').forEach(el => {
    el.replaceWith(el.textContent);
  });

  let firstMatchFound = false;

  contents.forEach(content => {
    const elements = content.querySelectorAll('*:not(a)');

    elements.forEach(element => {
      element.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.nodeValue;
          if (!text.trim()) return;

          const regex = new RegExp(`(${query})`, 'gi');
          if (regex.test(text)) {
            const fragment = document.createDocumentFragment();
            let lastIndex = 0;

            text.replace(regex, (match, p1, offset) => {
              fragment.appendChild(document.createTextNode(text.slice(lastIndex, offset)));

              const span = document.createElement('span');
              span.className = 'highlight';
              span.textContent = p1;
              fragment.appendChild(span);

              lastIndex = offset + p1.length;
            });

            fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
            node.parentNode.replaceChild(fragment, node);

            // Jump to first match
            if (!firstMatchFound) {
              const firstHighlight = content.querySelector('.highlight');
              if (firstHighlight) {
                tabs.forEach(tab => {
                  if (document.getElementById(tab.dataset.tab) === content) tab.click();
                });
                firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstMatchFound = true;
              }
            }
          }
        }
      });
    });
  });

  if (!firstMatchFound) alert('No matches found!');
}

searchButton.addEventListener('click', handleSearch);
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') handleSearch();
});

// ------------------ Modal functionality ------------------
if (btn && modal) {
  btn.onclick = () => (modal.style.display = "block");
}
if (span) {
  span.onclick = () => (modal.style.display = "none");
}
window.onclick = e => {
  if (e.target === modal) modal.style.display = "none";
};

// ------------------ Contact Form (jQuery AJAX) ------------------
$(document).ready(function () {
  $('#contactForm').on('submit', function (e) {
    e.preventDefault();

    let $form = $(this);
    let $messageBox = $('#formMessage');

    $messageBox.text('Sending...').css('color', '#888');

    $.ajax({
      type: 'POST',
      url: 'contact.php',
      data: $form.serialize(),
      success: function () {
        $messageBox.text('Thank you! Your message has been sent.').css('color', 'green');
        $form[0].reset();
      },
      error: function () {
        $messageBox.text('There was an error sending your message.').css('color', 'red');
      }
    });
  });
});
