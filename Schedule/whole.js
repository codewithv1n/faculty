// ===========================
// GLOBAL VARIABLES & DATA STORAGE
// ===========================
let schedules = []; // SINGLE SOURCE OF TRUTH

// Derived data arrays (regenerated from schedules)
let schedulesData = []; // Alias for compatibility
let filteredData = []; // For filter functionality
let currentScheduleData = []; // For timetable integration
let calendarScheduleData = []; // For calendar integration
let filteredSchedules = []; // For filtered schedules

let dashboardStats = {
  totalClasses: 0,
  unassignedSubjects: 0,
  conflicts: 0,
};

// Predefined subjects that need assignment
let requiredSubjects = [
  {
    code: "IT101",
    name: "Introduction to Programming",
    department: "IT Department",
  },
  { code: "CS201", name: "Data Structures", department: "CS Department" },
  { code: "IT201", name: "Web Development", department: "IT Department" },
  { code: "CS301", name: "Database Systems", department: "CS Department" },
  {
    code: "ED101",
    name: "Educational Psychology",
    department: "Education Department",
  },
  {
    code: "BA101",
    name: "Business Management",
    department: "Business Administration Department",
  },
  {
    code: "ENG201",
    name: "Engineering Mathematics",
    department: "Engineering Department",
  },
  {
    code: "ARCH101",
    name: "Architectural Design",
    department: "Architecture Department",
  },
  {
    code: "ACC101",
    name: "Financial Accounting",
    department: "Accountancy Department",
  },
  {
    code: "PSY101",
    name: "General Psychology",
    department: "Psychology Department",
  },
];

// Current schedule data for timetable/calendar integration
let currentSortColumn = null;
let currentSortDirection = "asc";

// ===========================
// UPDATED TIME SLOT GENERATION
// ===========================
// ===========================
// FIXED TIME SLOT GENERATION WITH PROPER AM/PM FORMAT
// ===========================
// CHANGED: Updated time slots to be more comprehensive and properly formatted
const timeSlots12Hour = [
  "6:00 AM",
  "6:30 AM",
  "7:00 AM",
  "7:30 AM",
  "8:00 AM",
  "8:30 AM",
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
  "9:30 PM",
  "10:00 PM",
];
// Replace the original timeSlots array
const timeSlots = timeSlots12Hour;

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let currentDate = new Date();

// Sidebar state
let sidebarCollapsed = false;

// DOM element cache
const domCache = {};

// Notification control
let notificationCooldown = false;
let lastNotificationMessage = "";
let lastNotificationType = "";

// ===========================
// IMPROVED NOTIFICATION SYSTEM
// ===========================
function showNotification(message, type = "info", duration = 5000) {
  // Prevent spam notifications
  if (
    notificationCooldown &&
    message === lastNotificationMessage &&
    type === lastNotificationType
  ) {
    return;
  }

  // Remove existing notification
  const existing = document.querySelector(".notification");
  if (existing) {
    existing.remove();
  }

  // Set cooldown
  notificationCooldown = true;
  lastNotificationMessage = message;
  lastNotificationType = type;

  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close" onclick="closeNotification(this)">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("show");
  }, 100);

  // Auto-hide after duration
  const hideTimeout = setTimeout(() => {
    hideNotification(notification);
  }, duration);

  notification.hideTimeout = hideTimeout;

  // Reset cooldown after 2 seconds
  setTimeout(() => {
    notificationCooldown = false;
    lastNotificationMessage = "";
    lastNotificationType = "";
  }, 2000);
}

function closeNotification(button) {
  const notification = button.closest(".notification");
  if (notification) {
    if (notification.hideTimeout) {
      clearTimeout(notification.hideTimeout);
    }
    hideNotification(notification);
  }
}

function hideNotification(notification) {
  if (notification && notification.parentElement) {
    notification.classList.remove("show");
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 300);
  }
}

// ===========================
// DOM ELEMENTS - CACHED FOR PERFORMANCE
// ===========================
function initializeElements() {
  domCache.scheduleForm = document.getElementById("scheduleForm");
  domCache.scheduleTable =
    document.querySelector("#schedulesTable tbody") ||
    document.querySelector("#schedule-table tbody");
  domCache.totalClassesElement = document.getElementById("total-classes");
  domCache.unassignedSubjectsElement = document.getElementById(
    "unassigned-subjects"
  );
  domCache.conflictsElement = document.getElementById("conflicts");
  domCache.sidebar = document.querySelector(".sidebar");
  domCache.mainContent = document.querySelector(".main-content");
  domCache.toggleSidebar =
    document.querySelector("#toggleSidebar") ||
    document.querySelector(".toggle-btn");
}

