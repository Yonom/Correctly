import Navigation from "../../components/Navigation";

export default () => {
    function getRandomColor(){
        const color = "#"+((1<<24)*Math.random()|0).toString(16)
        return color;
    }
    
    function createnames(name, times){
        let names = []
        for(let i = 0; i<times;i++){
            let randomcolor = getRandomColor()
            names.push(<p style={{color: randomcolor}}>{name}</p>)
        }
        return names;
    }
    
    return ( 
        <div>
            <Navigation current="pagecarl"></Navigation>
            <h1>
                    CArl
            </h1>
        <div>
                <p id='names'>{ createnames('carl', 100) }</p>
            </div>
        </div>
    )


}

