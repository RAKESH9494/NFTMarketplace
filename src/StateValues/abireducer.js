const initial={}
export default function abireducer(state = initial,action){
    const {type,payload} = action;
    switch(type){
        case "SETCONTRACT":
            return {payload};
        default : 
            return state;
    }
}