// ===========================
// SIDEBAR TOGGLE FUNCTIONALITY
// ===========================
function initializeSidebar() {
  // Clean up any duplicate toggle buttons
  const existingToggles = document.querySelectorAll(
    "#toggleSidebar, .toggle-btn"
  );
  if (existingToggles.length > 1) {
    // Keep only the first one
    for (let i = 1; i < existingToggles.length; i++) {
      existingToggles[i].remove();
    }
  }

  const toggleSidebar =
    document.getElementById("toggleSidebar") ||
    document.querySelector(".toggle-btn");
  const sidebar =
    document.getElementById("sidebar") || document.querySelector(".sidebar");
  const mainContent = document.querySelector(".main-content");

  if (toggleSidebar && sidebar) {
    // Remove any existing listeners to prevent duplicates
    const newToggle = toggleSidebar.cloneNode(true);
    toggleSidebar.parentNode.replaceChild(newToggle, toggleSidebar);

    newToggle.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      sidebar.classList.toggle("collapsed");
      if (mainContent) {
        mainContent.classList.toggle("expanded");
      }

      // Update icon if present
      const icon = this.querySelector("i");
      if (icon) {
        if (sidebar.classList.contains("collapsed")) {
          icon.className = "fas fa-bars";
        } else {
          icon.className = "fas fa-times";
        }
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  initializeSidebar();
});

// ===========================
// REFACTORED DROPDOWN MENU FUNCTIONALITY
// ===========================
function initializeDropdownMenus() {
  const scheduleMenu = document.getElementById("schedule-menu");
  if (scheduleMenu) {
    // Remove existing listeners
    const newMenu = scheduleMenu.cloneNode(true);
    scheduleMenu.parentNode.replaceChild(newMenu, scheduleMenu);

    newMenu.addEventListener("click", function (e) {
      e.preventDefault();
      const submenu = document.getElementById("schedule-submenu");
      const icon = this.querySelector(".dropdown-icon i");

      if (submenu) {
        submenu.classList.toggle("open");

        if (icon) {
          if (submenu.classList.contains("open")) {
            icon.classList.remove("fa-chevron-down");
            icon.classList.add("fa-chevron-up");
          } else {
            icon.classList.remove("fa-chevron-up");
            icon.classList.add("fa-chevron-down");
          }
        }
      }
    });
  }
}

// ===========================
// DATA MANAGEMENT - UNIFIED WITH SINGLE SOURCE OF TRUTH
// ===========================
let saveTimeout = null;

function saveToLocalStorage() {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    try {
      const data = {
        schedules,
        dashboardStats,
        lastUpdated: Date.now(),
      };
      localStorage.setItem("schedules", JSON.stringify(data));
      console.log("Data saved to localStorage");
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, 500);
}

function loadFromLocalStorage() {
  try {
    const savedData = localStorage.getItem("schedules");
    if (savedData) {
      const data = JSON.parse(savedData);
      schedules = data.schedules || [];
      dashboardStats = data.dashboardStats || {
        totalClasses: 0,
        unassignedSubjects: 0,
        conflicts: 0,
      };
      console.log("Data loaded from localStorage");
    }
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    resetData();
  }
}

function resetData() {
  schedules = []; // Only clear the single source of truth
  dashboardStats = {
    totalClasses: 0,
    unassignedSubjects: 0,
    conflicts: 0,
  };
}

// ===========================
// IMPROVED UNIFIED DATA SYNCHRONIZATION
// ===========================
function syncAllData() {
  console.log("Syncing data from schedules array...", {
    schedulesCount: schedules.length,
  });

  // Regenerate all derived data from schedules (single source of truth)
  schedulesData = [...schedules];
  filteredData = [...schedules];
  filteredSchedules = [...schedules];

  // Convert schedules to timetable format
  currentScheduleData = schedules.map((schedule) => ({
    id: schedule.id,
    subject: schedule.subject,
    courseCode: schedule.courseCode,
    professor: schedule.professor,
    room: schedule.room,
    section: schedule.section,
    department: schedule.department,
    semester: schedule.semester,
    time: schedule.timeSlot,
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    days: schedule.days,
    students: schedule.students,
  }));

  // Convert to full monthly calendar format
  calendarScheduleData = generateMonthlyCalendarEvents();

  // Update all displays
  updateAllDisplays();
}

function generateMonthlyCalendarEvents() {
  const events = [];
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Get all days in the current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  schedules.forEach((schedule) => {
    if (!schedule.days || !Array.isArray(schedule.days)) return;

    schedule.days.forEach((dayName) => {
      const dayIndex = days.indexOf(dayName);
      if (dayIndex === -1) return;

      // Find all occurrences of this day in the current month
      for (let date = 1; date <= daysInMonth; date++) {
        const checkDate = new Date(currentYear, currentMonth, date);
        const checkDayIndex =
          checkDate.getDay() === 0 ? 6 : checkDate.getDay() - 1; // Convert Sunday=0 to Monday=0

        if (checkDayIndex === dayIndex) {
          events.push({
            id: `${schedule.id}-${date}`,
            scheduleId: schedule.id,
            title: schedule.subject,
            description: `${schedule.courseCode} - ${schedule.professor}`,
            professor: schedule.professor,
            room: schedule.room,
            time: schedule.timeSlot,
            day: dayName,
            date: checkDate.toISOString().split("T")[0],
            className: "schedule-event",
            ...schedule, // Include all schedule properties
          });
        }
      }
    });
  });

  return events;
}

function updateAllDisplays() {
  renderScheduleTable();
  renderScheduleOnTimetable();
  renderCalendar();
  calculateDashboardStats();
  updateDashboardDisplay();
  updateResultsCount();
}

// ===========================
// IMPROVED CONFLICT DETECTION
// ===========================

function convertTimeToMinutes(timeString) {
  if (!timeString) return 0;

  timeString = timeString.trim();

  // Handle 12-hour format (e.g., "2:30 PM", "10:00 AM")
  if (timeString.includes("AM") || timeString.includes("PM")) {
    const [time, period] = timeString.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    // Convert to 24-hour format
    if (period === "PM" && hours !== 12) {
      hours += 12;
    }
    if (period === "AM" && hours === 12) {
      hours = 0;
    }

    return hours * 60 + (minutes || 0);
  }
}

function checkTimeOverlap(time1Start, time1End, time2Start, time2End) {
  const start1 = convertTimeToMinutes(time1Start);
  const end1 = convertTimeToMinutes(time1End);
  const start2 = convertTimeToMinutes(time2Start);
  const end2 = convertTimeToMinutes(time2End);

  return start1 < end2 && start2 < end1;
}

function detectScheduleConflicts(newSchedule, excludeId = null) {
  const conflicts = [];

  for (const existingSchedule of schedules) {
    if (excludeId && existingSchedule.id === excludeId) continue;

    const commonDays = newSchedule.days.filter((day) =>
      existingSchedule.days.includes(day)
    );

    if (commonDays.length > 0) {
      const hasTimeOverlap = checkTimeOverlap(
        newSchedule.startTime,
        newSchedule.endTime,
        existingSchedule.startTime,
        existingSchedule.endTime
      );

      if (hasTimeOverlap) {
        if (newSchedule.professor === existingSchedule.professor) {
          conflicts.push({
            type: "Professor Double Booking",
            message: `Professor ${
              newSchedule.professor
            } is already scheduled for ${
              existingSchedule.subject
            } on ${commonDays.join(", ")} at ${existingSchedule.timeSlot}`,
            existingSchedule,
            severity: "high",
          });
        }

        if (newSchedule.room === existingSchedule.room) {
          conflicts.push({
            type: "Room Double Booking",
            message: `Room ${newSchedule.room} is already booked for ${
              existingSchedule.subject
            } on ${commonDays.join(", ")} at ${existingSchedule.timeSlot}`,
            existingSchedule,
            severity: "high",
          });
        }

        if (newSchedule.section === existingSchedule.section) {
          conflicts.push({
            type: "Section Double Booking",
            message: `Section ${newSchedule.section} already has ${
              existingSchedule.subject
            } scheduled on ${commonDays.join(", ")} at ${
              existingSchedule.timeSlot
            }`,
            existingSchedule,
            severity: "high",
          });
        }
      }
    }
  }

  return conflicts;
}

function getAllConflicts() {
  const conflictSet = new Set();
  schedules.forEach((schedule) => {
    const conflicts = detectScheduleConflicts(schedule, schedule.id);
    if (conflicts.length > 0) {
      conflictSet.add(schedule.id);
    }
  });
  return conflictSet.size;
}

// ===========================
// DASHBOARD STATISTICS
// ===========================
function calculateDashboardStats() {
  dashboardStats.totalClasses = schedules.length;

  const assignedCourses = schedules.map((s) => s.courseCode);
  const requiredCourses = requiredSubjects.map((s) => s.code);
  const unassignedCourses = requiredCourses.filter(
    (code) => !assignedCourses.includes(code)
  );

  dashboardStats.unassignedSubjects = unassignedCourses.length;
  dashboardStats.conflicts = getAllConflicts();
}

function updateDashboardDisplay() {
  requestAnimationFrame(() => {
    if (domCache.totalClassesElement) {
      domCache.totalClassesElement.textContent = dashboardStats.totalClasses;
    }
    if (domCache.unassignedSubjectsElement) {
      domCache.unassignedSubjectsElement.textContent =
        dashboardStats.unassignedSubjects;
    }
    if (domCache.conflictsElement) {
      domCache.conflictsElement.textContent = dashboardStats.conflicts;
    }
  });
}

// ===========================
// FORM VALIDATION
// ===========================
function validateScheduleForm(formData) {
  const errors = [];
  const requiredFields = [
    "department",
    "professor",
    "semester",
    "subject",
    "course_code",
    "section",
    "room",
    "start_time",
    "end_time",
  ];

  requiredFields.forEach((field) => {
    const value = formData.get(field);
    if (!value || value.trim() === "") {
      errors.push(`${field.replace("_", " ").toUpperCase()} is required`);
    }
  });

  const days = formData.getAll("days[]") || formData.getAll("days");
  if (days.length === 0) {
    errors.push("At least one day must be selected");
  }

  const startTime = formData.get("start_time");
  const endTime = formData.get("end_time");

  if (startTime && endTime) {
    const startMinutes = convertTimeToMinutes(startTime);
    const endMinutes = convertTimeToMinutes(endTime);

    if (startMinutes >= endMinutes) {
      errors.push("End time must be after start time");
    }
  }

  return errors;
}

// ===========================
// SCHEDULE FORM HANDLING
// ===========================
function initializeScheduleForm() {
  const scheduleForm = document.getElementById("scheduleForm");
  if (!scheduleForm) return;

  // Remove existing listeners
  const newForm = scheduleForm.cloneNode(true);
  scheduleForm.parentNode.replaceChild(newForm, scheduleForm);
  domCache.scheduleForm = newForm;

  newForm.addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("Form submitted");

    const formData = new FormData(newForm);
    const validationErrors = validateScheduleForm(formData);

    if (validationErrors.length > 0) {
      showNotification(
        `Validation Error: ${validationErrors.join(", ")}`,
        "error"
      );
      return;
    }

    const days = formData.getAll("days[]") || formData.getAll("days");
    const schedule = {
      id: Date.now() + Math.random(),
      department: formData.get("department"),
      professor: formData.get("professor"),
      semester: formData.get("semester"),
      subject: formData.get("subject"),
      courseCode: formData.get("course_code"),
      section: formData.get("section"),
      room: formData.get("room"),
      startTime: formData.get("start_time"),
      endTime: formData.get("end_time"),
      timeSlot: `${formData.get("start_time")} - ${formData.get("end_time")}`,
      days: days,
      students: formData.get("students") || 0,
      createdAt: new Date().toISOString(),
    };

    console.log("New schedule created:", schedule);

    const conflicts = detectScheduleConflicts(schedule);

    if (conflicts.length > 0) {
      const conflictMessage =
        "SCHEDULING CONFLICTS DETECTED:\n\n" +
        conflicts
          .map(
            (conflict, index) =>
              `${index + 1}. ${conflict.type}:\n${conflict.message}`
          )
          .join("\n\n") +
        "\n\nDo you want to proceed anyway?";

      if (!confirm(conflictMessage)) {
        return;
      }
    }

    // Add schedule to the single source of truth
    schedules.push(schedule);
    console.log("Schedule added. Total schedules:", schedules.length);

    // Sync all data and update displays
    syncAllData();
    saveToLocalStorage();

    // Reset form
    newForm.reset();

    const formTitle = document.getElementById("formTitle");
    if (formTitle) formTitle.textContent = "Add New Schedule";

    const message =
      conflicts.length > 0
        ? "Schedule added with conflicts! Please resolve them."
        : "Schedule added successfully!";
    const type = conflicts.length > 0 ? "warning" : "success";

    showNotification(message, type);

    // Scroll to table if visible
    const scheduleTable =
      document.getElementById("scheduleTable") ||
      document.querySelector(".schedule-table") ||
      document.querySelector("#schedulesTable");
    if (scheduleTable) {
      scheduleTable.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });
}

// ===========================
// MERGED SCHEDULE TABLE MANAGEMENT
// ===========================
function renderScheduleTable() {
  const tableBody =
    document.querySelector("#scheduleTable tbody") ||
    document.querySelector(".schedule-table tbody") ||
    document.querySelector("#schedulesTable tbody") ||
    document.querySelector('[data-table="schedule"] tbody') ||
    document.querySelector("#schedulesTableBody");

  if (!tableBody) {
    console.warn("Schedule table not found for update!");
    return;
  }

  console.log(
    "Rendering schedule table with",
    filteredData.length,
    "filtered schedules"
  );

  // Clear existing rows
  tableBody.innerHTML = "";

  if (filteredData.length === 0) {
    const noDataRow = document.createElement("tr");
    noDataRow.className = "no-data-row";
    noDataRow.innerHTML = `
            <td colspan="11">
                <div class="no-data-message">
                    <i class="fas fa-calendar-times"></i>
                    <p>No schedules found matching your criteria</p>
                </div>
            </td>
        `;
    tableBody.appendChild(noDataRow);
    return;
  }

  // Add filtered schedules to table
  filteredData.forEach((schedule, index) => {
    const row = createScheduleRow(schedule, index);
    tableBody.appendChild(row);
  });
}

