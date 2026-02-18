![ER Diagram](../er_diagram.png)

```md
# ER Diagram

```mermaid
erDiagram

USERS {
  int id PK
  string name
  string email UNIQUE
  string password
  string role
}

PRODUCTS {
  int id PK
  string name
  string brand
  float price
  int stock
}

CUSTOMERS {
  int id PK
  string name
  string phone
  string email
}

SUPPLIERS {
  int id PK
  string name
  string contact
  string email
}

PURCHASES {
  int id PK
  date date
  int supplier_id FK
  float totalCost
}

PURCHASE_ITEMS {
  int id PK
  int purchase_id FK
  int product_id FK
  int quantity
  float cost
}

SALES {
  int id PK
  date date
  int customer_id FK
  float totalAmount
}

SALE_ITEMS {
  int id PK
  int sale_id FK
  int product_id FK
  int quantity
  float price
}

USERS ||--o{ SALES : creates
CUSTOMERS ||--o{ SALES : places
SALES ||--o{ SALE_ITEMS : contains
PRODUCTS ||--o{ SALE_ITEMS : included_in
SUPPLIERS ||--o{ PURCHASES : supplies
PURCHASES ||--o{ PURCHASE_ITEMS : includes
PRODUCTS ||--o{ PURCHASE_ITEMS : included_in
