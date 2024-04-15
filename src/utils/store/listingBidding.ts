import {create} from "zustand"
import {createJSONStorage, persist} from 'zustand/middleware'

type BiddingState={
    step:number;
    setStep: (step:number)=> void;
}

export const useBidding = create<BiddingState>()(
    persist(
        (set)=>({
            step: 0,
            setStep:(step:number)=>{
                set((state)=>({...state,step}))
            }
        }),
        {
            name: "bidding-state",
            storage:createJSONStorage(()=> sessionStorage),
        }
    )
)