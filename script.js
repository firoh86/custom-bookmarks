const modal = document.getElementById('modal');
const modalShow = document.getElementById('showModal');
const modalClose = document.getElementById('closeModal'); //
const bookmarkForm = document.getElementById('bookmark-form'); //
const bookmarksContainer = document.getElementById('bookmarks-container');
const websiteName = document.getElementById('website-name');

let bookmarks = [];

// Show modeal, focus on Input
const showModal = () => {
  modal.classList.add('show-modal');
  websiteName.focus();
};

// Modal Event Listener
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () =>
  modal.classList.remove('show-modal')
);
window.addEventListener('click', (e) =>
  e.target === modal ? modal.classList.remove('show-modal') : false
);
// Validate Data from form
const validate = (nameValue, urlValue) => {
  const expresion = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const regex = new RegExp(expresion);
  if (!nameValue || !urlValue) {
    alert('Please submit values for both fields.');
    return false;
  }

  if (!urlValue.match(regex)) {
    alert('please provide a valid web address');
    return false;
  }
  // Valid form
  return true;
};

// Build bookmarks
const buildBookmarks = () => {
  // Build items
  bookmarks.forEach((bookmark) => {
    const { name, url } = bookmark;
    //  Item
    const item = document.createElement('div');
    item.classList.add('bookmark__item');
    // Close icon
    const closeIcon = document.createElement('i');
    closeIcon.classList.add('fas', 'fa-times');
    closeIcon.setAttribute('title', 'Delete Bookmark');
    closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
    // Favicon /Link Container
    const linkInfo = document.createElement('div');
    linkInfo.classList.add('name');
    // Favicon
    const favicon = document.createElement('img');
    favicon.setAttribute(
      'src',
      `https://s2.googleusercontent.com/s2/favicons?domain=${url}`
    );
    favicon.setAttribute('alt', 'Favicon');
    // Link
    const link = document.createElement('a');
    link.classList.add('bookmark__link');
    link.setAttribute('href', `${url}`);
    link.setAttribute('target', '_blank');
    link.textContent = name;
    // Append to bookmarks container
    linkInfo.append(favicon, link);
    item.append(closeIcon, linkInfo);
    bookmarksContainer.appendChild(item);
  });
};

// Fetch bookmarjs
const fetchBoookmarks = () => {
  bookmarksContainer.innerHTML = '';
  // Get bookmarks from localStorage if avaible
  if (localStorage.getItem('bookmarks')) {
    bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  } else {
    // Create bookmarks array in localStorage
    bookmarks = [
      {
        name: 'Google',
        url: 'https://www.google.com',
      },
    ];
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }
  // console.log(bookmarks);
  buildBookmarks();
};

// Delete Bookmarks

const deleteBookmark = (url) => {
  bookmarks.forEach((bookmark, idx) => {
    if (bookmark.url === url) {
      bookmarks.splice(idx, 1);
    }
  });
  // Update bookmarks array in localStorage, re-populate DOM
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  fetchBoookmarks();
};

// Handle data from Form
const storeBookmark = (e) => {
  e.preventDefault();
  const nameValue = e.target.website.value;
  let urlValue = e.target.url.value;

  if (!urlValue.includes('http://', 'https://')) {
    urlValue = `http://${urlValue}`;
  }
  validate(nameValue, urlValue);
  if (!validate(nameValue, urlValue)) {
    return false;
  }
  const bookmark = {
    name: nameValue,
    url: urlValue,
  };
  bookmarks.push(bookmark);
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  fetchBoookmarks();
  bookmarkForm.reset();
  websiteName.focus();
};

// Event Listener
bookmarkForm && bookmarkForm.addEventListener('submit', storeBookmark);

// On load, Fetch Bookmarks

window.addEventListener('load', fetchBoookmarks);
