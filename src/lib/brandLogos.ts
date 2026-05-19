// Maps brand names to logo URLs (Google favicon service — reliable, cached, no key).
const DOMAINS: Record<string, string> = {
  hyundai: 'hyundai.com',
  kia: 'kia.com',
  genesis: 'genesis.com',
  samsung: 'renaultsamsungm.com',
  chevrolet: 'chevrolet.com',
  ssangyong: 'smotor.com',
  daewoo: 'gm.com',
  renault: 'renault.com',
  toyota: 'toyota.com',
  honda: 'honda.com',
  nissan: 'nissan-global.com',
  mazda: 'mazda.com',
  mitsubishi: 'mitsubishi-motors.com',
  subaru: 'subaru.com',
  lexus: 'lexus.com',
  infiniti: 'infinitiusa.com',
  bmw: 'bmw.com',
  audi: 'audi.com',
  mercedes: 'mercedes-benz.com',
  volkswagen: 'vw.com',
  vw: 'vw.com',
  porsche: 'porsche.com',
  ford: 'ford.com',
  cadillac: 'cadillac.com',
  buick: 'buick.com',
  gmc: 'gmc.com',
};

export function getBrandLogo(name: string): string {
  const key = name.trim().toLowerCase().split(/\s|\//)[0];
  const domain = DOMAINS[key] ?? `${key}.com`;
  return `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
}
