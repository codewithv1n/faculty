document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.getElementById("toggleSidebar");
  const sidebar = document.getElementById("sidebar");
  const main = document.getElementById("mainContent");
  const semesterFilter = document.getElementById("semesterFilter");
  const evaluationTable = document.getElementById("evaluationTable");
  const semesterDisplay = document.getElementById("semesterDisplay");
  const evalAverage = document.getElementById("evalAverage");
  const ratingCategory = document.getElementById("ratingCategory");
  const downloadBtn = document.getElementById("downloadSummaryBtn");

  // Sidebar toggle
  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    main.classList.toggle("expanded");
  });

  // Sample evaluation data
  const evaluations = {
    "1st Semester 2025": {
      average: 4.6,
      category: "Excellent",
      details: [
        { criteria: "Student Feedback", rating: "4.8" },
        { criteria: "Peer Review", rating: "4.7" },
        { criteria: "HOD Evaluation", rating: "4.5" },
      ],
    },
    "2nd Semester 2025": {
      average: 4.4,
      category: "Very Good",
      details: [
        { criteria: "Student Feedback", rating: "3.8" },
        { criteria: "Peer Review", rating: "4,0" },
        { criteria: "HOD Evaluation", rating: "3.5" },
      ],
    },
    "1st Semester 2024": {
      average: 4.2,
      category: "Good",
      details: [
        { criteria: "Student Feedback", rating: "3.5" },
        { criteria: "Peer Review", rating: "4.7" },
        { criteria: "HOD Evaluation", rating: "3.7" },
      ],
    },
  };

  // Function to render evaluation data
  function renderEvaluation(semester) {
    const data = evaluations[semester];
    if (!data) {
      evaluationTable.innerHTML = "<tr><td colspan='2'>No data available.</td></tr>";
      semesterDisplay.textContent = "—";
      evalAverage.textContent = "—";
      ratingCategory.textContent = "—";
      return;
    }

    semesterDisplay.textContent = semester;
    evalAverage.textContent = `${data.average} / 5`;
    ratingCategory.textContent = data.category;

    evaluationTable.innerHTML = data.details
      .map(
        (row) => `
        <tr>
          <td>${row.criteria}</td>
          <td>${row.rating}</td>
        </tr>
      `
      )
      .join("");
  }

  // Load default semester
  renderEvaluation("1st Semester 2025");

  // Semester filter
  semesterFilter.addEventListener("change", (e) => {
    const selected = e.target.value;
    if (selected) {
      renderEvaluation(selected);
    }
  });

  // --- Download as text-based PDF ---
  downloadBtn.addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const semester = semesterDisplay.textContent;
    const average = evalAverage.textContent;
    const category = ratingCategory.textContent;
    const data = evaluations[semester]?.details || [];

    // Header
    doc.setFontSize(16);
    doc.text("Faculty Evaluation Summary", 105, 15, { align: "center" });
    doc.setFontSize(11);
    doc.text(`Faculty Name: Dr. Jasmine Michaela Y. Espiritu`, 14, 30);
    doc.text(`Semester: ${semester}`, 14, 38);
    doc.text(`Evaluation Average: ${average}`, 14, 46);
    doc.text(`Rating Category: ${category}`, 14, 54);

    // Table (Criteria + Rating only)
    const tableData = data.map((d) => [d.criteria, d.rating]);
    doc.autoTable({
      head: [["Criteria", "Rating"]],
      body: tableData,
      startY: 62,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    // Footer
    const date = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.text(`Generated on: ${date}`, 14, doc.internal.pageSize.height - 10);

    // Save as PDF
    doc.save(`Evaluation_Summary_${semester.replace(/\s+/g, "_")}.pdf`);
  });
});