function createScheduleRow(schedule, index) {
  const row = document.createElement("tr");
  row.setAttribute("data-schedule-id", schedule.id);

  const timeDisplay =
    schedule.timeSlot ||
    schedule.time ||
    (schedule.startTime && schedule.endTime
      ? `${schedule.startTime} - ${schedule.endTime}`
      : "N/A");

  const daysDisplay = Array.isArray(schedule.days)
    ? schedule.days.join(", ")
    : schedule.days || "N/A";

  const conflicts = detectScheduleConflicts(schedule, schedule.id);
  if (conflicts.length > 0) {
    row.classList.add("conflict-row");
  }

  row.innerHTML = `
        <td>${schedule.department || "N/A"}</td>
        <td>${schedule.professor || "N/A"}</td>
        <td>${schedule.semester || "N/A"}</td>
        <td>${schedule.subject || "N/A"}</td>
        <td>${schedule.courseCode || "N/A"}</td>
        <td>${schedule.section || "N/A"}</td>
        <td>${schedule.room || "N/A"}</td>
        <td>${timeDisplay}</td>
        <td>${daysDisplay}</td>
        <td>${schedule.students || "N/A"}</td>
        <td class="action-buttons">
            ${
              conflicts.length > 0
                ? `<span class="conflict-indicator" title="Has ${conflicts.length} conflict(s)">⚠️</span>`
                : ""
            }
            <button onclick="viewSchedule('${
              schedule.id
            }')" class="btn-view" title="View Details">
                <i class="fas fa-eye"></i>
            </button>
            <button onclick="editSchedule('${
              schedule.id
            }')" class="btn-edit" title="Edit Schedule">
                <i class="fas fa-edit"></i>
            </button>
            <button onclick="deleteSchedule('${
              schedule.id
            }')" class="btn-delete" title="Delete Schedule">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;

  row.addEventListener("mouseenter", function () {
    this.style.backgroundColor = "#f8faff";
  });

  row.addEventListener("mouseleave", function () {
    this.style.backgroundColor = "";
  });

  return row;
}

// ===========================
// FILTER FUNCTIONALITY
// ===========================
function setupFilters() {
  const departmentSelect = document.getElementById("department-select");
  const professorSelect = document.getElementById("professor-select");
  const semesterSelect = document.getElementById("semester-select");
  const applyBtn = document.getElementById("applyFilterBtn");
  const resetBtn = document.getElementById("resetFilterBtn");

  if (applyBtn) {
    // Remove existing listeners
    const newApplyBtn = applyBtn.cloneNode(true);
    applyBtn.parentNode.replaceChild(newApplyBtn, applyBtn);
    newApplyBtn.addEventListener("click", applyFilters);
  }

  if (resetBtn) {
    // Remove existing listeners
    const newResetBtn = resetBtn.cloneNode(true);
    resetBtn.parentNode.replaceChild(newResetBtn, resetBtn);
    newResetBtn.addEventListener("click", resetFilters);
  }

  // Auto-apply filters when selections change
  [departmentSelect, professorSelect, semesterSelect].forEach((select) => {
    if (select) {
      // Remove existing listeners
      const newSelect = select.cloneNode(true);
      select.parentNode.replaceChild(newSelect, select);
      newSelect.addEventListener("change", applyFilters);
    }
  });

  setupTable();
}

function populateFilters() {
  populateDepartmentFilter();
  populateProfessorFilter();
  populateSemesterFilter();
}

function populateDepartmentFilter() {
  const departmentSelect = document.getElementById("department-select");
  if (!departmentSelect || schedules.length === 0) return;

  const departments = [
    ...new Set(schedules.map((schedule) => schedule.department)),
  ].sort();

  departmentSelect.innerHTML =
    '<option value="All Departments">All Departments</option>';

  departments.forEach((department) => {
    const option = document.createElement("option");
    option.value = department;
    option.textContent = department;
    departmentSelect.appendChild(option);
  });
}

function populateProfessorFilter() {
  const professorSelect = document.getElementById("professor-select");
  if (!professorSelect || schedules.length === 0) return;

  const professors = [
    ...new Set(schedules.map((schedule) => schedule.professor)),
  ].sort();

  professorSelect.innerHTML =
    '<option value="All Professors">All Professors</option>';

  professors.forEach((professor) => {
    const option = document.createElement("option");
    option.value = professor;
    option.textContent = professor;
    professorSelect.appendChild(option);
  });
}

function populateSemesterFilter() {
  const semesterSelect = document.getElementById("semester-select");
  if (!semesterSelect || schedules.length === 0) return;

  const semesters = [
    ...new Set(schedules.map((schedule) => schedule.semester)),
  ].sort();

  semesterSelect.innerHTML =
    '<option value="All Semesters">All Semesters</option>';

  semesters.forEach((semester) => {
    const option = document.createElement("option");
    option.value = semester;
    option.textContent = semester;
    semesterSelect.appendChild(option);
  });
}

function applyFilters() {
  showLoadingSpinner(true);

  setTimeout(() => {
    const departmentFilter =
      document.getElementById("department-select")?.value || "All Departments";
    const professorFilter =
      document.getElementById("professor-select")?.value || "All Professors";
    const semesterFilter =
      document.getElementById("semester-select")?.value || "All Semesters";

    filteredData = schedules.filter((schedule) => {
      const matchesDepartment =
        departmentFilter === "All Departments" ||
        schedule.department === departmentFilter;
      const matchesProfessor =
        professorFilter === "All Professors" ||
        schedule.professor === professorFilter;
      const matchesSemester =
        semesterFilter === "All Semesters" ||
        schedule.semester === semesterFilter;

      return matchesDepartment && matchesProfessor && matchesSemester;
    });

    renderScheduleTable();
    updateResultsCount();
    showLoadingSpinner(false);

    if (!notificationCooldown) {
      showNotification(
        `Found ${filteredData.length} schedules`,
        "success",
        2000
      );
    }
  }, 300);
}

function resetFilters() {
  showLoadingSpinner(true);

  setTimeout(() => {
    const departmentSelect = document.getElementById("department-select");
    const professorSelect = document.getElementById("professor-select");
    const semesterSelect = document.getElementById("semester-select");

    if (departmentSelect) departmentSelect.value = "All Departments";
    if (professorSelect) professorSelect.value = "All Professors";
    if (semesterSelect) semesterSelect.value = "All Semesters";

    filteredData = [...schedules];
    currentSortColumn = null;
    currentSortDirection = "asc";

    renderScheduleTable();
    updateResultsCount();
    showLoadingSpinner(false);

    if (!notificationCooldown) {
      showNotification("Filters reset", "success", 2000);
    }
  }, 300);
}

function updateResultsCount() {
  const resultsCount = document.getElementById("resultsCount");
  if (resultsCount) {
    const total = schedules.length;
    const filtered = filteredData.length;

    if (filtered === total) {
      resultsCount.textContent = `Showing all ${total} schedules`;
    } else {
      resultsCount.textContent = `Showing ${filtered} of ${total} schedules`;
    }
  }
}

// ===========================
// TABLE FUNCTIONALITY
// ===========================
function setupTable() {
  const table = document.getElementById("schedulesTable");
  if (!table) return;

  const sortButtons = table.querySelectorAll(".sort-btn");
  sortButtons.forEach((btn) => {
    // Remove existing listeners
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    newBtn.addEventListener("click", function () {
      const column = this.getAttribute("data-column");
      sortTable(column);
    });
  });
}

function sortTable(column) {
  if (currentSortColumn === column) {
    currentSortDirection = currentSortDirection === "asc" ? "desc" : "asc";
  } else {
    currentSortDirection = "asc";
  }

  currentSortColumn = column;

  filteredData.sort((a, b) => {
    let aValue = a[column];
    let bValue = b[column];

    if (column === "students") {
      aValue = parseInt(aValue) || 0;
      bValue = parseInt(bValue) || 0;
    }

    if (column === "time" || column === "timeSlot") {
      aValue = convertTimeToMinutes(aValue);
      bValue = convertTimeToMinutes(bValue);
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    let result = 0;
    if (aValue < bValue) result = -1;
    if (aValue > bValue) result = 1;

    return currentSortDirection === "desc" ? -result : result;
  });

  updateSortIcons(column, currentSortDirection);
  renderScheduleTable();

  if (!notificationCooldown) {
    showNotification(`Sorted by ${column}`, "success", 2000);
  }
}

function updateSortIcons(activeColumn, direction) {
  const sortButtons = document.querySelectorAll(".sort-btn");

  sortButtons.forEach((btn) => {
    const icon = btn.querySelector("i");
    const column = btn.getAttribute("data-column");

    if (column === activeColumn) {
      icon.className =
        direction === "asc" ? "fas fa-sort-up" : "fas fa-sort-down";
      btn.style.opacity = "1";
    } else {
      icon.className = "fas fa-sort";
      btn.style.opacity = "0.7";
    }
  });
}

// ===========================
// SIMPLIFIED ACTION FUNCTIONS
// ===========================
function viewSchedule(id) {
  const schedule = findScheduleById(id);
  if (schedule) {
    showScheduleModal(schedule, "view");
  } else {
    showNotification("Schedule not found!", "error");
  }
}

function editSchedule(id) {
  const schedule = findScheduleById(id);
  if (schedule) {
    showScheduleModal(schedule, "edit");
  } else {
    showNotification("Schedule not found!", "error");
  }
}

function deleteSchedule(id) {
  const schedule = findScheduleById(id);
  if (!schedule) {
    showNotification("Schedule not found!", "error");
    return;
  }

  const confirmMessage = `Are you sure you want to delete the schedule for "${schedule.subject}" by ${schedule.professor}?`;

  if (confirm(confirmMessage)) {
    removeScheduleFromArray(id);
    syncAllData();
    saveToLocalStorage();

    showNotification(`Schedule deleted successfully!`, "success");
  }
}

// ===========================
// SIMPLIFIED FIND AND REMOVE FUNCTIONS
// ===========================
function findScheduleById(id) {
  const stringId = String(id);
  return schedules.find((s) => String(s.id) === stringId);
}

function removeScheduleFromArray(id) {
  const stringId = String(id);
  const index = schedules.findIndex((s) => String(s.id) === stringId);
  if (index > -1) {
    schedules.splice(index, 1);
  }
}

// ===========================
// MODAL FUNCTIONALITY
// ===========================
function showScheduleModal(schedule, mode = "view") {
  closeModal();

  const modal = createModalElement(schedule, mode);
  document.body.appendChild(modal);

  requestAnimationFrame(() => {
    modal.classList.add("show");
  });

  addModalEventListeners(modal, schedule, mode);
}

function closeModal() {
  const modal = document.querySelector(".schedule-modal");
  if (modal) {
    modal.classList.remove("show");
    setTimeout(() => {
      if (modal.parentNode) {
        modal.remove();
      }
    }, 300);
  }
}

function createModalElement(schedule, mode) {
  const modal = document.createElement("div");
  modal.className = "schedule-modal";
  modal.innerHTML = generateModalHTML(schedule, mode);
  return modal;
}

function generateModalHTML(schedule, mode) {
  const isEditMode = mode === "edit";
  const modalTitle = isEditMode ? "Edit Schedule" : "Schedule Details";
  const saveButton = isEditMode
    ? '<button class="btn btn-primary" onclick="saveScheduleChanges()">Save Changes</button>'
    : "";

  return `
        <div class="modal-overlay" onclick="closeModalOnOverlay(event)">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${modalTitle}</h2>
                    <button class="close-modal" onclick="closeModal()" title="Close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="schedule-details">
                        ${generateScheduleDetailsHTML(schedule, isEditMode)}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeModal()">Close</button>
                    ${saveButton}
                </div>
            </div>
        </div>
    `;
}

function generateScheduleDetailsHTML(schedule, isEditMode) {
  const fields = [
    { key: "department", label: "Department" },
    { key: "professor", label: "Professor" },
    { key: "subject", label: "Subject" },
    { key: "courseCode", label: "Course Code" },
    { key: "section", label: "Section" },
    { key: "room", label: "Room" },
    { key: "startTime", label: "Start Time" },
    { key: "endTime", label: "End Time" },
    { key: "days", label: "Days", isArray: true },
    { key: "students", label: "Students" },
    { key: "semester", label: "Semester" },
  ];

  return fields
    .map((field) => {
      let value = schedule[field.key];

      if (field.isArray && Array.isArray(value)) {
        value = value.join(", ");
      }

      value = value || "N/A";

      const inputElement = isEditMode
        ? `<input type="text" data-field="${field.key}" value="${value}" class="modal-input">`
        : `<span>${value}</span>`;

      return `
            <div class="detail-group">
                <label>${field.label}:</label>
                ${inputElement}
            </div>
        `;
    })
    .join("");
}

function addModalEventListeners(modal, schedule, mode) {
  const handleKeydown = (e) => {
    if (e.key === "Escape") {
      closeModal();
      document.removeEventListener("keydown", handleKeydown);
    }
  };
  document.addEventListener("keydown", handleKeydown);

  if (mode === "edit") {
    modal.setAttribute("data-schedule-id", schedule.id);
  }
}

function closeModalOnOverlay(event) {
  if (event.target.classList.contains("modal-overlay")) {
    closeModal();
  }
}

// ===========================
// IMPROVED SAVE SCHEDULE CHANGES
// ===========================
function saveScheduleChanges() {
  const modal = document.querySelector(".schedule-modal");
  if (!modal) return;

  const scheduleId = modal.getAttribute("data-schedule-id");
  const schedule = findScheduleById(scheduleId);

  if (!schedule) {
    showNotification("Error: Schedule not found!", "error");
    return;
  }

  const inputs = modal.querySelectorAll(".modal-input");
  const updatedData = {};

  // Extract data from inputs
  inputs.forEach((input) => {
    const field = input.getAttribute("data-field");
    let value = input.value.trim();

    if (field === "days" && value !== "N/A") {
      value = value
        .split(",")
        .map((day) => day.trim())
        .filter((day) => day);
    }

    updatedData[field] = value === "N/A" ? "" : value;
  });

  // Validate required fields
  const requiredFields = [
    "department",
    "professor",
    "subject",
    "courseCode",
    "section",
    "room",
    "startTime",
    "endTime",
  ];
  const missingFields = requiredFields.filter(
    (field) => !updatedData[field] || updatedData[field].trim() === ""
  );

  if (missingFields.length > 0) {
    showNotification(
      `Missing required fields: ${missingFields.join(", ")}`,
      "error"
    );
    return;
  }

  // Validate time
  if (updatedData.startTime && updatedData.endTime) {
    const startMinutes = convertTimeToMinutes(updatedData.startTime);
    const endMinutes = convertTimeToMinutes(updatedData.endTime);

    if (startMinutes >= endMinutes) {
      showNotification("End time must be after start time", "error");
      return;
    }
  }

  // Validate days
  if (!Array.isArray(updatedData.days) || updatedData.days.length === 0) {
    showNotification("At least one day must be selected", "error");
    return;
  }

  // Create updated schedule for conflict checking
  const updatedSchedule = { ...schedule, ...updatedData };
  if (updatedData.startTime && updatedData.endTime) {
    updatedSchedule.timeSlot = `${updatedData.startTime} - ${updatedData.endTime}`;
  }

  // Check for conflicts
  const conflicts = detectScheduleConflicts(updatedSchedule, schedule.id);

  if (conflicts.length > 0) {
    const conflictMessage =
      "SCHEDULING CONFLICTS DETECTED:\n\n" +
      conflicts
        .map(
          (conflict, index) =>
            `${index + 1}. ${conflict.type}:\n${conflict.message}`
        )
        .join("\n\n") +
      "\n\nDo you want to proceed anyway?";

    if (!confirm(conflictMessage)) {
      return;
    }
  }

  // Apply updates to the schedule
  Object.assign(schedule, updatedData);

  // Recalculate timeSlot
  if (updatedData.startTime && updatedData.endTime) {
    schedule.timeSlot = `${updatedData.startTime} - ${updatedData.endTime}`;
  }

  // Resync all data
  syncAllData();
  saveToLocalStorage();

  const message =
    conflicts.length > 0
      ? "Schedule updated with conflicts! Please resolve them."
      : "Schedule updated successfully!";
  const type = conflicts.length > 0 ? "warning" : "success";

  showNotification(message, type);
  closeModal();
}

// ===========================
// EXPORT & PRINT FUNCTIONALITY - SCHEDULE PAGE ONLY
// ===========================
function initializeExportPrint() {
  // Only create buttons if we're on a schedule-related page
  if (!isSchedulePage()) return;

  createExportPrintButtons();
  setupExportPrintListeners();
}

function isSchedulePage() {
  // Check if we're on a page that should have export/print functionality
  return (
    document.querySelector("#schedulesTable") ||
    document.querySelector(".schedule-table") ||
    document.querySelector("#scheduleForm") ||
    window.location.pathname.includes("schedule") ||
    window.location.pathname.includes("timetable")
  );
}

function isDashboardPage() {
  // Check if we're on the dashboard page
  return (
    window.location.pathname.includes("dashboard") ||
    document.querySelector(".dashboard-container") ||
    document.querySelector("#dashboardSection")
  );
}

function createExportPrintButtons() {
  // Look for existing container or create one
  let container = document.querySelector(".export-print-container");

  if (!container) {
    // Try to find a suitable place to add buttons - specifically in schedule areas
    const filterSection = document.querySelector(".filter-section");
    const tableContainer = document.querySelector(".table-container");
    const scheduleSection = document.querySelector("#schedulesSection");
    const target = scheduleSection || filterSection || tableContainer;

    if (target) {
      container = document.createElement("div");
      container.className = "export-print-container";
      container.style.cssText = `
                display: flex;
                gap: 10px;
                margin: 15px 0;
                justify-content: flex-end;
                flex-wrap: wrap;
            `;

      target.appendChild(container);
    }
  }

  if (container && !container.querySelector(".export-btn")) {
    // Different buttons for schedule page vs dashboard
    if (isSchedulePage()) {
      container.innerHTML = `
                <button class="export-btn csv-btn" onclick="exportData('csv')" title="Export to CSV">
                    <i class="fas fa-file-csv"></i> Export CSV
                </button>
                <button class="export-btn pdf-btn" onclick="exportData('pdf')" title="Export to PDF">
                    <i class="fas fa-file-pdf"></i> Export PDF
                </button>
                <button class="export-btn print-btn" onclick="printTable()" title="Print Table">
                    <i class="fas fa-print"></i> Print
                </button>
            `;
    } else if (isDashboardPage()) {
      // Add generate report button only on dashboard
      const dashboardContainer =
        document.querySelector(".dashboard-stats") ||
        document.querySelector(".dashboard-container") ||
        document.querySelector("#dashboardSection");

      if (dashboardContainer) {
        const reportButton = document.createElement("button");
        reportButton.className = "export-btn report-btn";
        reportButton.onclick = generateReport;
        reportButton.title = "Generate Report";
        reportButton.innerHTML =
          '<i class="fas fa-chart-bar"></i> Generate Report';
        reportButton.style.cssText = "margin: 10px 0; padding: 10px 20px;";
        dashboardContainer.appendChild(reportButton);
      }
    }
  }
}

function setupExportPrintListeners() {
  // Only set up keyboard shortcuts on schedule pages
  if (!isSchedulePage()) return;

  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey) {
      switch (e.key.toLowerCase()) {
        case "e":
          e.preventDefault();
          exportData("csv");
          break;
        case "p":
          e.preventDefault();
          printTable();
          break;
      }
    }
  });
}

function exportData(format = "csv") {
  if (format === "csv") {
    exportToCSV();
  } else if (format === "pdf") {
    exportToPDF();
  }
}

function exportToCSV() {
  const headers = [
    "Department",
    "Professor",
    "Semester",
    "Subject",
    "Course Code",
    "Section",
    "Room",
    "Time",
    "Days",
    "Students",
  ];

  const csvData = filteredData.length > 0 ? filteredData : schedules;

  const csvContent = [
    headers.join(","),
    ...csvData.map((schedule) =>
      [
        `"${schedule.department || ""}"`,
        `"${schedule.professor || ""}"`,
        `"${schedule.semester || ""}"`,
        `"${schedule.subject || ""}"`,
        `"${schedule.courseCode || ""}"`,
        `"${schedule.section || ""}"`,
        `"${schedule.room || ""}"`,
        `"${schedule.timeSlot || ""}"`,
        `"${
          Array.isArray(schedule.days)
            ? schedule.days.join(", ")
            : schedule.days || ""
        }"`,
        `"${schedule.students || ""}"`,
      ].join(",")
    ),
  ].join("\n");

  downloadFile(csvContent, "schedules.csv", "text/csv");
  showNotification("Schedules exported to CSV successfully!", "success");
}

