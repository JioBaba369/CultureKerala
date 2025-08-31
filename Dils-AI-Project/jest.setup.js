import 'whatwg-fetch'
import '@testing-library/jest-dom'

process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'test'
global.setImmediate = require('timers').setImmediate;
