import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportOrdersToExcel = (result) => {
    const rows = result.map(order => {
        return {
            'Order ID': order.merchantOrderId,
            'Customer Name': `${order.customer.firstName} ${order.customer.lastName}`,
            'Email': order.customer.email,
            'Mobile': order.customer.mobile,
            'Payment Method': order.payMode,
            'Payment  Status': order.payStatus,
            'Order Status': order.status,
            'Delivery Type': order.deliveryType,
            'Order Date': new Date(order.orderDate).toLocaleString(),
            'Expected Delivery': new Date(order.expectedDelivery).toLocaleString(),
            'Amount': order.amount,
            'Items': order.items.map(item => `${item.name} (x${item.quantity})`).join(", "),
        };
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const fileBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(fileBlob, "Orders.xlsx");
};
