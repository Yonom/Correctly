import Link from 'next/link';

export default ({ current }) => {
  return (
    <div>
      <Link href="/"><span style={{ fontWeight: current == 'index' ? 'bold' : 'normal' }} >Home</span></Link>
      <Link href="/seiten/seite2"><span style={{ fontWeight: current == 'seite2' ? 'bold' : 'normal' }}>Seite 2</span></Link>
      <Link href="/aufgabeWorkshop1/pageRobinRinn"><span style={{ fontWeight: current == 'pageRobinRinn' ? 'bold' : 'normal' }}>pageRobinRinn</span></Link>
    </div>
  )
}