function exportToPDF() {
  const printData = filteredData.length > 0 ? filteredData : schedules;

  if (printData.length === 0) {
    showNotification("No data to export!", "warning");
    return;
  }

  // Create a new window for PDF generation
  const pdfWindow = window.open("", "_blank");
  const pdfContent = generatePDFHTML(printData);

  pdfWindow.document.write(pdfContent);
  pdfWindow.document.close();

  // Automatically trigger browser's print to PDF
  pdfWindow.onload = function () {
    setTimeout(() => {
      pdfWindow.print();
    }, 500);
  };

  showNotification(
    'PDF export initiated! Use "Save as PDF" in print dialog.',
    "success"
  );
}

function generatePDFHTML(data) {
  return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Schedule Report - PDF Export</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    margin: 15px; 
                    font-size: 12px;
                }
                .header { 
                    text-align: center; 
                    margin-bottom: 20px; 
                    border-bottom: 2px solid #333;
                    padding-bottom: 10px;
                }
                table { 
                    width: 100%; 
                    border-collapse: collapse; 
                    margin-top: 15px; 
                    font-size: 10px;
                }
                th, td { 
                    border: 1px solid #ddd; 
                    padding: 4px; 
                    text-align: left; 
                    vertical-align: top;
                }
                th { 
                    background-color: #f2f2f2; 
                    font-weight: bold; 
                    font-size: 9px;
                }
                .conflict-row { background-color: #fff3cd; }
                .summary { 
                    margin-bottom: 15px; 
                    background-color: #f8f9fa;
                    padding: 10px;
                    border-left: 4px solid #007bff;
                }
                .footer {
                    margin-top: 20px;
                    text-align: center;
                    font-size: 10px;
                    color: #666;
                    border-top: 1px solid #ddd;
                    padding-top: 10px;
                }
                @media print {
                    body { margin: 0; }
                    .no-print { display: none; }
                    table { page-break-inside: auto; }
                    tr { page-break-inside: avoid; page-break-after: auto; }
                    thead { display: table-header-group; }
                    tfoot { display: table-footer-group; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Schedule Management System</h1>
                <h2>Complete Schedule Report</h2>
                <p>Generated on: ${new Date().toLocaleString()}</p>
            </div>
            
            <div class="summary">
                <h3>Summary Statistics</h3>
                <p><strong>Total Schedules:</strong> ${data.length}</p>
                <p><strong>Conflicts Detected:</strong> ${
                  getAllConflicts ? getAllConflicts() : "N/A"
                }</p>
                <p><strong>Unassigned Subjects:</strong> ${
                  typeof dashboardStats !== "undefined"
                    ? dashboardStats.unassignedSubjects
                    : "N/A"
                }</p>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>Dept.</th>
                        <th>Professor</th>
                        <th>Subject</th>
                        <th>Code</th>
                        <th>Section</th>
                        <th>Room</th>
                        <th>Time</th>
                        <th>Days</th>
                        <th>Students</th>
                    </tr>
                </thead>
                <tbody>
                    ${data
                      .map((schedule) => {
                        const conflicts =
                          typeof detectScheduleConflicts === "function"
                            ? detectScheduleConflicts(schedule, schedule.id)
                            : [];
                        const rowClass =
                          conflicts.length > 0 ? "conflict-row" : "";

                        return `
                            <tr class="${rowClass}">
                                <td>${schedule.department || ""}</td>
                                <td>${schedule.professor || ""}</td>
                                <td>${schedule.subject || ""}</td>
                                <td>${schedule.courseCode || ""}</td>
                                <td>${schedule.section || ""}</td>
                                <td>${schedule.room || ""}</td>
                                <td>${schedule.timeSlot || ""}</td>
                                <td>${
                                  Array.isArray(schedule.days)
                                    ? schedule.days.join(", ")
                                    : schedule.days || ""
                                }</td>
                                <td>${schedule.students || ""}</td>
                            </tr>
                        `;
                      })
                      .join("")}
                </tbody>
            </table>
            
            <div class="footer">
                <p>Schedule Management System - Academic Year ${new Date().getFullYear()}</p>
                <p>Total Records: ${
                  data.length
                } | Report Type: Complete Schedule Export</p>
            </div>
        </body>
        </html>
    `;
}

function printTable() {
  const printData = filteredData.length > 0 ? filteredData : schedules;

  if (printData.length === 0) {
    showNotification("No data to print!", "warning");
    return;
  }

  const printWindow = window.open("", "_blank");
  const printContent = generatePrintHTML(printData);

  printWindow.document.write(printContent);
  printWindow.document.close();

  // Only show print preview - don't auto-print
  printWindow.onload = function () {
    // Just focus the window to show the print preview
    printWindow.focus();
  };

  showNotification(
    "Print preview opened! Use Ctrl+P to print when ready.",
    "success"
  );
}

function generatePrintHTML(data) {
  return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Schedule Print Preview</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .print-instructions {
                    background-color: #e3f2fd;
                    border: 1px solid #2196f3;
                    padding: 10px;
                    margin-bottom: 20px;
                    border-radius: 4px;
                    text-align: center;
                }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; font-weight: bold; }
                .conflict-row { background-color: #fff3cd; }
                .summary { margin-bottom: 20px; }
                @media print {
                    body { margin: 0; }
                    .no-print, .print-instructions { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="print-instructions no-print">
                <strong>Print Preview Mode</strong><br>
                Press <kbd>Ctrl+P</kbd> or <kbd>Cmd+P</kbd> to open print dialog
            </div>
            
            <div class="header">
                <h1>Schedule Management Report</h1>
                <p>Generated on: ${new Date().toLocaleString()}</p>
            </div>
            
            <div class="summary">
                <h3>Summary</h3>
                <p><strong>Total Schedules:</strong> ${data.length}</p>
                <p><strong>Conflicts:</strong> ${
                  typeof getAllConflicts === "function"
                    ? getAllConflicts()
                    : "N/A"
                }</p>
                <p><strong>Unassigned Subjects:</strong> ${
                  typeof dashboardStats !== "undefined"
                    ? dashboardStats.unassignedSubjects
                    : "N/A"
                }</p>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>Department</th>
                        <th>Professor</th>
                        <th>Subject</th>
                        <th>Course Code</th>
                        <th>Section</th>
                        <th>Room</th>
                        <th>Time</th>
                        <th>Days</th>
                        <th>Students</th>
                    </tr>
                </thead>
                <tbody>
                    ${data
                      .map((schedule) => {
                        const conflicts =
                          typeof detectScheduleConflicts === "function"
                            ? detectScheduleConflicts(schedule, schedule.id)
                            : [];
                        const rowClass =
                          conflicts.length > 0 ? "conflict-row" : "";

                        return `
                            <tr class="${rowClass}">
                                <td>${schedule.department || ""}</td>
                                <td>${schedule.professor || ""}</td>
                                <td>${schedule.subject || ""}</td>
                                <td>${schedule.courseCode || ""}</td>
                                <td>${schedule.section || ""}</td>
                                <td>${schedule.room || ""}</td>
                                <td>${schedule.timeSlot || ""}</td>
                                <td>${
                                  Array.isArray(schedule.days)
                                    ? schedule.days.join(", ")
                                    : schedule.days || ""
                                }</td>
                                <td>${schedule.students || ""}</td>
                            </tr>
                        `;
                      })
                      .join("")}
                </tbody>
            </table>
        </body>
        </html>
    `;
}

function downloadFile(content, fileName, contentType) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ===========================
// REPORT GENERATION - DASHBOARD ONLY
// ===========================
function generateReport() {
  // Only allow report generation from dashboard
  if (!isDashboardPage()) {
    showNotification(
      "Reports can only be generated from the dashboard!",
      "warning"
    );
    return;
  }

  try {
    const conflictSchedules = schedules.filter((schedule) =>
      typeof detectScheduleConflicts === "function"
        ? detectScheduleConflicts(schedule, schedule.id).length > 0
        : false
    );

    const reportData = {
      generatedAt: new Date().toLocaleString(),
      totalSchedules: schedules.length,
      totalConflicts:
        typeof dashboardStats !== "undefined" ? dashboardStats.conflicts : 0,
      unassignedSubjects:
        typeof dashboardStats !== "undefined"
          ? dashboardStats.unassignedSubjects
          : 0,
      conflictSchedules: conflictSchedules.map((schedule) => ({
        ...schedule,
        conflicts:
          typeof detectScheduleConflicts === "function"
            ? detectScheduleConflicts(schedule, schedule.id)
            : [],
      })),
    };

    const reportStr = `SCHEDULE MANAGEMENT DASHBOARD REPORT
Generated: ${reportData.generatedAt}

EXECUTIVE SUMMARY:
====================
- Total Schedules: ${reportData.totalSchedules}
- Unassigned Subjects: ${reportData.unassignedSubjects}
- Schedules with Conflicts: ${reportData.totalConflicts}
- System Efficiency: ${
      reportData.totalConflicts === 0 ? "OPTIMAL" : "NEEDS ATTENTION"
    }

CONFLICT ANALYSIS:
====================
${
  reportData.conflictSchedules.length === 0
    ? "No conflicts detected. System is running optimally."
    : reportData.conflictSchedules
        .map(
          (schedule) =>
            `CONFLICT: ${schedule.subject} (${schedule.courseCode}) - ${
              schedule.professor
            }
    Time: ${schedule.timeSlot}
    Days: ${
      Array.isArray(schedule.days) ? schedule.days.join(", ") : schedule.days
    }
    Room: ${schedule.room}
    Conflict Types: ${schedule.conflicts.map((c) => c.type).join(", ")}
    Action Required: Manual intervention needed`
        )
        .join("\n\n")
}

DEPARTMENT BREAKDOWN:
====================
${getDepartmentBreakdown()}

ROOM UTILIZATION:
====================
${getRoomUtilization()}

RECOMMENDATIONS:
====================
${generateRecommendations(reportData)}

COMPLETE SCHEDULE LISTING:
====================
${schedules
  .map(
    (schedule, index) =>
      `${index + 1}. ${schedule.subject} (${schedule.courseCode})
   Professor: ${schedule.professor}
   Department: ${schedule.department}
   Time: ${schedule.timeSlot}
   Days: ${
     Array.isArray(schedule.days) ? schedule.days.join(", ") : schedule.days
   }
   Room: ${schedule.room}
   Section: ${schedule.section}
   Students: ${schedule.students}
   Status: ${
     conflictSchedules.some((c) => c.id === schedule.id)
       ? "CONFLICT DETECTED"
       : "NORMAL"
   }`
  )
  .join("\n\n")}

---
Report generated by Schedule Management System
Dashboard Analytics Module`;

    const fileName = `dashboard_report_${
      new Date().toISOString().split("T")[0]
    }.txt`;
    downloadFile(reportStr, fileName, "text/plain");
    showNotification("Dashboard report generated successfully!", "success");
  } catch (error) {
    console.error("Report generation error:", error);
    showNotification("Error generating dashboard report!", "error");
  }
}

// Helper functions for report generation
function getDepartmentBreakdown() {
  if (!schedules || schedules.length === 0) return "No data available";

  const deptCount = schedules.reduce((acc, schedule) => {
    const dept = schedule.department || "Unassigned";
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(deptCount)
    .map(([dept, count]) => `- ${dept}: ${count} schedules`)
    .join("\n");
}

function getRoomUtilization() {
  if (!schedules || schedules.length === 0) return "No data available";

  const roomCount = schedules.reduce((acc, schedule) => {
    const room = schedule.room || "Unassigned";
    acc[room] = (acc[room] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(roomCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10) // Top 10 rooms
    .map(([room, count]) => `- ${room}: ${count} classes`)
    .join("\n");
}

function generateRecommendations(reportData) {
  const recommendations = [];

  if (reportData.totalConflicts > 0) {
    recommendations.push(
      "- Resolve scheduling conflicts immediately to optimize resource allocation"
    );
  }

  if (reportData.unassignedSubjects > 0) {
    recommendations.push("- Assign professors to unassigned subjects");
  }

  if (reportData.totalSchedules === 0) {
    recommendations.push("- Begin adding schedules to the system");
  }

  if (recommendations.length === 0) {
    recommendations.push("- System is operating efficiently");
    recommendations.push("- Continue monitoring for optimal performance");
  }

  return recommendations.join("\n");
}

// Initialize based on page type
document.addEventListener("DOMContentLoaded", function () {
  if (isSchedulePage()) {
    initializeExportPrint();
  } else if (isDashboardPage()) {
    createExportPrintButtons(); // This will add the report button to dashboard
  }
});

// ===========================
// FIXED TIMETABLE FUNCTIONALITY - HANDLES OVERLAPPING SCHEDULES
// ===========================
function initializeTimetable() {
  const timetableGrid = document.getElementById("timetable");
  if (!timetableGrid) return;

  timetableGrid.innerHTML = "";
  createTimetableHeader(timetableGrid);
  createTimetableBody(timetableGrid);
  setupViewSwitching();
}

function createTimetableHeader(grid) {
  const emptyHeader = document.createElement("div");
  emptyHeader.className = "time-slot";
  grid.appendChild(emptyHeader);

  days.forEach((day) => {
    const dayHeader = document.createElement("div");
    dayHeader.className = "day-header";
    dayHeader.textContent = day;
    grid.appendChild(dayHeader);
  });
}

function createTimetableBody(grid) {
  timeSlots.forEach((timeSlot) => {
    const timeElement = document.createElement("div");
    timeElement.className = "time-slot";
    timeElement.textContent = timeSlot;
    grid.appendChild(timeElement);

    days.forEach((day) => {
      const scheduleSlot = document.createElement("div");
      scheduleSlot.className = "schedule-slot";
      scheduleSlot.dataset.time = timeSlot;
      scheduleSlot.dataset.day = day;

      scheduleSlot.addEventListener("click", function () {
        handleScheduleSlotClick(this);
      });

      grid.appendChild(scheduleSlot);
    });
  });
}

function handleScheduleSlotClick(slot) {
  const time = slot.dataset.time;
  const day = slot.dataset.day;

  const schedulesInSlot = findSchedulesForSlot(day, time);

  if (schedulesInSlot.length === 1) {
    showScheduleModal(schedulesInSlot[0]);
  } else if (schedulesInSlot.length > 1) {
    showMultiScheduleModal(schedulesInSlot, day, time);
  }
}

function findSchedulesForSlot(day, time) {
  return currentScheduleData.filter((schedule) => {
    if (!schedule.days || !Array.isArray(schedule.days)) return false;

    return (
      schedule.days.includes(day) &&
      schedule.startTime &&
      schedule.endTime &&
      isTimeInRange(time, schedule.startTime, schedule.endTime)
    );
  });
}

function showMultiScheduleModal(schedules, day, time) {
  closeModal();

  const modal = document.createElement("div");
  modal.className = "schedule-modal";
  modal.innerHTML = `
        <div class="modal-overlay" onclick="closeModalOnOverlay(event)">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Multiple Schedules - ${day} at ${time}</h2>
                    <button class="close-modal" onclick="closeModal()" title="Close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <p>Multiple schedules found for this time slot:</p>
                    <div class="schedule-list">
                        ${schedules
                          .map(
                            (schedule, index) => `
                            <div class="schedule-item" onclick="viewSchedule('${schedule.id}')">
                                <h4>${schedule.subject} (${schedule.courseCode})</h4>
                                <p><strong>Professor:</strong> ${schedule.professor}</p>
                                <p><strong>Room:</strong> ${schedule.room}</p>
                                <p><strong>Section:</strong> ${schedule.section}</p>
                            </div>
                        `
                          )
                          .join("")}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeModal()">Close</button>
                </div>
            </div>
        </div>
    `;

  document.body.appendChild(modal);

  requestAnimationFrame(() => {
    modal.classList.add("show");
  });
}

function isTimeInRange(checkTime, startTime, endTime) {
  const checkMinutes = convertTimeToMinutes(checkTime);
  const startMinutes = convertTimeToMinutes(startTime);
  const endMinutes = convertTimeToMinutes(endTime);

  return checkMinutes >= startMinutes && checkMinutes < endMinutes;
}

function renderScheduleOnTimetable() {
  const scheduleSlots = document.querySelectorAll(".schedule-slot");

  // Clear all slots first
  scheduleSlots.forEach((slot) => {
    slot.classList.remove("occupied", "multiple-schedules");
    slot.innerHTML = "";
    slot.style.backgroundColor = "";
  });

  console.log(
    "Rendering timetable with",
    currentScheduleData.length,
    "schedules"
  );

  // Group schedules by time slot and day
  const slotSchedules = {};

  currentScheduleData.forEach((schedule) => {
    if (!schedule.days || !Array.isArray(schedule.days)) return;

    schedule.days.forEach((day) => {
      timeSlots.forEach((timeSlot) => {
        if (
          schedule.startTime &&
          schedule.endTime &&
          isTimeInRange(timeSlot, schedule.startTime, schedule.endTime)
        ) {
          const slotKey = `${day}-${timeSlot}`;
          if (!slotSchedules[slotKey]) {
            slotSchedules[slotKey] = [];
          }
          slotSchedules[slotKey].push(schedule);
        }
      });
    });
  });

  // Render schedules in slots
  Object.entries(slotSchedules).forEach(([slotKey, schedules]) => {
    const [day, timeSlot] = slotKey.split("-");
    const slot = document.querySelector(
      `[data-day="${day}"][data-time="${timeSlot}"]`
    );

    if (!slot) return;

    slot.classList.add("occupied");

    if (schedules.length > 1) {
      // Multiple schedules in same slot
      slot.classList.add("multiple-schedules");
      slot.innerHTML = `
                <div class="subject">Multiple Classes (${schedules.length})</div>
                <div class="professor">Click to view all</div>
            `;
      slot.style.backgroundColor = "#ff6b6b"; // Red for conflicts
      slot.style.color = "white";
    } else {
      // Single schedule
      const schedule = schedules[0];
      slot.innerHTML = `
                <div class="subject">${schedule.subject || ""}</div>
                <div class="professor">${schedule.professor || ""}</div>
                <div class="room">${schedule.room || ""}</div>
            `;

      // Add some visual variety
      const colors = ["#4a90e2", "#50c878", "#f39c12", "#ffd93d", "#6c5ce7"];
      const colorIndex =
        Math.abs(schedule.id.toString().charCodeAt(0)) % colors.length;
      slot.style.backgroundColor = colors[colorIndex];
      slot.style.color = "white";
    }
  });
}

// ===========================
// FIXED CALENDAR FUNCTIONALITY - FULL MONTH EVENTS
// ===========================
function initializeCalendar() {
  setupCalendarNavigation();
  renderCalendar();
}

function setupCalendarNavigation() {
  const prevBtn = document.getElementById("prevMonthBtn");
  const nextBtn = document.getElementById("nextMonthBtn");

  if (prevBtn) {
    // Remove existing listeners
    const newPrevBtn = prevBtn.cloneNode(true);
    prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);

    newPrevBtn.addEventListener("click", function () {
      currentDate.setMonth(currentDate.getMonth() - 1);
      syncAllData(); // Regenerate calendar events for new month
    });
  }

  if (nextBtn) {
    // Remove existing listeners
    const newNextBtn = nextBtn.cloneNode(true);
    nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);

    newNextBtn.addEventListener("click", function () {
      currentDate.setMonth(currentDate.getMonth() + 1);
      syncAllData(); // Regenerate calendar events for new month
    });
  }
}

function renderCalendar() {
  const monthYearElement = document.getElementById("currentMonthYear");
  const calendarGrid = document.querySelector(".calendar-grid");

  if (!calendarGrid) return;

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  if (monthYearElement) {
    monthYearElement.textContent = `${
      monthNames[currentDate.getMonth()]
    } ${currentDate.getFullYear()}`;
  }

  // Remove existing day elements
  const existingDays = calendarGrid.querySelectorAll(".calendar-day");
  existingDays.forEach((day) => day.remove());

  // Calculate calendar layout
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);

  // Start from the beginning of the week containing the first day
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  const today = new Date();

  // Generate 42 days (6 weeks) to ensure full calendar coverage
  for (let i = 0; i < 42; i++) {
    const cellDate = new Date(startDate);
    cellDate.setDate(startDate.getDate() + i);

    const dayElement = document.createElement("div");
    dayElement.className = "calendar-day";

    // Style days outside current month
    if (cellDate.getMonth() !== month) {
      dayElement.classList.add("empty");
    }

    // Highlight today
    if (cellDate.toDateString() === today.toDateString()) {
      dayElement.classList.add("today");
    }

    dayElement.innerHTML = `
            <div class="day-number">${cellDate.getDate()}</div>
            <div class="events-container"></div>
        `;

    // Get events for this specific date
    const dayEvents = getEventsForDate(cellDate);
    const eventsContainer = dayElement.querySelector(".events-container");

    dayEvents.forEach((event, index) => {
      // Limit display to prevent overcrowding
      if (index < 3) {
        const eventElement = document.createElement("div");
        eventElement.className = `event ${event.className || ""}`;
        eventElement.textContent =
          event.title.length > 15
            ? event.title.substring(0, 15) + "..."
            : event.title;
        eventElement.title = `${event.title} - ${event.description}`;
        eventElement.addEventListener("click", (e) => {
          e.stopPropagation();
          const schedule = findScheduleById(event.scheduleId);
          if (schedule) {
            showScheduleModal(schedule);
          }
        });
        eventsContainer.appendChild(eventElement);
      } else if (index === 3) {
        // Show "+X more" for additional events
        const moreElement = document.createElement("div");
        moreElement.className = "event more-events";
        moreElement.textContent = `+${dayEvents.length - 3} more`;
        moreElement.addEventListener("click", (e) => {
          e.stopPropagation();
          showDayEventsModal(cellDate, dayEvents);
        });
        eventsContainer.appendChild(moreElement);
      }
    });

    calendarGrid.appendChild(dayElement);
  }
}

function getEventsForDate(date) {
  const dateString = date.toISOString().split("T")[0];
  return calendarScheduleData.filter((event) => {
    return event.date === dateString;
  });
}

function showDayEventsModal(date, events) {
  closeModal();

  const modal = document.createElement("div");
  modal.className = "schedule-modal";
  modal.innerHTML = `
        <div class="modal-overlay" onclick="closeModalOnOverlay(event)">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Events for ${date.toLocaleDateString()}</h2>
                    <button class="close-modal" onclick="closeModal()" title="Close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="events-list">
                        ${events
                          .map(
                            (event) => `
                            <div class="event-item" onclick="viewSchedule('${event.scheduleId}')">
                                <h4>${event.title}</h4>
                                <p><strong>Time:</strong> ${event.time}</p>
                                <p><strong>Professor:</strong> ${event.professor}</p>
                                <p><strong>Room:</strong> ${event.room}</p>
                            </div>
                        `
                          )
                          .join("")}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeModal()">Close</button>
                </div>
            </div>
        </div>
    `;

  document.body.appendChild(modal);

  requestAnimationFrame(() => {
    modal.classList.add("show");
  });
}

// ===========================
// VIEW SWITCHING
// ===========================
function setupViewSwitching() {
  const weeklyBtn = document.getElementById("weeklyViewBtn");
  const monthlyBtn = document.getElementById("monthlyViewBtn");
  const weeklySection = document.getElementById("weeklyTimetableSection");
  const monthlySection = document.getElementById("monthlyCalendarSection");

  if (weeklyBtn && monthlyBtn) {
    // Remove existing listeners
    const newWeeklyBtn = weeklyBtn.cloneNode(true);
    const newMonthlyBtn = monthlyBtn.cloneNode(true);
    weeklyBtn.parentNode.replaceChild(newWeeklyBtn, weeklyBtn);
    monthlyBtn.parentNode.replaceChild(newMonthlyBtn, monthlyBtn);

    newWeeklyBtn.addEventListener("click", function () {
      this.classList.add("active");
      newMonthlyBtn.classList.remove("active");

      if (weeklySection) weeklySection.style.display = "block";
      if (monthlySection) monthlySection.style.display = "none";
    });

    newMonthlyBtn.addEventListener("click", function () {
      this.classList.add("active");
      newWeeklyBtn.classList.remove("active");

      if (weeklySection) weeklySection.style.display = "none";
      if (monthlySection) monthlySection.style.display = "block";
    });
  }
}

// ===========================
// UTILITY FUNCTIONS
// ===========================
function showLoadingSpinner(show) {
  const spinner = document.getElementById("loadingSpinner");
  if (spinner) {
    spinner.style.display = show ? "flex" : "none";
  }
}

function handleResize() {
  if (window.innerWidth <= 768) {
    if (domCache.sidebar) domCache.sidebar.classList.add("collapsed");
    if (domCache.mainContent) domCache.mainContent.classList.add("expanded");
    sidebarCollapsed = true;
  }
}

// ===========================
// SEARCH FUNCTIONALITY
// ===========================
function setupSearch() {
  const filterContainer = document.querySelector(".filter-grid");
  if (filterContainer && !document.getElementById("search-input")) {
    const searchGroup = document.createElement("div");
    searchGroup.className = "filter-group";
    searchGroup.innerHTML = `
            <label for="search-input">Quick Search</label>
            <input type="text" id="search-input" class="filter-select" placeholder="Search schedules...">
        `;

    filterContainer.insertBefore(searchGroup, filterContainer.lastElementChild);

    const searchInput = document.getElementById("search-input");
    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase();

      filteredData = schedules.filter((schedule) => {
        return Object.values(schedule).some(
          (value) =>
            value && value.toString().toLowerCase().includes(searchTerm)
        );
      });

      renderScheduleTable();
      updateResultsCount();
    });
  }
}

// ===========================
// CONFLICT MANAGEMENT
// ===========================
function manageConflicts() {
  const conflictSchedules = schedules.filter(
    (schedule) => detectScheduleConflicts(schedule, schedule.id).length > 0
  );

  if (conflictSchedules.length === 0) {
    showNotification("No conflicts found!", "success");
    return;
  }

  let message = "CURRENT SCHEDULING CONFLICTS:\n\n";
  conflictSchedules.forEach((schedule, index) => {
    const conflicts = detectScheduleConflicts(schedule, schedule.id);
    message += `${index + 1}. ${schedule.subject} (${schedule.courseCode})\n`;
    message += `   Professor: ${schedule.professor}\n`;
    message += `   Time: ${schedule.timeSlot}\n`;
    message += `   Days: ${
      Array.isArray(schedule.days) ? schedule.days.join(", ") : schedule.days
    }\n`;
    conflicts.forEach((conflict) => {
      message += `   - ${conflict.type}: ${conflict.message}\n`;
    });
    message += "\n";
  });

  alert(message);
}

// ===========================
// ERROR HANDLING
// ===========================
function handleError(error, context = "") {
  console.error(`Error in ${context}:`, error);

  // Only show notification for critical errors
  if (error.message && !error.message.includes("non-critical")) {
    showNotification(`Error: ${error.message}`, "error");
  }
}

function safeExecute(func, context = "operation") {
  try {
    return func();
  } catch (error) {
    handleError(error, context);
    return null;
  }
}

// ===========================
// EVENT LISTENERS & SETUP
// ===========================
function setupEventListeners() {
  // Close dropdowns when clicking outside
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".menu-item") && !e.target.closest(".submenu")) {
      closeAllDropdowns();
    }

    // Close modal when clicking overlay
    if (e.target.classList.contains("modal-overlay")) {
      closeModal();
    }
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeModal();
    }

    if (e.ctrlKey && e.key === "f") {
      e.preventDefault();
      document.getElementById("department-select")?.focus();
    }
  });

  // Search functionality
  setupSearch();
}

