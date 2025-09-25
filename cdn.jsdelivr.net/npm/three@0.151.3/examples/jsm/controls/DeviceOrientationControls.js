import * as THREE from '../../../build/three.module.js'; // chemin relatif correct

// DeviceOrientationControls.js
export class DeviceOrientationControls {
  constructor(object) {
    this.object = object;
    this.enabled = true;
    this.screenOrientation = 0;
    this.deviceOrientation = {};
    this.alphaOffset = 0;

    this.onDeviceOrientationChangeEvent = this.onDeviceOrientationChangeEvent.bind(this);
    this.onScreenOrientationChangeEvent = this.onScreenOrientationChangeEvent.bind(this);

    window.addEventListener('orientationchange', this.onScreenOrientationChangeEvent);
    window.addEventListener('deviceorientation', this.onDeviceOrientationChangeEvent);
    this.onScreenOrientationChangeEvent();
  }

  onDeviceOrientationChangeEvent(event) { this.deviceOrientation = event; }
  onScreenOrientationChangeEvent() { this.screenOrientation = window.orientation || 0; }

  update() {
    if (!this.enabled) return;
    const device = this.deviceOrientation;
    if (!device) return;

    const alpha = device.alpha ? THREE.MathUtils.degToRad(device.alpha) + this.alphaOffset : 0;
    const beta  = device.beta  ? THREE.MathUtils.degToRad(device.beta)  : 0;
    const gamma = device.gamma ? THREE.MathUtils.degToRad(device.gamma) : 0;
    const orient = this.screenOrientation ? THREE.MathUtils.degToRad(this.screenOrientation) : 0;

    this.setObjectQuaternion(this.object.quaternion, alpha, beta, gamma, orient);
  }

  setObjectQuaternion(quaternion, alpha, beta, gamma, orient) {
    const zee = new THREE.Vector3(0, 0, 1);
    const euler = new THREE.Euler();
    const q0 = new THREE.Quaternion();
    const q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
    euler.set(beta, alpha, -gamma, 'YXZ');
    quaternion.setFromEuler(euler);
    quaternion.multiply(q1);
    quaternion.multiply(q0.setFromAxisAngle(zee, -orient));
  }

  dispose() {
    window.removeEventListener('orientationchange', this.onScreenOrientationChangeEvent);
    window.removeEventListener('deviceorientation', this.onDeviceOrientationChangeEvent);
    this.enabled = false;
  }
}
