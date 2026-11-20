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
            alert("Student added successfully!");
            resetForm();
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