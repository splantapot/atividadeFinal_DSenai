function navigateFromTo(from, to) {
    const fromDiv = document.getElementById(from);
    const toDiv = document.getElementById(to);
    
    fromDiv.classList.add('hidden');
    toDiv.classList.remove('hidden')
}