function closeAllDropdowns() {
  const openDropdowns = document.querySelectorAll(".submenu.open");
  openDropdowns.forEach((dropdown) => {
    dropdown.classList.remove("open");
    const icon = dropdown.parentElement.querySelector(".dropdown-icon i");
    if (icon) {
      icon.classList.remove("fa-chevron-up");
      icon.classList.add("fa-chevron-down");
    }
  });
}

// ===========================
// DYNAMIC STYLES
// ===========================
function addDynamicStyles() {
  const style = document.createElement("style");
  style.textContent = `
        /* Export/Print Buttons - Only show on schedule pages */
        .export-print-container {
            display: flex;
            gap: 10px;
            margin: 15px 0;
            justify-content: flex-end;
            flex-wrap: wrap;
        }
        
        .export-btn {
            padding: 8px 16px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.9rem;
        }
        
        .csv-btn {
            background: #28a745;
            color: white;
        }
        
        .csv-btn:hover {
            background: #218838;
            transform: translateY(-2px);
        }
        
        .json-btn {
            background: #17a2b8;
            color: white;
        }
        
        .json-btn:hover {
            background: #138496;
            transform: translateY(-2px);
        }
        
        .print-btn {
            background: #6c757d;
            color: white;
        }
        
        .print-btn:hover {
            background: #5a6268;
            transform: translateY(-2px);
        }
        
        .report-btn {
            background: #fd7e14;
            color: white;
        }
        
        .report-btn:hover {
            background: #e8680c;
            transform: translateY(-2px);
        }
        
        /* Action Buttons */
        .action-btn {
            background: none;
            border: none;
            padding: 6px 8px;
            margin: 0 2px;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 0.9rem;
        }
        
        .view-btn {
            color: #4a90e2;
        }
        
        .view-btn:hover {
            background-color: rgba(74, 144, 226, 0.1);
        }
        
        .edit-btn {
            color: #f39c12;
        }
        
        .edit-btn:hover {
            background-color: rgba(243, 156, 18, 0.1);
        }
        
        .delete-btn {
            color: #e74c3c;
        }
        
        .delete-btn:hover {
            background-color: rgba(231, 76, 60, 0.1);
        }
        
        /* Modal Styles */
        .schedule-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .schedule-modal.show {
            opacity: 1;
            visibility: visible;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        
        .modal-content {
            background: white;
            border-radius: 12px;
            max-width: 600px;
            width: 100%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            transform: scale(0.9);
            transition: transform 0.3s ease;
        }
        
        .schedule-modal.show .modal-content {
            transform: scale(1);
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 25px;
            border-bottom: 1px solid #eee;
        }
        
        .modal-header h2 {
            margin: 0;
            color: #333;
        }
        
        .close-modal {
            background: none;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            color: #999;
            padding: 5px;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .close-modal:hover {
            background-color: #f5f5f5;
            color: #333;
        }
        
        .modal-body {
            padding: 25px;
        }
        
        .schedule-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
        
        .detail-group {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        
        .detail-group label {
            font-weight: 600;
            color: #333;
            font-size: 0.9rem;
        }
        
        .detail-group span {
            color: #555;
            padding: 8px 12px;
            background-color: #f8f9fa;
            border-radius: 6px;
            border: 1px solid #e9ecef;
        }
        
        .modal-input {
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 0.9rem;
        }
        
        .modal-input:focus {
            outline: none;
            border-color: #4a90e2;
            box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
        }
        
        .modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            padding: 20px 25px;
            border-top: 1px solid #eee;
        }
        
        .btn {
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.2s ease;
        }
        
        .btn-secondary {
            background-color: #6c757d;
            color: white;
        }
        
        .btn-secondary:hover {
            background-color: #5a6268;
        }
        
        .btn-primary {
            background-color: #4a90e2;
            color: white;
        }
        
        .btn-primary:hover {
            background-color: #357abd;
        }
        
        .conflict-row {
            background-color: #fff3cd !important;
            border-left: 4px solid #ffc107;
        }
        
        .conflict-indicator {
            display: inline-block;
            margin-right: 10px;
            font-size: 1.2rem;
        }
        
        .no-data-message {
            text-align: center;
            padding: 40px 20px;
            color: #666;
        }
        
        .no-data-message i {
            font-size: 3rem;
            color: #ddd;
            margin-bottom: 10px;
            display: block;
        }
        
        /* Improved Notification Styles */
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 20000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            max-width: 400px;
            pointer-events: auto;
        }
        
        .notification.show {
            opacity: 1;
            transform: translateX(0);
        }
        
        .notification.success {
            background: #2ecc71;
        }
        
        .notification.warning {
            background: #f39c12;
        }
        
        .notification.error {
            background: #e74c3c;
        }
        
        .notification.info {
            background: #3498db;
        }
        
        .notification-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 15px;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 2px 6px;
            border-radius: 3px;
            opacity: 0.8;
        }
        
        .notification-close:hover {
            opacity: 1;
            background-color: rgba(255, 255, 255, 0.2);
        }
        
        /* Timetable Styles */
        .schedule-slot.occupied {
            border-radius: 6px;
            padding: 8px;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .schedule-slot.occupied:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        
        .schedule-slot.multiple-schedules {
            border: 2px solid #fff;
            box-shadow: 0 0 10px rgba(255, 107, 107, 0.5);
        }
        
        .schedule-slot .subject {
            font-weight: bold;
            font-size: 0.85rem;
            margin-bottom: 2px;
        }
        
        .schedule-slot .professor {
            font-size: 0.75rem;
            opacity: 0.9;
        }
        
        .schedule-slot .room {
            font-size: 0.7rem;
            opacity: 0.8;
            margin-top: 2px;
        }
        
        /* Calendar Styles */
        .calendar-day {
            position: relative;
            min-height: 100px;
            border: 1px solid #ddd;
            padding: 5px;
            cursor: pointer;
        }
        
        .calendar-day.empty {
            opacity: 0.5;
            background-color: #f8f9fa;
        }
        
        .calendar-day.today {
            background-color: #e3f2fd;
            border-color: #2196f3;
        }
        
        .day-number {
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .events-container {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }
        
        .event {
            background: #4a90e2;
            color: white;
            padding: 2px 4px;
            border-radius: 3px;
            font-size: 0.75rem;
            cursor: pointer;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        
        .event:hover {
            background: #357abd;
        }
        
        .more-events {
            background: #999 !important;
            text-align: center;
        }
        
        .more-events:hover {
            background: #777 !important;
        }
        
        /* Schedule List and Event Items */
        .schedule-list, .events-list {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        
        .schedule-item, .event-item {
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .schedule-item:hover, .event-item:hover {
            background-color: #f8faff;
            border-color: #4a90e2;
            transform: translateY(-1px);
        }
        
        .schedule-item h4, .event-item h4 {
            margin: 0 0 10px 0;
            color: #333;
        }
        
        .schedule-item p, .event-item p {
            margin: 5px 0;
            color: #666;
            font-size: 0.9rem;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .schedule-details {
                grid-template-columns: 1fr;
            }
            
            .modal-content {
                margin: 10px;
                max-height: 90vh;
            }
            
            .action-btn {
                padding: 4px 6px;
                font-size: 0.8rem;
            }
            
            .export-print-container {
                justify-content: center;
            }
            
            .export-btn {
                padding: 6px 12px;
                font-size: 0.8rem;
            }
            
            .calendar-day {
                min-height: 60px;
            }
            
            .event {
                font-size: 0.7rem;
                padding: 1px 2px;
            }
        }
    `;

  document.head.appendChild(style);
}

