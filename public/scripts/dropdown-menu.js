function toggleMenu() {
    document.getElementById("dropdown").classList.toggle("show");
}

window.onclick = function(event) {
    if (!event.target.matches('.nav__img-drop') && !event.target.matches('.nav__button-drop')) {
        var dropdowns = document.getElementsByClassName("nav__dropdown");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}