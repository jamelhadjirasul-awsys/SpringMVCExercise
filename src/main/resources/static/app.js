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
    if (id) {
        updateStudent(id, studentData);
    }
    else {
        createStudent(studentData);
    }
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
                        <button class="btn-edit" onClick="initializesStudentFormById(${student.id})">Edit</button>
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

async function initializesStudentFormById(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error("Could not fetch student details");

        const student = await response.json();

        document.getElementById("studentId").value = student.id;
        document.getElementById("firstName").value = student.firstName;
        document.getElementById("lastName").value = student.lastName;
        document.getElementById("email").value = student.email;

        // button changes when edit button is triggered
        const submitBtn = document.getElementById("submitBtn");
        submitBtn.textContent = "Update";
        submitBtn.style.backgroundColor = "#007bff";

        // clear old error highlights when loading data into form
        clearValidationStyles();
    }
    catch (error) {
        console.error("Error fetching student details:", error)
    }
}

async function updateStudent(id, studentData) {
    try {
        const response = await fetch (`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(studentData)
        });

        if (response.ok) {
            resetForm();
            await getAllStudents();
            alert("Student updated successfully!");
        }
        else {
            alert("Error updating student.");
        }
    }
    catch (error) {
        console.error("Error updating student:", error);
    }
}

async function deleteStudent(id) {
    if (confirm("Are you sure you want to delete this student?")) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
            });

            if (response.ok) {
                const message = await response.text();
                resetForm();
                alert(message);
                getAllStudents();
            }
            else {
                alert("Error deleting student.");
            }
        }
        catch (error) {
            console.error("Error deleting student:", error);
        }
    }
}