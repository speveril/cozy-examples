import * as Cozy from 'Cozy';

export class Alien extends Cozy.Sprite {
    speed:number;
    heading:number;
    destroyed:Boolean;
    value:number;
    bounds:any;

    constructor(args:any) {
        let variant = args.variant || '1';
        let texture = Cozy.getTexture('alien_' + variant);

        args = Object.assign({
            texture: texture,
            hotspot: { x: texture.width / 2, y: texture.width / 2 }
        }, args);

        super(args);

        this.destroyed = false;
        this.heading = 1;
        this.speed = args.speed || 35;
        this.value = args.value || 100;

        this.bounds = {
            left:  args.bounds.left,
            right:  args.bounds.right
        };
    }

    update(dt:number) {
        this.adjustPosition(this.speed * dt * this.heading, 0);

        if (this.heading === 1 && this.position.x > this.bounds.right) {
            this.heading = -1;
            this.adjustPosition(this.bounds.right - this.position.x, 5);
        } else if (this.heading === -1 && this.position.x < this.bounds.left) {
            this.heading = 1;
            this.adjustPosition(this.bounds.left - this.position.x, 5);
        }
    }
}
