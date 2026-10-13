import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  Timestamp,
  updateDoc,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '@/services/firebase/config';
import type { Task, TaskInput } from '../types/task';

const tasksCollection = collection(db, 'tasks');

// Timestamp <-> Date conversion lives here
function fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>): Task {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    userId: data.userId,
    title: data.title,
    description: data.description,
    dueDate: data.dueDate ? (data.dueDate as Timestamp).toDate() : null,
    priority: data.priority,
    completed: data.completed,
    createdAt: (data.createdAt as Timestamp).toDate(),
    updatedAt: (data.updatedAt as Timestamp).toDate(),
  };
}

// calls onChange with the full list on every change; returns unsubscribe
export function subscribeToTasks(userId: string, onChange: (tasks: Task[]) => void): () => void {
  const tasksQuery = query(tasksCollection, where('userId', '==', userId));

  return onSnapshot(tasksQuery, (snapshot) => {
    onChange(snapshot.docs.map(fromFirestore));
  });
}

export async function createTask(userId: string, input: TaskInput): Promise<void> {
  const now = Timestamp.now();
  await addDoc(tasksCollection, {
    userId,
    title: input.title,
    description: input.description,
    dueDate: input.dueDate ? Timestamp.fromDate(input.dueDate) : null,
    priority: input.priority,
    completed: false,
    createdAt: now,
    updatedAt: now,
  });
}

export async function updateTask(taskId: string, input: TaskInput): Promise<void> {
  await updateDoc(doc(db, 'tasks', taskId), {
    title: input.title,
    description: input.description,
    dueDate: input.dueDate ? Timestamp.fromDate(input.dueDate) : null,
    priority: input.priority,
    updatedAt: Timestamp.now(),
  });
}

export async function setTaskCompleted(taskId: string, completed: boolean): Promise<void> {
  await updateDoc(doc(db, 'tasks', taskId), {
    completed,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteTask(taskId: string): Promise<void> {
  await deleteDoc(doc(db, 'tasks', taskId));
}
