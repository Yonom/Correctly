import Navigation from '../../components/Navigation';

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function multipleNames() {
  const returnValue = [];
  const n = 100;
  for (let i = 0; i < n; i++) {
    returnValue.push(<p style={{ backgroundColor: getRandomColor() }}>Robin</p>);
  }
  return returnValue;
}

export default () => {
  return (
    <div>
      <h1> h1 Überschrift </h1>
      <Navigation current="pageRobinRinn" />
      {multipleNames()};
    </div>
  );
};
