//Создаем два массива данных с лат фразами и переводами
const latinPhrases = [
    "Consuetudo est altera natura",
    "Nota bene",
    "Nulla calamitas sola",
    "Per aspera ad astra"
];

const translations = [
    "Привычка - вторая натура",
    "Заметьте хорошо!",
    "Беда не приходит одна",
    "Через тернии к звёздам"
];

//Вспомогательные переменные 
let remainingIndices = Array.from(Array(latinPhrases.length).keys()); //Массив индексов для отслеживания неисппользуемых фраз 
let toggleClass = false; //Флаг для чередования стилей фраз class1; class2

//Получение DOM элементов
const container = document.getElementById("container");
const list = document.getElementById("list");
const generateButton = document.getElementById("generate");
const repaintButton = document.getElementById("repaint");
const createListButton = document.getElementById("createList");

//Генерация фразы по кнопке "Показать фразу"
//Привязываем событие клик к кнопке 
generateButton.addEventListener("click", () => {
    //Если массив пуст - выводим алерт фразы закончились
    if (remainingIndices.length === 0) {
        alert("Фразы закончились");
        return;
    }
    //Генерируем случайное число от 0 до 1 и умножаем на массив индексов, чтобы получить случайную фразу 
    const randomIndex = Math.floor(Math.random() * remainingIndices.length);
    //Полученный индекс возвращаем и удаляем из массива
    const phraseIndex = remainingIndices.splice(randomIndex, 1)[0];

    //Создаем новый элемент, в котором объединяем лат фразу и перевод
    const phraseElement = document.createElement("div");
    phraseElement.textContent = `${latinPhrases[phraseIndex]} — ${translations[phraseIndex]}`;
    //Применяем стиль к фразу в зависимости от класса и добавляем элемент в контейнер 
    phraseElement.className = toggleClass ? "class1" : "class2";
    container.appendChild(phraseElement);
    //Переключаем флаг для смены стилей 
    toggleClass = !toggleClass;
});

//Изменение шрифта для четных строк 
//Привязываем событие клик к кнопке
repaintButton.addEventListener("click", () => {
    //Получаем дочерние элементы контейнера и проходим по всем элементам - фразам
    const children = container.children;
    for (let i = 0; i < children.length; i++) {
        //Проверяем на четность, если четная - шрифт жирный
        if ((i + 1) % 2 === 0) { 
            children[i].classList.add("bold");
        }
    }
});

// Создание списка
//Привязываем событие клик к кнопке
createListButton.addEventListener("click", () => {
    //Очистка списка для избежания дублирования при повторном нажатии
    list.innerHTML = "";
    //Проходим по всем элементам массива лат фраз и создаем основные элементы списка
    for (let i = 0; i < latinPhrases.length; i++) {
        const listItem = document.createElement("li");
        listItem.textContent = `"${latinPhrases[i]}"`;

        //Создаем элементы вложенного списка с переводами 
        const subList = document.createElement("ul");
        const subItem = document.createElement("li");
        subItem.textContent = `"${translations[i]}"`;
        subList.appendChild(subItem);
        
        //Добавляем вложенный список в основной
        listItem.appendChild(subList);
        //Перекрашиваем элементы списка в зависимости от четности фразы
        listItem.style.backgroundColor = (i % 2 === 0) ? "rgb(192, 137, 247)" : "rgb(246, 202, 136)";       
        //Добавляем основной список в корневой элемент
        list.appendChild(listItem);
    }
});
