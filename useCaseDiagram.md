# Use Case Diagram

```mermaid
flowchart TD

User --> Login
Login --> Dashboard

Dashboard --> ViewInventory
Dashboard --> CreateSale
Dashboard --> ManageProducts
Dashboard --> ViewReports

Admin --> ManageUsers
Admin --> ManageSuppliers