// ===========================
// MAIN INITIALIZATION FUNCTION
// ===========================
function initialize() {
  console.log("Initializing Schedule Management System...");

  // Initialize DOM elements
  initializeElements();

  // Initialize sidebar and dropdowns first
  initializeSidebar();
  initializeDropdownMenus();

  // Load saved data
  loadFromLocalStorage();

  // Initialize UI components
  initializeScheduleForm();
  initializeTimetable();
  initializeCalendar();
  initializeExportPrint(); // Only on schedule pages

  // Setup event listeners
  setupEventListeners();
  setupFilters();

  // Add dynamic styles
  addDynamicStyles();

  // Initial data sync and display
  syncAllData();
  populateFilters();

  // Auto-save every 2 minutes
  setInterval(saveToLocalStorage, 120000);

  // Update dashboard every 30 seconds
  setInterval(() => {
    calculateDashboardStats();
    updateDashboardDisplay();
  }, 30000);

  // Initial resize check
  handleResize();

  console.log("Schedule Management System initialized successfully");
  showNotification("System loaded successfully!", "success");
}

// ===========================
// GLOBAL EXPORTS
// ===========================
// Make functions globally available
window.showNotification = showNotification;
window.closeNotification = closeNotification;
window.exportData = exportData;
window.printTable = printTable;
window.generateReport = generateReport;
window.manageConflicts = manageConflicts;
window.viewSchedule = viewSchedule;
window.editSchedule = editSchedule;
window.deleteSchedule = deleteSchedule;
window.closeModal = closeModal;
window.applyFilters = applyFilters;
window.resetFilters = resetFilters;
window.sortTable = sortTable;
window.saveScheduleChanges = saveScheduleChanges;
window.closeModalOnOverlay = closeModalOnOverlay;

