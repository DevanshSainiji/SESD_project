

# Sequence Diagram — Create Sale

```mermaid
sequenceDiagram

actor Staff
participant Frontend
participant Backend
participant DB

Staff->>Frontend: Enter sale info
Frontend->>Backend: POST /sales
Backend->>DB: Get product stock
DB-->>Backend: Stock qty
alt Enough stock
Backend->>DB: Create sale record
Backend->>DB: Update stock
Backend-->>Frontend: Sale confirmed with invoice
Frontend->>Staff: Display invoice
else Out of stock
Backend-->>Frontend: Error
Frontend->>Staff: Show error
end

