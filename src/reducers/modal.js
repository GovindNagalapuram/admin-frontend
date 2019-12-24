const openOrCloseModalReducer = (state = {}, action) => {
    switch (action.type) {
        case "OPEN_OR_CLOSE_STATUS":
            return {
                ...state,
                ...action.payload
            }
    }

    return state;
}

export default openOrCloseModalReducer;