const auth = firebase.auth();
const database = firebase.database();
const nameIn = document.querySelector('#name-input');
const emailIn = document.querySelector('#email-input');
const passIn = document.querySelector('#pass-input');
const signInBtn = document.querySelector('#sign-in');
const signUpBtn = document.querySelector('#sign-up');
const link = document.querySelector('#link');

function whichOne(title) {
  if (title === 'Animusic | Sign in') {
    nameIn.style.display = 'none'
    signInBtn.style.display = 'block';
    signUpBtn.style.display = 'none';
    link.innerText = 'Sign up';
  } else {
    signUpBtn.style.display = 'block';
    signInBtn.style.display = 'none';
    link.innerText = 'Sign in';
  }
}
whichOne(document.title)

function pushState(page, title) {
  window.history.replaceState({}, title, `${window.origin}/${page}`);
  whichOne(title)
}

function signUp() {
  var name = nameIn.value;
  var email = emailIn.value;
  var pass = passIn.value;
  auth.createUserWithEmailAndPassword(email, pass)
    .catch(err => alert(err))
    .then(() => database.ref('/users/' + auth.currentUser.uid).set({ full_name: name }))
}

function signUp() {
  var email = emailIn.value;
  var pass = passIn.value;
  auth.signInWithEmailAndPassword(email, pass)
    .catch(err => alert(err))
}

auth.onAuthStateChanged(user => {
  if (user) {
    //window.location = window.origin
  }
})
document.querySelector('#link').onclick = () => {
  if (event.target.innerText === 'Sign in') {
    pushState('sign-in', 'Animusic | Sign in')
  } else if (event.target.innerText === 'Sign up') {
    pushState('sign-up', 'Animusic | Sign up')
  }
}