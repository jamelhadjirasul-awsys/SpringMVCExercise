const API_URL = "http://localhost:8080/api/students"

// create a student
async function createStudent(studentData) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(studentData)
        });

        if (response.ok) {
            resetForm();
            await getAllStudents();
            alert("Student added successfully!");
        }
        else {
            const errorDetails = await response.text();
            alert(`Error adding student (${response.status}): ${errorDetails || response.statusText}`);
        }
    }
    catch (error) {
        console.error("Error creating student:", error);
        alert("Could not connect to the server. Check that the application is running, then try again.");
    }
}

document.getElementById("studentForm").addEventListener("submit", function(e) {
    e.preventDefault();

    if(!validateStudentForm()){
        return;
    }

    const id = document.getElementById("studentId").value;
    const studentData = {
        firstName: document.getElementById("firstName").value.trim(),
        lastName: document.getElementById("lastName").value.trim(),
        email: document.getElementById("email").value.trim()
    };
    createStudent(studentData);
});

// Helper function to reset form state
function resetForm() {
    document.getElementById("studentId").value = "";
    document.getElementById("studentForm").reset();
    clearValidationStyles();

    const submitBtn = document.getElementById("submitBtn");
    submitBtn.textContent = "Add Student";
    submitBtn.style.backgroundColor = "#28a745";
}

async function getAllStudents() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Network response was not ok");

        const students = await response.json();
        const tableBody = document.getElementById("studentTableBody");
        tableBody.innerHTML = "";

        students.forEach(student => {
            const row = `
                <tr>
                    <td>${student.id}</td>
                    <td>${student.firstName}</td>
                    <td>${student.lastName}</td>
                    <td>${student.email}</td>
                    <td>
                        <button class="btn-edit" onClick="initializeStudentFormById(${student.id})">Edit</button>
                        <button class="btn-delete" onClick="deleteStudent(${student.id})">Delete</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    }
    catch (error) {
        console.error("Error fetching students:", error);
        alert("Failed to fetch students. Is your Spring Boot backend running?");
    }
}

document.addEventListener("DOMContentLoaded", getAllStudents);