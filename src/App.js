import { useState } from 'react';
import CSVReader from 'react-csv-reader'
import './App.css';
import NFTMinterABI from "./abi/TokamakNFTMinter.json"
import Web3 from 'web3';

const mainNet = "https://mainnet.infura.io/v3/b8099123c7e64dc8ae82f8fa8b870bef"
const rinkeby = "https://rinkeby.infura.io/v3/b8099123c7e64dc8ae82f8fa8b870bef"
const web3 = new Web3(new Web3.providers.HttpProvider(rinkeby))
const nftAddress = ' 0xe5949B80a7A28A4e3391543F362fDa1BACcdFA4A'
const nftMinterAddress = '0x4aD610E6872Df1a8EF3B223c315ef080E5e200c5'
const myAddress = '0x6830d743D821C5b13416571eB713566396769Fdb'
const contract = new web3.eth.Contract(
  NFTMinterABI.abi, nftMinterAddress
)

function App() {
  const [data, setData] = useState([])
  const [eventName, setEventName] = useState('')
  const [input, setInput] = useState('')
  const [selectValue, setSelectValue] = useState(['eventname-1', 'eventname-2', 'eventname-3'])

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
    console.log(data)
    console.log(eventName)
    await contract.methods.mintBatch(data, eventName).send({ from: '0x6830d743D821C5b13416571eB713566396769Fdb'}, (error, result) => {
      if (error) {
        console.log(error)
      }
      console.log(result)
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
