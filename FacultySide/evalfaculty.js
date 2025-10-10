// Simulated evaluation data for this logged-in faculty
const facultyEvaluation = {
  name: "Dr. Jasmine Michaela Y. Espiritu",
  semester: "1st Semester, SY 2025",
  average: 4.6,
  category: "Excellent",
  feedback: [
    { criteria: "Teaching Methods", rating: 4.7, comment: "Very engaging lectures and examples." },
    { criteria: "Punctuality", rating: 4.9, comment: "Always starts class on time." },
    { criteria: "Communication", rating: 4.5, comment: "Explains lessons clearly and interacts well with students." },
    { criteria: "Class Management", rating: 4.4, comment: "Handles disruptive behavior calmly and effectively." },
    { criteria: "Professionalism", rating: 4.6, comment: "Shows respect and fairness to all students." }
  ]
};

const facultyName = document.getElementById("facultyName");
const semesterDisplay = document.getElementById("semesterDisplay");
const evalAverage = document.getElementById("evalAverage");
const ratingCategory = document.getElementById("ratingCategory");
const evaluationTable = document.getElementById("evaluationTable");
const semesterFilter = document.getElementById("semesterFilter");

function renderEvaluation() {
  facultyName.textContent = facultyEvaluation.name;
  semesterDisplay.textContent = facultyEvaluation.semester;
  evalAverage.textContent = facultyEvaluation.average + " / 5";
  ratingCategory.textContent = facultyEvaluation.category;

  evaluationTable.innerHTML = "";
  facultyEvaluation.feedback.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.criteria}</td>
      <td>${item.rating.toFixed(1)} / 5</td>
      <td class="comment-box">${item.comment}</td>
    `;
    evaluationTable.appendChild(tr);
  });
}

// Filter semester display
semesterFilter.addEventListener("change", e => {
  semesterDisplay.textContent = e.target.value || facultyEvaluation.semester;
});

// Generate and download evaluation summary as text file
document.getElementById("downloadSummaryBtn").addEventListener("click", () => {
  const summary = `
Faculty Evaluation Summary
===========================

Faculty Name: ${facultyEvaluation.name}
Semester: ${semesterDisplay.textContent}
Average Rating: ${facultyEvaluation.average} / 5
Category: ${facultyEvaluation.category}

Detailed Feedback:
${facultyEvaluation.feedback.map(item => 
  `- ${item.criteria}: ${item.rating}/5 — ${item.comment}`
).join("\n")}
`;

  const blob = new Blob([summary], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "EvaluationSummary.txt";
  link.click();
  URL.revokeObjectURL(link.href);
});

renderEvaluation();
