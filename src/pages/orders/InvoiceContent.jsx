import React from 'react'
import { format } from 'date-fns'

const InvoiceContent = ({ order }) => {
    return (
        <div id="invoice-content" className="hidden" >
            <div className="p-8 bg-white">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-2xl font-bold">INVOICE</h1>
                        <p className="text-neutral-600 mt-1">Invoice #{order?.merchantOrderId}</p>
                        <p className="text-neutral-600">Date: {order?.orderDate ? format(new Date(order?.orderDate), 'MMMM dd, yyyy') : 'NA'}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-semibold">Tesuto Leather</h2>
                        <p>123 Leather Lane</p>
                        <p>Craftsville, CA 90210</p>
                        <p>info@tesutoleather.com</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-8 mb-8">
                    <div>
                        <h3 className="font-semibold mb-2">Bill To:</h3>
                        <p className="font-semibold">{order?.billAddress?.fullName}</p>
                        <p>{order?.billAddress?.street}</p>
                        <p>{order?.billAddress?.city}, {order?.billAddress?.state} {order?.billAddress?.zip}</p>
                        <p>{order?.billAddress?.country}</p>
                        <p className="mt-2">{order?.userId?.email}</p>
                        {order?.billAddress?.phoneNumber && <p>{order?.billAddress?.phoneNumber}</p>}
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Ship To:</h3>
                        <p className="font-semibold">{order?.shipAddress?.fullName}</p>
                        <p>{order?.shipAddress?.street}</p>
                        <p>{order?.shipAddress?.city}, {order?.shipAddress?.state} {order?.shipAddress?.zip}</p>
                        <p>{order?.shipAddress?.country}</p>
                        {order?.shipAddress?.phoneNumber && <p className="mt-2">{order?.shipAddress?.phoneNumber}</p>}
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Payment Information:</h3>
                        <p><span className="font-medium">Method:</span> {order?.payMode}</p>
                        <p><span className="font-medium">Status:</span> Paid</p>
                        <p><span className="font-medium">Date:</span> {order?.orderDate ? format(new Date(order?.orderDate), 'MMMM dd, yyyy') : 'NA'}</p>
                    </div>
                </div>

                <table className="w-full mb-8 border-collapse">
                    <thead>
                        <tr className="bg-neutral-100">
                            <th className="p-2 text-left border border-neutral-300">Item</th>
                            <th className="p-2 text-right border border-neutral-300">Price</th>
                            <th className="p-2 text-right border border-neutral-300">Quantity</th>
                            <th className="p-2 text-right border border-neutral-300">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order?.items.map((item, index) => (
                            <tr key={index}>
                                <td className="p-2 border border-neutral-300">{item.name}</td>
                                <td className="p-2 text-right border border-neutral-300">₹{item.price?.toFixed(2)}</td>
                                <td className="p-2 text-right border border-neutral-300">{item.quantity}</td>
                                <td className="p-2 text-right border border-neutral-300">₹{(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex justify-end mb-8">
                    <div className="w-64">
                        <div className="flex justify-between py-2">
                            <span>Subtotal:</span>
                            <span>₹{order?.subTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span>Shipping:</span>
                            <span>₹{order?.deliveryCharge.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span>Tax:</span>
                            <span>₹{order?.totalTax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span>Discount:</span>
                            <span>₹{order?.discount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between py-2 font-bold border-t border-neutral-300">
                            <span>Total:</span>
                            <span>₹{order?.amount?.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="text-center text-sm text-neutral-600 mt-16">
                    <p>Thank you for your business!</p>
                    <p>For any questions regarding this invoice, please contact us at support@tesutoleather.com</p>
                </div>
            </div>
        </div>
    )
}

export default InvoiceContent