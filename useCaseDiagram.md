# Use Case Diagram

```mermaid
flowchart TD

Admin --> ManageUsers
Admin --> ViewReports
Admin --> ManageInventory
Admin --> ManageSuppliers

Staff --> CreateBill
Staff --> ManageCustomers
Staff --> ViewInventory

ManageInventory --> AddProduct
ManageInventory --> UpdateProduct
ManageInventory --> DeleteProduct

CreateBill --> GenerateInvoice
CreateBill --> UpdateStock
