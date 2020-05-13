export class PhysicKeyboardDebug {
  constructor(scene) {
    this.scene = scene;
    this._onKeyDown = this.onKeyDown.bind(this);
  }

  connect() {
    window.addEventListener('keydown', this._onKeyDown, true);
  }

  disconnect() {
    window.removeEventListener('keydown', this._onKeyDown, true);
  }

  onKeyDown (e) {
    const isHome = this.scene.statesSystem.currentStateId === 'home';
    const cage = this.scene._vNutCage;
    if (e.keyCode === 38) { // arrow up
      if (isHome) cage.body.angularVelocity.x += 1;
    } else if (e.keyCode === 40) { // arrow down
      if (isHome) cage.body.angularVelocity.x -= 1;
    }
  }
}