// TimetableAPI for external integration
window.TimetableAPI = {
  loadSchedule: function (scheduleArray) {
    schedules = scheduleArray;
    syncAllData();
    saveToLocalStorage();
    showNotification("Schedule data loaded!", "success");
  },

  loadCalendarEvents: function (eventsArray) {
    // Convert events back to schedules format if needed
    console.warn("Use loadSchedule instead for consistency");
    showNotification("Use TimetableAPI.loadSchedule() instead", "warning");
  },

  getScheduleData: function () {
    return currentScheduleData;
  },

  getCalendarEvents: function () {
    return calendarScheduleData;
  },

  getAllSchedules: function () {
    return schedules;
  },

  refresh: function () {
    syncAllData();
    showNotification("System refreshed!", "info");
  },

  clearAllData: function () {
    if (
      confirm("Are you sure you want to clear all data? This cannot be undone.")
    ) {
      resetData();
      localStorage.removeItem("schedules");
      syncAllData();
      showNotification("All data cleared!", "warning");
    }
  },

  getStats: function () {
    return dashboardStats;
  },
};

// ===========================
// CLEANUP AND ERROR HANDLING
// ===========================
window.addEventListener("error", function (e) {
  console.error("Global error:", e);
  // Don't show notification for every error
});

window.addEventListener("beforeunload", function () {
  saveToLocalStorage();
  clearTimeout(saveTimeout);
});

window.addEventListener("resize", handleResize);

document.addEventListener("visibilitychange", function () {
  if (!document.hidden) {
    calculateDashboardStats();
    updateDashboardDisplay();
  }
});

// ===========================
// INITIALIZE WHEN READY
// ===========================
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize);
} else {
  // DOM is already loaded
  setTimeout(initialize, 100);
}
