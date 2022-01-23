function navButton (btn) {
    btn.classList.toggle("navMenuActive")
    document.getElementById("navMenuOverlay").classList.toggle("activeOverlay")
    document.body.classList.toggle("hideOverflow")
}