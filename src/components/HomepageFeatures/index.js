import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Fisheye Camera Calibration',
    Svg: require('@site/static/img/feature_fisheye.svg').default,
    description: (
      <>
        Calibrate fisheye cameras (FOV &gt; 180°) using a concentric pattern target,
        recovering principal point, focal length, viewpoint, and projection function
        based on <strong>US Patent 7,042,508 B2</strong>.
      </>
    ),
  },
  {
    title: 'Multi-Round Analysis',
    Svg: require('@site/static/img/feature_rounds.svg').default,
    description: (
      <>
        Capture up to <strong>10 calibration rounds</strong>, process each with the
        IH-Alpha and ZFL-IH pipeline, and find the best distance via minimum
        aggregation search across all enabled rounds.
      </>
    ),
  },
  {
    title: 'Server & Client Architecture',
    Svg: require('@site/static/img/feature_server.svg').default,
    description: (
      <>
        HTTP-based services for Axis (port 8000), Monitor (port 8001), and Camera
        (port 8002) — Windows 11 server controls hardware, Ubuntu 22.04 client
        operates the GUI through FastAPI.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
