import Navigation from '../../components/Navigation';

export default () => {
  // returns a random color
  function tempColorFunction() {
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    return randomColor;
  }

  // creates the names in color
  function OutputFunction() {
    const Output = [];
    for (let i = 1; i <= 100; i++) {
      const tempColor = tempColorFunction();
      Output.push(<p style={{ color: tempColor }}>Luca</p>);
    }
    return Output;
  }

  return (
    <div>
      <Navigation current="lucalenhard" />
      <h1> Header</h1>
      <p id="Output">{ OutputFunction() }</p>
    </div>
  );
};
