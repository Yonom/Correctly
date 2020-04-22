import Link from 'next/link';

export default ({ current }) => {
  return (
    <div>
      <Link href="/"><span style={{ fontWeight: current == 'index' ? 'bold' : 'normal' }} >Home</span></Link>
      <Link href="/seiten/pageMalteBlank"><span style={{ fontWeight: current == 'pageMalteBlank' ? 'bold' : 'normal' }}>pageMalteBlank</span></Link>
    </div>
  )
}