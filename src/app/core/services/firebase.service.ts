import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc, deleteDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { UtilsService } from './utils.service';
import { User } from 'src/app/models/user.model';
import { Service } from 'src/app/models/service.model';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  utilsSvc = inject(UtilsService);

  // Métodos de autenticación
  getAuth() {
    return getAuth();
  }

  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password).catch((error) => {
      console.error('Error al iniciar sesión:', error.message);
      throw error; // Propaga el error para manejarlo en `submit()`
    });
  }

  signUp(credentials: { email: string; password: string }) {
    return createUserWithEmailAndPassword(getAuth(), credentials.email, credentials.password);
  }

  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName });
  }

  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    localStorage.clear();
    this.utilsSvc.routerLink('/auth');
  }

  // Métodos para Firestore
  setDocument(path: string, data: any) {
    try {
      return setDoc(doc(getFirestore(), path), data);
    } catch (error) {
      console.error('Error al guardar el documento:', error);
      throw error;
    }
  }

  async getCollection(path: string): Promise<Service[]> {
    const snapshot = await getDocs(collection(getFirestore(), path));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() as Service }));
  }

  // Corregido: Método con filtro
  async getCollectionWithFilter<T>(collectionPath: string, field: string, operator: string, value: any): Promise<T[]> {
    try {
      const db = getFirestore();
      const q = query(collection(db, collectionPath), where(field, operator as any, value));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T));
    } catch (error) {
      console.error('Error al obtener la colección con filtro:', error);
      throw error;
    }
  }

  async getCollectionWithMultipleFilters<T>(
    collectionPath: string,
    filters: { field: string; operator: string; value: any }[]
): Promise<T[]> {
    try {
        const db = getFirestore();
        let q = query(collection(db, collectionPath));

        // Aplica los filtros dinámicamente
        filters.forEach((filter) => {
            console.log(`Aplicando filtro: ${filter.field} ${filter.operator} ${filter.value}`);
            q = query(q, where(filter.field, filter.operator as any, filter.value));
        });

        // Realiza la consulta
        const querySnapshot = await getDocs(q);

        // Depurar resultados
        const results = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T));
        console.log('Resultados de la consulta con múltiples filtros:', results);

        return results;
    } catch (error) {
        console.error('Error al realizar la consulta con múltiples filtros:', error);
        throw error;
    }
}

  

  async deleteDocument(path: string): Promise<void> {
    return deleteDoc(doc(getFirestore(), path));
  }

  createId(): string {
    const db = getFirestore();
    const ref = doc(collection(db, '_')); // `_` es una colección ficticia temporal
    return ref.id;
  }

  async getDocument(path: string) {
    try {
      const docSnap = await getDoc(doc(getFirestore(), path));
      if (docSnap.exists()) {
        return docSnap.data(); // Retorna los datos del documento
      } else {
        console.warn('El documento no existe en la ruta:', path);
        throw new Error('Documento no encontrado');
      }
    } catch (error) {
      console.error('Error al obtener el documento:', error);
      throw error; // Propaga el error
    }
  }

  async uploadImage(path: string, file: File): Promise<string> {
    try {
      const storage = getStorage();
      const storageRef = ref(storage, path); // Ruta específica para la imagen
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref); // Obtener la URL pública de la imagen
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      throw error;
    }
  }


}
