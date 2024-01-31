(function() {
 const baseUrl = "https://swapi.dev/api/people/";
 const characterList = document.querySelector("#character-list ul");
 const movieDetails = document.querySelector("#movie-details");
 const loadingIcon = document.querySelector("#loading-icon");
 const movieTitle = document.querySelector("#movie-title");
 const openingCrawl = document.querySelector("#opening-crawl");
   const moviePoster = document.querySelector("#movie-poster");

  function fetchData(url) {
    return fetch(url)
      .then(function(response) {
        if (!response.ok) {
          throw new Error('Error fetching data from ' + url);
        }
        return response.json();
      })
      .catch(function(error) {
        console.error('Error fetching data:', error);
        throw error;
      });
  }

  function displayLoadingSpinner(element) {
    element.innerHTML = '<img src="./images/1486.gif" alt="Loading">';
  }

  function displayCharacters(characters) {
    characterList.innerHTML = "";

    characters.forEach(function(character) {
      var listItem = document.createElement("li");
      var anchorElement = document.createElement("a");
      anchorElement.href = "#";
      anchorElement.textContent = character.name;
      anchorElement.addEventListener('click', function() {
        handleCharacterClick(character);
      });
      listItem.appendChild(anchorElement);
      characterList.appendChild(listItem);
    });
  }

  function handleCharacterClick(character) {
    displayLoadingSpinner(loadingIcon);

    Promise.all(character.films.map(function(filmUrl) {
        return fetchData(filmUrl);
      }))
      .then(function(filmsData) {
        var firstFilmData = filmsData[0];
        displayMovieDetails(firstFilmData);
      })
      .catch(function(error) {
        console.error('Error fetching film data:', error);
      })
      .finally(function() {
        loadingIcon.innerHTML = "";
      });
  }

  function displayMovieDetails(movie) {
    movieDetails.style.display = 'block';
    movieTitle.textContent = 'Title: ' + movie.title;
    openingCrawl.textContent = 'Opening Crawl: ' + (movie.opening_crawl || "No opening crawl available");
    moviePoster.src = './images/' + movie.episode_id + '.jpg';
    moviePoster.alt = movie.title + ' Poster';
  }

  function init() {
    displayLoadingSpinner(loadingIcon);

    fetchData(baseUrl)
      .then(function(data) {
        displayCharacters(data.results);
      })
      .catch(function(error) {
        console.error('Error initializing:', error);
      })
      .finally(function() {
        loadingIcon.innerHTML = "";
      });
  }

  init();
})();
