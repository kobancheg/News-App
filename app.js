// Custom Http Module
function customHttp() {
  return {
    get(url, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.addEventListener('load', () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener('error', () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        xhr.send();
      } catch (error) {
        cb(error);
      }
    },
    post(url, body, headers, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.addEventListener('load', () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener('error', () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        if (headers) {
          Object.entries(headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value);
          });
        }

        xhr.send(JSON.stringify(body));
      } catch (error) {
        cb(error);
      }
    },
  };
}
// Init http module
const http = customHttp();

const newsService = (function () {
  const apiKey = '';
  const apiUrl = '';

  return {
    topHeadlines(country = 'ru', category = 'technology', cb) {
      http.get(`${apiUrl}/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}`, cb);
    },
    everything(query, cb) {
      http.get(`${apiUrl}/everything?q=${query}&apiKey=${apiKey}`, cb)
    }
  }
})();

// Elements
const form = document.forms['newsControls'];
const countrySelect = form.elements['country'];
const categorySelect = form.elements['category']
const searchInput = form.elements['search'];

form.addEventListener('submit', e => {
  e.preventDefault();
  loadNews();
})

//  init selects
document.addEventListener('DOMContentLoaded', function () {
  M.AutoInit();
  loadNews();
});

// load news function
function loadNews() {
  showLoader();

  const country = countrySelect.value;
  const category = categorySelect.value;
  const searchText = searchInput.value;

  if (!searchText) {
    newsService.topHeadlines(country, category, onGetResponse)
  } else {
    newsService.everything(searchText, onGetResponse)
  }
}

// function on get response from server
function onGetResponse(err, res) {
  removePreloader()

  if (err) {
    showAlert(err, 'error-msg');
    return;
  }

  if (!res.articles.length) {
    showAlert('Nothing found');
    return;
  }

  renderNews(res.articles)
}

// function render news
function renderNews(news) {
  const newsContainer = document.querySelector('.news-container .row');
  if (newsContainer.children.length) {
    clrearContainer(newsContainer);
  }
  let fragment = '';

  news.forEach((newsItem) => {
    const el = newsTemplate(newsItem)
    fragment += el;
  })

  newsContainer.insertAdjacentHTML('afterbegin', fragment);
}

// Function clear container
function clrearContainer(container) {
  let child = container.lastElementChild;
  while (child) {
    container.removeChild(child);
    child = container.lastElementChild;
  }
}

// news item template function
function newsTemplate({ urlToImage, title, url, description }) {
  if (urlToImage === '') {
    urlToImage = 'https://ok-education.eu/wp-content/uploads/2018/08/news.jpg'
  }
  return `
  <div class="col s12">
    <div class="card">
      <div class="card-image">
        <img src="${urlToImage}">
        <span class="card-title">${title || ''}</span>
      </div> 
      <div class="card-content">
        <p>${description || ''}</p>
      </div>
       <div class="card-action">
          <a href="${url}">Read more...</a>
       </div>
    </div>
  </div>
  `;
}

function showAlert(msg, type = 'success') {
  M.toast({ html: msg, class: type });
}

// Shou loader function
function showLoader() {
  document.body.insertAdjacentHTML(
    'afterbegin',
    `
    <div class="progress">
      <div class="indeterminate"></div>
    </div>`
  )
}

// Remove loader function
function removePreloader() {
  const loader = document.querySelector('.progress');
  if (loader) {
    loader.remove()
  }
}

function setDefaultImage() {

}
