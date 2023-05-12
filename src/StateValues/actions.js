export const setOwner=(owner)=> async dispatch =>{
    dispatch({
        type:"SETOWNER",
        payload:owner
    })
}
export const setContract=(contract)=>async dispatch=>{
    dispatch({
        type:"SETCONTRACT",
        payload : contract
    })
}

export const setName=(name)=>async dispatch=>{
    dispatch({
        type:"SETNAME",
        payload:name
    })
}