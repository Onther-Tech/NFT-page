import { useState } from 'react';
import CSVReader from 'react-csv-reader'
import './App.css';
import NFTMinterABI from "./abi/TokamakNFTMinter.json"
import Web3 from 'web3';

let web3 = null;
if (window.ethereum) {
  web3 = new Web3(window.ethereum);
  try {
    window.ethereum.enable().then(function() {
      console.log("Allowed");
    });
  } catch (e) {
    console.log({ e });
  }
}

const nftMinterAddress = '0x9E01Ae54b02298aC3d4cC98b2A3F538E928d457B' // need to change
const contract = new web3.eth.Contract(
  NFTMinterABI.abi, nftMinterAddress
)

function App() {
  const [data, setData] = useState([])
  const [eventName, setEventName] = useState('event1')
  const [input, setInput] = useState('')
  const [selectValue, setSelectValue] = useState(['event1', 'event2', 'event3'])

  const listItems = data.map((rowData, index) => <li className="address-list" key={index}>{rowData}<button onClick={() => deleteRow(data, index)}>delete</button></li>)
  
  const selectItems = selectValue.map((rowData, index) => <option value={rowData}>{rowData}</option>)

  const controledSelectItems = selectValue.map((rowData, index) => <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 10}} value={rowData}>{rowData}<button onClick={() => deleteRow(selectValue, index)}>delete</button></div>)

  const handleChange = (e) => {
    setInput(e.target.value)
  }

  const handleSelectChange = (e) => {
    setEventName(e.target.value)
  }

  const insertRow = () => {
    const result = data.filter(d => d === input)

    if (input === '') {
      return alert("Please input address")
    }
    if (result.length > 0) {
      return alert("This address is already added")
    }

    setData([...data, input])
  }

  const deleteRow = (value, args) => {
    if (value === selectValue) {
      return setSelectValue(value.filter((d, index) => 
      index !== args
    ))
    }
    setData(value.filter((d, index) => 
      index !== args
    ))
  }
  
  const submit = async () => {
    web3.eth.getAccounts().then(accounts => {
      console.log({ accounts });
      contract.methods.mintBatch(data, eventName).send({ from: accounts[0] }, (error, result) => {
        if (error) {
          console.log(error)
        }
        console.log(result)
      });
    });
  }
  
  return (
    <div className="App">
      <h1>Title</h1>
      <div style={{ marginBottom: 40 }}>
        <div className="top-container">
        <h2>Address</h2>
          <CSVReader onFileLoaded={(data) => setData(data)}></CSVReader>
        </div>
        <input style={{ width: 400, height:40, marginRight: 10 }} onChange={handleChange}></input>
        <button style={{height:40, width: 100}} onClick={() => insertRow()}>Add</button>
      </div>
      <div className="data-area">
        <ol>
          {listItems}
        </ol>
      </div>
      <div className="btn-container">
        <div style={{ width: 250, display: 'flex', flexDirection: 'column' }}>
          <h2>Eventname-list</h2>
          <div style={{display: 'flex'} }>
          <input style={{marginRight: 10}}></input>
          <button>add</button>
          </div>
          <div style={{marginTop: 20}}>{controledSelectItems}</div>
        </div>
        <select style={{ width: 150, height: 40 }} onChange={handleSelectChange} >
          {selectItems}
        </select>
          <button className="btn-send" style={{height:40, width: 100}} onClick={() => submit()}>Send</button>
       
        </div>
    </div>
  );
}

export default App;
