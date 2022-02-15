const responseHandler = (res, options = {}) => ({
  meta: {
    code: 200,
    error_type: null,
    error_message: null,
    ...options,
  },
  data: res,
})

module.exports.responseHandler = responseHandler
