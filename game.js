//Объект для храненя текущего состояния игры
const gameData = {
    playerName: "",
    score: 0,
    correctAnswers: 0,
    timer: null,
    currentIteration: 1,
    currentCorrectAnswers: 0
};

//Функция для инициализации первого экрана 
function renderStartScreen() {
    resetLocalStorage();
    const app = document.getElementById("app");
    app.innerHTML = `
        <div class="game-container">
            <h1 class="title">ИГРА В СЛОВА</h1>
            <input type="text" id="playerName" class="input" placeholder="Введите ваше имя">
            <button id="startButton" class="button" disabled>Начать</button>
        </div>
    `;
    
    const playerNameInput = document.getElementById("playerName");
    const startButton = document.getElementById("startButton");

    //Валидация поля ввода имени, если что-то введено - сохраняем имя и активируем кнопку
    playerNameInput.addEventListener("input", () => {
        if (playerNameInput.value.trim() !== "") {
            startButton.disabled = false;
            startButton.classList.remove("button-disabled");
            startButton.classList.add("button-enabled");
        //Если поле пустое - нельзя пройти дальше
        } else {
            startButton.disabled = true;
            startButton.classList.remove("button-enabled");
            startButton.classList.add("button-disabled");
        }
    });
    //После нажатия на кнопку запускаем игру
    startButton.addEventListener("click", () => {
        gameData.playerName = playerNameInput.value.trim();
        renderLevelOneIntro();
    });
}

//Инициализация игры
function initializeGame() {
    renderStartScreen();
}

document.addEventListener("DOMContentLoaded", initializeGame);

//Коллекция слов для первого уровня
const animalCollection = [
    "Кошка", "Река", "Собака", "Горы", "Машина", "Тигр", "Слон", "Лев", "Дом", "Медведь", "Автомобиль", "Лошадь", "Трава", "Пингвин", "Крокодил", "Рыба", "Велосипед", "Змея", "Пальма", "Волк", "Котёнок", "Утка", "Курица", "Орел", "Рак", "Лиса", "Заяц", "Кролик", "Бобер", "Корова", "Олень", "Перепелка", "Снегирь", "Синица"
];

const correctAnswersList = [
    "Кошка", "Собака", "Тигр", "Слон", "Лев", "Медведь", "Лошадь", "Крокодил", "Змея", "Волк", "Котёнок", "Собака", "Лиса", "Заяц", "Кролик", "Бобер", "Корова", "Олень"
];

//Функция для перемешивания массива, чтобы слова выкидывались в рандомном порядке
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

//Инициализация экрана для первого уровня
function renderLevelOneIntro() {
    const app = document.getElementById("app");
    app.innerHTML = `
        <div class="game-container">
            <h1 class="title">Уровень 1</h1>
            <p class="description">Вам нужно выбрать правильные слова, которые относятся к категории "Животные". 
            Время уменьшается с каждой итерацией, за неправильный ответ снимается 20 баллов. Для прохождения уровня нужно набрать минимум 60 очков. Вы можете завершить игру в любой момент.</p>
            <button id="startLevelButton" class="button">Начать</button>
        </div>
    `;
    //Запуск первого экрана после клика на кнопку Скачать
    const startLevelButton = document.getElementById("startLevelButton");
    startLevelButton.addEventListener("click", () => {
        gameData.currentIteration = 1;
        renderLevelOneGame();
    });
}

