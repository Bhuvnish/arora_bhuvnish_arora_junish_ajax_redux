(() => {
  const baseUrl = "https://swapi.dev/api/people/";
  const characterList = document.querySelector("#character-list ul");
  const movieDetails = document.querySelector("#movie-details");
  const loadingIcon = document.querySelector("#loading-icon");
  const movieTitle = document.getElementById("movie-title");
  const openingCrawl = document.getElementById("opening-crawl");
  const moviePoster = document.getElementById("movie-poster");

  async function fetchData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error fetching data from ${url}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  function displayLoadingSpinner(element) {
    element.innerHTML = '<img src="./images/1486.gif" alt="Loading">';
  }

  function displayCharacters(characters) {
    characterList.innerHTML = "";

    characters.forEach(character => {
      const listItem = document.createElement("li");
      const anchorElement = document.createElement("a");
      anchorElement.href = "#";
      anchorElement.textContent = character.name;
      anchorElement.addEventListener('click', () => handleCharacterClick(character));
      listItem.appendChild(anchorElement);
      characterList.appendChild(listItem);
    });
  }

  async function handleCharacterClick(character) {
    displayLoadingSpinner(loadingIcon);

    try {
      const filmsData = await Promise.all(character.films.map(filmUrl => fetchData(filmUrl)));

      const firstFilmData = filmsData[0];

      displayMovieDetails(firstFilmData);
    } catch (error) {
      console.error('Error fetching film data:', error);
    } finally {
      loadingIcon.innerHTML = "";
    }
  }

  function displayMovieDetails(movie) {
    movieDetails.style.display = 'block';
    movieTitle.textContent = `Title: ${movie.title}`;
    openingCrawl.textContent = `Opening Crawl: ${movie.opening_crawl || "No opening crawl available"}`;
    moviePoster.src = `./images/${movie.episode_id}.jpg`;
    moviePoster.alt = `${movie.title} Poster`;
  }

  function init() {
    displayLoadingSpinner(loadingIcon);

    fetchData(baseUrl)
      .then(data => {
        displayCharacters(data.results);
      })
      .catch(error => {
        console.error('Error initializing:', error);
      })
      .finally(() => {
        loadingIcon.innerHTML = "";
      });
  }

  init();
})();
