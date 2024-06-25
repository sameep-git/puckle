/* @refresh reload */
import { render } from 'solid-js/web';

import './index.css';
import App from './App';
import colors from 'tailwindcss/colors'

const colorArray = [
  colors.amber,
  colors.blue,
  colors.cyan,
  colors.emerald,
  colors.fuchsia,
  colors.green,
  colors.indigo,
  colors.lime,
  colors.orange,
  colors.pink,
  colors.purple,
  colors.red,
  colors.rose,
  colors.sky,
  colors.teal,
  colors.violet,
  colors.yellow,
]

const accentColor = colorArray[new Date().getDate() % colorArray.length];
document.documentElement.style.setProperty('--ACCENT', accentColor[400] as string);

const root = document.getElementById('root');

render(() => <App />, root!);
