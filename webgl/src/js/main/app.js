import '../../css/global.css';
import '../../css/main.css';

import SceneApp from './SceneApp'
import Settings from './Settings'
import addControls from './debug/addControls'
import { addDropSupport } from '../debug/addDropSupport';
import assets from './asset-list'
import preload from 'utils/preload'

if (document.body) {
  _init()
} else {
  window.addEventListener('DOMContentLoaded', _init)
}

function _init () {
  preload({ assets }).then(init3D, logError)
}

function logError (e) {
  console.log('Error', e)
}

function init3D () {

  if (process.env.NODE_ENV === 'development') {
    Settings.init()
  }
  
  // CREATE SCENE
  const scene = new SceneApp()
  
  if (process.env.NODE_ENV === 'development') {
    console.log('IS_DEVELOPMENT')
    addControls(scene)
    addDropSupport((img)=>{
    })
    
  }
}
