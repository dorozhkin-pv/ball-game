window.addEventListener('load', function(){

    let canvas = document.querySelector('#canvas');
	let ctx = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    let r = 50;     //радиус мяча
    let x = canvas.width / 2;
    let y = canvas.height - r;
    let beginPos = y;
    let dx = 0;     //приращение к движению
    let dy = 0;     //приращение к движению
    let grav = 1;   //гравитация
    let speed = 5; //скорость
    //let collision = false;  //столкновение
    let interval;   //для setInterval
    let xp; //полярные координаты
    let yp; //полярные координаты
    let score = 0;

    function drawScore() {
        ctx.font = '16px Arial';
        ctx.fillStyle = '#000';
        ctx.fillText('Score: ' + score, 10, 25);
    }

    function drawLose() {
        ctx.font = '18px Arial';
        ctx.fillStyle = '#000';
        ctx.fillText('Game Over', 10, 45);
    }

    function drawBall() {
        let ball = new Path2D();
    	ball.arc(x, y, r, 0, 2*Math.PI);
    	ctx.fillStyle = 'orange';
    	ctx.fill(ball);
        drawScore();
    }

    function moveBall() {
    	if(x + dx >= canvas.width - r || x + dx <= r) {
    	    dx = -dx;
    	    collision = true;
    	}
    	if(y + dy >= canvas.height - r || y + dy <= r) {

    		if (y + dy <= r) collision = true;
    	    dy = -dy;
    	}

    	x += dx;
    	y += dy;
    }

    function dropBall() {
		if(y < beginPos) {
			y += grav;
		} else{
            score = 0;
			clearInterval(interval);
			collision = false;
            drawLose();
		}
    }

    function direction(angle) {
        if (angle > -67.5 && angle < 67.5) {
            return;
        } else if (angle < -67.5 && angle > -112.5) {     //летит вправо
            dx = 1 * speed;
            dy = 0;
        } else if (angle < -112.5 && angle > -157.5) {   //летит вверх вправо
            dx = 1 * speed;
            dy = -1 * speed;
        } else if ((angle < -157.5 && angle >= -180) || (angle <= 180 && angle > 157.5)) {   //летит вверх
            dx = 0;
            dy = -1 * speed;
        } else if (angle < 157.5 && angle > 112.5) {   //летит вверх влево
            dx = -1 * speed;
            dy = -1 * speed;
        } else if (angle < 112.5 && angle > 67.5) {   //летит влево
            dx = -1 * speed;
            dy = 0;
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        drawScore();

        if (collision) {
			dropBall();    		        		
        }else {
        	moveBall();
        }
    }


    function condition(e) {
        clearInterval(interval);
        collision = false;

        let x1 = e.clientX;
        let y1 = e.clientY;
        let angleRad;

        if ((x1 >= x - r && x1 <= x + r) &&     //Попал в мяч
            (y1 >= y - r && y1 <= y + r)) {

            score++;

            xp = x1 - x;    //полярные координаты
            yp = y1 - y;    //полярные координаты

            if (xp < 0) angleRad = Math.atan(yp / xp) - Math.PI / 2;    //вычисляю угол
            else angleRad = Math.atan(yp / xp) + Math.PI / 2;
            
            let angleGrad = Math.floor(angleRad * 180 / Math.PI);

            direction(angleGrad);
            
            interval = setInterval(draw, 10);

        }
    }

    drawBall();
    canvas.addEventListener('click', condition);
    
});


