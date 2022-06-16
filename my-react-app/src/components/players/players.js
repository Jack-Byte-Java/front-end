import React, { useState, useContext, useEffect } from 'react';
import '../../firebase_config.js'
import { storage } from '../../firebase_config.js';
import { UserContext } from '../lobby/Lobby';
import "./player.css"
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage';
import { v4 } from "uuid";
import { collection,  addDoc, updateDoc, doc, where, query, getDocs } from 'firebase/firestore';


 const Player = (props) => {
   
    const [colour, setColour] = useState("White");

    const [image, setImage] = useState(null);

    const [imageUrl, setImageUrl] = useState("");
    
    const {coloured, urls, user} = useContext(UserContext);

    useEffect(() => {
        setColour(props.colour);
        setImageUrl(props.url);
        console.log(" ");
        console.log(props.number);
        console.log(props.colour);
        console.log(props.url);
        }, [props.colour, props.url])

    const handleImage = e => {
        if (e.target.files[0]) {
          setImage(e.target.files[0]);
        }
      };

    
    const change = async (c) => {
        setColour(c);
        switch(props.number) {
            case "1":
                props.toPlayer({ ...coloured, P1: c});
                break;
            case "2":
                props.toPlayer({ ...coloured, P2: c});
                break;
            case "3":
                props.toPlayer({ ...coloured, P3: c});  
                break;
            case "4":
                props.toPlayer({ ...coloured, P4: c});
                break;
            default:
                console.log(props.number === "1");
                break;
        }
    }
   
    
      const handleUpload = async () => {
        if (image == null) {
            return;
        }
        const path = `images/${image.name + v4()}`
        const imageRef = ref(storage, path);
        console.log(path);
        await uploadBytes(imageRef, image);
        const url = await getDownloadURL(imageRef)
        console.log("image: ", url);
        // setImageUrl(url);


        switch(props.number) {
            case "1":
                props.getUrls({ ...urls, P1: url});
                break;
            case "2":
                props.getUrls({ ...urls, P2: url});
                break;
            case "3":
                props.getUrls({ ...urls, P3: url});  
                break;
            case "4":
                props.getUrls({ ...urls, P4: url});
                break;
            default:
                console.log(props.number === "1");
                break;
        }

      };

    console.log(`image url player ${props.number}: `, imageUrl)
    return (
        <div className='player'>
            <h1 style={{backgroundColor: colour}}>
                P{props.number}
            </h1>
            <br />
            <img src={imageUrl} alt="" />
            <hr />
            <select>
                <option onClick={() => change("White")}>
                    Choose colour
                </option>
                {((coloured.P1 !== "DodgerBlue" && coloured.P2 !== "DodgerBlue" && coloured.P3 !== "DodgerBlue" && coloured.P4 !== "DodgerBlue") || colour === "DodgerBlue") &&
                <option onClick={() => change("DodgerBlue")}>
                    Blue
                </option>
                }
                {((coloured.P1 !== "Red" && coloured.P2 !== "Red" && coloured.P3 !== "Red" && coloured.P4 !== "Red") || colour === "Red") &&
                <option onClick={() => change("Red")}>
                    Red
                </option>
                }
                {((coloured.P1 !== "Green" && coloured.P2 !== "Green" && coloured.P3 !== "Green" && coloured.P4 !== "Green") || colour === "Green") &&
                    <option onClick={() => change("Green")}>
                    Green
                </option>
                }
                {((coloured.P1 !== "Yellow" && coloured.P2 !== "Yellow" && coloured.P3 !== "Yellow" && coloured.P4 !== "Yellow") || colour === "Yellow") &&
                <option onClick={() => change("Yellow")}>
                    Yellow
                </option>
                }
            </select>

            <div>
                <input type="file" onChange={handleImage} />
            </div>
            <div>
                <button onClick={handleUpload}>Upload</button>
            </div>

        </div>

        
    )
}

export default Player;