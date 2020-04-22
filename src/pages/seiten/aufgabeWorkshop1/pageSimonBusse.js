export default () => {

  function getNameList(number, colors) {
    let list = []
    for (let i = 0; i < number; i++) {
      list.push(<li style={{ color: colors[Math.floor(Math.random() * colors.length)]}}>Simon Busse</li>)
    }
    return list
  }

  return (

      <div>

        <h1>
          Dies ist (m)eine Überschrift!
        </h1>

        <table> <td>
            <ol>
            {getNameList(100,["black"])}
            </ol>
          </td> <td>
            <ol>
            {getNameList(100,["red","blue","green","yellow","purple","pink","brown","black"])}
            </ol>
        </td> </table>

      </div>
    );
};