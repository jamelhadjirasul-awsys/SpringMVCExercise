function validateStudentForm() {
    let isValid = true;

    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const email = document.getElementById("email");

    const firstNameError = document.getElementById("firstNameError");
    const lastNameError  = document.getElementById("lastNameError");
    const emailError  = document.getElementById("emailError");

    // First Name Validation
    if (firstName.value.trim() === "") {
        firstNameError.textContent = "First name is required.";
        firstName.classList.add("invalid");
        isValid = false;
    }
    else if (firstName.value.trim().length < 2) {
        firstNameError.textContent = "First name must be atleast 2 characters long.";
        firstName.classList.add("invalid");
        isValid = false;
    }
}