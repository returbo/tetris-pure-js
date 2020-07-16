let overlay = document.querySelector('.overlay');
let modal = document.querySelector('.modal');
let speed = 0;

modal.addEventListener('click', function (e) {
	if (e.target.classList.contains("easy")) {
		speed = 1000;
	} else if (e.target.classList.contains("normal")) {
		speed = 500;
	} else if (e.target.classList.contains("hard")) {
		speed = 200;
	}

	if (e.target.classList.contains("button")) {
		modal.style.display = "none";
		overlay.style.display = "none";
		startGame();
	}
})

const startGame = () => {
	let tetris = document.createElement("div");
	tetris.classList.add("tetris");

	for (let i = 1; i < 181; i++) {
		let excel = document.createElement("div");
		excel.classList.add("excel");
		tetris.appendChild(excel);
	}

	let main = document.querySelector(".main");
	console.log(main);
	// помещаем внутрь него контейнер tetris
	main.appendChild(tetris);

	// помещаем все 180 контейенеров div с классом excel в переменную excel как массив
	let excel = document.getElementsByClassName("excel");

	// задаем каждому контейнеру div с классом excel аттрибуты posX и posY
	// в соответствии с задуманной системой координат разметки
	let i = 0;
	for (let y = 18; y > 0; y--) {
		for (let x = 1; x < 11; x++) {
			excel[i].setAttribute("posX", x);
			excel[i].setAttribute("posY", y);
			i++
		}
	}

	// Начальные координаты появления фигур
	let x = 5, y = 15;


	// создаем массив с описанием фигур
	let mainArr = [
		// палка
		[
			// оригинал относительно появления фигуры в x, y
			[0, 1], [0, 2], [0, 3],
			// поворот 90 градусов
			[[-1, 1], [0, 0], [1, -1], [2, -2]],
			// поворот на 180 градусов
			[[1, -1], [0, 0], [-1, 1], [-2, 2]],
			// поворот 270 градусов
			[[-1, 1], [0, 0], [1, -1], [2, -2]],
			// поворот на 360 градусов
			[[1, -1], [0, 0], [-1, 1], [-2, 2]]
		],
		// квадрат
		[
			// оригинал
			[1, 0], [0, 1], [1, 1],
			// поворот 90 градусов
			[[0, 0], [0, 0], [0, 0], [0, 0]],
			// поворот на 180 градусов
			[[0, 0], [0, 0], [0, 0], [0, 0]],
			// поворот 270 градусов
			[[0, 0], [0, 0], [0, 0], [0, 0]],
			// поворот на 360 градусов
			[[0, 0], [0, 0], [0, 0], [0, 0]]
		],
		// буква L
		[
			// оригинал
			[1, 0], [0, 1], [0, 2],
			// поворот на 900 градусов
			[[0, 0], [-1, 1], [1, 0], [2, -1]],
			// поворот на 180 градусов
			[[1, -1], [1, -1], [-1, 0], [-1, 0]],
			// поворот 270 градусов
			[[-1, 0], [0, -1], [2, -2], [1, -1]],
			// поворот на 360 градусов
			[[1, -1], [1, -1], [-1, 0], [-1, 0]]
		],
		// буква L зеракальная
		[
			[1, 0], [1, 1], [1, 2],
			// поворот 90 градусов
			[[0, 0], [0, 0], [1, -1], [-1, -1]],
			// поворот на 180 градусов
			[[0, -1], [-1, 0], [-2, 1], [1, 0]],
			// поворот 270 градусов
			[[1, 0], [-1, 0], [0, -1], [0, -1]],
			// поворот на 360 градусов
			[[-1, -1], [2, -2], [1, -1], [0, 0]]
		],
		// молния влево
		[
			[1, 0], [1, 1], [2, 1],
			// поворот 90 градусов
			[[1, -1], [-1, 0], [0, -1], [-2, 0]],
			// поворот на 180 градусов
			[[-1, 1], [1, 0], [0, 1], [2, 0]],
			// поворот 270 градусов
			[[1, -1], [-1, 0], [0, -1], [-2, 0]],
			// поворот на 360 градусов
			[[-1, 1], [1, 0], [0, 1], [2, 0]]
		],
		// молния вправо
		[
			[1, 0], [-1, 1], [0, 1],
			// поворот 90 градусов
			[[0, -1], [-1, 0], [2, -1], [1, 0]],
			// поворот на 180 градусов
			[[0, 1], [1, 0], [-2, 1], [-1, 0]],
			// поворот 270 градусов
			[[0, -1], [-1, 0], [2, -1], [1, 0]],
			// поворот на 360 градусов
			[[0, 1], [1, 0], [-2, 1], [-1, 0]]
		],
		// деталь LEGO
		[
			[1, 0], [2, 0], [1, 1],
			// поворот 90 градусов
			[[1, -1], [0, 0], [0, 0], [0, 0]],
			// поворот на 180 градусов
			[[0, 0], [-1, 0], [-1, 0], [1, -1]],
			// поворот 270 градусов
			[[0, 0], [0, 0], [0, 0], [-1, 1]],
			// поворот на 360 градусов
			[[-1, 1], [1, 0], [1, 0], [0, 0]]
		]
	]

	let currentFigure, figureBody;
	let rotate = 1;


	function create() {
		rotate = 1;
		function getRandom() {
			return Math.round(Math.random() * (mainArr.length - 1))
		}
		currentFigure = getRandom();

		figureBody = [
			document.querySelector(`[posX = "${x}"][posY = "${y}"]`),
			document.querySelector(`[posX = "${x + mainArr[currentFigure][0][0]}"][posY = "${y + mainArr[currentFigure][0][1]}"]`),
			document.querySelector(`[posX = "${x + mainArr[currentFigure][1][0]}"][posY = "${y + mainArr[currentFigure][1][1]}"]`),
			document.querySelector(`[posX = "${x + mainArr[currentFigure][2][0]}"][posY = "${y + mainArr[currentFigure][2][1]}"]`),
		]
		// добавляем каждому контейнеру div массива figureBody класс figure
		for (let i = 0; i < figureBody.length; i++) {
			figureBody[i].classList.add("figure")
		}

	}

	create();

	let score = 0;
	let input = document.getElementsByTagName('input')[0];
	input.value = `Ваши очки ${score}`;

	function move() {
		let moveFlag = true;
		// запоминаем массив координат posX и posY каждого контейнера div текущей фигуры figureBody в массиве coordinates
		let coordinates = [
			[figureBody[0].getAttribute('posX'), figureBody[0].getAttribute('posY')],
			[figureBody[1].getAttribute('posX'), figureBody[1].getAttribute('posY')],
			[figureBody[2].getAttribute('posX'), figureBody[2].getAttribute('posY')],
			[figureBody[3].getAttribute('posX'), figureBody[3].getAttribute('posy')]
		]
		// Останавливаем движение, если координата y == 1 либо снизу есть контейнер div с классом set
		for (let i = 0; i < coordinates.length; i++) {
			if (coordinates[i][1] == 1 || document.querySelector(`
		[posX = "${coordinates[i][0]}"][posY = "${coordinates[i][1] - 1}"]`).classList.contains("set")) {
				moveFlag = false;
				break;
			}
		}

		if (moveFlag) {
			for (let i = 0; i < figureBody.length; i++) {
				figureBody[i].classList.remove("figure")
			}
			figureBody = [
				document.querySelector(`[posX = "${coordinates[0][0]}"][posY = "${coordinates[0][1] - 1}"]`),
				document.querySelector(`[posX = "${coordinates[1][0]}"][posY = "${coordinates[1][1] - 1}"]`),
				document.querySelector(`[posX = "${coordinates[2][0]}"][posY = "${coordinates[2][1] - 1}"]`),
				document.querySelector(`[posX = "${coordinates[3][0]}"][posY = "${coordinates[3][1] - 1}"]`)
			];
			for (let i = 0; i < figureBody.length; i++) {
				figureBody[i].classList.add("figure");
			}

		} else {
			for (let i = 0; i < figureBody.length; i++) {
				figureBody[i].classList.remove("figure");
				figureBody[i].classList.add("set");
			}
			for (let i = 1; i < 15; i++) {

				let count = 0;

				for (let k = 1; k < 11; k++) {
					if (document.querySelector(`[posX = "${k}"][posY = "${i}"]`).classList.contains('set')) {
						count++;
						if (count == 10) {

							score += 10;
							input.value = `Ваши очки ${score}`;

							for (let m = 1; m < 11; m++) {
								document.querySelector(`[posX = "${m}"][posY = "${i}"]`).classList.remove('set');
							}

							let set = document.querySelectorAll('.set');
							let newSet = [];

							for (let s = 0; s < set.length; s++) {
								let setCoordinates = [
									set[s].getAttribute('posX'),
									set[s].getAttribute("posY")
								]
								if (setCoordinates[1] > i) {
									set[s].classList.remove('set');
									newSet.push(document.querySelector(`[posX = "${setCoordinates[0]}"][posY = "${setCoordinates[1] - 1}"]`));
								}
							}
							for (let a = 0; a < newSet.length; a++) {
								newSet[a].classList.add('set');
							}

							i--;
						}
					}
				}
			}
			for (let n = 1; n < 11; n++) {
				if (document.querySelector(`[posX = "${n}"][posY = "${15}"]`).classList.contains("set")) {
					clearInterval(interval);
					alert(`Игра окончена. Ваши очки ${score}`);
					break;
				}
			}
			create();
		}
	}

	let interval = setInterval(move, speed);

	let flag = true;

	window.addEventListener('keydown', function (e) {

		let coordinates1 = [figureBody[0].getAttribute('posX'), figureBody[0].getAttribute('posY')];
		let coordinates2 = [figureBody[1].getAttribute('posX'), figureBody[1].getAttribute('posY')];
		let coordinates3 = [figureBody[2].getAttribute('posX'), figureBody[2].getAttribute('posY')];
		let coordinates4 = [figureBody[3].getAttribute('posX'), figureBody[3].getAttribute('posY')];

		flag = true;

		function getNewState(a) {
			let figureNew = [
				document.querySelector(`[posX = "${+coordinates1[0] + a}"][posY = "${coordinates1[1]}"]`),
				document.querySelector(`[posX = "${+coordinates2[0] + a}"][posY = "${coordinates2[1]}"]`),
				document.querySelector(`[posX = "${+coordinates3[0] + a}"][posY = "${coordinates3[1]}"]`),
				document.querySelector(`[posX = "${+coordinates4[0] + a}"][posY = "${coordinates4[1]}"]`)
			];

			for (let i = 0; i < figureNew.length; i++) {
				if (!figureNew[i] || figureNew[i].classList.contains('set')) {
					flag = false;
				}
			}

			if (flag) {
				for (let i = 0; i < figureBody.length; i++) {
					figureBody[i].classList.remove("figure")
				}

				figureBody = figureNew;


				for (let i = 0; i < figureBody.length; i++) {
					figureBody[i].classList.add("figure");
				}

			}
		}

		if (e.keyCode == 37) {
			getNewState(-1);
		} else if (e.keyCode == 39) {
			getNewState(1);
		} else if (e.keyCode == 40) {
			move();
		} else if (e.keyCode == 38) {
			flag = true;

			let figureNew =
				[
					document.querySelector(`[posX = "${+coordinates1[0] + mainArr[currentFigure][rotate + 2][0][0]}"][posY = "${+coordinates1[1] + mainArr[currentFigure][rotate + 2][0][1]}"]`),
					document.querySelector(`[posX = "${+coordinates2[0] + mainArr[currentFigure][rotate + 2][1][0]}"][posY = "${+coordinates2[1] + mainArr[currentFigure][rotate + 2][1][1]}"]`),
					document.querySelector(`[posX = "${+coordinates3[0] + mainArr[currentFigure][rotate + 2][2][0]}"][posY = "${+coordinates3[1] + mainArr[currentFigure][rotate + 2][2][1]}"]`),
					document.querySelector(`[posX = "${+coordinates4[0] + mainArr[currentFigure][rotate + 2][3][0]}"][posY = "${+coordinates4[1] + mainArr[currentFigure][rotate + 2][3][1]}"]`)
				];

			for (let i = 0; i < figureNew.length; i++) {
				if (!figureNew[i] || figureNew[i].classList.contains('set')) {
					flag = false;
				}
			}

			if (flag) {
				for (let i = 0; i < figureBody.length; i++) {
					figureBody[i].classList.remove("figure")
				}

				figureBody = figureNew;

				for (let i = 0; i < figureBody.length; i++) {
					figureBody[i].classList.add("figure");
				}

				if (rotate < 4) {
					rotate++;
				} else {
					rotate = 1;
				}
			}
		}
	})
}

