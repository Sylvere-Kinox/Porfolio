import { Reveal, T } from './ui';
import DaoDemo from './DaoDemo';
import SentinelleDemo from './SentinelleDemo';
import { PROJECTS } from '../data/content';

const DEMOS = { dao: DaoDemo, sentinelle: SentinelleDemo };

function Project({ p, n }) {
  const Demo = DEMOS[p.id];
  return (
    <article className={`block project tone-${p.tone}`} id={p.id}>
      <div className="wrap">
        <header className="project-head">
          <span className="project-n" aria-hidden="true">{n}</span>
          <Reveal as="h3" className="display xl">{p.name}</Reveal>
          <Reveal as="p" className="project-tagline" delay={80}>{p.tagline}</Reveal>
          <dl className="facts">
            {p.facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd><T>{v}</T></dd></div>)}
          </dl>
        </header>

        <Reveal><Demo /></Reveal>

        <div className="project-body">
          <Reveal className="project-col">
            <h4>Le problème</h4>
            {p.problem.map((t, i) => <p key={i}>{t}</p>)}
          </Reveal>
          <Reveal className="project-col" delay={100}>
            <h4>Comment ça marche</h4>
            <ol className="steps">
              {p.steps.map(([title, text], i) => (
                <li key={title} style={{ '--i': i }}><b>{title}</b><span><T>{text}</T></span></li>
              ))}
            </ol>
          </Reveal>
        </div>

        <div className="project-foot">
          <dl className="outcomes">
            {p.outcomes.map(([k, v]) => <div key={k}><dt>{k}</dt><dd><T>{v}</T></dd></div>)}
          </dl>
          {p.award && <p className="award"><span aria-hidden="true">✺</span>{p.award}</p>}
          <ul className="chips">{p.stack.map((s) => <li key={s}>{s}</li>)}</ul>
          <p className="learned">{p.learned}</p>
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  return (
    <section id="projets" aria-label="Projets">
      {PROJECTS.map((p, i) => <Project p={p} n={`0${i + 1}`} key={p.id} />)}
    </section>
  );
}
