/*
 * Que queda por hacer:
 * - Make a diferent vibration pattern for if you are clore to the center of circle or not.
 *
 */

// Variables:

// Array to store the circles.
let circles = [];
let positions = [];

let num_circles = 100;

// Vibration pattern [on, off, on, off, ...]
let vibration_pattern = [
  200, 50, 200, 50, 200, 50, 200, 50, 200, 50, 200, 50, 200, 50, 200, 50, 200,
  50, 200, 50, 200, 50, 200, 50, 200, 50, 200, 50, 200, 50, 200, 50, 200, 50,
  200, 50, 200, 50, 200, 50, 200, 50, 200, 50, 200, 50, 200, 50, 200, 50, 200,
  50, 200, 50, 200, 50, 200, 50, 200, 50, 200, 50, 200, 50, 200, 50, 200, 50,
  200, 50, 200, 50, 200, 50, 200, 50, 200, 50, 200, 50, 200, 50, 200, 50, 200,
  50, 200, 50, 200, 50, 200, 50, 200, 50, 200, 50, 200, 50, 200, 50, 200, 50,
  200, 50, 200, 50, 200, 50, 200, 50, 200, 50, 200, 50, 200, 50, 200, 50, 200,
  50, 200, 50, 200, 50, 200, 50, 200, 50, 200, 50, 200, 50, 200, 50, 200, 50,
  200, 50, 200, 50,
];

// Generate random colors for the circles.
const colors = [];
for (let i = 0; i < 10; i++) {
  const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
  colors.push(randomColor);
}

// Functions:
function distance_points(lat1, lon1, lat2, lon2) {
  // Calculate the distance between two points.
  return Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2));
}

// Create the map object without specifying the location.
const mymap = L.map("sample_map").setView([0, 0], 15);

// Get the location of the user and center the map on it.
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;
      mymap.panTo([lat, lon]);
    },
    (err) => {
      alert("No se pudo obtener la ubicación");
    }
  );
}

// Add the OpenStreetMap tiles.
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
}).addTo(mymap);

// Create the empty pointers and the mark.
let pointer1 = { X: 0, Y: 0 };
let pointer2 = { X: 0, Y: 0 };
let mark_center;

mymap.on("click", function (e) {
  // If the first pointer is empty, it means that we are going to set the center of the circle.
  if (pointer1.X == 0) {
    // Save the pointer and draw the mark on the map to show the user the center of the circle.
    pointer1.X = e.latlng.lat;
    pointer1.Y = e.latlng.lng;
    mark_center = L.marker([pointer1.X, pointer1.Y])
      .addTo(mymap)
      .bindPopup("Este es el centro,<br> selecciona el radio.")
      .openPopup();

    // Wait 5 seconds to close the popup.
    setTimeout(() => {
      mark_center.closePopup();
    }, 2000);
  } else {
    // If the second pointer is empty, it means that we are going to set the radius of the circle.
    pointer2.X = e.latlng.lat;
    pointer2.Y = e.latlng.lng;

    // Calculate the distance between the two pointers.
    let distance = distance_points(
      pointer1.X,
      pointer1.Y,
      pointer2.X,
      pointer2.Y
    );

    // 85000 is a constant to adjust the distance to meters (it's not exact, but it's close enough :) )
    // Draw the circle on the map.
    var circle = L.circle([pointer1.X, pointer1.Y], {
      color: "red",
      fillColor: "#f03",
      fillOpacity: 0.4,
      radius: distance * 85000,
    }).addTo(mymap);
    circles.push(circle);
    positions.push({ lat: pointer1.X, lon: pointer1.Y, radius: distance });

    // Remove mark once the circle is drawn.
    mymap.removeLayer(mark_center);

    // Reset the pointers to be able to draw a new circle.
    pointer1 = { X: 0, Y: 0 };
    pointer2 = { X: 0, Y: 0 };
  }
});

function clear_circles() {
  circles.forEach((c) => {
    mymap.removeLayer(c);
  });
  circles = [];
  positions = [];
  navigator.vibrate(0);
}

function draw_circle_temp(lat, lon, radius) {
  var circle = L.circle([lat, lon], {
    color: colors[Math.floor(Math.random() * 10)],
    fillColor: colors[Math.floor(Math.random() * 10)],
    fillOpacity: 0.2,
    radius: radius,
  }).addTo(mymap);
  setTimeout(() => {
    mymap.removeLayer(circle);
  }, 200);
}

// If the phone is shaken, remove the circles.
if (window.DeviceOrientationEvent) {
  // Check if the device is compatible with the DeviceOrientationEvent API, aka, it has a gyroscope.
  let gyroscope = new Gyroscope({ frequency: 10 });
  gyroscope.onreading = () => {
    if (gyroscope.x > 2 || gyroscope.y > 2 || gyroscope.z > 2) {
      clear_circles();
    }
  };
  gyroscope.start();
}

// Check if the device's position is inside the circles:
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;

      positions.forEach((p) => {
        // PREGUNTA: Porque no se puede usar la funcion distance_points?
        // es como si no lo reconociera bien. Pero si ambio de pestaña se arregla.
        let dist = distance_points(lat, lon, p.lat, p.lon);

        var distance = Math.sqrt(
          Math.pow(lat - p.lat, 2) + Math.pow(lon - p.lon, 2)
        );
        // Y si quitas esta linea, el programa no funciona, o si.
        // No funciona en incógnito. WHY?
        console.log(dist, distance);

        if (distance < p.radius) {
          // Check if there is a vibrator on the device.
          if ("vibrate" in navigator) {
            navigator.vibrate(vibration_pattern);
          }
          setTimeout(() => {
            // Remove the circle from the map and the arrays.
            var indx = mymap.removeLayer(circles[positions.indexOf(p)]);
            circles.splice(indx, 1);
            positions.splice(indx, 1);

            // Draw random colour circle for a period of time, to make the user look.
            let intervalo = setInterval(
              draw_circle_temp,
              150,
              p.lat,
              p.lon,
              p.radius * 85000
            );
            // The timeout is the sum of the vibration pattern minus 250ms.
            setTimeout(
              () => {
                clearInterval(intervalo);
              },
              vibration_pattern.reduce((a, b) => a + b, -250)
            );
            // If the phone is shaken, stop the flashing.
            if (window.DeviceOrientationEvent) {
              let gyroscope = new Gyroscope({ frequency: 10 });
              gyroscope.onreading = () => {
                if (gyroscope.x > 2 || gyroscope.y > 2 || gyroscope.z > 2) {
                  clearInterval(intervalo);
                }
              };
              gyroscope.start();
            }

            // Move the camera to the position of the circle that has been entered.
            mymap.panTo([lat, lon]);
          });
        }
      });
    },
    (err) => {
      alert("No se pudo obtener la ubicación");
    }
  );
}
