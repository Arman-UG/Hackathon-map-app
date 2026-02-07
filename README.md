# HACKATHON SOLUTION SUBMISSION

## TEAM DETAILS

Team Name: Arr automation  
Problem Statement Chosen: Problem 3 – Displacement with AI  
Team Members: <Rohit, Arman, Harish>  
GitHub Repository Link: <https://arman-ug.github.io/Hackathon-map-app/>  

---

# 1. PROBLEM UNDERSTANDING & SCOPE

## 1.1 Problem Understanding

When maps are rendered at certain scales, features such as highways, roads, rivers, and railways visually overlap.  
This reduces readability and hides important information.

The challenge is to:

- Detect overlapping features
- Apply priority rules
- Automatically move lower-priority features
- Improve visual clarity

Inputs:
- Vector map features (lines/polygons)
- Display widths
- Priority rules

Output:
- Conflict-free map
- Displaced geometries
- Error/overlap report

---

## 1.2 Assumptions & Simplifications

To stay within hackathon scope:

- Only basic line features handled
- Simple priority rules used
- Fixed displacement distance
- No advanced cartographic optimization
- No complex topology preservation

Focus was kept on clarity and working prototype.

---

# 2. SOLUTION APPROACH & DESIGN

## 2.1 Approach

We designed a rule-based geometric engine:

Workflow:

Upload GeoJSON → Buffer features → Detect intersections → Move lower priority → Recheck → Export

Steps:

1. Convert features to buffered polygons (consider width)
2. Detect overlaps using Turf.js intersection checks
3. Apply priority rules
4. Displace lower-priority features
5. Highlight conflicts visually
6. Export corrected data

---

## 2.2 Why this approach?

Reasons:

- Deterministic and fast
- No heavy AI required
- Easier to debug
- Suitable for real-time processing
- Works reliably for hackathon scope

Alternatives considered:
- Machine learning-based detection
- Complex optimization algorithms

But they were unnecessary and time-consuming.

Rule-based approach was simpler and effective.

---

# 3. TECHNICAL IMPLEMENTATION

## 3.1 Technologies Used

- JavaScript
- Leaflet.js (map visualization)
- Turf.js (geometry operations)
- HTML/CSS
- GeoJSON

---

## 3.2 Technical Challenges

Challenges faced:

- Detecting overlaps with line width
- Correct displacement direction
- Rendering dynamic layers
- Map resizing issues

Solutions:

- Used Turf buffer()
- Used transformTranslate()
- Layer redraw strategy
- Fixed map height & layout

---

# 4. RESULTS & EFFECTIVENESS

## 4.1 Achievements

Solution successfully:

✔ Detects overlapping features  
✔ Highlights conflicts  
✔ Applies priority displacement  
✔ Automatically resolves overlaps  
✔ Exports corrected GeoJSON  
✔ Works with any uploaded dataset  

---

## 4.2 Validation

Validation methods:

- Before/After visual comparison
- Multiple test features
- Conflict count metrics
- Manual verification

Example:

Before → overlapping roads  
After → clear separation  

(Screenshots recommended)

---

# 5. INNOVATION & PRACTICAL VALUE

## 5.1 Innovation

- Interactive web-based displacement tool
- Real-time overlap visualization
- Auto-fix system
- Upload → Fix → Export workflow

Unlike static scripts, our solution behaves like a mini GIS editor.

---

## 5.2 Real-world Use

Useful for:

- Cartography
- GIS data cleaning
- Map generalization
- Automated pre-processing
- Web map visualization

Can be extended into production GIS tools.

---

# 6. LIMITATIONS & FUTURE IMPROVEMENTS

## 6.1 Limitations

- Fixed displacement amount
- No curved displacement
- Limited topology preservation
- Basic UI
- No advanced optimization

---

## 6.2 Future Improvements

If given more time:

- Smart displacement directions
- Curved feature handling
- Animation
- Better UI
- Large dataset optimization
- Cloud deployment

---

# FINAL DECLARATION

We confirm that this submission is our own work and was developed during the hackathon period.

Team Representative Name: <Arman>  
Confirmation: Yes
