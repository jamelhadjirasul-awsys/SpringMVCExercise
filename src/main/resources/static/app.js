const API_URL = "http://localhost:8080/api/students";
const API_AUTH = "http://localhost:8080/api/auth";

/**
 * Sends a new student to the API, then resets the form and refreshes the list.
 * @param {{firstName: string, lastName: string, email: string}} studentData
 * @returns {Promise<void>}
 */
async function createStudent(studentData) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
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

/**
 * Validates the form and dispatches a create or update request on submission.
 * @param {SubmitEvent} e the form submission event
 */
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

/**
 * Clears the form and restores its default submit-button state.
 * @returns {void}
 */
function resetForm() {
    document.getElementById("studentId").value = "";
    document.getElementById("studentForm").reset();
    clearValidationStyles();

    const submitBtn = document.getElementById("submitBtn");
    submitBtn.textContent = "Add Student";
    submitBtn.style.backgroundColor = "#28a745";
}

/**
 * Fetches all students and renders them in the student table.
 * @returns {Promise<void>}
 */
async function getAllStudents() {
    try {
        const response = await fetch(API_URL, {
            method: "GET",
            credentials: "include"
        });
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

/**
 * Loads a student's data into the form for editing.
 * @param {number|string} id the ID of the student to load
 * @returns {Promise<void>}
 */
async function initializesStudentFormById(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "GET",
            credentials: "include"
        });
        if (!response.ok) throw new Error("Could not fetch student details");

        const student = await response.json();

        document.getElementById("studentId").value = student.id;
        document.getElementById("firstName").value = student.firstName;
        document.getElementById("lastName").value = student.lastName;
        document.getElementById("email").value = student.email;

        const submitBtn = document.getElementById("submitBtn");
        submitBtn.textContent = "Update";
        submitBtn.style.backgroundColor = "#007bff";

        clearValidationStyles();
    }
    catch (error) {
        console.error("Error fetching student details:", error)
    }
}

/**
 * Sends updated student data to the API, then resets the form and refreshes the list.
 * @param {number|string} id the ID of the student to update
 * @param {{firstName: string, lastName: string, email: string}} studentData
 * @returns {Promise<void>}
 */
async function updateStudent(id, studentData) {
    try {
        const response = await fetch (`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
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

/**
 * Deletes a student after confirmation and refreshes the student list.
 * @param {number|string} id the ID of the student to delete
 * @returns {Promise<void>}
 */
async function deleteStudent(id) {
    if (confirm("Are you sure you want to delete this student?")) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
                credentials: "include"
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

/**
 * Attempts session login and navigates to the dashboard on success.
 * @param {{username: string, password: string}} loginDto credentials provided by the caller
 * @returns {Promise<void>}
 */
async function loginUser(loginDto) {
    try {
        const response = await fetch(`${API_AUTH}/auth_login_session`, {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            credentials: "include"
        });

        if (response.ok) {
            alert("Login successfull!");
            window.location.href = "index.html";
        }
        else {
            alert("Invalid credentials.");
        }
    }
    catch (error) {
        console.error("Login error:", error);
    }
}

/**
 * Ends the current session, clears the dashboard, and reloads the page.
 * @returns {Promise<void>}
 */
async function logoutUser() {
    try {
        await fetch(`${API_AUTH}/logout`, {
            method: "POST",
            credentials: "include"
        });
        document.getElementById("studentTableBody").innerHTML = "";
        resetForm();
        alert("Logged out successfully!");

        try {
            await fetch(API_URL, {
                method: "GET",
                headers: {
                    "Authorization:": "Basic " + 
                                btoa("invalid_user:wrong_password")
                }
            });
        }
        catch (err) {
            console.log("Browser credential cache cleared.");
        }
        window.location.reload();
    }
    catch (e) {
        console.error("Logout transmission crash:", e);
    }
}


