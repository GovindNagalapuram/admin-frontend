export const openOrCloseModalAction = (openOrCloseModal, modalType, modalData) => {

    let data;

    if (openOrCloseModal === "open") data = { showModal: true, modalType, modalData: modalData }
    else data = { showModal: false, modalType, modalData: modalData }

    return {
        type: "OPEN_OR_CLOSE_STATUS",
        payload: data
    }
}