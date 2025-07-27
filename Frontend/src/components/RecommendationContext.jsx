import { createContext, useContext, useEffect, useState } from "react"

export const RecommendationContext = createContext(null);

export const RecommendationProvider = ({children}) => {
    const [recommendation, setRecommendationState] = useState(null)

    useEffect(() => {
        const storedRecommendation = localStorage.getItem('recommendation')
        if(storedRecommendation){
            setRecommendationState(JSON.parse(storedRecommendation))
        }
    }, [])

    const setRecommendation = (recommendationData) => {
        setRecommendationState(recommendationData)
        localStorage.setItem('recommendation', JSON.stringify(recommendationData))
    }

    return (
            <RecommendationContext.Provider value={{recommendation, setRecommendation}}>
                {children}
            </RecommendationContext.Provider>
        )
}

export const useRecommendation = () => useContext(RecommendationContext)