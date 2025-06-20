import { create } from "zustand";

// 1️⃣ Define the shape of the store
interface WorkspaceState {
    workspaceId: string | null;
    setWorkspaceId: (id: string) => void;
}

// 2️⃣ Create the Zustand store with initial state and an updater function
export const useWorkspaceStore = create<WorkspaceState>((set) => ({
    workspaceId: null, // ✅ This is the initial state of the store
    setWorkspaceId: (id: string) => set({ workspaceId: id }) // ✅ This is like an action — but simpler
}));
