import Navigation from "../../../components/Navigation";
import { formatWithValidation } from "next/dist/next-server/lib/utils";



export default () => {
    // Funktion gibt Array mit 100 mal "Linn" mit zufälligen Farben zurück
    function coloredNames () 
    {
        let content = []
        for(let t = 0; t<100;t++)
        {
            content.push(<p style={{color:getRandomColor()}}>Linn</p>)
        };
    return content
    };

    //Funktion gibt zufälligen HEX-Farben-Code zurück
    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }
    return (
      <div>
        <Navigation current="pageLinn" />
        <h1>Linn</h1>
        <div> {coloredNames()} </div>
      </div>
      
      
    );
  };