import { useDispatch, useSelector } from "react-redux"
import { deleteCustomer } from "../slices/customerSlice";

const CustomerList = ({onEdit}) =>{
    const customers = useSelector((state) => state.customers.list);
    const dispatch = useDispatch;

    return(
        <div>
            <h2 className="text-3xl font-extrabold">Customer List</h2>
            <table className="table-fixed">
                <thead>
                    <tr>
                        <th>Pan</th>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        customers.map((customer) => (
                            <tr>
                                <td>{customers.pan}</td>
                                <td>{customers.fullName}</td>
                                <td>{customers.email}</td>
                                <td>{customers.mobile}</td>
                                <td>
                                    <button onClick={() => onEdit(customer)}>Edit</button>
                                    <button onClick={() => dispatch(deleteCustomer(customer))}>Delete</button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default CustomerList;