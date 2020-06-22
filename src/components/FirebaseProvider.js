import React, { useContext } from 'react'
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage'

import firebaseConfig from '../config/firebase';

// import custom hook untuk mendapapatkan user autentikasi dari firebase
import { useAuthState } from 'react-firebase-hooks/auth'

// inisialiasi firebase
firebase.initializeApp(firebaseConfig);

const FirebaseContext = React.createContext();

// fungsi custom hooks untuk use firebase-context
export function useFirebase() {
    return useContext(FirebaseContext);
}

export default function FirebaseProvider(props) {

    // inialiasi ftiur auth,authstore,authstorage
    const auth = firebase.auth();
    const firestore = firebase.firestore();
    const storage = firebase.storage();

    // useauthstate dari react-firebase-hooks untuk get data user authentication
    const [user, loading, error] = useAuthState(auth);

    return <FirebaseContext.Provider value={{
        auth,
        firestore,
        storage,
        user,
        loading,
        error
    }}>
        {props.children}
    </FirebaseContext.Provider>
}
