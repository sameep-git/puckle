import { createSignal, type Component } from 'solid-js';
//import AboutIcon from "~icons/bx/bxs-info-circle"
import logo from './logo.svg';
import styles from './App.module.css';
import PlayerSelect from "../components/CustomSearch"
import Modal from '../components/Modal';

import { FaSolidCircleInfo } from 'solid-icons/fa'
import { AiFillGithub } from 'solid-icons/ai'
import { IoStatsChart } from 'solid-icons/io'
import { IoSettings } from 'solid-icons/io'
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
            <Modal Icon={IoSettings} title='Settings'>
              <p>Change some settings here!</p>
            </Modal>
            <div class="flex">
              <div class="font-emoji text-5xl text-center">🏒</div>
              <h1 class="text-5xl font-bold text-center text-accent font-display ">
              <a href="/" class="no-underline">PUCKLE</a>
              </h1>
            </div>
            <div class="flex gap-2">
              <Modal Icon={FaSolidCircleInfo} title='About'>
                <p> 
                  Everyday a hockey player is selected from a list of all active NHL players. Try to guess the player correctly in 6 tries.
                </p>
                <p>
                  Built using SolidJS and TailwindCSS. Check out source: <a target='_blank' href='https://github.com/sameep-git/puckle'> <AiFillGithub class='inline-flex' /> </a>
                </p>
              </Modal>
              <Modal Icon={IoStatsChart} title='Stats'>
                <p>
                  Check out some your stats here!
                </p>
              </Modal>
            </div>
          </div>
          
            <SearchBox/>
        </div>
      </div>
    </>
  );
};