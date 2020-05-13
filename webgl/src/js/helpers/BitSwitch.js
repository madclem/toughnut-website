class BitSwitch {
  constructor (initValue = 0) {
    this._value = initValue;
  }

  set (mNumDigit, mValue = 1) {
    if (mValue === 0) {
      this._value = this._value & (0 << mNumDigit)
    } else {
      this._value = this._value | (1 << mNumDigit)
    }
  }

  toggle(mNumDigit) {
    this._value = this._value ^ (1 << (mNumDigit))
  }

  get (mNumDigit) {
    let value = this._value & (1 << mNumDigit)
    value = value >> mNumDigit

    return value === 1
  }

  reset () {
    this._value = 0
  }

  get value () {
    return this._value
  }

  log () {
    const s = this._value.toString(2)
    return s
  }
}

export { BitSwitch }
