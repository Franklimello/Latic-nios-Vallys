import { initializeApp, getApps } from "firebase/app";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { demoProducts, demoRecipes, demoHighlights } from "@/interfaces/catalog";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const isFirebaseConfigured = [
  firebaseConfig.apiKey,
  firebaseConfig.authDomain,
  firebaseConfig.projectId,
  firebaseConfig.storageBucket,
  firebaseConfig.messagingSenderId,
  firebaseConfig.appId,
].every(Boolean);

const app = isFirebaseConfigured
  ? getApps().length
    ? getApps()[0]
    : initializeApp(firebaseConfig)
  : null;

export const db = app ? getFirestore(app) : null;
export const auth = app ? getAuth(app) : null;
export const analytics = typeof window !== "undefined" && app ? getAnalytics(app) : null;

function cleanPayload(payload) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined),
  );
}

async function readCollection(collectionName, fallback) {
  if (!db) {
    return fallback;
  }

  const snapshot = await getDocs(collection(db, collectionName));

  const firestoreDocs = snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));

  // Merge fallback items that do not exist in Firestore yet
  const merged = [...firestoreDocs];
  fallback.forEach((item) => {
    if (!firestoreDocs.some((d) => d.id === item.id)) {
      merged.push(item);
    }
  });

  // Sort by `order` field when present, then by createdAt as fallback
  merged.sort((a, b) => {
    const orderA = typeof a.order === "number" ? a.order : Infinity;
    const orderB = typeof b.order === "number" ? b.order : Infinity;
    if (orderA !== Infinity || orderB !== Infinity) {
      return orderA - orderB;
    }
    // Fallback: sort by createdAt desc for items without order
    const getVal = (x) => {
      if (x.createdAt?.seconds) return x.createdAt.seconds;
      if (x.updatedAt?.seconds) return x.updatedAt.seconds;
      return 0;
    };
    const valA = getVal(a);
    const valB = getVal(b);
    if (valA !== 0 && valB !== 0) {
      return valB - valA;
    }
    if (valA !== 0) return -1;
    if (valB !== 0) return 1;
    return 0;
  });

  return merged;
}

export function watchAdminUser(callback) {
  if (!auth) {
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, callback);
}

export async function loginAdmin(email, password) {
  if (!auth) {
    throw new Error("Configure o Firebase Auth em .env.local.");
  }

  return signInWithEmailAndPassword(auth, email, password);
}

export async function logoutAdmin() {
  if (!auth) {
    return;
  }

  return signOut(auth);
}

// Caching helper functions (safe for Server Side Rendering)
function getStoredCache(key) {
  if (typeof window === "undefined") return null;
  try {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

function setStoredCache(key, value) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // Ignore quota/security errors
  }
}

function clearStoredCache(key) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(key);
  } catch (e) {
    // Ignore
  }
}

export async function getProducts() {
  const cached = getStoredCache("vallys_products");
  if (cached) {
    return cached;
  }
  const data = await readCollection("products", demoProducts);
  setStoredCache("vallys_products", data);
  return data;
}

