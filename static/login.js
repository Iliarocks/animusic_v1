const auth = firebase.auth();
const database = firebase.database();
const nameIn = document.querySelector('#name-input');
const emailIn = document.querySelector('#email-input');
const passIn = document.querySelector('#pass-input');
const signInBtn = document.querySelector('#sign-in');
const signUpBtn = document.querySelector('#sign-up');

function whichOne() {
  console.log('wassup')
  if (document.title === 'Animusic | Sign in') {
    nameIn.style.display = 'none'
    signInBtn.style.display = 'block';
  } else {
    signUpBtn.style.display = 'block';
  }
}
whichOne()
window.addEventListener("hashchange", whichOne, false);

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
  window.history.pushState({ page: 'login' }, 'Animusic | Sign in', `${window.origin}/login`);
}