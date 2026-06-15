window.getCurrentUsername = function() {
    return sessionStorage.getItem('username');
};

window.getCurrentUserId = function() {
    return sessionStorage.getItem('userId');
};

window.getCurrentEmail = function() {
    return sessionStorage.getItem('email');
};