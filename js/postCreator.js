let db = {};

$(document).ready(function() {
    // Initialize Cloud Firestore through Firebase
    db = firebase.firestore();

    // Disable deprecated features
    db.settings({
        timestampsInSnapshots: true
    });
    db.collection("posts").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            let post = doc.data();
            createPost(post.title, post.price);
        });
    });
});

function submitPost() {
    const title = document.getElementById('title').value;
    const price = document.getElementById('price').value;
    const category = document.getElementById('category').value;
    if (!title) {
        window.alert("You need to enter a title.");
        return;
    }
    if (!price) {
        window.alert("You need to enter a price.");
        return;
    }
    db.collection("posts").add({
        title: title,
        price: price,
        category: category
    })
        .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
            $('#uploadModal').modal('hide');
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
}

const ilat = 47.148182;
const ilong = 27.591623;

const distanceCalc = "Distance from you: " + Math.floor(google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(ilat, ilong), new google.maps.LatLng(clat, clong))/1000)+" km";

const feed = document.getElementById("feed");

for (let i = 1; i <= 100; i++) {
	//create a post

}

function createPost(titleValue, priceValue) {
    const post = document.createElement("div");
    const topSide = document.createElement("span");
    const title = document.createElement("h2");
    const dateTime = document.createElement("span");
    const img = document.createElement("img");
    const bottomSide = document.createElement("div");
    const price = document.createElement("span");
    const upvote = document.createElement("img");
    const downvote = document.createElement("img");
    const distance = document.createElement("span");
    const showMap = document.createElement("img");

    post.style.maxWidth = "60%";
    post.style.marginLeft = "20%";

    dateTime.classList.add("button1");
    const today = new Date();
    dateTime.textContent = (today.getDate() < 10 ? '0' : '') + today.getDate() + '.' + (today.getMonth() < 9 ? '0' : '') + (today.getMonth() + 1) + '.' + today.getFullYear()
        + ' ' + (today.getHours() < 10 ? '0' : '')+ today.getHours() + ':' + (today.getMinutes() < 10 ? '0' : '') + today.getMinutes();
    dateTime.style.padding = "1%";
    dateTime.style.display = "inline-block";

    dateTime.style.cssFloat = "right";

    title.classList.add("text-title");
    title.textContent = titleValue;
    title.style.display = "inline-block";

    topSide.appendChild(title);
    topSide.appendChild(dateTime);

    img.setAttribute("src", "imgs/test_pooky.jpg");
    img.classList.add("background-obj");
    img.style.width = "100%";
    img.style.margin = "auto";

    price.classList.add("button1");
    price.textContent = priceValue + " DKK";
    price.style.padding = "1%";
    price.style.marginLeft = "5%";

    upvote.setAttribute("src", "imgs/upvote.png");
    downvote.setAttribute("src", "imgs/downvote.png");

    upvote.style.marginRight = "2%";
    upvote.style.maxWidth = "10%";
    upvote.onclick = function() {
        if (upvote.getAttribute("src") === "imgs/upvote.png") {
            upvote.setAttribute("src", "imgs/upvoteActive.png");
            if (downvote.getAttribute("src") === "imgs/downvoteActive.png")
                downvote.setAttribute("src", "imgs/downvote.png");
        }
        else
            upvote.setAttribute("src", "imgs/upvote.png");
    };

    downvote.style.maxWidth = "10%";
    downvote.onclick = function() {
        if (downvote.getAttribute("src") === "imgs/downvote.png") {
            downvote.setAttribute("src", "imgs/downvoteActive.png");
            if (upvote.getAttribute("src") === "imgs/upvoteActive.png")
                upvote.setAttribute("src", "imgs/upvote.png");
        }
        else
            downvote.setAttribute("src", "imgs/downvote.png");
    };

    distance.classList.add("button1");
    distance.textContent = distanceCalc;
    distance.style.cssFloat = "right";
    distance.style.padding = "1%";
    distance.style.display = "inline-block";
    distance.style.marginRight = "1%";

    showMap.setAttribute("src", "imgs/showMap.png");
    showMap.style.maxWidth = "30px";
    showMap.style.cssFloat = "right";
    showMap.style.display = "inline-block";
    showMap.onclick = function() {
        addMarker2(new google.maps.LatLng(ilat,ilong));
    };

    bottomSide.style.marginTop = "20px";
    bottomSide.appendChild(upvote);
    bottomSide.appendChild(downvote);
    bottomSide.appendChild(price);
    bottomSide.appendChild(showMap);
    bottomSide.appendChild(distance);


    post.appendChild(topSide);
    post.appendChild(img);
    post.appendChild(bottomSide);
    post.style.marginBottom = "5%";

    feed.appendChild(post);
}