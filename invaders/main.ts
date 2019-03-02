import * as Cozy from 'Cozy';
import { Player } from './Player';
import { Alien } from './Alien';
import { Barrier } from './Barrier';

let plane:Cozy.RenderPlane;
let stage:Cozy.Layer;

let player:Player;
let playerShot:Cozy.Sprite = null;
let aliens:Array<Alien>;

let score:number;

export function load() {
    return Cozy.loadTextures({
        player:   "gfx/player.png",
        shot:     "gfx/shot.png",
        alien_1:  "gfx/alien01.png",
        alien_2:  "gfx/alien02.png",
        alien_3:  "gfx/alien03.png"
    });
}

export function start() {
    Cozy.setBackground('#303040');

    plane = <Cozy.RenderPlane>Cozy.addPlane(Cozy.RenderPlane, {
        renderable: true
    });

    stage = plane.addRenderLayer();

    resetGame();
    Cozy.unpause();
}

export function frame(dt:number) {
    // this will run every frame
    // - dt is the number of seconds that have passed since the last frame

    // -- process input --

    if (Cozy.Input.pressed('menu')) {
        Cozy.quit();
    }

    if (Cozy.Input.pressed('left')) {
        player.setPosition(Math.max(7, player.position.x - 200 * dt), player.position.y);
    }
    if (Cozy.Input.pressed('right')) {
        player.setPosition(Math.min(Cozy.config('width') - 8, player.position.x + 200 * dt), player.position.y);
    }

    if (Cozy.Input.pressed('confirm') || Cozy.Input.pressed('cancel')) {
        playerShoot();
    }

    // -- step world --

    if (playerShot) {
        playerShot.adjustPosition(0, -300 * dt);
        if (playerShot.position.y < -20) {
            stage.remove(playerShot);
            playerShot = null;
        }
    }

    var won:boolean      = true;
    var lost:boolean     = false;
    var speedup:number   = 0;

    aliens.forEach(function(alien) {
        if (alien.destroyed) {
            return;
        }

        alien.update(dt);

        if (playerShot && playerShot.overlaps(alien)) {
            stage.remove(alien);
            alien.destroyed = true;
            score += alien.value;

            stage.remove(playerShot);
            playerShot = null;
            speedup = Math.random() * 5;
        }

        if (!alien.destroyed) {
            won = false;
            if (alien.position.y > Cozy.config('height') - 32) {
                lost = true;
            }
        }
    });

    if (speedup > 0) {
        aliens.forEach(function(alien) { alien.speed += speedup; });
    }

    if (won) {
        alert("You won!");
        Cozy.quit();
    } else if (lost) {
        alert("You lost. :(");
        Cozy.quit();
    }
}


function resetGame() {
    stage.clear();

    score = 0;

    player = new Player({
        position: { x: Cozy.config('width') / 2, y: Cozy.config('height') - 25 }
    });
    stage.add(player);

    var alienPattern = [
        'xxxxxxxx',
        'xxxxxxxx',
        'xxxxxxxx',
        'xxxxxxxx',
        'xxxxxxxx',
        'xxxxxxxx',
    ];
    var widest = 0;
    for (let ln of alienPattern) {
        if (ln.length > widest) {
            widest = ln.length;
        }
    }
    console.log(widest);

    aliens = [];

    var y = 32;
    for (let row of alienPattern) {
        let rowWidth = row.length;
        let left = Cozy.config('width') / 2 - rowWidth * 16;
        let leftBorder = 8 + (widest - rowWidth) * 16;
        let rightBorder = 292 - (widest - rowWidth) * 16;

        for (let i = 0; i < row.length; i++) {
            let variant = row[i];
            if (variant === ' ') return;
            if (variant === 'x') variant = (1 + Math.floor(Math.random() * 3)).toString();

            aliens.push(new Alien({
                variant: variant,
                position: { x: left + 32 * i, y: y },
                bounds: { left: leftBorder + 32 * i, right: rightBorder - 32 * (row.length - i - 1) }
            }));
        }
        y += 20;
    }

    aliens.forEach(function(alien) { stage.add(alien); });

    playerShot = null;
}

function playerShoot() {
    if (!playerShot) {
        playerShot = new Cozy.Sprite({
            texture: Cozy.getTexture('shot'),
            hotspot: { x: 2, y: 2 },
            position: { x: player.position.x, y: player.position.y - 15 }
        });
        stage.add(playerShot);
    }
}
