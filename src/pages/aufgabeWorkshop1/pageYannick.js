import Navigation from '../../components/Navigation';

export default () => {
  const mycolors = ['red', 'blue', 'green', 'pink', 'yellow', 'orange', 'black'];

  function colorfulTexts(text, number, colors) {
    const texts = [];
    for (let i = 0; i < number; i++) {
      texts.push(<p style={{ color: colors[Math.floor(Math.random() * Math.floor(colors.length))], fontSize: `${i}px`, fontWeight: i * 10 }}>{text} {i + 1}</p>);
    }
    return texts;
  }
  return (
    <div>
      <Navigation current="yannick" />
      {colorfulTexts('Yannick', 100, mycolors)}
      <p>Seite von Yannick</p>
    </div>
  );
};
