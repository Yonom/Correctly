import Navigation from "../../components/Navigation";


export default () => {
  return (
    <div>
      <h1> h1 Überschrift </h1>
      <Navigation current="pageRobinRinn" />
      {multipleNames()};
    </div>
  );
};

function multipleNames(){
  var returnValue = [];
  let n= 100;
  for (var i = 0; i <n; i++) {
    returnValue.push(<p style={{ backgroundColor: getRandomColor() }}>Robin</p>);
}
return returnValue;
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
