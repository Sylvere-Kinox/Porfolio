import { Reveal, Seal } from './ui';
import { ABOUT, PROFILE } from '../data/content';
import { PHOTO } from '../data/assets';

export default function About() {
  return (
    <section className="block tone-cream" id="a-propos">
      <div className="wrap about">
        <Reveal className="about-photo">
          <img src={PHOTO} alt="Portrait de Sylvère Kinox Kouffossi" width="420" height="560" />
          <Seal text={ABOUT.seal} />
        </Reveal>
        <div className="about-text">
          <Reveal as="h2" className="display">{ABOUT.title}</Reveal>
          {ABOUT.paragraphs.map((p, i) => <Reveal as="p" delay={80 * (i + 1)} key={i}>{p}</Reveal>)}
          <ul className="stickers">
            {ABOUT.stickers.map((s, i) => (
              <Reveal as="li" delay={100 * i} key={s.text} className={`sticker tone-${s.tone}`} style={{ '--tilt': `${s.tilt}deg`, '--d': `${100 * i}ms` }}>
                {s.text}
              </Reveal>
            ))}
          </ul>
          <p className="about-school">{PROFILE.school}</p>
        </div>
      </div>
    </section>
  );
}
