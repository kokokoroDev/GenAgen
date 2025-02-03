const menuToggle = document.getElementById("menu-toggle");
const closeMenu = document.getElementById("close-menu");
const navLinks = document.getElementById("navlinks");
const body = document.body

menuToggle.addEventListener("click", function() {
    navLinks.classList.add("show");
    body.style.overflow = 'hidden'
});

closeMenu.addEventListener("click", function() {
    navLinks.classList.remove("show");
    body.style.overflow = ''
});