
import React, {createContext, useState} from 'react';
import auth from '@react-native-firebase/auth';


export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login: async (email, password) => {
          try {
            await auth().signInWithEmailAndPassword(email, password);
          } catch (e) {
            console.log(e);
          }
        },
      
        register: async (email, password) => {
          try {
            await auth().createUserWithEmailAndPassword(email, password)
            .then(() => {
              console.log('User account created & signed in!');
            })
            .catch(error => {
              if (error.code === 'auth/email-already-in-use') {
                throw 'The email address is already in use!'
                console.log('That email address is already in use!');
              }
          
              if (error.code === 'auth/invalid-email') {
                throw error
                console.log('That email address is invalid!');
              }
          
              console.error(error);
            });
          } catch (e) {
            throw e
          }
        },
        logout: async () => {
          try {
            await auth().signOut();
          } catch (e) {
            console.log(e);
          }
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
};