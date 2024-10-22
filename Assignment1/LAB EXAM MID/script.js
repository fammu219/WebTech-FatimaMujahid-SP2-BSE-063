const hoverImage = document.getElementById('hoverImage');
const introText = document.getElementById('introText');


hoverImage.addEventListener('mouseover', () => {
    introText.style.display = 'block'; 
});


hoverImage.addEventListener('mouseout', () => {
    introText.style.display = 'none'; 
});
