export interface SpaceAgency {
  name: string;
  acronym: string;
  country: string;
  founded: number;
  budgetUsdBn: number;
  employees: string;
  hq: string;
  flagshipPrograms: string[];
  site: string;
}

export const SPACE_AGENCIES: SpaceAgency[] = [
  { name: 'National Aeronautics and Space Administration', acronym: 'NASA', country: 'United States', founded: 1958, budgetUsdBn: 25.4, employees: '17,900', hq: 'Washington, D.C.', flagshipPrograms: ['Artemis', 'James Webb', 'Perseverance', 'Europa Clipper'], site: 'https://www.nasa.gov' },
  { name: 'Indian Space Research Organisation', acronym: 'ISRO', country: 'India', founded: 1969, budgetUsdBn: 1.7, employees: '17,000', hq: 'Bengaluru', flagshipPrograms: ['Chandrayaan-3', 'Aditya-L1', 'Gaganyaan', 'NISAR'], site: 'https://www.isro.gov.in' },
  { name: 'European Space Agency', acronym: 'ESA', country: 'Europe (22 states)', founded: 1975, budgetUsdBn: 8.2, employees: '2,200', hq: 'Paris', flagshipPrograms: ['Ariane 6', 'JUICE', 'Copernicus', 'Gaia'], site: 'https://www.esa.int' },
  { name: 'China National Space Administration', acronym: 'CNSA', country: 'China', founded: 1993, budgetUsdBn: 14.0, employees: '~20,000', hq: 'Beijing', flagshipPrograms: ['Tiangong', 'Chang\u2019e', 'Tianwen', 'Long March'], site: 'https://www.cnsa.gov.cn' },
  { name: 'Roscosmos State Corporation', acronym: 'Roscosmos', country: 'Russia', founded: 1992, budgetUsdBn: 3.4, employees: '170,000', hq: 'Moscow', flagshipPrograms: ['Soyuz', 'Progress', 'Luna-Glob'], site: 'https://www.roscosmos.ru' },
  { name: 'Japan Aerospace Exploration Agency', acronym: 'JAXA', country: 'Japan', founded: 2003, budgetUsdBn: 2.6, employees: '1,600', hq: 'Tokyo', flagshipPrograms: ['H3', 'Hayabusa2', 'SLIM', 'MMX'], site: 'https://global.jaxa.jp' },
  { name: 'Canadian Space Agency', acronym: 'CSA', country: 'Canada', founded: 1989, budgetUsdBn: 0.5, employees: '670', hq: 'Longueuil', flagshipPrograms: ['Canadarm3', 'RADARSAT', 'Artemis II crew'], site: 'https://www.asc-csa.gc.ca' },
  { name: 'UAE Space Agency', acronym: 'UAESA', country: 'United Arab Emirates', founded: 2014, budgetUsdBn: 0.8, employees: '200+', hq: 'Abu Dhabi', flagshipPrograms: ['Hope Mars Mission', 'MBR Explorer', 'Rashid Rover'], site: 'https://space.gov.ae' },
  { name: 'Korea AeroSpace Administration', acronym: 'KASA', country: 'South Korea', founded: 2024, budgetUsdBn: 0.7, employees: '300+', hq: 'Sacheon', flagshipPrograms: ['Nuri (KSLV-II)', 'Danuri', 'KPLO'], site: 'https://www.kasa.go.kr' },
  { name: 'Agenzia Spaziale Italiana', acronym: 'ASI', country: 'Italy', founded: 1988, budgetUsdBn: 2.3, employees: '300', hq: 'Rome', flagshipPrograms: ['COSMO-SkyMed', 'Vega-C', 'PLATiNO'], site: 'https://www.asi.it' },
];

export interface Constellation {
  name: string;
  operator: string;
  active: number;
  planned: number;
  orbit: string;
  altitudeKm: number;
  purpose: string;
}

