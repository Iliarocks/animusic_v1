const database = firebase.database();
const auth = firebase.auth();
const storage = firebase.storage();
const headerTitle = document.querySelector('header > div > h2');
const errorMessage_p = document.querySelector('#create-error-message');

auth.onAuthStateChanged(user => {
  if (user) {
    document.querySelector('.signed-in-header').style.display = 'inline-block';
    document.querySelector('.signed-out-header').style.display = 'none';
  } else {
    document.querySelector('.signed-out-header').style.display = 'inline-block';
    document.querySelector('.signed-in-header').style.display = 'none';
  }
})

//go to anime sub-page
function animeBoxEvent(arr) {
  arr.forEach(anime => {
    anime.addEventListener('click', e => {
      window.location = window.origin + '/' + e.currentTarget.id.split('-').join(' ');
    })
  })
}

function loadAnime() {
  database.ref('/anime').once('value', function(snap) {
      if (snap.val() === null) return;
      var anime = Object.values(snap.val()).sort((a, b) => b.likes - a.likes).slice(0, 4);
      var newHTML = anime.reduce((html, anime) => html + `<div id="${anime.en_name.split(' ').join('-')}" class="anime-box" style="background-image: url(${anime.cover_src})">
        <h1 class="en-name anime-box-text">${anime.en_name}</h1>
        <h3 class="jap-name anime-box-text">${anime.jap_name}</h3>
      </div>`, '');
      document.querySelector('.anime-holder').innerHTML = newHTML;
      var animeBoxs = document.querySelectorAll('.anime-box');
      animeBoxEvent(animeBoxs)
  })
}

//check if anime page exists
function animeExists(en, jap, wiki) {
  database.ref('/anime').once('value', function(snap) {
    if (snap.val() === null) return;
    var anime = Object.values(snap.val());
    var match = anime.filter(anime => anime.en_name === en || anime.jap_name === jap || anime.wiki === wiki);
    if (match.length > 0) {
      return true;
    }
    return false;
  })
}

//create anime page
async function createPage() {
  var enName = document.querySelector('#name-english-input').value.toLowerCase();
  var japName = document.querySelector('#name-japanese-input').value.toLowerCase();
  var wiki = document.querySelector('#anime-wik-input').value.toLowerCase();
  var cover = document.querySelector('#cover-input').files[0];
  if (enName === '' || japName === '' || wiki === '' || cover === undefined) {
    document.querySelector('.create-error-box').style.display = 'block';
    errorMessage_p.innerText = "Hmm... something's missing";
    return;
  }
  var exists = await animeExists(enName, japName, wiki);
  if (exists) {
    document.querySelector('.create-error-box').style.display = 'block';
    errorMessage_p.innerText = "Anime already exists";
    return;
  }
}

// go home from any page
headerTitle.onclick = () => {
  window.location = window.origin;
}
