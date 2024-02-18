function getLocation() {
  const text_p = document.getElementById("coords");
  text_p.innerHTML = "Getting your location...";
  if (!navigator.geolocation) {
    text_p.innerHTML = "Geolocation is not supported by this browser.";
    alert("Geolocation is not supported by this browser");
  } else {
    navigator.geolocation.watchPosition(
      (position) => {
        text_p.innerHTML =
          "Latitude: " +
          position.coords.latitude +
          "<br>Longitude: " +
          position.coords.longitude;
      },
      (err) => {
        text_p.innerHTML = "Unable to retrieve your location";
        alert("Unable to retrieve your location");
      }
    );
  }
}
