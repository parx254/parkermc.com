const tabs = document.querySelectorAll('.nav a');
const contents = document.querySelectorAll('.tab-content');
const rightSection = document.getElementById('rightSection');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

tabs.forEach(tab => {
    tab.addEventListener('mouseover', () => {
        rightSection.classList.add('flipped');
    });

    tab.addEventListener('mouseout', () => {
        rightSection.classList.remove('flipped');
    });

    tab.addEventListener('click', () => {
        const targetTab = document.getElementById(tab.dataset.tab);

        // Remove active class from all tabs
        tabs.forEach(t => t.classList.remove('active'));

        // Add active class to the clicked tab
        tab.classList.add('active');

        // Show the corresponding content
        contents.forEach(content => content.classList.remove('active'));
        targetTab.classList.add('active');
    });
});

// Search functionality
function handleSearch() {
    const query = searchInput.value.toLowerCase().trim();
    if (!query) return;

    // Clear previous highlights
    document.querySelectorAll('.highlight').forEach(el => {
        el.classList.remove('highlight');
        el.textContent = el.textContent; // Restore original text
    });

    let firstMatchFound = false;

    // Search visible text only
    contents.forEach(content => {
        const elements = content.querySelectorAll('*:not(a)'); // Exclude <a> tags

        elements.forEach(element => {
            if (element.childNodes.length) {
                element.childNodes.forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        const text = node.nodeValue;
                        const regex = new RegExp(`(${query})`, 'gi');

                        if (regex.test(text)) {
                            const highlighted = text.replace(regex, `<span class="highlight">$1</span>`);
                            const span = document.createElement('span');
                            span.innerHTML = highlighted;
                            node.parentNode.replaceChild(span, node);

                            if (!firstMatchFound) {
                                const firstHighlight = span.querySelector('.highlight');
                                if (firstHighlight) {
                                    tabs.forEach(tab => {
                                        const targetTab = document.getElementById(tab.dataset.tab);
                                        if (targetTab === content) {
                                            tab.click();
                                        }
                                    });
                                    firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    firstMatchFound = true;
                                }
                            }
                        }
                    }
                });
            }
        });
    });

    if (!firstMatchFound) {
        alert('No matches found!');
    }
}

// Add event listener to the search button
searchButton.addEventListener('click', handleSearch);

// Allow Enter key to trigger search
searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleSearch();
    }
});
