axios.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.clear()
      window.location.href = "/sign-in"
    }
    return Promise.reject(err)
  }
)
