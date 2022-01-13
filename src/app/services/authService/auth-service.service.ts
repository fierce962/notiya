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
    try{
      const { user } = await createUserWithEmailAndPassword(this.afAuth, email, password);
      await this.verifiedEmail();
      return user;
    }
    catch(error){
      console.log('no se pudo registrar', error);
    }
  };

  async verifiedEmail(){
    await sendEmailVerification(this.afAuth.currentUser);
  }

  async resetPassword(newPassword: string): Promise<void>{
    try{
      await updatePassword(this.afAuth.currentUser, newPassword);
    }catch(error){
      console.log('error change password', error);
    };
  }

  async loginEmail(email: string, password: string): Promise<User>{
    try{
      const { user } = await signInWithEmailAndPassword(this.afAuth, email, password);
      return user;
    }catch(error){
      console.log('login error', error);
    }
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
