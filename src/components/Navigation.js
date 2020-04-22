import Link from 'next/link';

export default ({ current }) => {
  return (
    <div>
      <Link href="/"><span style={{ fontWeight: current == 'index' ? 'bold' : 'normal' }} >Home</span></Link>
      <Link href="/seiten/seite2"><span style={{ fontWeight: current == 'seite2' ? 'bold' : 'normal' }}>Seite 2</span></Link>
      <Link href="/seiten/aufgabeWorkshop1/pageLucaSteingen"><span style={{ fontWeight: current == 'index' ? 'bold' : 'normal' }}>Luca</span></Link>
      <Link href="/seiten/aufgabeWorkshop1/pageSimonBusse"><span style={{ fontWeight: current == 'pageSimonBusse' ? 'bold' : 'normal' }}>Simon Busse</span></Link>
    </div>
  )
}