/** @format */

// Select elements
var bookmarkForm = document.getElementById("bookmarkForm");
var bookmarkList = document.getElementById("bookmarkList");
var searchField = document.getElementById("searchField");
var updateButton = document.getElementById("updateButton");
var siteNameInput = document.getElementById("siteName");
var siteUrlInput = document.getElementById("siteUrl");

var updateIndex = null; // Track the index of the bookmark being updated

// Load bookmarks from local storage on page load
document.addEventListener("DOMContentLoaded", () => {
    loadBookmarks();
});

// Handle form submission
bookmarkForm.addEventListener("submit", (e) => {
    e.preventDefault();

    var siteName = siteNameInput.value.trim();
    var siteUrl = siteUrlInput.value.trim();

    // Validate input
    if (!siteName || !isValidUrl(siteUrl)) {
        alert("Please enter valid site name and URL!");
        return;
    }

    // Add new bookmark
    var bookmarks = getBookmarksFromStorage();

    if (updateIndex === null) {
        // Add a new bookmark
        bookmarks.push({ siteName, siteUrl });
    } else {
        // Update an existing bookmark
        bookmarks[updateIndex] = { siteName, siteUrl };
        updateIndex = null; // Reset the updateIndex
    }

    saveBookmarksToStorage(bookmarks);

    // Refresh UI
    loadBookmarks();

    // Clear inputs
    clearForm();
    updateButton.classList.add("d-none"); // Hide update button
});

// Handle update button click
updateButton.addEventListener("click", () => {
    bookmarkForm.dispatchEvent(new Event("submit")); // Reuse the form submit logic
});

// Search bookmarks with highlight
searchField.addEventListener("input", () => {
    var query = searchField.value.trim().toLowerCase();
    var bookmarks = getBookmarksFromStorage();
    bookmarkList.innerHTML = ""; // Clear the current table

    bookmarks.forEach((bookmark, index) => {
        const { siteName, siteUrl } = bookmark;

        // Check if the query matches
        if (siteName.toLowerCase().includes(query) || siteUrl.toLowerCase().includes(query)) {
            const highlightedName = highlightText(siteName, query);
            const highlightedUrl = highlightText(siteUrl, query);
            addBookmarkRow(index + 1, highlightedName, highlightedUrl, siteUrl, index); // Adjust index to start from 1
        }
    });
});

// Add a new row to the table
function addBookmarkRow(displayIndex, siteName, highlightedUrl, actualUrl, realIndex) {
    var row = `
        <tr>
            <td>${displayIndex}</td>
            <td>${siteName}</td>
            <td><a href="${actualUrl}" class="btn btn-success" target="_blank">Visit</a></td>
            <td><button class="btn btn-warning" onclick="editRow(${realIndex})">Edit</button></td>
            <td><button class="btn btn-danger" onclick="deleteRow(${realIndex})">Delete</button></td>
        </tr>
    `;
    bookmarkList.insertAdjacentHTML("beforeend", row);
}

// Highlight search query in text
function highlightText(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, `<mark>$1</mark>`);
}

// Edit a bookmark
function editRow(index) {
    var bookmarks = getBookmarksFromStorage();
    var bookmark = bookmarks[index];

    // Set input values
    siteNameInput.value = bookmark.siteName;
    siteUrlInput.value = bookmark.siteUrl;

    // Show update button
    updateButton.classList.remove("d-none");

    // Save index for updating
    updateIndex = index;
}

// Delete a bookmark
function deleteRow(index) {
    var bookmarks = getBookmarksFromStorage();
    bookmarks.splice(index, 1);
    saveBookmarksToStorage(bookmarks);
    loadBookmarks();
}

// Load bookmarks from storage to UI
function loadBookmarks() {
    bookmarkList.innerHTML = "";
    var bookmarks = getBookmarksFromStorage();
    bookmarks.forEach((bookmark, index) => addBookmarkRow(index + 1, bookmark.siteName, bookmark.siteUrl, bookmark.siteUrl, index));
}

// Validate URL
function isValidUrl(url) {
    var urlPattern = /^(http|https):\/\/[^\s$.?#].[^\s]*$/gm;
    return urlPattern.test(url);
}

// Get bookmarks from local storage
function getBookmarksFromStorage() {
    return JSON.parse(localStorage.getItem("bookmarks")) || [];
}

// Save bookmarks to local storage
function saveBookmarksToStorage(bookmarks) {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}

// Clear form inputs
function clearForm() {
    siteNameInput.value = "";
    siteUrlInput.value = "";
    updateIndex = null;
}
