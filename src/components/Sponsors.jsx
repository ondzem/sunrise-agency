import React from 'react';
import './Sponsors.css';

const Sponsors = () => {
  const sponsors = [
    { file: 'SUNRISE Sponsor Loga13.png', link: 'http://www.rpl-eng.eu' },
    { file: 'SUNRISE Sponsor Loga14.webp', link: 'https://www.masinkapardubice.cz' },
    { file: 'SUNRISE Sponsor Loga15.png', link: 'https://www.stavmat.cz' },
    { file: 'SUNRISE Sponsor Loga16.png', link: 'http://www.rothsware.cz' },
    { file: 'SUNRISE Sponsor Loga17.png', link: 'https://www.ms-koralek.cz' },
    { file: 'SUNRISE Sponsor Loga18.webp', link: 'https://www.masutazu.cz' },
    { file: 'SUNRISE Sponsor Loga19.png', link: 'https://www.tmt.cz' },
    { file: 'SUNRISE Sponsor Loga20.png', link: 'https://www.cettus.cz/text/hlavni.php' },
    { file: 'SUNRISE Sponsor Loga21.png', link: 'https://pardubice.eu/obvod4' },
    { file: 'SUNRISE Sponsor Loga22.png', link: 'https://www.podkrkonosi.eu' },
    { file: 'SUNRISE Sponsor Loga23.png', link: 'https://www.hakvelkoobchod.cz' },
    { file: 'SUNRISE Sponsor Loga24.png', link: 'https://msduha.eu' },
    { file: 'SUNRISE Sponsor Loga25.png', link: 'https://www.jhv.cz' },
    { file: 'SUNRISE Sponsor Loga26.png', link: 'https://www.saint-gobain.cz/kontakty-saint-gobain/isover-vyrobni-zavod-castolovice' },
    { file: 'SUNRISE Sponsor Loga27.png', link: 'https://www.pentachemicals.eu' },
    { file: 'SUNRISE Sponsor Loga28.png', link: 'https://noinstant.cz' },
    { file: 'SUNRISE Sponsor Loga29.png', link: 'https://www.gabex.cz' },
    { file: 'SUNRISE Sponsor Loga30.png', link: 'https://www.skolaindigo.cz' },
    { file: 'SUNRISE Sponsor Loga31.png', link: 'https://www.kovaz.cz' },
    { file: 'SUNRISE Sponsor Loga32.png', link: 'https://www.obytnazahrada.cz' },
    { file: 'SUNRISE Sponsor Loga33.png', link: 'https://www.sav.cz' },
    { file: 'SUNRISE Sponsor Loga34.png', link: 'https://www.zubnicentrum.cz/cs/' },
    { file: 'SUNRISE Sponsor Loga35.png', link: 'https://www.era.aero/cs' },
    { file: 'SUNRISE Sponsor Loga36.png', link: 'https://www.retia.cz' },
    { file: 'SUNRISE Sponsor Loga37.png', link: 'https://fotoraska.cz' },
  ];

  return (
    <section className="sponsors-section">
      <div className="sponsors-container">
        <div className="sponsors-marquee-wrapper">
          <div className="sponsors-marquee">
            {/* První sada log */}
            {sponsors.map((sponsor, index) => (
              <a 
                href={sponsor.link}
                target="_blank"
                rel="noopener noreferrer"
                className="sponsor-logo-container" 
                key={`sponsor-1-${index}`}
              >
                <img 
                  src={`/SUNRISE Sponsor Loga/${sponsor.file}`} 
                  alt={`Sponsor ${index + 13}`} 
                  className="sponsor-logo"
                  loading={index < 6 ? "eager" : "lazy"} 
                  decoding="async" 
                />
              </a>
            ))}
            {/* Druhá sada log pro plynulou nekonečnou animaci */}
            {sponsors.map((sponsor, index) => (
              <a 
                href={sponsor.link}
                target="_blank"
                rel="noopener noreferrer"
                className="sponsor-logo-container" 
                key={`sponsor-2-${index}`}
              >
                <img 
                  src={`/SUNRISE Sponsor Loga/${sponsor.file}`} 
                  alt={`Sponsor ${index + 13}`} 
                  className="sponsor-logo"
                  loading="lazy"
                  decoding="async"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sponsors;
