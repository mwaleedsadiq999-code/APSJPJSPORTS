/**
 * Club data — edit this file to change any player name, role or photo.
 * The whole site reads from here, so you only ever edit this one file.
 */

export const club = {
  shortName: 'APS JPJ',
  name: 'APS JPJ Cricket Club',
  campus: 'Jalal Pur Jattan Campus',
  fullName: 'Army Public School & College · Jalal Pur Jattan Campus',
  season: '2025 - 26',
  motto: 'I Shall Rise and Shine',
}

export const leaders = [
  {
    number: '01',
    name: 'Umer Shabir',
    role: 'Captain',
    discipline: 'Batsman',
    style: 'Right hand Batsman Highest 89',
    photo: '/assets/captains.jpg',
    quote: 'Set the standard in training and the match takes care of itself.',
  },
  {
    number: '02',
    name: 'Muhammad Awais Maqsood',
    role: 'Vice Captain',
    discipline: 'Wicketkeeper',
    style: 'Right hand · Safe pair of hands',
    photo: '/assets/captains.jpg',
    quote: 'Every run counts. Every wicket is a team wicket.',
  },
]

/** Full squad. `role` drives the leadership tag, `discipline` the filter. */
export const squad = [
  { number: '01', name: 'Umer Shabir', role: 'Captain', discipline: 'Batsman', style: 'Right hand Batsman · Right hand Off spin' },
  { number: '02', name: 'Muhammad Awais Maqsood', role: 'Vice Captain', discipline: 'Batter', style: 'Right Hand' },
  { number: '03', name: 'Yousaf Jan', role: 'Player', discipline: 'Bowler', style: 'Opening bowler' },
  { number: '04', name: 'Joel Adan', role: 'Player', discipline: 'Bowler', style: 'Right arm fast' },
  { number: '05', name: 'Ahmed', role: 'Player', discipline: 'Wicketkeeper', style: 'Right hand' },
  { number: '06', name: 'Sameer', role: 'Player', discipline: 'Batter', style: 'Top order' },
  { number: '07', name: 'Haji', role: 'Player', discipline: 'Batsman', style: 'Right hand' },
  { number: '08', name: 'Sameer', role: 'Player', discipline: 'All-rounder', style: 'Right hand' },
  { number: '09', name: 'Daniyal Ahmed', role: 'Player', discipline: 'Batter', style: 'Middle order' },
  { number: '10', name: 'Farhan Nazir', role: 'Player', discipline: 'Bowler', style: 'Left arm spin' },
  { number: '11', name: 'Saad Raza', role: 'Player', discipline: 'Wicketkeeper', style: 'Right hand' },
  { number: '12', name: 'Ahmed Munir', role: 'Player', discipline: 'Batsman', style: 'Right hand' }, 
]
/** Season numbers shown in the stat band (count up when scrolled into view). */
export const seasonStats = [
  // Derived, so the band can never disagree with the roster above.
  { value: squad.length, label: 'Squad members' },
  { value: 8, label: 'Matches played' },
  { value: 5, label: 'Season wins' },
]
