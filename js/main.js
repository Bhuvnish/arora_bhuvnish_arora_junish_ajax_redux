(() => {
  (function() {
  const baseUrl = "https://swapi.dev/api/people/";
  const characterListContainer = document.querySelector("#character-list-container ul");
  const movieDetailsContainer = document.querySelector("#movie-details-container");
  const loadingSpinner = document.querySelector("#loading-spinner");
  const adventureTitle = document.querySelector("#adventure-title");
  const galacticCrawl = document.querySelector("#galactic-crawl");
  const adventurePoster = document.querySelector("#adventure-poster");
 
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
     characterListContainer.innerHTML = "";
 
     characters.forEach(function(character) {
       var listItem = document.createElement("li");
       var anchorElement = document.createElement("a");
       anchorElement.href = "#";
       anchorElement.textContent = character.name;
       anchorElement.addEventListener('click', function() {
         handleCharacterClick(character);
       });
       listItem.appendChild(anchorElement);
       characterListContainer.appendChild(listItem);
     });
   }
 
   function handleCharacterClick(character) {
     displayLoadingSpinner(loadingSpinner);
 
     Promise.all(character.films.map(function(filmUrl) {
         return fetchData(filmUrl);
       }))
       .then(function(filmsData) {
         var firstFilmData = filmsData[0];
         displayAdventureDetails(firstFilmData);
       })
       .catch(function(error) {
         console.error('Error fetching film data:', error);
       })
       .finally(function() {
         loadingSpinner.innerHTML = "";
       });
   }
 
   function displayAdventureDetails(adventure) {
     movieDetailsContainer.style.display = 'block';
     adventureTitle.textContent = 'Title: ' + adventure.title;
     galacticCrawl.textContent = 'Opening Crawl: ' + (adventure.opening_crawl || "No opening crawl available");
     adventurePoster.src = './images/' + adventure.episode_id + '.jpg';
     adventurePoster.alt = adventure.title + ' Poster';
   }
 
   function init() {
     displayLoadingSpinner(loadingSpinner);
 
     fetchData(baseUrl)
       .then(function(data) {
         displayCharacters(data.results);
       })
       .catch(function(error) {
         console.error('Error initializing:', error);
       })
       .finally(function() {
         loadingSpinner.innerHTML = "";
       });
   }
 
   init();
 })();
})();