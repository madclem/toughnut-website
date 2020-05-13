import gsap from 'gsap';

class OrbControlTween {
  constructor() {
    this.orbitalControl = null;
    this.initialised = false;
  }

  init(orbitalControl) {
    this.initialised = true;
    this.orbitalControl = orbitalControl;
  }

  tween(options) {
    const orb = this.orbitalControl;

    const o = {
      radius: orb.radius.value,
      rx: orb.rx.value,
      ry: orb.ry.value,
      centerX: orb.center[0],
      centerY: orb.center[1],
      centerZ: orb.center[2],
      offsetX: orb.positionOffset[0],
      offsetY: orb.positionOffset[1],
      offsetZ: orb.positionOffset[2],
    };

    gsap.to(o, options.duration || 1, {
      delay: options.delay || 0,
      radius: options.radius || 0,
      rx: options.rx || 0,
      ry: options.ry || 0,
      centerX: options.centerX || 0,
      centerY: options.centerY || 0,
      centerZ: options.centerZ || 0,
      offsetX: options.offsetX || 0,
      offsetY: options.offsetY || 0,
      offsetZ: options.offsetZ || 0,
      ease: options.ease || 'sine.out',
      onUpdate: () => {
        if (options.rx !== undefined) orb.rx.setTo(o.rx);
        if (options.ry !== undefined) orb.ry.setTo(o.ry);
        if (options.radius !== undefined) orb.radius.setTo(o.radius);
        if (options.centerX !== undefined) orb.center[0] = o.centerX;
        if (options.centerY !== undefined) orb.center[1] = o.centerY;
        if (options.centerZ !== undefined) orb.center[2] = o.centerZ;
        if (options.offsetX !== undefined) orb.positionOffset[0] = o.offsetX;
        if (options.offsetY !== undefined) orb.positionOffset[1] = o.offsetY;
        if (options.offsetZ !== undefined) orb.positionOffset[2] = o.offsetZ;
      },
      onComplete: options.onComplete || null,
    });
  }

  get isReady () {
    return this.initialised;
  }
}

const orbitalControlTween = new OrbControlTween();

export { orbitalControlTween };
