import * as Cozy from 'Cozy';

export class Player extends Cozy.Sprite {
    constructor(args:any) {
        let texture = Cozy.getTexture('player');
        args = Object.assign({
            texture: texture,
            hotspot: { x: texture.width / 2, y: texture.height / 2 }
        }, args);
        super(args);
    }
}
