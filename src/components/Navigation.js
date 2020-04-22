import Link from 'next/link';

export default ({ current }) => {
  return (
    <div>
      <Link href="/"><span style={{ fontWeight: current == 'index' ? 'bold' : 'normal' }} >Home</span></Link>
      <Link href="/seiten/seite2"><span style={{ fontWeight: current == 'seite2' ? 'bold' : 'normal' }}>Seite 2</span></Link>
      <Link href="/aufgabeWorkshop1/pageYannick"><span style={ current == 'yannick' ? { fontWeight:'bold', color: 'red',fontSize:"20px"} : { fontWeight:'normal', color: 'black', fontSize:"16px"} }>Yannick</span></Link>
      <Link href="/aufgabeWorkshop1/pageRobinRinn"><span style={{ fontWeight: current == 'pageRobinRinn' ? 'bold' : 'normal' }}>pageRobinRinn</span></Link>
      <Link href="/seiten/lucalenhard"><span style={{ fontWeight: current == 'lucalenhard' ? 'bold' : 'normal' }}>Workshop 1</span></Link>
      <Link href="/seiten/aufgabeWorkshop1/pageLinn"><span style={{ fontWeight: current == 'pageLinn' ? 'bold' : 'normal' }} >Linn</span></Link>
      <Link href="/aufgabeWorkshop1/pagecarl"><span style={{ fontWeight: current == 'carl' ? 'bold' : 'normal' }}>Carl</span></Link>
      <Link href="/seiten/aufgabeWorkshop1/pageLucaSteingen"><span style={{ fontWeight: current == 'index' ? 'bold' : 'normal' }}>Luca</span></Link>
      <Link href="/seiten/aufgabeWorkshop1/pageSimonBusse"><span style={{ fontWeight: current == 'pageSimonBusse' ? 'bold' : 'normal' }}>Simon Busse</span></Link>
    </div>
  )
}
