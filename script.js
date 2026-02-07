// =============================
// MAP SETUP
// =============================
const map = L.map("map").setView([20, 78], 6);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);


// =============================
// FEATURES
// =============================

let features = [
  {
    name: "Highway",
    priority: 1,
    width: 12,
    coords: [[20, 77], [20, 79]],
    color: "red"
  },
  {
    name: "Road A",
    priority: 2,
    width: 8,
    coords: [[20.02, 77], [20.02, 79]],
    color: "blue"
  },
  {
    name: "Road B",
    priority: 2,
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

  let conflicts = [];

  for (let i = 0; i < features.length; i++) {
    for (let j = i + 1; j < features.length; j++) {

      const A = features[i];
      const B = features[j];

      const overlap = turf.booleanIntersects(getBuffered(A), getBuffered(B));

      if (overlap) {
        conflicts.push(`${A.name} overlaps ${B.name}`);
      }
    }
  }

  if (conflicts.length === 0) {
    report.innerHTML = "No overlaps found ✅";
  } else {
    report.innerHTML = "<b>Conflicts:</b><br>" + conflicts.join("<br>");
  }
});