//Отображение первого уровня 
function renderLevelOneGame() {
    const app = document.getElementById("app");

    //Генерация игровых опций
    //Перемешивание коллекции животных
    const shuffledOptions = shuffleArray([...animalCollection]);
    //Выбираем первые три правильных ответа
    const correctOptions = shuffleArray([...correctAnswersList]).slice(0, 3);
    //Исключаем правильные и оставляем неправильные
    const incorrectOptions = shuffledOptions.filter(option => !correctAnswersList.includes(option)).slice(0, 3);
    //Объединяем выборки
    const finalOptions = shuffleArray([...correctOptions, ...incorrectOptions]);
    //Сброс счетчика верных ответов для новой итерации
    gameData.currentCorrectAnswers = 0; 
    //Уменьшаем таймер на 10 сек для каждой итерации
    const timeLimit = 60 - (gameData.currentIteration - 1) * 10; 

    //Отображаем игровой экран согласно итерации
    app.innerHTML = `
        <div class="game-container">
            <h1 class="title">Уровень 1: Итерация ${gameData.currentIteration}</h1>
            <p id="timer" class="timer">Время: ${timeLimit}</p>
            <div id="gameArea" class="game-area">
                ${finalOptions.map(option => `<button class="game-option">${option}</button>`).join("")}
            </div>
            <p id="score" class="score">Очки: ${gameData.score}</p>
            <button id="endGameButton" class="button">Завершить игру</button>
            <button id="skipLevelButton" class="button">Пропустить уровень</button>
        </div>
    `;

    document.getElementById("skipLevelButton").addEventListener("click", () => {
        clearInterval(gameData.timer); 
        const requiredScore = 80; 
        gameData.score = requiredScore; 
        gameData.levelOneScore = requiredScore; 
        endIteration(true); 
    });

    //Событие для кнопки окончания игры
    document.getElementById("endGameButton").addEventListener("click", () => {
        endGame(false);
    });
    //Запускаем таймер и вызываем функцию для обработки игровых опций
    startTimer(timeLimit, document.getElementById("timer"));
    setupGameOptions();
}

//Функция для работы таймера
function startTimer(duration, timerElement) {
    let time = duration;
    //Вызываем функцию каждую секунду, обновляем значение таймера
    gameData.timer = setInterval(() => {
        time--;
        timerElement.textContent = `Время: ${time}`;
        //Если время истекло, вызываем функцию окончания итерации
        if (time <= 0) {
            clearInterval(gameData.timer);
            endIteration(false);
        }
    }, 1000);
}

//Функция отвечающая за работу всех игровых опций для первого уровня
function setupGameOptions() {
    const options = document.querySelectorAll(".game-option");

    //Для каждой кнопки добавляем событие
    options.forEach(option => {
        option.addEventListener("click", () => {
            //Проверяем содержатся ли правильные ответы, если да меняем цвет кнопки на зеленый, добавляем очки, увеличиваем счетчик и обновляем счет
            if (correctAnswersList.includes(option.textContent)) {
                option.style.animation = "correctAnswer 0.5s ease";
                option.style.backgroundColor = "#48b608";
                gameData.score += 10;
                gameData.currentCorrectAnswers++;
                document.getElementById("score").textContent = `Очки: ${gameData.score}`;

                //Если есть три правильных ответа - итерация завершена
                if (gameData.currentCorrectAnswers === 3) { 
                    clearInterval(gameData.timer);
                    endIteration(true);
                }
            } else {
                //Если ответ неверный, меняем цвет кнопки, отнимаем баллы, обновляем счет
                option.style.animation = "wrongAnswer 0.5s ease";
                option.style.backgroundColor = "#FF2A5F";
                gameData.score -= 20;
                if (gameData.score < 0) {
                    gameData.score = 0;
                }
                document.getElementById("score").textContent = `Очки: ${gameData.score}`;
            }
            //После выбора кнопка неактивна, повторно ее выбрать нельзя
            option.disabled = true;
            // Удаляем анимацию после её завершения
            option.addEventListener("animationend", () => {
                option.style.animation = ""; // Сброс анимации
            });
        });
    });
}

//Функция окончания итерации первого уровня 
function endIteration(success) {
    //Если итерация завершена успешно - увеличиваем счетчик
    if (success) {
        gameData.currentIteration++;
        //Если итераций больше 5 - уровень пройден
        if (gameData.currentIteration > 5) {
            //Сохраняем очки первого уровня
            localStorage.setItem("levelOneScore", gameData.score.toString()); 
            //Вызываем функцию окончания игры
            endGame(gameData.score >= 60);
        } else {
            //Если итерация не последняя - переходим на след
            renderLevelOneGame();
        }
    } else {
        //Если итерация окончена неуспешно вызываем функцию окончания игры 
        endGame(false);
    }
}

function resetLocalStorage() {
    localStorage.removeItem("levelOneScore");
    localStorage.removeItem("levelTwoScore");
    localStorage.removeItem("levelThreeScore");
}

