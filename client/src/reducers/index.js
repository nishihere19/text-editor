import {combineReducers} from "redux";

const searchKeyWordReducer = (keyword = '', action) => {
    if (action.type === 'SET_KEYWORD') {
        return action.keyword
    }

    return keyword
}

const openModalFunctionReducer = (openModalFunction = () => {}, action) => {
    if (action.type === 'SET_OPEN_MODAL') {
        return action.openModal
    }

    return openModalFunction
}

const cleanupReducer = (cleanup = async () => {}, action) => {
    if (action.type === 'SET_CLEANUP') {
        return action.cleanup
    }

    return cleanup
}

export default combineReducers({
    keyword: searchKeyWordReducer,
    openModalFunction: openModalFunctionReducer,
    cleanup: cleanupReducer
})