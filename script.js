// =============================
// MAP SETUP
// =============================
document.addEventListener("DOMContentLoaded", () => {

const map = L.map("map").setView([20, 78], 6);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);


// =============================
// FEATURES
// =============================

let highlightLayers = [];

let features = [
  {
    name: "Highway",
    priority: 1,
    width: 12,
    coords: [[20, 77], [20, 79]],
    color: "red"
  },

  {
    name: "Railway",
    priority: 2,
    width: 6,
    coords: [[19.99, 77], [19.99, 79]],
    color: "black"
  },

  {
    name: "River",
    priority: 3,
    width: 10,
    coords: [[20.015, 77], [20.015, 79]],
    color: "cyan"
  },

  {
    name: "Road A",
    priority: 4,
    width: 8,
    coords: [[20.02, 77], [20.02, 79]],
    color: "blue"
  },

  {
    name: "Road B",
    priority: 4,
    width: 8,
    coords: [[20.01, 77], [20.01, 79]],
    color: "green"
  }
];


// draw
features.forEach(f => {
  f.layer = L.polyline(f.coords, {
    color: f.color,
    weight: f.width
  }).addTo(map);
});


// =============================
// HELPERS
// =============================

const getBuffered = (f) =>
  turf.buffer(f.layer.toGeoJSON(), f.width / 200, { units: "kilometers" });


// =============================
// BUTTONS
// =============================

const detectBtn = document.getElementById("detectBtn");
const reportBtn = document.getElementById("reportBtn");
const report = document.getElementById("report");


// =============================
// DETECT + FIX BUTTON
// =============================

detectBtn.addEventListener("click", () => {

  let resolved = 0;

  for (let i = 0; i < features.length; i++) {
    for (let j = i + 1; j < features.length; j++) {

      const A = features[i];
      const B = features[j];

      const overlap = turf.booleanIntersects(getBuffered(A), getBuffered(B));

      if (overlap) {

        resolved++;

        const loser = A.priority > B.priority ? A : B;

        const moved = turf.transformTranslate(
          loser.layer.toGeoJSON(),
          1,
          90,
          { units: "kilometers" }
        );

        map.removeLayer(loser.layer);

        loser.layer = L.geoJSON(moved, {
          style: { color: loser.color, weight: loser.width }
        }).addTo(map);
      }
    }
  }

  report.innerHTML = `Resolved overlaps: ${resolved}`;
});


// =============================
// REPORT BUTTON (NO MOVEMENT)
// =============================

reportBtn.addEventListener("click", () => {

  // remove old highlights
  highlightLayers.forEach(l => map.removeLayer(l));
  highlightLayers = [];

  let conflicts = [];

  for (let i = 0; i < features.length; i++) {
    for (let j = i + 1; j < features.length; j++) {

      const A = features[i];
      const B = features[j];

      const bufA = getBuffered(A);
      const bufB = getBuffered(B);

      const overlap = turf.intersect(bufA, bufB);

      if (overlap) {

        conflicts.push(`${A.name} overlaps ${B.name}`);

        // draw highlight
        const layer = L.geoJSON(overlap, {
          style: {
            color: "yellow",
            fillColor: "orange",
            fillOpacity: 0.5
          }
        }).addTo(map);

        highlightLayers.push(layer);
      }
    }
  }

  if (conflicts.length === 0) {
    report.innerHTML = "No overlaps found ✅";
  } else {
    report.innerHTML = "<b>Conflicts:</b><br>" + conflicts.join("<br>");
  }
});

// =============================
// FILE UPLOAD
// =============================

const fileInput = document.getElementById("fileInput");

fileInput.addEventListener("change", (e) => {

  const file = e.target.files[0];

  const reader = new FileReader();

  reader.onload = function (event) {

    const geojson = JSON.parse(event.target.result);

    // clear old layers
    features.forEach(f => map.removeLayer(f.layer));
    features = [];

    // load new features
    geojson.features.forEach((feat, index) => {

      const color = ["red","blue","green","black","cyan"][index % 5];

      const layer = L.geoJSON(feat, {
        style: { color, weight: 8 }
      }).addTo(map);

      features.push({
        name: feat.properties?.name || `Feature ${index}`,
        priority: feat.properties?.priority || 3,
        width: 8,
        layer,
        color
      });
    });

    report.innerHTML = "File loaded successfully ✅";
  };

  reader.readAsText(file);
});

// =============================
// EXPORT GEOJSON
// =============================

const exportBtn = document.getElementById("exportBtn");

exportBtn.addEventListener("click", () => {

  // convert all layers back to GeoJSON
  const geojson = {
    type: "FeatureCollection",
    features: features.map(f => {
      const gj = f.layer.toGeoJSON();
      gj.properties = {
        name: f.name,
        priority: f.priority
      };
      return gj;
    })
  };

  const blob = new Blob(
    [JSON.stringify(geojson, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "fixed_map.geojson";
  a.click();

  URL.revokeObjectURL(url);

  report.innerHTML = "File exported successfully ✅";
});
});