//Функция окончания игры и перехода на другие уровни
function endGame(success, finalScore = gameData.score) {
    const app = document.getElementById("app");
    clearInterval(gameData.timer);
   
    //Получаем очки с каждого уровня из localStorage
    const levelOneScore = parseInt(localStorage.getItem("levelOneScore"), 10) || 0;
    const levelTwoScore = parseInt(localStorage.getItem("levelTwoScore"), 10) || 0;
    const levelThreeScore = parseInt(localStorage.getItem("levelThreeScore"), 10) || 0;

    //Проверяем, завершены ли все уровни
    const allLevelsCompleted = localStorage.getItem("levelOneScore") !== null &&
                               localStorage.getItem("levelTwoScore") !== null &&
                               localStorage.getItem("levelThreeScore") !== null;

    //Суммируем очки для финального подсчета
    const totalScore = allLevelsCompleted 
        ? levelOneScore + levelTwoScore + levelThreeScore 
        : finalScore + levelTwoScore;

    
    //Обработка неудачного прохождения какого-то из уровней
    if (!success) {
        //Если какой-то из уровней не пройден, то обнуляем все данные прохождения и запускаем уровень заново
        if (!localStorage.getItem("levelOneScore") || parseInt(localStorage.getItem("levelOneScore"), 10) < 60) {
            gameData.levelOneScore = 0;
            gameData.score = 0;
            gameData.correctAnswers = 0;
            gameData.currentIteration = 1;
            localStorage.removeItem("levelOneScore");
            alert("Уровень 1 не пройден. Попробуйте снова!");
            renderLevelOneIntro();
        } else if (!localStorage.getItem("levelTwoScore") || parseInt(localStorage.getItem("levelTwoScore"), 10) < 120) {
            gameData.levelTwoScore = 0;
            gameData.score = 0;
            gameData.correctAnswers = 0;
            localStorage.removeItem("levelTwoScore");
            gameData.currentIteration = 1;
            alert("Уровень 2 не пройден. Попробуйте снова!");
            renderLevelTwoIntro();
        } else if (!localStorage.getItem("levelThreeScore") || parseInt(localStorage.getItem("levelThreeScore"), 10) < 150) {
            gameData.levelThreeScore = 0; 
            gameData.score = 0;
            gameData.correctAnswers = 0;
            localStorage.removeItem("levelThreeScore");
            gameData.currentIteration = 1;
            alert("Уровень 3 не пройден. Попробуйте снова!");
            renderLevelThreeIntro();
        }
        return; 
    }

    app.innerHTML = `
        <div class="game-container">
            <h1 class="title">${success ? "Вы прошли уровень!" : "Игра завершена!"}</h1>
            <p class="description">Ваши очки: ${totalScore}</p>
            <button id="restartButton" class="button">${success ? "Начать следующий уровень" : "Попробовать снова"}</button>
        </div>
    `;

    //Обработчик для кнопки запуска
    const restartButton = document.getElementById("restartButton");
    restartButton.addEventListener("click", () => {
        if (success) {
            // Логика перехода между уровнями
            if (!localStorage.getItem("levelTwoScore")) {
                // Если второй уровень еще не начат, переходим на второй уровень
                if (levelOneScore >= 60) {
                    renderLevelTwoIntro();
                } else {
                    alert("Недостаточно очков для перехода на следующий уровень. Попробуйте снова!");
                    renderLevelOneIntro();
                }
            } else if (!localStorage.getItem("levelThreeScore")) {
                // Если третий уровень еще не начат, проверяем очки второго уровня
                if (levelTwoScore >= 120) {
                    renderLevelThreeIntro(); 
                } else {
                    alert("Недостаточно очков для перехода на следующий уровень. Попробуйте снова!");
                    renderLevelTwoIntro(); 
                }
            } else {
                // Если все уровни завершены, игра считается полностью пройденной
                alert("Поздравляем! Вы завершили все уровни!");
                openLeaderboardPage(totalScore, gameData.playerName); 
            }
        } else {
            // Полный сброс данных игры
            // gameEnded = false; 
            gameData.playerName = "";
            gameData.score = 0;
            gameData.correctAnswers = 0;
            gameData.timer = null;
            gameData.currentIteration = 1;
            gameData.currentCorrectAnswers = 0;
            gameData.levelTwoScore = 0;
            gameData.levelThreeScore = 0;
            resetLocalStorage();
            renderLevelOneIntro(); // Начать с первого уровня
        }
    });
}

