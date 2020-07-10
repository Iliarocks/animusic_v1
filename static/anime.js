const database = firebase.database();
const auth = firebase.auth();
const storage = firebase.storage();

auth.onAuthStateChanged(user => {
  if (user) {
    document.querySelector('.signed-in-header').style.display = 'inline-block';
    document.querySelector('.signed-out-header').style.display = 'none';
  } else {
    document.querySelector('.signed-out-header').style.display = 'inline-block';
    document.querySelector('.signed-in-header').style.display = 'none';
  }
})

function loadAnime() {
  database.ref(`/anime/${window.animeName}`).once('value', snap => {
    if (snap.val() === null) {
      document.querySelector('#english-title').innerText = 'Page not found';
      document.querySelector('#jap-title').innerHTML = 'Go <a href="' + window.origin + '">home</a>'
      document.querySelector('#wiki-link').style.display = 'none';
      document.querySelector('#genre-select').style.display = 'none';
      return;
    };
    document.querySelector('#cover-img').style.backgroundImage = `url(${snap.val().cover_src})`;
    document.querySelector('#english-title').innerText = snap.val().en_name;
    document.querySelector('#jap-title').innerText = snap.val().jap_name;
    document.querySelector('#wiki-link-text').innerText = snap.val().wiki;
    document.querySelector('#wiki-link').href = snap.val().wiki;
    document.querySelector('#genre-select').value = snap.val().genre;
  })
}

function songExists(embeded) {
  var promise = database.ref(`/anime/${window.animeName}/songs`).once('value').then(snap => {
    if (snap.val() === null) return;
    var songs = Object.values(snap.val());
    var match = songs.filter(song => song.embeded === embeded);
    return match
  })
  return promise
}

async function addSong() {
  var url = document.querySelector('#spotify-link-input').value;
  if (url.split('/').indexOf('album') > 0) return;
  var embeded = `<iframe src="https://open.spotify.com/embed/track/${url.split('/')[url.split('/').length - 1].split('=')[0].split('?')[0]}" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`;
  let exists = await songExists(embeded)
  if (exists.length > 0) {
    document.querySelector('#add-error-text').innerText = 'Hmm... seems like this song has already been added😁';
    return
  }
  database.ref(`anime/${window.animeName}/songs`).push({ embeded })
  document.querySelector('.add-song-prompt').style.display = 'none';
  document.querySelector('#spotify-link-input').value = '';
}

function loadSongs() {
  database.ref(`/anime/${window.animeName}/songs`).once('value', snap => {
    if (snap.val() === null) return;
    let songs = Object.values(snap.val());
    console.log(songs)
    let newHTML = songs.reduce((html, song) => html + song.embeded, '');
    document.querySelector('.song-holder').innerHTML = newHTML;
  })
}

function setAnimeName(anime) {
  window.animeName = anime;
  loadAnime()
  loadSongs()
}

//go home from anime page
document.querySelector('.header-navigator > h2').onclick = () => {
  window.location = window.origin;
}

//close add song pop up
document.querySelector('#close-add-song').onclick = () => {
  document.querySelector('.add-song-prompt').style.display = 'none';
}

//open add song pop up
document.querySelector('#open-add-song').onclick = () => {
  document.querySelector('.add-song-prompt').style.display = 'block';
}
// <iframe src="https://open.spotify.com/embed/track/2Vjg5rtBcuzx99SyAOHJsD" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
// https://open.spotify.com/track/2Vjg5rtBcuzx99SyAOHJsD?si=IdAbYABcQSKFmOzB6DO1Fw
