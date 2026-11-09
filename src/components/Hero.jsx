import SwarmCanvas from './SwarmCanvas';
import { Magnetic } from './ui';
import { PROFILE } from '../data/content';

const LINKS = [
  ['#a-propos', 'À propos'], ['#projets', 'Projets'], ['#labo', 'Labo'], ['#parcours', 'Parcours'],
  ['#certifications', 'Certifications'], ['#communaute', 'Communauté'], ['#contact', 'Contact'],
];

export function Nav() {
  return (
    <nav className="nav" aria-label="Sections">
      <a className="nav-logo" href="#top">SKK<span>.</span></a>
      <ul>{LINKS.map(([href, label]) => <li key={href}><a href={href}>{label}</a></li>)}</ul>
    </nav>
  );
}

/** Chaque lettre du nom entre séparément ; la ligne du milieu est en contour. */
function NameLine({ word, index, hollow }) {
  let n = index * 5;
  return (
    <span className={`name-line ${hollow ? 'hollow' : ''}`} aria-hidden="true" data-cursor>
      {[...word].map((ch, i) => <span className="letter" key={i} style={{ '--i': n++ }}>{ch}</span>)}
    </span>
  );
}

export default function Hero() {
  return (
    <header className="hero" id="top">
      <SwarmCanvas />
      <div className="wrap hero-inner">
        <Nav />
        <div className="hero-body">
          <p className="hero-role"><span className="pulse" aria-hidden="true" />{PROFILE.role}</p>
          <h1 aria-label={PROFILE.name.join(' ')}>
            {PROFILE.name.map((w, i) => <NameLine word={w} index={i} hollow={i === 1} key={w} />)}
          </h1>
          <p className="hero-thesis">{PROFILE.thesis}</p>
          <div className="hero-actions">
            <Magnetic className="btn btn-sun" href="#projets">Voir mes projets</Magnetic>
            <Magnetic className="btn btn-line" href="#contact">Me contacter</Magnetic>
          </div>
        </div>
      </div>
    </header>
  );
}
