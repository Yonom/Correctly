export default () => {
  function printName() {
    const name = 'Luca';
    let output = '';
    for (let i = 0; i < 100; i++) {
      output = `${output} ${name}`;
    }
    document.getElementById('name').innerHTML = output;
  }

  function color() {
    document.getElementById('name').style.color = `#${(Math.random() * 0xFFFFFF << 0).toString(16)}`;
  }

  return (
    <div>
      <h1>Überschrift</h1>
      <button type="button" onClick={() => printName()}>Print name</button>
      <button type="button" onClick={() => color()}>Random Color</button>
      <p id="name" />
    </div>
  );
};
