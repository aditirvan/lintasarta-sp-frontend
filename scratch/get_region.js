const { db } = require('../src/lib/firebase')
db.collection("region").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(doc.data());
    });
});