export const CONSTELLATIONS: Constellation[] = [
  { name: 'Starlink', operator: 'SpaceX', active: 7000, planned: 42000, orbit: 'LEO', altitudeKm: 550, purpose: 'Broadband internet' },
  { name: 'OneWeb', operator: 'Eutelsat OneWeb', active: 648, planned: 6372, orbit: 'LEO', altitudeKm: 1200, purpose: 'Broadband internet' },
  { name: 'Iridium NEXT', operator: 'Iridium', active: 75, planned: 75, orbit: 'LEO', altitudeKm: 780, purpose: 'Voice & data relay' },
  { name: 'GPS III', operator: 'US Space Force', active: 31, planned: 32, orbit: 'MEO', altitudeKm: 20180, purpose: 'Navigation (PNT)' },
  { name: 'Galileo', operator: 'EUSPA', active: 28, planned: 30, orbit: 'MEO', altitudeKm: 23222, purpose: 'Navigation (PNT)' },
  { name: 'NavIC / IRNSS', operator: 'ISRO', active: 8, planned: 11, orbit: 'GEO/GSO', altitudeKm: 35786, purpose: 'Regional navigation' },
  { name: 'BeiDou-3', operator: 'CNSA', active: 45, planned: 45, orbit: 'MEO/GEO', altitudeKm: 21500, purpose: 'Navigation (PNT)' },
  { name: 'Planet SuperDove', operator: 'Planet Labs', active: 200, planned: 250, orbit: 'LEO (SSO)', altitudeKm: 475, purpose: 'Daily Earth imaging' },
  { name: 'Cartosat / RISAT', operator: 'ISRO', active: 22, planned: 30, orbit: 'LEO (SSO)', altitudeKm: 509, purpose: 'Earth observation & radar' },
  { name: 'Kuiper', operator: 'Amazon', active: 60, planned: 3236, orbit: 'LEO', altitudeKm: 630, purpose: 'Broadband internet' },
];

export interface UpcomingMission {
  name: string;
  agency: string;
  vehicle: string;
  window: string;
  destination: string;
  crewed: boolean;
  summary: string;
}

export const UPCOMING_MISSIONS: UpcomingMission[] = [
  { name: 'Artemis II', agency: 'NASA / CSA', vehicle: 'SLS Block 1', window: '2026', destination: 'Lunar free-return', crewed: true, summary: 'First crewed flight around the Moon since Apollo 17, four astronauts, ~10 day profile.' },
  { name: 'Gaganyaan G1 / H1', agency: 'ISRO', vehicle: 'HLVM3', window: '2026', destination: 'LEO 400 km', crewed: true, summary: 'India\u2019s first indigenous human spaceflight programme; uncrewed qualification flights precede the crewed mission.' },
  { name: 'Chandrayaan-4', agency: 'ISRO / JAXA', vehicle: 'LVM3 + PSLV', window: '2027', destination: 'Lunar south pole', crewed: false, summary: 'Lunar sample-return architecture with docking, ascent and re-entry modules.' },
  { name: 'Europa Clipper science phase', agency: 'NASA', vehicle: 'Falcon Heavy (launched)', window: '2030 arrival', destination: 'Jupiter / Europa', crewed: false, summary: '49 flybys of Europa to assess the subsurface ocean\u2019s habitability.' },
  { name: 'Dragonfly', agency: 'NASA', vehicle: 'Falcon Heavy', window: '2028', destination: 'Titan', crewed: false, summary: 'Nuclear-powered rotorcraft lander hopping across Titan\u2019s dunes.' },
  { name: 'Starship HLS uncrewed demo', agency: 'SpaceX / NASA', vehicle: 'Starship', window: '2026\u201327', destination: 'Lunar surface', crewed: false, summary: 'Full-stack orbital refuelling then an uncrewed lunar landing demonstration.' },
  { name: 'ExoMars Rosalind Franklin', agency: 'ESA', vehicle: 'Falcon 9', window: '2028', destination: 'Oxia Planum, Mars', crewed: false, summary: 'Two-metre drill searching for biosignatures below the Martian regolith.' },
  { name: 'Tianwen-3', agency: 'CNSA', vehicle: 'Long March 5', window: '2028', destination: 'Mars sample return', crewed: false, summary: 'Lander/ascent pair plus orbiter to return Martian samples by 2031.' },
];

