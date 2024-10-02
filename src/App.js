import { useState } from 'react';
import './App.css';
const uuid = require('uuid');

function App() {
  const [image, setImage] = useState('');
  const [uploadResultMessage, setUploadResultMessage] = useState('Upload an image to authenticate');
  const [imgName, setImgName] = useState('placeholder-avatar.jpg');
  const [isAuth, setAuth] = useState(false);

  function sendImage(e){
    e.preventDefault();
    setImgName(image.name);
    const visitorImageName = uuid.v4();
    fetch(`https://j30dmohyhf.execute-api.us-east-1.amazonaws.com/dev/visitor-image-fr/${visitorImageName}.jpg`,{
      method: 'PUT',
      headers: {
        'Content-Type': 'image/jpg'
      },
      body: image
    }).then(async()=>{
      const response = await authenticate(visitorImageName)
      if (response.Message === 'Success'){
        setAuth(true);
        setUploadResultMessage(`Authenticated ${response['firstName']} ${response['lastName']}`);
      }else{
        setAuth(false);
        setUploadResultMessage('Authentication Failed');
      }      
    }).catch(error => {
      setAuth(false);
      setUploadResultMessage('There was an error. Please try again');
      console.error(error);
    })
  }

  async function authenticate(visitorImageName){
    const requestURL = 'https://j30dmohyhf.execute-api.us-east-1.amazonaws.com/dev/employee?' + new URLSearchParams({
      objectKey: `${visitorImageName}.jpg`
    });
    return await fetch(requestURL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
    .then((data) => {
      return data;
    }).catch(error => console.error(error));
  }
  
  return (
    <div className="App">
      <h2>Facial Recognition System</h2>
      <form onSubmit={sendImage}>
        <input type = 'file' name='image' onChange ={e => setImage(e.target.files[0])}></input>
        <button type='submit'>Authenticate</button>
      </form>
      <div className={isAuth ? 'success' : 'failure'}>{uploadResultMessage}</div>
      <img src={require(`./visitors/${imgName}`)} alt="Visitor" height={250} width ={250}></img>
    </div>
  );
}

export default App;
