// Mock user data
const mockUsers = [
    {
        username: "dungeonmaster",
        password: "password123",
        email: "dm@example.com"
    },
    {
        username: "elfbard",
        password: "harpstrings",
        email: "bard@example.com"
    },
    {
        username: "dwarfwarrior",
        password: "axe4life",
        email: "dwarf@example.com"
    }
];

// Function to authenticate a user
function authenticateUser(username, password) {
    console.log("Authenticating user:", username);
    
    // Find the user in our mock database
    const user = mockUsers.find(user => user.username === username && user.password === password);
    
    if (user) {
        console.log("User found, storing session data");
        // Store the logged in user in sessionStorage
        sessionStorage.setItem('currentUser', JSON.stringify({
            username: user.username,
            email: user.email,
            // Do not store the password in session storage
            isLoggedIn: true
        }));
        return true;
    }
    console.log("Authentication failed: user not found or password incorrect");
    return false;
}

// Function to check if a user is logged in
function isUserLoggedIn() {
    const user = JSON.parse(sessionStorage.getItem('currentUser'));
    const loggedIn = user && user.isLoggedIn;
    console.log("Checking login status:", loggedIn ? "Logged in as " + user.username : "Not logged in");
    return loggedIn;
}

// Function to log out the current user
function logoutUser() {
    console.log("Logging out user");
    sessionStorage.removeItem('currentUser');
}

// Function to get the current logged in user
function getCurrentUser() {
    return JSON.parse(sessionStorage.getItem('currentUser'));
}