export interface IssFact {
  label: string;
  value: string;
}

export const ISS_FACTS: IssFact[] = [
  { label: 'Assembly began', value: '20 Nov 1998 (Zarya)' },
  { label: 'Mass', value: '~419,725 kg' },
  { label: 'Pressurised volume', value: '~932 m³' },
  { label: 'Orbit altitude', value: '~408 km (LEO)' },
  { label: 'Orbital speed', value: '7.66 km/s' },
  { label: 'Orbital period', value: '92.9 minutes' },
  { label: 'Inclination', value: '51.64°' },
  { label: 'Orbits per day', value: '~15.5' },
  { label: 'Crew (Expedition)', value: '7 typical' },
  { label: 'Solar array power', value: '~120 kW' },
  { label: 'Partner agencies', value: 'NASA, Roscosmos, ESA, JAXA, CSA' },
  { label: 'Planned deorbit', value: '2030\u201331 via US Deorbit Vehicle' },
];

export const ISS_MODULES = [
  'Zarya (FGB)', 'Unity (Node 1)', 'Zvezda', 'Destiny Lab', 'Quest Airlock',
  'Pirs / Poisk', 'Harmony (Node 2)', 'Columbus', 'Kibo (JEM)', 'Tranquility (Node 3)',
  'Cupola', 'Rassvet', 'Leonardo PMM', 'BEAM', 'Nauka', 'Prichal',
];

export interface LaunchSite {
  name: string;
  country: string;
  operator: string;
  lat: number;
  lon: number;
  pads: number;
}

export const LAUNCH_SITES: LaunchSite[] = [
  { name: 'Kennedy Space Center / Cape Canaveral', country: 'USA', operator: 'NASA / USSF', lat: 28.57, lon: -80.65, pads: 8 },
  { name: 'Satish Dhawan Space Centre (SHAR)', country: 'India', operator: 'ISRO', lat: 13.72, lon: 80.23, pads: 3 },
  { name: 'Baikonur Cosmodrome', country: 'Kazakhstan', operator: 'Roscosmos', lat: 45.96, lon: 63.31, pads: 6 },
  { name: 'Guiana Space Centre', country: 'French Guiana', operator: 'ESA / CNES', lat: 5.24, lon: -52.77, pads: 4 },
  { name: 'Wenchang Space Launch Site', country: 'China', operator: 'CNSA', lat: 19.61, lon: 110.95, pads: 2 },
  { name: 'Tanegashima Space Center', country: 'Japan', operator: 'JAXA', lat: 30.39, lon: 130.97, pads: 2 },
  { name: 'Starbase Boca Chica', country: 'USA', operator: 'SpaceX', lat: 25.99, lon: -97.15, pads: 2 },
  { name: 'Vandenberg SFB', country: 'USA', operator: 'USSF', lat: 34.74, lon: -120.57, pads: 5 },
];

export const ORBIT_REFERENCE = [
  { regime: 'LEO', range: '160 – 2,000 km', period: '88 – 127 min', use: 'Imaging, broadband, ISS, most debris', objects: '~9,800 active' },
  { regime: 'MEO', range: '2,000 – 35,786 km', period: '2 – 24 h', use: 'Navigation (GPS, Galileo, BeiDou)', objects: '~150 active' },
  { regime: 'GEO', range: '35,786 km', period: '23h 56m', use: 'Weather, TV, comms, early warning', objects: '~590 active' },
  { regime: 'HEO', range: 'Elliptical, apogee > GEO', period: '12 – 24 h', use: 'High-latitude comms, science', objects: '~60 active' },
];
