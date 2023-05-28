document.querySelector('.hamburger-btn').addEventListener('click', function(){
    this.classList.toggle('active');
    document.querySelector('.menu-container').classList.toggle('active');
});
