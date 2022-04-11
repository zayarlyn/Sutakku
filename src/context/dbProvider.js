import { createContext, useContext } from "react";
import app from "../firebaseConfig";
import { useAuth } from "./authProvider";
import {
  getFirestore,
  serverTimestamp,
  onSnapshot,
  doc,
  collection,
  query,
  orderBy,
  setDoc,
  getDoc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
const dbCtx = createContext({});
export const useDB = () => useContext(dbCtx);

const metadata = () => ({ created: serverTimestamp(), modified: serverTimestamp() });
const db = getFirestore(app);

function DbProvider({ children }) {
  const { getUser, user } = useAuth();

  const listenToStacks = (setStacks) => {
    const q = query(collection(db, "users", user.reloadUserInfo.screenName, "stacks"), orderBy("created"));
    return onSnapshot(q, snapshot => {
      const ideas = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setStacks(ideas);
    })
  };
  
  const listenToStack = (stackId, setStack) => {
    const q = doc(db, "users", user.reloadUserInfo.screenName, "stacks", stackId);
    return onSnapshot(q, (snapshot) => {
      const stack = { id: snapshot.id, ...snapshot.data() };
      setStack(stack);
    });
  };

  const listenToIdeas = (stackId, setIdeas, order) => {
    const q = query(collection(db, "users", user.reloadUserInfo.screenName, "stacks", stackId, "ideas"), orderBy(order));
    return onSnapshot(q, snapshot => {
      const ideas = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setIdeas(ideas);
    })
  };

  const createUser = async () => {
    const user = getUser(); //
    const path = "users/" + user.reloadUserInfo.screenName;
    const alreadyExist = await getDoc(doc(db, path));
    if (alreadyExist.exists()) return;
    return setDoc(doc(db, path), {
      username: user.displayName,
      ...metadata(),
    });
  };

  const createStack = async (repo, url) => {
    const user = getUser(); //
    const path = "users/" + user.reloadUserInfo.screenName + "/stacks";
    return addDoc(collection(db, path), { name: repo, url: url, ...metadata() });
  };

  const createIdea = (stackId, new_data) => {
    const path = collection(db, "users", user.reloadUserInfo.screenName, "stacks", stackId, "ideas");
    return addDoc(path, { ...new_data, ...metadata() });
  };

  const updateIdea = async (stackId, id, new_data) => {
    const path = doc(db, "users", user.reloadUserInfo.screenName, "stacks", stackId, "ideas", id);
    return updateDoc(path, { ...new_data, modified: serverTimestamp() });
  };

  const value = { createUser, createStack, createIdea, updateIdea, listenToStacks, listenToIdeas, listenToStack };
  return <dbCtx.Provider value={value}>{children}</dbCtx.Provider>;
}

export default DbProvider;
