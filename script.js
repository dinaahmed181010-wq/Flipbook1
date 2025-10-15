const db = firebase.firestore();
const flipbook = document.querySelector('.flipbook');
const totalPages = 30;
let current = 0;

// Create pages dynamically
for (let i = 0; i < totalPages; i++) {
  const page = document.createElement('div');
  page.classList.add('page');
  page.dataset.page = i;
  page.contentEditable = true;
  page.innerHTML = `Article ${i + 1}: Type here...`;

  // Listen for changes and update Firestore
  page.addEventListener('input', () => {
    const content = page.innerHTML;
    db.collection('flipbook').doc(`page-${i}`).set({ text: content });
  });

  flipbook.appendChild(page);
}

const pages = document.querySelectorAll('.page');

// Show page function
function showPage(index) {
  pages.forEach((page, i) => {
    page.classList.toggle('active', i === index);
  });
}

// Navigation buttons
document.getElementById('prev').addEventListener('click', () => {
  if (current > 0) current--;
  showPage(current);
});
document.getElementById('next').addEventListener('click', () => {
  if (current < pages.length - 1) current++;
  showPage(current);
});

// Show first page initially
showPage(current);

// Load Firestore data and listen for updates
for (let i = 0; i < totalPages; i++) {
  db.collection('flipbook').doc(`page-${i}`).onSnapshot(doc => {
    if (doc.exists) {
      pages[i].innerHTML = doc.data().text;
    }
  });
}