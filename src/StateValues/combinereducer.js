import { combineReducers } from "redux";
import addressreducer from './addressreducer';
import abireducer from './abireducer'
const reducer = combineReducers({
    abireducer : abireducer,
    addressreducer : addressreducer
})
export default reducer;