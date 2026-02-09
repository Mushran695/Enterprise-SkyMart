export const getAdminStats = async () => {
  return {
    revenue: 269000,
    orders: 748,
    users: 312,
    conversion: 3.4,
  }
}

export const getOrderStats = async () => {
  return [
    { month: "Jan", orders: 120 },
    { month: "Feb", orders: 98 },
    { month: "Mar", orders: 150 },
    { month: "Apr", orders: 180 },
  ]
}

export const getRevenueStats = async () => {
  return [
    { month: "Jan", revenue: 42000 },
    { month: "Feb", revenue: 38000 },
    { month: "Mar", revenue: 52000 },
    { month: "Apr", revenue: 67000 },
  ]
}

export const getCategoryStats = async () => {
  return [
    { name: "Fashion", value: 45 },
    { name: "Electronics", value: 30 },
    { name: "Beauty", value: 15 },
    { name: "Wellness", value: 10 },
  ]
}
