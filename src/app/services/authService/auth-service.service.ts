import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword,
  signInWithPopup, GoogleAuthProvider,
  sendEmailVerification, updatePassword,  signInWithEmailAndPassword } from '@angular/fire/auth';
import { User } from 'src/app/models/interface';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(private afAuth: Auth) { }

  async register(email: string, password: string): Promise<User>{
    return new Promise((resolve, reject)=>{
      createUserWithEmailAndPassword(this.afAuth, email, password)
      .then(userRegister =>{
        const user: User = {
          uid: userRegister.user.uid,
          displayName: userRegister.user.displayName,
          email: userRegister.user.email,
          emailVerified: userRegister.user.emailVerified
        };
        resolve(user);
      })
      .catch(error=>{
        reject(error.code);
      });
    });
  };

  async resetPassword(newPassword: string): Promise<void>{
    try{
      await updatePassword(this.afAuth.currentUser, newPassword);
    }catch(error){
      console.log('error change password', error);
    };
  }

  async loginEmail(email: string, password: string): Promise<User>{
    return new Promise((resolve, reject)=>{
      signInWithEmailAndPassword(this.afAuth, email, password)
      .then(userLogin=>{
        const user: User = {
          uid: userLogin.user.uid,
          displayName: userLogin.user.displayName,
          email: userLogin.user.email,
          emailVerified: userLogin.user.emailVerified
        };
        resolve(user);
      }).catch(error =>{
        reject(error.code);
      });
    });

  }

  async loginGoogle(): Promise<User>{
    try{
      return await signInWithPopup(this.afAuth, new GoogleAuthProvider())
      .then(resUser=>{
        const user: User = {
          uid: resUser.user.uid,
          displayName: resUser.user.displayName,
          email: resUser.user.email,
          emailVerified: resUser.user.emailVerified
        };
        return user;
      });
    }catch(error){
      console.log('error in register google', error);
    };
  }

  logout(){
    this.afAuth.signOut();
  }
}
