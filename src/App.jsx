import { useState } from "react"
import CustomerForm from "./component/CustomerForm"
import CustomerList from "./component/CustomerList"

function App() {
  const [editingCustomer, setEditingCustomer] = useState(null)

  return (
    <div className="">
        <h1 className="bg-black text-white text-5xl font-extrabold text-center">Customer Management</h1>
        <CustomerForm customer={editingCustomer} onClose={() => setEditingCustomer(null)} />
        <CustomerList onEdit={(customer) => setEditingCustomer(customer)} />
    </div>
  )
}

export default App
