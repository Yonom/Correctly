import Navigation from '../../../components/Navigation';


export default () => {
  // Funktion gibt zufälligen HEX-Farben-Code zurück
  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // Funktion gibt Array mit 100 mal "Linn" mit zufälligen Farben zurück
  function coloredNames() {
    const content = [];
    for (let t = 0; t < 100; t++) {
      content.push(<p style={{ color: getRandomColor() }}>Linn</p>);
    }
    return content;
  }

  return (
    <div>
      <Navigation current="pageLinn" />
      <h1>Linn</h1>
      <div> {coloredNames()} </div>
    </div>
  );
};
