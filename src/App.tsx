import type { Component } from 'solid-js';
//import AboutIcon from "~icons/bx/bxs-info-circle"
import logo from './logo.svg';
import styles from './App.module.css';

const App: Component = () => {
  return (
    <>
      <div class="w-screen bg-primary-900 text-primary-100">
        <div class="p-2 max-w-screen-sm 2xl:1/3 mx-auto flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <div class="font-emoji text-4xl">🏒</div>
            <h1 class="text-4xl font-bold text-center text-accent font-display">
            <a href="/" class="no-underline">PUCKLE</a>
            </h1>
            <div class="flex gap-2 ml-auto">
              
            </div>
          </div>

          <hr class="border-accent"/>

          <input>
            Guess player
          </input>
        </div>
      </div>
    </>
  );
};

export default App;
