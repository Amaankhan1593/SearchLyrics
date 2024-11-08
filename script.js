// GET FORM ELEMENTS
const form = document.getElementById('form');
const search = document.getElementById('search');
const results = document.getElementById('results');
const pagination = document.getElementById('pagination');

// for api
const api = 'https://api.lyrics.ovh';

// functions
// 1. to search song title nd artist
async function searchSongs(term) {
    const res = await fetch(`${api}/suggest/${term}`)
    const data = await res.json();
    
    showData(data);
}

//2.function to display data from search into the UI
function showData(data){
    results.innerHTML = `
       <ul>
          ${data.data.map(
               song => `
                  <li>
                     <span>${song.artist.name} - ${song.title}</span>
                     <button class="btn" data-artist="${song.artist.name}" data-title="${song.title}">Get Lyrics</button>
                  </li>
              `
            ).join('')
          }
       </ul>
    `;

    // add pagination if req
     if ( data.prev || data.next ){
         pagination.innerHTML = `
           ${ data.prev ? `<button class="btn" onClick="getMoreSongs('${data.prev}')">Prev</button>` : '' }
           ${ data.next ? `<button class="btn" onClick="getMoreSongs('${data.next}')">Next</button>` : '' }
         `;
     } else{
        pagination.innerHTML = '';
     }
}

// 3.function to get prev nd next songs
async function getMoreSongs(url){
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
    const data = await res.json()

    showData(data);
}

// 4. function to get lyrics
async function getLyrics(artist, title) { 
    const res = await fetch(`${api}/v1/${artist}/${title}`)
    const data = await res.json();

    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '</br>');

    results.innerHTML = `
       <h2>${artist} - ${title}</h2>
       <p>${lyrics}</p>
    `;
    pagination.innerHTML = '';
}

// Event listener
form.addEventListener('click', e => {
    e.preventDefault();
    //
    const searchTerm = search.value.trim();
    //
    if (searchTerm){
        searchSongs(searchTerm);
    }
    else{
        alert('Please enter a valid search');
    }
})

// to get lyrics to a song on click of button
results.addEventListener('click', e => {
    const clickedElement = e.target;
    //
    if ( clickedElement.tagName === 'BUTTON' ){
        const artist = clickedElement.getAttribute('data-artist');     
        const title = clickedElement.getAttribute('data-title');
        //fetching the lyrics
        getLyrics(artist,title);

    }
})