//Функция для отображения старта второго уровня
function renderLevelTwoIntro() {
    const app = document.getElementById("app");
    
    app.innerHTML = `
        <div class="game-container">
            <h1 class="title">Уровень 2</h1>
            <p class="description">Введите три предложенных слова за ограниченное время. Время на каждую итерацию сокращается, а слова выбираются случайным образом!</p>
            <button id="startLevelButton" class="button">Начать</button>
        </div>
    `;
    //Запуск уровня после нажатия на кнопку
    document.getElementById("startLevelButton").addEventListener("click", () => {
        gameData.currentIteration = 1; 
        gameData.levelTwoScore = 0; 
        renderLevelTwoGame();
    });
}

function animateCorrectInput(inputElement) {
    let scale = 1;
    let growing = true;
    let steps = 0;

    function step() {
        steps++;

        if (growing) {
            scale += 0.02; 
            if (scale >= 1.15) growing = false; 
        } else {
            scale -= 0.02; 
            if (scale <= 1 && steps >= 50) { 
                inputElement.style.transform = "";
                inputElement.style.backgroundColor = ""; 
                return;
            }
        }

        inputElement.style.transform = `scale(${scale})`;
        inputElement.style.backgroundColor = "#48b608"; 
        requestAnimationFrame(step);
    }

    step();
}

function animateWrongInput(inputElement) {
    let angle = 0;
    let direction = 1;
    //Для отслеживания завершения цикла
    let steps = 0; 

    function step() {
        steps++;

        angle += 2 * direction; 
        inputElement.style.transform = `rotate(${angle}deg)`;
        inputElement.style.backgroundColor = "#FF2A5F"; 

        if (angle >= 10 || angle <= -10) {
            direction *= -1; 
        }

        if (steps >= 30 && Math.abs(angle) < 1 && direction === -1) {
            inputElement.style.transform = "";
            inputElement.style.backgroundColor = ""; 
            return;
        }
        requestAnimationFrame(step);
    }

    step();
}

