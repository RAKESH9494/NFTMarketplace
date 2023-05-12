const initial={}
export default function addressreducer(state = initial,action){
    const {type,payload} = action;
    switch(type){
        case "SETADDRESS":
            return {payload};
        default : 
            return state;
    }
}