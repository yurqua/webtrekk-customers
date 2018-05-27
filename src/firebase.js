import firebase from 'firebase'
const config = {
    apiKey: "AIzaSyAlh_ydml_9Nuj-r6nhBRng0NGnFFi90YE",
    authDomain: "webtrekk-customers.firebaseapp.com",
    databaseURL: "https://webtrekk-customers.firebaseio.com",
    projectId: "webtrekk-customers",
    storageBucket: "",
    messagingSenderId: "749947351521"
};
firebase.initializeApp(config);
export default firebase;