//Функция для начала игры второго уровня
function renderLevelTwoGame() {
    const app = document.getElementById("app");
    gameData.currentIteration = gameData.currentIteration || 1;
    //Загружаем текущие баллы или берем 0 по умолчанию
    const levelOneScore = parseInt(localStorage.getItem("levelOneScore"), 10) || 0;
    const levelTwoScore = parseInt(gameData.levelTwoScore, 10) || 0;
    //Считаем общее кол-во баллов
    const totalScore = levelOneScore + levelTwoScore;
    
    //Коллекция слов второго уровня
    const wordCollections = [
        ["пень", "лес", "дом", "кот", "река", "гора", "рука", "забор", "сон", "птица"],
        ["цветок", "медведь", "дорога", "горы", "озеро", "звезда", "лошадь", "солнце", "синоним", "солнечный"],
        ["замечательный", "удивительный", "фантастический", "потрясающий", "великолепный", "восхитительный", "невероятный", "изумительный", "прекрасный", "блестящий"]
    ];

    //Выбираем три слова из коллекции для каждой итерации
    const currentWords = shuffleArray(wordCollections[Math.min(gameData.currentIteration - 1, wordCollections.length - 1)]).slice(0, 3);
    gameData.currentCorrectAnswers = 0;
    //Для каждой итерации уменьшаем время на 5 сек
    const timeLimit = 60 - (gameData.currentIteration - 1) * 5;
    
    app.innerHTML = `
        <div class="game-container">
            <h1 class="title">Уровень 2: Итерация ${gameData.currentIteration}</h1>
            <div class="words-list">
                ${currentWords.map(word => `<p class="word">${word}</p>`).join("")}
            </div>
            <input type="text" id="wordInput" class="input" placeholder="Введите слово">
            <button id="submitWordButton" class="button" disabled>Проверить</button>
            <button id="endLevelButton" class="button">Завершить уровень</button>
            <button id="skipLevelButton" class="button">Пропустить уровень</button>
            <p id="timer" class="timer">Время: ${timeLimit}</p>
            <p id="score" class="score">Очки: ${totalScore}</p>
        </div>
    `;

    //Запускаем таймер
    startTimer(timeLimit, document.getElementById("timer"));
    //Получаем необходмые игровые элементы
    const wordInput = document.getElementById("wordInput");
    const submitButton = document.getElementById("submitWordButton");
    const endLevelButton = document.getElementById("endLevelButton");
    
    //Активируем кнопку проверки если в поле есть текст
    wordInput.addEventListener("input", () => {
        submitButton.disabled = wordInput.value.trim() === "";
    });

    //Настраиваем досрочное завершение уровня
    endLevelButton.addEventListener("click", () => {
        renderEndLevelScreen();
    });

    document.getElementById("skipLevelButton").addEventListener("click", () => {
        clearInterval(gameData.timer); 
        const requiredScore = 120; 
        gameData.levelTwoScore = requiredScore;
        endIterationTwo(true); 
    });

    //Настройка события для проверки правильности ввода
    submitButton.addEventListener("click", () => {
        const userInput = wordInput.value.trim().toLowerCase();
        //Сравниваем ввод со словами
        if (currentWords.includes(userInput)) {
            animateCorrectInput(wordInput);
            //Если слово введено верно, добавляем баллы
            gameData.levelTwoScore = parseInt(gameData.levelTwoScore || 0, 10) + 20;
            gameData.currentCorrectAnswers++;
            const updatedTotalScore = parseInt(localStorage.getItem("levelOneScore"), 10) + gameData.levelTwoScore;
            document.getElementById("score").textContent = `Очки: ${updatedTotalScore}`;
            wordInput.value = "";
            submitButton.disabled = true;
            //Если все слова угаданы - заканчиваем текущую итерацию
            if (gameData.currentCorrectAnswers === currentWords.length) {
                clearInterval(gameData.timer);
                endIterationTwo(true);
            }
        } else {
            animateWrongInput(wordInput);
            //Неверный ввод слова
            gameData.levelTwoScore = parseInt(gameData.levelTwoScore || 0, 10) - 20;
            if (gameData.levelTwoScore < 0) gameData.levelTwoScore = 0; 
            const updatedTotalScore = parseInt(localStorage.getItem("levelOneScore"), 10) + gameData.levelTwoScore;
            document.getElementById("score").textContent = `Очки: ${updatedTotalScore}`;
            alert("Неправильное слово! Попробуйте снова.");
        }
    });
}

//Функция для контроля итераций второго уровня
function endIterationTwo(success) {
    if (success) {
        gameData.currentIteration++;
        if (gameData.currentIteration > 3) {
            // Завершаем второй уровень
            const levelOneScore = parseInt(localStorage.getItem("levelOneScore"), 10) || 0;
            const levelTwoScore = parseInt(gameData.levelTwoScore, 10) || 0;
            // Сохраняем очки второго уровня в localStorage
            localStorage.setItem("levelTwoScore", levelTwoScore);
            endGame (levelTwoScore >= 120)
            } else {
                renderLevelTwoGame();
            }
    } else {
        //Если уровень не завершен успешно, ничего не сохраняем и показываем экран завершения уровня
        renderEndLevelScreen();
    }
}

//Экран досрочного окончания второго уровня
function renderEndLevelScreen() {
    if (gameData.timer) clearInterval(gameData.timer);
    const app = document.getElementById("app");
    //Подводим итог по очкам
    const levelOneScore = parseInt(localStorage.getItem("levelOneScore"), 10) || 0;
    const totalScore = levelOneScore + gameData.levelTwoScore;

    app.innerHTML = `
        <div class="game-container">
            <h1 class="title">Уровень завершен досрочно</h1>
            <p class="description">Вы можете завершить игру с текущим количеством очков или попробовать пройти уровень заново.</p>
            <p class="score">Ваши очки: ${totalScore}</p>
            <button id="restartLevelButton" class="button">Пройти уровень заново</button>
            <button id="endGameButton" class="button">Завершить игру</button>
        </div>
    `;

    //Если игрок хочет пройти уровень заново
    document.getElementById("restartLevelButton").addEventListener("click", () => {
        //Обнуляем только очки второго уровня
        gameData.levelTwoScore = 0; 
        localStorage.removeItem("levelTwoScore");
        //Обнуляем итерации
        gameData.currentIteration = 1; 
        renderLevelTwoGame();
    });

    //Если игрок завершает игру
   document.getElementById("endGameButton").addEventListener("click", () => {
        //Завершаем игру с текущими очками
            endGame(false, totalScore); 
        });
    
}

