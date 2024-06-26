import { createSignal, type Component } from 'solid-js';
//import AboutIcon from "~icons/bx/bxs-info-circle"
import logo from './logo.svg';
import styles from './App.module.css';
import PlayerSelect from "../components/CustomSearch"

import { FaSolidCircleInfo } from 'solid-icons/fa'
import { FiMenu } from 'solid-icons/fi'
import players from '../../get_data/players.json'

export default () => {
  const playerNames = players.map(player => player.Name).sort()

  const [playerGuess, setPlayerGuess] = createSignal<string>('')


  const SearchBox = () => {
    return (
      <>
        <div class="mt-2">
          <PlayerSelect guess={playerGuess} setGuess={setPlayerGuess} options={playerNames}/>
        </div>
      </>
    )
  }

  return (
    <>
      <div class="w-screen bg-primary-900 text-primary-100">
        <div class="p-2 max-w-screen-sm 2xl:1/3 mx-auto flex flex-col gap-4 ">
          <div class="flex flex-row items-center gap-2 justify-between">
            <FiMenu />
            <div class="flex">
              <div class="font-emoji text-5xl text-center">🏒</div>
              <h1 class="text-5xl font-bold text-center text-accent font-display ">
              <a href="/" class="no-underline">PUCKLE</a>
            </h1>
            </div>
            <FaSolidCircleInfo />
            {/* <div class="flex gap-2 ml-auto">
              
            </div> */}
          </div>
          
            <SearchBox/>
        </div>
      </div>
    </>
  );
};