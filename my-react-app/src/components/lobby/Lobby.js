import React, { useState, createContext, useEffect } from 'react';
import './Lobby.css';
import Grid from '@mui/material/Grid';
import { db } from '../../firebase_config.js';
import Player from '../players/players';
import { createUserWithEmailAndPassword, signOut, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase_config.js';
import { collection,  addDoc, updateDoc, doc, where, query, getDocs } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';

const axios = require('axios');


export const UserContext = createContext();

function Lobby() {
    const [signInEmail, setSignInEmail] = useState("");

    const [signInPass, setSignInPass] = useState("");

    const [loginEmail, setLoginEmail] = useState("");

    const [loginPass, setLoginPass] = useState("");

    const [user, setUser] = useState(null);

    const [snapShot ,setSnapShot] = useState(null);

    const [coloured, setColoured] = useState({
        P1: "white",
        P2: "white",
        P3: "white",
        P4: "white"
    });

    const [imageUrls, setImageUrls] = useState({
        P1: "",
        P2: "",
        P3: "",
        P4: ""
    })

    const collectionRef = collection(db, "colours");

    useEffect(() => {
        
            const getData = async () => {
                try {
                    const q = query(collection(db, "colours"), where("email", "==", user.email));
                    const querySnapshot = await getDocs(q);
                    
                    querySnapshot.forEach(async (document) => {
                        setColoured(document.data().colours);
                        setImageUrls(document.data().urls);
                     });
                }
                catch(error) {
                    console.log(error.message);
                }
        }
        getData();
    }, [user])

    onAuthStateChanged(auth, (curUser) => {
        if (curUser !== user) {
            setUser(curUser);
        }
    })

    const toPlayer = async (curColours) => {
        setColoured(curColours);
        console.log(curColours);
        console.log("change");
        console.log(user.email);
        axios.post('https://us-central1-backend-basics-d1569.cloudfunctions.net/setColour',null, { params: 
        {email: user.email, colours: curColours}});
        
    }

    const getUrls = async (curUrls) => {
        setImageUrls(curUrls);
        console.log("change");
        const q = query(collection(db, "colours"), where("email", "==", user.email));

        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((document) => {
            const imageDoc = doc(db, "colours", document.id)
            updateDoc(imageDoc, {urls: curUrls});
        });
    }

    const login = async () => {
        try {
            await signInWithEmailAndPassword(auth, loginEmail, loginPass);
            const q = query(collection(db, "colours"), where("email", "==", loginEmail));

            const querySnapshot = await getDocs(q);

            
            querySnapshot.forEach(async (document) => {
                setImageUrls(document.data().urls);

            const functions = getFunctions();
            const getColour = httpsCallable(functions, 'getColour')
            const result = await getColour({email: loginEmail});
            console.log(result);
            setColoured(result.data);
        });

        }
        catch(error) {
            console.log(error.message);
        }
    };

    const SignIn = async () => {
        try {
            await createUserWithEmailAndPassword(auth, signInEmail, signInPass);
            await addDoc(collectionRef, {colours:{
                P1: "white",
                P2: "white",
                P3: "white",
                P4: "white"
            }, email: signInEmail, urls: {
                P1: "",
                P2: "",
                P3: "",
                P4: ""
            }});
            setColoured({
                P1: "white",
                P2: "white",
                P3: "white",
                P4: "white"
            });
            setImageUrls({
                P1: "",
                P2: "",
                P3: "",
                P4: ""
            });

            const q = query(collection(db, "colours"), where("email", "==", signInEmail));

            const querySnapshot = await getDocs(q);

            setSnapShot(querySnapshot);
        }
        catch (error) {
            console.log(error.message);
        }
    };

    const logout = async () => {
        await signOut(auth);
    };

    const handleChange = (e) => {
        setSignInEmail(e.target.value);
    }

    return (
        <>
            {user !== null && 
                <>
                    <h4>
                        User logged in: 
                    </h4>
                    {user?.email}
                    <button onClick={logout}>
                        Logout
                    </button>
                    <UserContext.Provider value={{coloured: coloured, urls: imageUrls, user: user, snapShot: snapShot}}>
                        <>
                            <h1> Game Lobby</h1>
                            <Grid className="grid-container">
                                <Grid item xs={6} className="grid-item"><Player number="1" toPlayer={toPlayer} colour={coloured.P1} getUrls={getUrls} url={imageUrls.P1}> </Player></Grid>
                                <Grid item xs={6} className="grid-item"><Player number="2" toPlayer={toPlayer} colour={coloured.P2} getUrls={getUrls} url={imageUrls.P2}></Player></Grid>
                                <Grid item xs={6} className="grid-item"><Player number="3" toPlayer={toPlayer} colour={coloured.P3} getUrls={getUrls} url={imageUrls.P3}></Player></Grid>
                                <Grid item xs={6} className="grid-item"><Player number="4" toPlayer={toPlayer} colour={coloured.P4} getUrls={getUrls} url={imageUrls.P4}></Player></Grid>`
                            </Grid>
                        </>
                    </UserContext.Provider>
                </>
            }

            {user === null &&
                <>
                    <div>
                    <label>
                        Enter your email: 
                        <input type="text" onChange={(event) => {
                            setLoginEmail(event.target.value);
                        }}/> 
                    </label>
                    <label>
                        Enter your password: 
                        <input type="password" onChange={(event) => {
                            setLoginPass(event.target.value);
                        }}/>
                    </label>
                    <button onClick={login}> Login In</button>
                    </div>

                    <div>
                    <label>
                        Enter your email: 
                        <input type="text" onChange={(event) => {
                            console.log(event.target.value);
                            handleChange(event);
                        }} /> 
                    </label>
                    <label>
                        Enter your password: 
                        <input type="password" onChange={(event) => {
                            setSignInPass(event.target.value);
                        }}/>
                    </label>
                    <button onClick={SignIn}> Sign Up</button>
                    </div>
                </>
            }
        </>
    )
}

export default Lobby;