const orders = [
  {
    id: 1,
    customer: 'Amara Okafor',
    email: 'amara@gmail.com',
    address: '12 Lagos Island, Lagos',
    status: 'pending',
    total: 45000,
    date: '2026-05-01',
    items: [
      { name: 'Wireless Earbuds', quantity: 2, price: 15000 },
      { name: 'Protein Supplement', quantity: 1, price: 12000 },
    ],
  },
  {
    id: 2,
    customer: 'Chidi Nwosu',
    email: 'chidi@gmail.com',
    address: '5 Wuse Zone 3, Abuja',
    status: 'completed',
    total: 25000,
    date: '2026-05-02',
    items: [
      { name: 'Leather Handbag', quantity: 1, price: 25000 },
    ],
  },
  {
    id: 3,
    customer: 'Fatima Aliyu',
    email: 'fatima@gmail.com',
    address: '8 Ring Road, Ibadan',
    status: 'processing',
    total: 8000,
    date: '2026-05-03',
    items: [
      { name: 'Scented Candle Set', quantity: 1, price: 8000 },
    ],
  },
  {
    id: 4,
    customer: 'Emeka Eze',
    email: 'emeka@gmail.com',
    address: '3 GRA, Port Harcourt',
    status: 'pending',
    total: 27000,
    date: '2026-05-04',
    items: [
      { name: 'Wireless Earbuds', quantity: 1, price: 15000 },
      { name: 'Scented Candle Set', quantity: 1, price: 8000 },
      { name: 'Protein Supplement', quantity: 1, price: 12000 },
    ],
  },
]

export default orders