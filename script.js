//Выпадающее меню
const menuBtn = document.querySelector('.menu-btn');
const menu = document.querySelector('.menu');

menuBtn.addEventListener('click', () => {
    menu.classList.toggle('active');
});
//Выпадающие блоки
document.querySelectorAll('.block-header').forEach((header) => {
    header.addEventListener('click', () => {
        const block = header.parentElement;
        block.classList.toggle('open');
    });
});