//Функция для отображения стратового экрана третьего уровня
function renderLevelThreeIntro() {
    const app = document.getElementById("app");
    app.innerHTML = `
        <div class="game-container">
            <h1 class="title">Уровень 3</h1>
            <p class="description">
                Перетащите правильные слова в область "Правильные слова", а неправильные — в "Неправильные слова".
                За правильно перенесённое слово начисляется 10 баллов, за ошибку снимается штраф.
                С каждым уровнем слова становятся сложнее, а штраф увеличивается.
            </p>
            <button id="startLevelButton" class="button">Начать</button>
        </div>
    `;
    //Настройка события для кнопки начала уровня
    document.getElementById("startLevelButton").addEventListener("click", () => {
        gameData.currentIteration = 1;
        renderLevelThreeGame();
    });
}

function animateCorrectArea(area) {
    let scale = 1;
    let growing = true;
    let steps = 0;

    function step() {
        steps++;
        if (growing) {
            scale += 0.02;
            if (scale >= 1.1) growing = false;
        } else {
            scale -= 0.02;
            if (scale <= 1 && steps >= 30) {
                area.style.transform = "";
                area.style.backgroundColor = "#f9f9f9"; 
                return;
            }
        }

        area.style.transform = `scale(${scale})`;
        area.style.backgroundColor = "#48b608"; 
        requestAnimationFrame(step);
    }

    step();
}

function animateWrongArea(area) {
    let angle = 0;
    let direction = 1;
    let steps = 0;

    function step() {
        steps++;
        angle += 2 * direction;
        area.style.transform = `rotate(${angle}deg)`;
        area.style.backgroundColor = "#FF2A5F"; 

        if (angle >= 10 || angle <= -10) {
            direction *= -1;
        }

        if (steps >= 30 && Math.abs(angle) < 1) {
            area.style.transform = "";
            area.style.backgroundColor = "#f9f9f9"; 
            return;
        }

        requestAnimationFrame(step);
    }

    step();
}

//Функция для игры третьего уровня
function renderLevelThreeGame() {
    const app = document.getElementById("app");
    //Получаем все очки
    const levelOneScore = parseInt(localStorage.getItem("levelOneScore"), 10) || 0;
    const levelTwoScore = parseInt(localStorage.getItem("levelTwoScore"), 10) || 0;
    gameData.levelThreeScore = gameData.levelThreeScore || parseInt(localStorage.getItem("levelThreeScore"), 10) || 0;
    //Суммируем очки для отображения начального общего счета
    const totalScore = levelOneScore + levelTwoScore + gameData.levelThreeScore;

    // Коллекции слов
    const correctWords = [
        "Кошка", "Собака", "Лошадь", "Слон", "Тигр", "Пингвин", "Утка", "Змея", "Волк", "Медведь","Машина", "Тигр", "Слон", "Лев", "Дом", "Медведь", "Автомобиль", "Лошадь", "Трава", "Пингвин", "Крокодил", "Рыба", "Велосипед", "Змея", "Пальма", "Волк", "Котёнок", "Утка", "Курица", "Орел", "Рак", "Лиса", "Заяц", "Кролик", "Бобер", "Корова", "Олень", "Перепелка", "Снегирь", "Синица"
    ];
    const incorrectWords = [
        "Рек", "Гор", "До", "Дерев", "Звезд", "Машин", "Автомобил", "Велосипе", "Лун", "Пру", "Змия", "Бмага", "Арел", "Грб", "Оснавная", "Колекция", "Мароз", "Свит", "Смерчь", "Циган", "Нибо", "Улца", "Машына", "Мыш", "Ореол", "Мисто", "Цел"
    ];

    //Случайный выбор 5 верных и 5 неверных слов, после выбора еще раз перемешиваем их
    const selectedCorrectWords = shuffleArray([...correctWords]).slice(0, 5); 
    const selectedIncorrectWords = shuffleArray([...incorrectWords]).slice(0, 5); 
    const allWords = shuffleArray([...selectedCorrectWords, ...selectedIncorrectWords]); 
    //Время уменьшается на 5 сек с каждой новой итерацией
    const timeLimit = 60 - (gameData.currentIteration - 1) * 5;
    //Штраф за ошибку увеличивается пропорционально текущей итерации    
    const penalty = -10 * gameData.currentIteration;

    app.innerHTML = `
    <div class="game-container">
        <h1 class="title">Уровень 3: Итерация ${gameData.currentIteration}</h1>
        <div class="drag-words">
        ${allWords.map(word => `<div class="game-option" draggable="true">${word}</div>`).join("")}
        </div>
        <div class="drop-areas">
            <div id="correctArea" class="drop-area">Правильные слова</div>
            <div id="incorrectArea" class="drop-area">Неправильные слова</div>
    </div>
        <p id="timer" class="timer">Время: ${timeLimit}</p>
        <p id="score" class="score">Очки: ${totalScore}</p>
        <button id="endLevelButton" class="button">Завершить уровень</button>
        <button id="skipLevelButton" class="button">Пропустить уровень</button>
    </div>
    `;
    document.getElementById("skipLevelButton").addEventListener("click", () => {
        clearInterval(gameData.timer); 
        const requiredScore = 150; 
        gameData.levelThreeScore = requiredScore;
        endIterationThree(true); 
    });
    //Запускаем таймер
    startTimer(timeLimit, document.getElementById("timer"));
    //Вызываем функцию, контролирующую логику перетаскивания слов
    setupDragAndDrop(correctWords, penalty);
    //Добавляем обработчик событий для досрочного завершения уровня
    document.getElementById("endLevelButton").addEventListener("click", () => {
        renderEndLevelThreeScreen();
    });
}

