//Задаем относительные смещения между элементами, чтобы проверить правильность сбора картинки
const relativePositions = {
    piece1: { piece2: { left: 0, top: 150 } },
    piece2: { piece4: { left: 0, top: 150 } },
    piece3: { piece4: { left: 150, top: 0 } },
    piece4: {} 
  };
  
  //Настраиваем обработчик события dragstart для всех элементов пазла. Событие вызывается при перетаскиевании жлементов
  document.querySelectorAll('.puzzle-piece').forEach((piece) => {
    piece.addEventListener('dragstart', (event) => {
      const rect = piece.getBoundingClientRect();

      //Вычисляем положение курсора относительно верхнего левого угла элемента, чтобы после перетаскивания элементы оставались на том же месте
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;
  
      //Сохраняем айди и смещение для передачи в событие drop
      event.dataTransfer.setData('id', piece.id);
      event.dataTransfer.setData('offsetX', offsetX);
      event.dataTransfer.setData('offsetY', offsetY);
    });
  });
  
  //Настраиваем события dragover для drop-area, вызываются, когда элемент находится над областью сброса
  document.getElementById('drop-area').addEventListener('dragover', (event) => {
    event.preventDefault(); //Метод "разрешает" сброс, тк по умолчанию браузер его запрещает
  });
  
  //Настраиваем события drop для drop-area, вызываются, когда элемент внутри drop-area
  document.getElementById('drop-area').addEventListener('drop', (event) => {
    event.preventDefault(); 
  
    //Получаем айди и смещение, далее находим элемент по айди
    const id = event.dataTransfer.getData('id');
    const offsetX = parseFloat(event.dataTransfer.getData('offsetX'));
    const offsetY = parseFloat(event.dataTransfer.getData('offsetY'));
    const piece = document.getElementById(id);
  
    //Получаем размеры и положение drop-area
    const dropAreaRect = event.target.getBoundingClientRect();

    //Вычисляем новые координаты элемента относительно drop-area
    const dropX = event.clientX - dropAreaRect.left - offsetX;
    const dropY = event.clientY - dropAreaRect.top - offsetY;
  
    //Корректируем координаты, чтобы элемент не выходил за drop-area
    const adjustedLeft = Math.max(0, Math.min(dropX, dropAreaRect.width - piece.offsetWidth));
    const adjustedTop = Math.max(0, Math.min(dropY, dropAreaRect.height - piece.offsetHeight));
  
    //Задаем новые координаты к элементу
    piece.style.position = 'absolute';
    piece.style.left = `${adjustedLeft}px`;
    piece.style.top = `${adjustedTop}px`;
  
    //Если элемент еще не находится внутри drop-area, добавляем его
    if (!event.target.contains(piece)) {
      event.target.appendChild(piece);
    }
  
    // Проверяем правильность сборки
    checkCompletion();
  });
  
  //Функция для проверки правильности сборки
  function checkCompletion() {
    const resultMessage = document.getElementById('result-message');
    const pieces = document.querySelectorAll('.puzzle-piece');
    const dropArea = document.getElementById('drop-area');
  
    //Проверяем что все части находятся внутри drop-area
    let allInDropArea = true;
    pieces.forEach((piece) => {
      if (!dropArea.contains(piece)) {
        allInDropArea = false;
      }
    });
  
    //Не показываем результат, если еще не все элементы внутри
    if (!allInDropArea) {
      resultMessage.style.display = 'none'; 
      return;
    }
  
    let allCorrect = true;
    //Допустимое отклонение в пикселях
    const tolerance = 10; 
  
    //Получаем текущую часть пазла ее положение и размер
    for (const [pieceId, relations] of Object.entries(relativePositions)) {
      const piece = document.getElementById(pieceId);
      const pieceRect = piece.getBoundingClientRect();
  
      //Находим соседнюю часть, ее положение и размер
      for (const [relatedPieceId, offset] of Object.entries(relations)) {
        const relatedPiece = document.getElementById(relatedPieceId);
        const relatedRect = relatedPiece.getBoundingClientRect();
  
        //Вычисляем смещение между текущей частью и соседней
        const actualLeft = relatedRect.left - pieceRect.left;
        const actualTop = relatedRect.top - pieceRect.top;
  
        //Вычисляем допустимые границы с учетом отклонения
        const leftTolerance = Math.abs(offset.left - tolerance);
        const topTolerance = Math.abs(offset.top - tolerance);
  
        //Проверяем, укладывается ли смещение в допустимые границы. Если хотя бы одна часть расположена неверно - прерываем циклы
        if (
          Math.abs(actualLeft - offset.left) > leftTolerance ||
          Math.abs(actualTop - offset.top) > topTolerance
        ) {
          allCorrect = false;
          break;
        }
      }
  
      if (!allCorrect) {
        break;
      }
    }
  
    //Если все верно показываем сообщение и анимацию
    if (allCorrect) {
        resultMessage.style.display = 'block';
        resultMessage.textContent = "Поздравляем! Пазл собран правильно!";
        resultMessage.style.color = 'green';
    
        //Добавляем класс анимации
        dropArea.classList.add('success-animation');
    
        //Удаляем класс после завершения анимации, время анимации 1сек
        setTimeout(() => {
          dropArea.classList.remove('success-animation');
        }, 1000);
      } else {
        //Если неверно - неуспешное сообщение
        resultMessage.style.display = 'block';
        resultMessage.textContent = "Пазл собран неправильно. Попробуйте еще раз!";
        resultMessage.style.color = 'red';
      }
    }

    
  