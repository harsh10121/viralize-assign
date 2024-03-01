import { React,useState,useEffect } from "react";
import axios from "axios";

const apiKey = import.meta.env.VITE_API;
const companies = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];

function App(){

    const [apidata,setApiData] = useState([]);
    const [text,setText] = useState("");
    const [filteredResults,setFilteredResults] = useState([]);
    const [expand,setExpand] = useState(null);

    async function loadData(){
        try {
            for (let i = 0; i < companies.length; i++) {
                const company = companies[i];
                const url = `https://finnhub.io/api/v1/stock/metric?symbol=${company}&metric=all&token=${apiKey}`;
                const response = await axios.get(url);
          
                setApiData((prevState) => {
                    let newarr = [...prevState];

                    if(newarr.length===0)newarr.push(response.data);
                    else{
                        if (!newarr.some(item => item.symbol === response.data.symbol)) {
                            newarr.push(response.data);
                        }
                    }
                    return newarr;
                });
            }
        } 
        catch (error) {
            console.error('Error fetching data:', error.message);
        }
    }

    useEffect(function(){
        loadData();
        const intervalId = setInterval(loadData, 5 * 60 * 1000);
        return () => clearInterval(intervalId);
    },[]);

    function handleClick(index){
        setExpand(function(prev){
            if(prev===index){
                return null;
            }
            else return index;
        });
    }

    function createCard(item,index){

        return (
            <div key={index} className="card" onClick={()=>{handleClick(index)}}>
                <div className="top">
                    <div>{item.symbol}</div>
                    <div>{item.metric["3MonthAverageTradingVolume"]}</div>
                </div>
                <div className="bottom">
                    {expand===index?
                        <div className="dropdown">
                            <div>Metric Type {":"} {item.metricType}</div>
                            <div>netIncomeEmployeeAnnual {":"} {item.metric["netIncomeEmployeeAnnual"]}</div>
                            <div>netMarginGrowth5Y {":"} {item.metric["netMarginGrowth5Y"]}</div>
                            <div>netProfitMargin5Y {":"} {item.metric["netProfitMargin5Y"]}</div>
                        </div>
                    :null}
                </div>
            </div>
        );
    }

    useEffect(function(){
        const filteredData = apidata.filter(function(entry){
            return Object.values(entry)
              .join("")
              .toLowerCase()
              .includes(text.toLowerCase());
          });
        setFilteredResults(filteredData);
    },[text,apidata]);

    function handleChange(event){
        setText(event.target.value);
    }

    return (
        <div>
            <input type="text" onChange={handleChange} placeholder="Start typing" className="search"/>
            {filteredResults.map(createCard)}
        </div>
    );
}

export default App;