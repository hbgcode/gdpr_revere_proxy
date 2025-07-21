import React, { useRef, useState } from "react";
import './App.css';
// import rsa from 'js-crypto-rsa';
// const PRE = require("./functions/encryption");
// const Proxy = PRE.Proxy;
// const sha3 = require('js-sha3');
// let ec = new elliptic.ec('secp256k1');
// const secp = require("noble-secp256k1");
// const fs = require('fs');
// var fs = require('browserify-fs');
const axios = require('axios');
// const EthCrypto = require("eth-crypto");
// const crypto = require("crypto");
// const { PerformanceObserver, performance } = require('node:perf_hooks');




function App() {
  
  // const obs = new PerformanceObserver((items) => {
  //   console.log(items.getEntries()[0].duration);
  //   performance.clearMarks();
  // });
  // obs.observe({ type: 'measure' });
  // performance.measure('Start to Now');
  

  
  const baseURL = "http://localhost:3002";

  const get_title = useRef(null);

  const post_title = useRef(null);
  // const post_description = useRef(null);


  const [getResult, setGetResult] = useState(null);
  const [getResult2, setGetResult2] = useState(null);
  const [postResult, setPostResult] = useState(null);
  const [postInitialize, setInitializeResult] = useState(null);
  const [data , setData] = useState([]);
  const fortmatResponse = (res) => {
    return JSON.stringify(res, null, 2);
  };
  
  async function initialize(){
    console.time('initialization');
    axios({
      method: "get",
      url: "http://localhost:3002/getKeys",
    }).then((response) => {
    const userData = {
      identity: "user",
      publicKey : response.data.data.publicKey 
    };
    const dataUser = {
        user: "user",
        publicKey : response.data.data.publicKey, 
        privateKey : response.data.data.privateKey 
      };
      axios.post(`${baseURL}/initialize`, userData).then((response) => {
      console.log("sent");
      setInitializeResult(fortmatResponse(response.data.status));
        });
      axios.post(`${baseURL}/storeKey`, dataUser).then((response) => {
      console.log("saved");
      console.log('initialization - time');      
      console.timeEnd('initialization');      
    });
});
};


async function request(e){
  // alert();
  console.time('request');
  axios({
    method: "get",
    url: "http://localhost:3002/getSign",
  }).then((response) => {
  const signature = response.data.signature; 
  // console.log(response.data.signature);
  const hash = response.data.hash;

  const postData = {
    "signature" : signature,
    "hash" : hash,
    "key" : e.target.dataset.id
  };
  axios.post(`${baseURL}/request`, postData).then((response) => {
    console.log("requst sent");
    setGetResult2(fortmatResponse(response.data.data));
    console.log('request and access - time');
    console.timeEnd('request');
  });
});
// console.time('test');
}

async function fetchlocation(){
  console.log("Hello")
  // console.time('test');
 await axios({
    method: "get",
    url: "http://localhost:3002/documentlist/user",
  })
  .then((res) => {
    const datas = res.data.docs;
    console.log(res.data.docs)
    setData(datas);
    // setData({data})
    // return res;
    // console.timeEnd('test');
  })
  // .then(data=>{
  //   setData(data);
  //   // console.log(data);
  // })
}
  async function getDataByTitle(){
    const title = get_title.current.value;
    axios
  .get(`${baseURL}/access/`+title)
  .then(function (response) {
    console.log(response.data.status);
    setGetResult(fortmatResponse(response.data.status));
  });
  }

  async function postData() {
    console.time('uploadf');
    const postData = {
      buff: post_title.current.value,
      user: "user",
    };

    try {
      axios.post(`${baseURL}/upload`, postData).then((response) => {
        console.log("sent");
        setPostResult(fortmatResponse(response.data.status));
        console.timeEnd('uploadf');
      });

    } catch (err) {
      setPostResult(err.message);
    }
  }


  const clearGetOutput = () => {
    setGetResult(null);
  }

  const clearPostOutput = () => {
    setPostResult(null);
  }
// if(!data.lenght) return<div>Loading</div>
  return (
    <div id="app" className="w-full max-w-xs">
      {/* {data} */}
      <h1 className="font-medium leading-tight text-5xl mt-0 mb-2 text-blue-600">GDPR DATA USER</h1>
      
      {/* Initialize */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="font-medium leading-tight text-3xl mt-0 mb-2 text-blue-600">Initialize</h2>
      <div className="mb-4">   
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={initialize}>Initialize</button>
          </div>
          { postInitialize && <div className="alert alert-secondary mt-2" role="alert"><pre>{postInitialize}</pre></div> }
        </div>
{/* Upload */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="font-medium leading-tight text-3xl mt-0 mb-2 text-blue-600">Data Upload</h2>
      <div className="mb-4">
            <input type="text" className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" ref={post_title} placeholder="Title" />
          
          
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={postData}>Post Data</button>
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={clearPostOutput}>Clear</button>
          </div>
          { postResult && <div className="alert alert-secondary mt-2" role="alert"><pre>{postResult}</pre></div> }
        </div>
{/* Access */}

        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="font-medium leading-tight text-3xl mt-0 mb-2 text-blue-600">Data Access</h2>
      <div className="mb-4">
            {/* <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={getAllData}>Get All</button> */}
      
      </div>
      <div className="mb-4">
            {/* <input type="text" ref={get_title} className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" placeholder="Title" /> */}
            <div className="input-group-append">
              {/* <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={fetchlocation}>Feth</button> */}
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={fetchlocation}>Show</button>
            </div>
            {/* <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={clearGetOutput}>Clear</button> */}
            { getResult && <div className="alert alert-secondary mt-2" role="alert"><pre>{getResult}</pre></div> }
          </div>   
          <div>
            <ul className="flex">
              {/* {data} */}
      {/* {
        var i = 0
        } */}
        {
        data.map((item , index)=><li key={item.id} className="mr-6">{index} {item.id}<button value={item.user} data-id={item.id} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded" onClick={request}>Request
      </button></li>)
      }
      </ul>
      { getResult2 && <div className="alert alert-secondary mt-2" role="alert"><pre>{getResult2}</pre></div> }
    </div>
      </div>
    </div>





  );
}

export default App;