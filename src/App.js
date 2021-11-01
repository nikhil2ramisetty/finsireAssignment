import { useEffect, useState } from 'react';
import styles from './App.module.css'
import Cards from './components/Cards'
import Dat from './components/Dat'
function median(values){
  values.sort(function(a,b){
    return a-b;
  });

  var half = Math.floor(values.length / 2);
  
  if (values.length % 2)
    return values[half];
  
  return (values[half - 1] + values[half]) / 2.0;
}
function App() {
  const [site,setSite] = useState('https://assignment-aa0ef-default-rtdb.firebaseio.com/data.json');
  const [dataset,setDataset] = useState([]);
  const [stats, setMean] = useState({});
  const [input, setInput] = useState();
  const sum = (arr) => {
    var sum =0;
    for(var i=0;i<arr.length;i++){
      sum+=arr[i];
    }
    return sum;
  }
  useEffect(()=>{
    console.log(site);
    getJSON(site, function(err, data) {
    if (err !== null) {
      alert('Something went wrong: ' + err);
    }
    else {
      setMean({"mean":Math.round(avg(data) * 100) / 100, "median":Math.round(median(data) * 100) / 100, "standardDeviation": Math.round(standardDeviation(data) * 100) / 100,"mode":Math.round(mode(data) * 100) / 100});
      setDataset(data);
    }
  });
  },[site])
  const submitHandler = (event) => {
    event.preventDefault();
    if(input===''){
      return;
    }
    else{
      var d = dataset;
      
      var data = [Number(input),...d]
      setInput('');
      setMean({"mean":Math.round(avg(data) * 100) / 100, "median":Math.round(median(data) * 100) / 100, "standardDeviation": Math.round(standardDeviation(data) * 100) / 100,"mode":Math.round(mode(data) * 100) / 100});
      setDataset([Number(input),...d]);
    }
  }
  const reload = () => {
    var s = 'https://assignment-aa0ef-default-rtdb.firebaseio.com/';
    var l = Math.floor(Math.random() * (6 - 1) + 1);
    s = s+'data'+l.toString()+'.json';
    console.log(l);
    setSite(s);
  }
  const changeHandler = (event) => {
    console.log(event.target.value);
    setInput(event.target.value);
  }
  return (
    <div>
      <div className={styles.reloadButton}>
      
      <button onClick={reload}>Reload</button>
      </div>
      <h2 className={styles.Title}>Data Set</h2>
      <div className={styles.dset}>
        {dataset.map((d)=>(
          <Dat val={d}></Dat>
        ))}
      </div>
      <div className={styles.cards}>
        <Cards type="Mean" value={stats.mean}/>
        <Cards type="Median" value={stats.median}/>
        <Cards type="Standard Deviation" value={Math.round(stats.standardDeviation)}/>
        <Cards type="Mode" value={stats.mode}/>
      </div>
      <form className={styles.form} onSubmit={submitHandler}>
        <input type="text" onChange={changeHandler} value={input}></input>
        <button type="submit">Add</button>
      </form>

    </div>
  );
}

export default App;
var getJSON = function(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.onload = function() {
    var status = xhr.status;
    if (status === 200) {
      callback(null, xhr.response);
    } else {
      callback(status, xhr.response);
    }
  };
  xhr.send();
};
const avg = (array) => {
  var total = 0;
  var count = 0;

  array.forEach(function(item, index) {
      total += item;
      count++;
  });

  return total / count;
}
const standardDeviation = (array) => {
  const n = array.length;
  const mean = array.reduce((a, b) => a + b) / n;
  return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
}
const mode =(a)=>{
  a = a.slice().sort((x, y) => x - y);

  var bestStreak = 1;
  var bestElem = a[0];
  var currentStreak = 1;
  var currentElem = a[0];

  for (let i = 1; i < a.length; i++) {
    if (a[i-1] !== a[i]) {
      if (currentStreak > bestStreak) {
        bestStreak = currentStreak;
        bestElem = currentElem;
      }

      currentStreak = 0;
      currentElem = a[i];
    }

    currentStreak++;
  }

  return currentStreak > bestStreak ? currentElem : bestElem;
}