export async function createProduct(product) {
  if (!db) {
    throw new Error("Configure o Firebase para salvar produtos.");
  }
  const category = product.category || "Outros";
  const snapshot = await getDocs(collection(db, "products"));
  const categoryCount = snapshot.docs.filter(
    (doc) => (doc.data().category || "Outros") === category
  ).length;
  const result = await addDoc(collection(db, "products"), {
    ...cleanPayload(product),
    order: categoryCount,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  clearStoredCache("vallys_products");
  return result;
}

export async function updateProduct(id, product) {
  if (!db) {
    throw new Error("Configure o Firebase para atualizar produtos.");
  }
  const result = await setDoc(doc(db, "products", id), {
    ...cleanPayload(product),
    updatedAt: serverTimestamp(),
  }, { merge: true });
  clearStoredCache("vallys_products");
  return result;
}

export async function deleteProduct(id) {
  if (!db) {
    throw new Error("Configure o Firebase para excluir produtos.");
  }
  const result = await deleteDoc(doc(db, "products", id));
  clearStoredCache("vallys_products");
  return result;
}

export async function getRecipes() {
  const cached = getStoredCache("vallys_recipes");
  if (cached) {
    return cached;
  }
  const data = await readCollection("recipes", demoRecipes);
  setStoredCache("vallys_recipes", data);
  return data;
}

export async function createRecipe(recipe) {
  if (!db) {
    throw new Error("Configure o Firebase para salvar receitas.");
  }
  const result = await addDoc(collection(db, "recipes"), {
    ...cleanPayload(recipe),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  clearStoredCache("vallys_recipes");
  return result;
}

export async function updateRecipe(id, recipe) {
  if (!db) {
    throw new Error("Configure o Firebase para atualizar receitas.");
  }
  const result = await setDoc(doc(db, "recipes", id), {
    ...cleanPayload(recipe),
    updatedAt: serverTimestamp(),
  }, { merge: true });
  clearStoredCache("vallys_recipes");
  return result;
}

export async function deleteRecipe(id) {
  if (!db) {
    throw new Error("Configure o Firebase para excluir receitas.");
  }
  const result = await deleteDoc(doc(db, "recipes", id));
  clearStoredCache("vallys_recipes");
  return result;
}

export async function getHighlights() {
  const cached = getStoredCache("vallys_highlights");
  if (cached) {
    return cached;
  }
  const data = await readCollection("highlights", demoHighlights);
  setStoredCache("vallys_highlights", data);
  return data;
}

export async function createHighlight(highlight) {
  if (!db) {
    throw new Error("Configure o Firebase para salvar destaques.");
  }
  const snapshot = await getDocs(collection(db, "highlights"));
  const nextOrder = snapshot.size;
  const result = await addDoc(collection(db, "highlights"), {
    ...cleanPayload(highlight),
    order: nextOrder,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  clearStoredCache("vallys_highlights");
  return result;
}

export async function updateHighlight(id, highlight) {
  if (!db) {
    throw new Error("Configure o Firebase para atualizar destaques.");
  }
  const result = await setDoc(doc(db, "highlights", id), {
    ...cleanPayload(highlight),
    updatedAt: serverTimestamp(),
  }, { merge: true });
  clearStoredCache("vallys_highlights");
  return result;
}

export async function deleteHighlight(id) {
  if (!db) {
    throw new Error("Configure o Firebase para excluir destaques.");
  }
  const result = await deleteDoc(doc(db, "highlights", id));
  clearStoredCache("vallys_highlights");
  return result;
}

// ─── Ordering helpers ─────────────────────────────────────────────

const cacheKeyMap = {
  products: "vallys_products",
  highlights: "vallys_highlights",
  recipes: "vallys_recipes",
};

/**
 * Swap the `order` field of two items in a Firestore collection.
 */
export async function swapOrder(collectionName, idA, orderA, idB, orderB) {
  if (!db) {
    throw new Error("Configure o Firebase para reordenar.");
  }

  const batch = writeBatch(db);
  batch.update(doc(db, collectionName, idA), { order: orderB });
  batch.update(doc(db, collectionName, idB), { order: orderA });
  await batch.commit();

  clearStoredCache(cacheKeyMap[collectionName] || collectionName);
}

/**
 * Re-index the `order` field of all items in a collection (0, 1, 2, ...).
 * Useful after deleting an item to keep order contiguous.
 */
export async function reindexOrders(collectionName, orderedIds) {
  if (!db) {
    throw new Error("Configure o Firebase para reindexar.");
  }

  const batch = writeBatch(db);
  orderedIds.forEach((id, index) => {
    batch.update(doc(db, collectionName, id), { order: index });
  });
  await batch.commit();

  clearStoredCache(cacheKeyMap[collectionName] || collectionName);
}

/**
 * Ensure a demo/fallback item exists in Firestore so it can be reordered.
 * Creates the document using the item's hardcoded id if it doesn't exist yet.
 */
export async function ensurePersisted(collectionName, item, order) {
  if (!db) {
    throw new Error("Configure o Firebase.");
  }

  const { id, ...data } = item;
  await setDoc(doc(db, collectionName, id), {
    ...cleanPayload(data),
    order,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  clearStoredCache(cacheKeyMap[collectionName] || collectionName);
}

/**
 * Atomically initialize orders for a list of items and swap two target items.
 */
export async function initializeAndSwap(collectionName, orderedIds, idA, indexA, idB, indexB) {
  if (!db) {
    throw new Error("Configure o Firebase.");
  }

  const batch = writeBatch(db);
  orderedIds.forEach((id, index) => {
    let targetOrder = index;
    if (id === idA) {
      targetOrder = indexB;
    } else if (id === idB) {
      targetOrder = indexA;
    }
    batch.update(doc(db, collectionName, id), { order: targetOrder });
  });
  await batch.commit();

  clearStoredCache(cacheKeyMap[collectionName] || collectionName);
}

/**
 * Salva a candidatura de um interessado no Trabalhe Conosco na coleção 'candidates' do Firestore.
 */
export async function saveCandidate(candidate) {
  if (!db) {
    throw new Error("Configure o Firebase para salvar currículos.");
  }
  return await addDoc(collection(db, "candidates"), {
    ...cleanPayload(candidate),
    createdAt: serverTimestamp(),
  });
}

