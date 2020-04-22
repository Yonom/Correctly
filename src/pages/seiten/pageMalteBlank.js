import Navigation from "../../components/Navigation";

export default () => {

  //returns a random hexadecimal code of a color
  function tempColorFunction() 
  {
   var randomColor = '#'+ Math.floor(Math.random()*16777215).toString(16);
   return randomColor;
  }
  
  //prints my name in random colors
  function OutputFunction() 
  {
    let Output = []
    for(let i = 1; i <= 100; i++)
    {
      let tempColor = tempColorFunction()
        Output.push(<p style={{color: tempColor}}>Malte</p>)
    };
  return Output
  }

  return(
    <div>
      <Navigation current="pageMalteBlank" />
      <h1> This is a header </h1>
      <p id="Output">{ OutputFunction() }</p>
    </div>
  );

};