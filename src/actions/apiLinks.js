// let API_SOCKETS_URL,
   let API_BASE_URL,
   API_ARCH_URL

if(process.env.NODE_ENV === "development"){
    // API_SOCKETS_URL = 'ws://localhost:8000/nes'
    API_BASE_URL = 'http://localhost:8000/'
    API_ARCH_URL = 'http://localhost:5000/'
}

else if (process.env.NODE_ENV === "production"){
    // API_SOCKETS_URL = 'wss://api.rollinglogs.com/nes'
    API_BASE_URL = 'https://api.rollinglogs.com/'
    API_ARCH_URL = 'https://api2.rollinglogs.com/'
}


const API_PATH = 'api/'
const API_URL = API_BASE_URL + API_PATH

export const api = {
    
    ADMIN_LOGIN : API_BASE_URL + API_PATH + 'admin/admin-login',
    ADMIN_DATA : API_BASE_URL + API_PATH + 'admin/get-admin-data',

    CUSTOM_DESIGN_ENQUIRY : API_ARCH_URL + API_PATH + 'admin/get-custom-design-requests', // Get custom design requests
    PRODUCT_QUOTE_REQUEST : API_ARCH_URL + API_PATH + 'admin/get-product-request-quotes', // Get quote requests
    GET_VENDOR_DETAILS : API_ARCH_URL + API_PATH + 'admin/get-product-vendor-detail', // Get vendor details about the product requested
    VENDOR_ONBOARD_REQUESTS : API_ARCH_URL + API_PATH + 'admin/get-vendor-partnership-requests',
    
    GET_ALL_PLACED_ORDERS: API_ARCH_URL + API_PATH + 'orders/fetch-all-placed-orders',

    GET_TOP_VIEWED_SCATS : API_BASE_URL + API_PATH + 'trending/get-top-subcategories', 

    SERVICE_PARTNER_ONBOARD_REQUESTS : API_ARCH_URL + API_PATH + 'service-partner/fetch-all-service-partners',
    
    SERVICE_QUOTE_DATA : API_ARCH_URL + API_PATH + 'enquiry/fetch-all-service-requests',

    CREATE_SERVICE : API_BASE_URL + API_PATH + 'services/new-service',
    DELETE_SERVICE : API_BASE_URL + API_PATH + 'services/delete-service',
    GET_ALL_SERVICE : API_BASE_URL + API_PATH + 'services/fetch-services',
    GET_SERVICE_BY_ID : API_BASE_URL + API_PATH + 'services/fetch-service-by-serviceId',

    UPLOAD_IMAGE: API_BASE_URL + API_PATH + 'common/upload-image',

    SEND_MAIL: API_BASE_URL + API_PATH + 'admin/mail/send-mail',
    FETCH_SENT_MAIL: API_BASE_URL + API_PATH + 'admin/mail/fetch-sent-mail',
    DRAFT_MAIL: API_BASE_URL + API_PATH + 'admin/mail/new-draft-mail',
    FETCH_DRAFT_MAIL: API_BASE_URL + API_PATH + 'admin/mail/fetch-draft-mail',
    DELETE_DRAFT_MAIL: API_BASE_URL + API_PATH + 'admin/mail/delete-draft-mail'
}