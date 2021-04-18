const setSearchKeyWord = keyword => {
    keyword = keyword.toLowerCase()
    return {
        type: 'SET_KEYWORD',
        keyword: keyword
    }
}

const setOpenModalFunction = (openModal) => {
    return {
        type: 'SET_OPEN_MODAL',
        openModal: openModal,
    }
}

const setCleanupFunction = cleanup => {
    return {
        type: 'SET_CLEANUP',
        cleanup: cleanup
    }
}

export {setSearchKeyWord, setOpenModalFunction, setCleanupFunction}