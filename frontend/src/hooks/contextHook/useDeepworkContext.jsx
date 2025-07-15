import { useContext } from "react";
import { DeepworkContext } from "../../context/DeepworkContext";

export const useDeepworkContext = () => {
    const context = useContext(DeepworkContext);

    if (!context) {
        throw Error('useDeepworkContext should be inside a DeepworkContextProvider');
    }

    return context;
}; 