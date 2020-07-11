const database = firebase.database();
const auth = firebase.auth();
const storage = firebase.storage();
const headerTitle = document.querySelector('header > div > h2');
const errorMessage_p = document.querySelector('#create-error-message');
const genreSelect = document.querySelector('.genre-select');

auth.onAuthStateChanged(user => {
  if (user) {
    document.querySelector('.signed-in-header').style.display = 'inline-block';
    document.querySelector('.signed-out-header').style.display = 'none';
  } else {
    document.querySelector('.signed-out-header').style.display = 'inline-block';
    document.querySelector('.signed-in-header').style.display = 'none';
  }
})

function signOut() {
  auth.signOut()
    .catch(err => alert(err.message))
}

//go to anime sub-page
function animeBoxEvent(arr) {
  arr.forEach(anime => {
    anime.addEventListener('click', e => {
      window.location = window.origin + '/' + e.currentTarget.id;
    })
  })
}

function getImgURL(ref) {
  var promise = storage.ref(ref).getDownloadURL().then(url => {
    return url;
  });
  return promise;
}

function loadAnime() {
  database.ref('/anime').once('value', function(snap) {
      if (snap.val() === null) return;
      var anime = Object.values(snap.val()).sort((a, b) => b.likes - a.likes).slice(0, 4);
      var newHTML = anime.reduce((html, anime) => {
        return html + `<div id="${anime.en_name.split(' ').join('-')}" class="anime-box" style="background-image: url(${anime.cover_src})">
          <h1 class="en-name anime-box-text">${anime.en_name}</h1>
          <h3 class="jap-name anime-box-text">${anime.jap_name}</h3>
        </div>`
      }, '')
      document.querySelector('.anime-holder').innerHTML = newHTML;
      var animeBoxs = document.querySelectorAll('.anime-box');
      animeBoxEvent(animeBoxs)
  })
}

//add creation error
function createErrorMsg(err) {
  if (err === 'missing') errorMessage_p.innerText = "Hmm... something's missing";
  if (err === 'exists') errorMessage_p.innerText = "Anime already exists";
}

//check if anime page exists
function animeExists(en, jap, wiki) {
  var promise = database.ref('/anime').once('value').then(snap => {
    if (snap.val() === null) return;
    var anime = Object.values(snap.val());
    var match = anime.filter(anime => anime.en_name === en || anime.jap_name === jap || anime.wiki === wiki);
    return match;
  })
  return promise
}

//create anime page
async function createPage() {
  var enName = document.querySelector('#name-english-input').value.toLowerCase();
  var japName = document.querySelector('#name-japanese-input').value.toLowerCase();
  var wiki = document.querySelector('#anime-wik-input').value.toLowerCase();
  var cover = document.querySelector('#cover-input').files[0];
  var genre = genreSelect.options[genreSelect.selectedIndex].value;
  if (enName === '' || japName === '' || wiki === '' || cover === undefined) {
    createErrorMsg('missing');
    return;
  }
  var exists = await animeExists(enName, japName, wiki);
  if (exists != undefined) {
    if (exists.length > 0) {
      createErrorMsg('exists')
      return;
    }
  }
  storage.ref(`/covers/${enName.split(' ').join('-')}`).put(cover)
  getImgURL(`/covers/${enName.split(' ').join('-')}`)
    .then(url => {
      database.ref(`/anime/${enName.split(' ').join('-')}`).set({ en_name:enName, jap_name:japName, wiki:wiki, cover_src:url, likes:0, genre})
      document.querySelector('.create-pop-up').style.display = 'none';
    })
}

//open create pop-up
document.querySelector('#create-btn-header').onclick = () => {
  document.querySelector('.create-pop-up').style.display = 'block';
}

//close create pop-up
document.querySelector('#close-create').onclick = () => {
  document.querySelector('.create-pop-up').style.display = 'none';
}

// go home from any page
headerTitle.onclick = () => {
  window.location = window.origin;
}

//open/close profile drop down
let profileDown = false;
document.querySelector('#header-profile-btn').onclick = () => {
  if (profileDown) {
    document.querySelector('.profile-drop-down').style.display = 'none';
    profileDown = false;
  } else {
    profileDown = true;
    document.querySelector('.profile-drop-down').style.display = 'block';
  }
}

// go to login page
document.querySelector('#go-login').onclick = () => {
  window.location = window.origin + '/sign-up'
}
