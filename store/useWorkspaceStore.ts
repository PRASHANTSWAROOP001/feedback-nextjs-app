import { create } from "zustand";
import { persist } from "zustand/middleware"
// 1️⃣ Define the shape of the store
interface WorkspaceState {
    workspaceId: string | null;
    setWorkspaceId: (id: string) => void;
}

// 2️⃣ Create the Zustand store with initial state and an updater function
export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      workspaceId: null,
      setWorkspaceId: (id: string) => set({ workspaceId: id }),
    }),
    {
      name: "workspace-storage", // localStorage key
    }
  )
)
