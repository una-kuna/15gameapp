function init() {
	var canvas = document.getElementById("15");
		canvas.width  = 500;
	    canvas.height = 500;
	var cellSize = canvas.width / 4;
	var context = canvas.getContext("2d");
	var field = new game15(); 
	    field.mix(350); 
	    field.setCellView(function(x, y) {
	    	context.fillStyle = "#228B22";
	    	context.fillRect(x+1, y+1, cellSize-2, cellSize-2);
	    });
	    field.setNumView(function() { // параметры шрифта для цифр
	    	context.font = "bold "+(cellSize/2)+"px Sans";
	    	context.textAlign = "center";
	    	context.textBaseline = "middle";
	    	context.fillStyle = "#ffffff";
	    });
	context.fillStyle = "#222";
	context.fillRect(0, 0, canvas.width, canvas.height);
	field.draw(context, cellSize);
	
	function event(x, y) { // функция производит необходимые действие при клике(касанию)
		field.move(x, y);
		context.fillStyle = "#222";
		context.fillRect(0, 0, canvas.width, canvas.height);
		field.draw(context, cellSize);
		if (field.victory()) { // если головоломка сложена, то пятнашки заново перемешиваются
			alert("Собрано за "+field.getClicks()+" касание!"); // вывод сообщения о выигрыше!!
			field.mix(300);
			context.fillStyle = "#222";
			context.fillRect(0, 0, canvas.width, canvas.height);
			field.draw(context, cellSize);
		}
	}
	
	canvas.onclick = function(e) { // обрабатываем клики мышью
		var x = (e.pageX - canvas.offsetLeft) / cellSize | 0;
		var y = (e.pageY - canvas.offsetTop)  / cellSize | 0;
		event(x, y); // выхов функции действия
	};
	
}
function game15() {
	var cellView = null;
	var numView = null;
	var arr = [[1,2,3,4], [5,6,7,8], [9,10,11,12], [13,14,15,0]];
	var clicks = 0;
	function getNull() { // функция возвращает координату пустой клетки
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				if (arr[j][i] === 0) {
					return{"x":i,"y":j};
					
				}
			}
		}
	};
	// случайное логическое значение 
	function getRandomBool() {
		if (Math.floor(Math.random() * 2) === 0) {
			return true;
		}
	}
	
	// метод возвращает число нажатий
	this.getClicks = function() {
		return clicks;
	};
	// перемещение 
	this.move = function(x, y) {
		var nullX = getNull().x;
		var nullY = getNull().y;
		if (((x - 1 == nullX || x + 1 == nullX) && y == nullY) || ((y - 1 == nullY || y + 1 == nullY) && x == nullX)) {
			arr[nullY][nullX] = arr[y][x];
			arr[y][x] = 0;
			clicks++;
		}
	};
	
	// проверка победы
	this.victory = function() {
		var e = [[1,2,3,4], [5,6,7,8], [9,10,11,12], [13,14,15,0]];
		var res = true;
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				if (e[i][j] != arr[i][j]) {
					res = false;
				}
			}
		}
		return res;
	};
	
	// генерация позиций 
	this.mix = function(stepCount) {
		var x,y;
		for (var i = 0; i < stepCount; i++) {
			var nullX = getNull().x;
			var nullY = getNull().y;
			var hMove = getRandomBool();
			var upLeft = getRandomBool();
			if (!hMove && !upLeft) { y = nullY; x = nullX - 1;}
			if (hMove && !upLeft)  { x = nullX; y = nullY + 1;}
			if (!hMove && upLeft)  { y = nullY; x = nullX + 1;}
			if (hMove && upLeft)   { x = nullX; y = nullY - 1;}
			if (0 <= x && x <= 3 && 0 <= y && y <= 3) {
				this.move(x, y);
			}
		}
		clicks = 0;
	};
	
	// внешний вид пятнашки
	this.setCellView = function(func) {
		cellView = func;
	};
	
	// параметры шрифта цифр
	this.setNumView = function(func) {
		numView = func;
	};
	
	// Метод отрисовки
	this.draw = function(context, size) {
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				if (arr[i][j] > 0) {
					if (cellView !== null) {
						cellView(j * size, i * size);
					}
					if (numView !== null) {
						numView();
						context.fillText(arr[i][j], j * size + size / 2, i * size + size / 2);
					}
				}
			}
		}
	};
}