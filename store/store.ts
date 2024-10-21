import { create } from 'zustand';


type User = {
    id: string;
    email: string;
}

type Prompt = {
    id: string;
    title: string;
    description: string;
}

export const useStore = create((set) => ({
    user_id: [],
    setUser: (user_id: string[]) => set({ user_id }),

    prompts: [],
    setPrompts: (prompts: Prompt[]) => set({ prompts }),
}));