//Функция отвечающая за логику перетаскивания слов
function setupDragAndDrop(correctWords, penalty) {
    //Получаем необходимые области
    const words = document.querySelectorAll(".game-option");
    const correctArea = document.getElementById("correctArea");
    const incorrectArea = document.getElementById("incorrectArea");
    //Для каждого слова настраиваем обработчик событий
    words.forEach(word => {
        word.addEventListener("dragstart", (e) => {
            //Сохраняем текст слова в передаваемые данные
            e.dataTransfer.setData("text", e.target.textContent);
        });
    });

    //Проверка завершения итерации, если слов нет - итерация завершена
    const checkCompletion = () => {
        const remainingWords = document.querySelectorAll(".game-option").length;
        if (remainingWords === 0) {
                endIterationThree(true);
        }
    };
    //Настройка зон перетаскивания
    [correctArea, incorrectArea].forEach(area => {
        //Позволяем элементу быть сброшенным в область
        area.addEventListener("dragover", (e) => {
            e.preventDefault();
        });
        //Извлекаем текст из перетащенного элементы
        area.addEventListener("drop", (e) => {
            e.preventDefault();
            const droppedWord = e.dataTransfer.getData("text");
            if (!droppedWord) return;
            //Если слова распределены правильно - добавляем баллы
            if (area.id === "incorrectArea" && !correctWords.includes(droppedWord)) {
                gameData.levelThreeScore = (gameData.levelThreeScore || 0) + 10;
                animateCorrectArea(area); // Анимация для правильной области
            } else if (area.id === "correctArea" && correctWords.includes(droppedWord)) {
                gameData.levelThreeScore = (gameData.levelThreeScore || 0) + 10;
                animateCorrectArea(area); // Анимация для правильной области
            //Если слово перенесено неверно - применяем штраф
            } else {
                gameData.levelThreeScore = (gameData.levelThreeScore || 0) + penalty; 
                animateWrongArea(area); // Анимация для неправильной области
            }
            //Недопускаем отрицательные очки
            if (gameData.levelThreeScore < 0) gameData.levelThreeScore = 0;
            //В счете суммируем все очки за все уровни
            document.getElementById("score").textContent = `Очки: ${
                (parseInt(localStorage.getItem("levelOneScore"), 10) || 0) +
                (parseInt(localStorage.getItem("levelTwoScore"), 10) || 0) +
                gameData.levelThreeScore
            }`;
            //Удаляем перенесенный элемент из списка и проверяем завершение итерации
            const wordElement = [...document.querySelectorAll(".game-option")].find(word => word.textContent === droppedWord);
            if (wordElement) {
                wordElement.parentElement.removeChild(wordElement); 
                checkCompletion();
            }
        });
    });
}

