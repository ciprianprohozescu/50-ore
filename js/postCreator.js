let db = {}, pos = {};

$(document).ready(function() {
    initDatabase();
    getCurrentLocation();
    initFeed();
});

function submitPost() {
    getCurrentLocation();
    const title = document.getElementById('title').value;
    if (!title) {
        window.alert("You need to enter a title.");
        return;
    }
    const price = document.getElementById('price').value;
    if (!price) {
        window.alert("You need to enter a price.");
        return;
    }
    const today = new Date();
    const dateTime = {
        day: today.getDate(),
        month: today.getMonth(),
        year: today.getFullYear(),
        hour: today.getHours(),
        minute: today.getMinutes()
    };
    const image = document.getElementById('postImage').files[0];
    const imageRef = firebase.storage().ref().child(today.getTime() + '.jpg');
    imageRef.put(image);

    db.collection("posts").add({
        title: title,
        price: price,
        //category: category,
        lat: pos.lat,
        lng: pos.lng,
        imageRef: imageRef.fullPath,
        dateTime: dateTime
    })
        .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
            $('#uploadModal').modal('hide');
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
}

const feed = document.getElementById("feed");

function createPost(titleValue, priceValue, lat, lng, imageRef, dateTimeValue) {
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
    dateTime.textContent = (dateTimeValue.day < 10 ? '0' : '') + dateTimeValue.day + '.' + (dateTimeValue.month < 9 ? '0' : '') + (dateTimeValue.month + 1) + '.' + dateTimeValue.year
        + ' ' + (dateTimeValue.hour < 10 ? '0' : '')+ dateTimeValue.hour + ':' + (dateTimeValue.minute < 10 ? '0' : '') + dateTimeValue.minute;
    dateTime.style.padding = "1%";
    dateTime.style.display = "inline-block";

    dateTime.style.cssFloat = "right";

    title.classList.add("text-title");
    title.textContent = titleValue;
    title.style.display = "inline-block";

    topSide.appendChild(title);
    topSide.appendChild(dateTime);

    firebase.storage().ref().child(imageRef).getDownloadURL().then(function(url) {
        img.setAttribute("src", url);
    });
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
    distance.textContent = distanceInKmBetweenEarthCoordinates(lat, lng, pos.lat, pos.lng) + ' km';
    distance.style.cssFloat = "right";
    distance.style.padding = "1%";
    distance.style.display = "inline-block";
    distance.style.marginRight = "1%";

    showMap.setAttribute("src", "imgs/showMap.png");
    showMap.style.maxWidth = "30px";
    showMap.style.cssFloat = "right";
    showMap.style.display = "inline-block";
    showMap.onclick = function() {
        drawMap(lat, lng);
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
function initDatabase() {
    // Initialize Cloud Firestore through Firebase
    db = firebase.firestore();

    // Disable deprecated features
    db.settings({
        timestampsInSnapshots: true
    });
}
function initFeed() {
    while (feed.firstChild) {
        feed.removeChild(feed.firstChild);
    }
    db.collection("posts").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            let post = doc.data();
            createPost(post.title, post.price, post.lat, post.lng, post.imageRef, post.dateTime);
        });
    });
}
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            console.log("lat: " + pos.lat + "; long: " + pos.lng);
        }, function() {
            //handleLocationError(true, infoWindow, map.getCenter());
            window.alert("Could not get your current location.");
        });
    } else {
        // Browser doesn't support Geolocation
        //handleLocationError(false, infoWindow, map.getCenter());
        window.alert("Your browser does not support geolocation.");
    }
}

function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}
function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
    var earthRadiusKm = 6371;

    var dLat = degreesToRadians(lat2-lat1);
    var dLon = degreesToRadians(lon2-lon1);

    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (earthRadiusKm * c).toFixed(2);
}
function drawMap(lat, lng) {
    let position = {lat: lat, lng: lng};
    let map = new google.maps.Map(
        document.getElementById('map'), {zoom: 10, center: position});
    let marker = new google.maps.Marker({position: position, map: map});
    document.getElementById('mapContainer').style.display = 'block';
}