//Функция для управления экраном оконачания третьего уровня
function renderEndLevelThreeScreen() {
    //Останавливаем таймер и рассчитываем текущий счет
    if (gameData.timer) clearInterval(gameData.timer);
    const app = document.getElementById("app");
    const levelOneScore = parseInt(localStorage.getItem("levelOneScore"), 10) || 0;
    const levelTwoScore = parseInt(localStorage.getItem("levelTwoScore"), 10) || 0;
    const totalScore = levelOneScore + levelTwoScore + gameData.levelThreeScore;

    app.innerHTML = `
        <div class="game-container">
            <h1 class="title">Уровень завершен досрочно</h1>
            <p class="description">Вы можете завершить игру с текущим количеством очков или попробовать пройти уровень заново.</p>
            <p class="score">Ваши очки: ${totalScore}</p>
            <button id="restartLevelButton" class="button">Пройти уровень заново</button>
            <button id="endGameButton" class="button">Завершить игру</button>
        </div>
    `;
    //Обработчик событий для кнопки рестарта уровня
    document.getElementById("restartLevelButton").addEventListener("click", () => {
        //Сбрасываем очки третьего уровня
        gameData.levelThreeScore = 0; 
        localStorage.removeItem("levelThreeScore");
        //Сбрасываем итерации
        gameData.currentIteration = 1; 
        renderLevelThreeGame();
    });
    //Завершаем игру с текущими очками по кнопке окончания игры
    document.getElementById("endGameButton").addEventListener("click", () => {
        endGame(true, totalScore); 
    });
}

//Окончание итерации третьего уровня
function endIterationThree(success) {
   if (success) {
        gameData.currentIteration++;
        //Если итерации 3 сохраняем все баллы и вызываем функцию окончания игры
        if (gameData.currentIteration > 3) {
            const levelOneScore = parseInt(localStorage.getItem("levelOneScore"), 10) || 0;
            const levelTwoScore = parseInt(localStorage.getItem("levelTwoScore"), 10) || 0;
            const levelThreeScore = parseInt(gameData.levelThreeScore, 10) || 0;
            localStorage.setItem("levelThreeScore",levelThreeScore);
            endGame (levelThreeScore >= 80)
        } else {
            renderLevelThreeGame();
        }
    } else {
        renderEndLevelThreeScreen(); 
    }
}

//Отображение последней страницы с таблицей игроков
function openLeaderboardPage(score, playerName) {
    //Сохраняем текущего игрока в localStorage
    const players = JSON.parse(localStorage.getItem("leaderboard")) || [];
    //Если имя игрока и счет валидны сохраняем их в таблицу
    if (playerName && score > 0) {
        players.push({ name: playerName, score: score });
        localStorage.setItem("leaderboard", JSON.stringify(players));
    }
    //Открываем новое окно с итогами
    const leaderboardWindow = window.open("gameratesep.html", "_blank");

    //Проверяем, что страница загрузилась
    leaderboardWindow.onload = () => {
        const players = JSON.parse(localStorage.getItem("leaderboard")) || [];
        //Сортируем игроков по убыванию очков
        players.sort((a, b) => b.score - a.score);
        //Заполняем список игроков
        const playerList = leaderboardWindow.document.getElementById("playerListBody");
        players.forEach(player => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${player.name}</td>
                <td>${player.score} очков</td>
            `;
            playerList.appendChild(row);
        });
        //Добавляем обработчик для кнопки "Начать новую игру"
        const startNewGameButton = leaderboardWindow.document.getElementById("startNewGame");
        startNewGameButton.addEventListener("click", () => {
            leaderboardWindow.close();
            //Возврат на главную страницу игры
            window.location.href = "gamestylesep.html"; 
        });
    };
}

//Выпадающее меню
const menuBtn = document.querySelector('.menu-btn');
const menu = document.querySelector('.menu');

menuBtn.addEventListener('click', () => {
    menu.classList.toggle('active');
});
