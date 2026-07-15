-- Tables for Sales and SaleItems
IF OBJECT_ID('dbo.Sales', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Sales (
        SaleID INT IDENTITY(1,1) PRIMARY KEY,
        Invoice NVARCHAR(100) NOT NULL,
        CustomerName NVARCHAR(200) NULL,
        SalespersonID INT NULL,
        PaymentMethod NVARCHAR(50) NULL,
        Status NVARCHAR(50) NULL,
        TotalAmount DECIMAL(18,2) NOT NULL,
        Date NVARCHAR(50) NULL
    );
END

IF OBJECT_ID('dbo.SaleItems', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.SaleItems (
        SaleItemID INT IDENTITY(1,1) PRIMARY KEY,
        SaleID INT NOT NULL,
        ProductID INT NOT NULL,
        Name NVARCHAR(300) NULL,
        Quantity INT NOT NULL,
        Price DECIMAL(18,2) NOT NULL,
        CONSTRAINT FK_SaleItems_Sales FOREIGN KEY (SaleID) REFERENCES dbo.Sales(SaleID)
    );
END

GO

-- Get all sales with items (joins repeated rows for items)
CREATE OR ALTER PROCEDURE dbo.sp_GetAllSales
AS
BEGIN
    SELECT s.SaleID, s.Invoice, s.CustomerName, sp.Name AS SalespersonName, s.PaymentMethod, s.Status, s.TotalAmount, s.Date,
           si.SaleItemID, si.ProductID, si.Name AS ItemName, si.Quantity, si.Price
    FROM dbo.Sales s
    LEFT JOIN dbo.SaleItems si ON si.SaleID = s.SaleID
    LEFT JOIN dbo.Salespersons sp ON sp.SalespersonID = s.SalespersonID
    ORDER BY s.SaleID DESC
END

GO

CREATE OR ALTER PROCEDURE dbo.sp_GetSaleById
    @SaleID INT
AS
BEGIN
    SELECT s.SaleID, s.Invoice, s.CustomerName, sp.Name AS SalespersonName, s.PaymentMethod, s.Status, s.TotalAmount, s.Date,
           si.SaleItemID, si.ProductID, si.Name AS ItemName, si.Quantity, si.Price
    FROM dbo.Sales s
    LEFT JOIN dbo.SaleItems si ON si.SaleID = s.SaleID
    LEFT JOIN dbo.Salespersons sp ON sp.SalespersonID = s.SalespersonID
    WHERE s.SaleID = @SaleID
END

GO

CREATE OR ALTER PROCEDURE dbo.sp_InsertSale
    @Invoice NVARCHAR(100),
    @CustomerName NVARCHAR(200),
    @SalespersonID INT = NULL,
    @PaymentMethod NVARCHAR(50) = NULL,
    @Status NVARCHAR(50) = NULL,
    @TotalAmount DECIMAL(18,2),
    @Date NVARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO dbo.Sales (Invoice, CustomerName, SalespersonID, PaymentMethod, Status, TotalAmount, Date)
    VALUES (@Invoice, @CustomerName, @SalespersonID, @PaymentMethod, @Status, @TotalAmount, @Date);
    SELECT SCOPE_IDENTITY();
END

GO

CREATE OR ALTER PROCEDURE dbo.sp_InsertSaleItem
    @SaleID INT,
    @ProductID INT,
    @Name NVARCHAR(300),
    @Quantity INT,
    @Price DECIMAL(18,2)
AS
BEGIN
    INSERT INTO dbo.SaleItems (SaleID, ProductID, Name, Quantity, Price)
    VALUES (@SaleID, @ProductID, @Name, @Quantity, @Price);
END

GO

CREATE OR ALTER PROCEDURE dbo.sp_RefundSale
    @SaleID INT
AS
BEGIN
    -- mark sale as refunded
    UPDATE dbo.Sales SET Status = 'Refunded' WHERE SaleID = @SaleID;
    -- optionally restore stock quantities here by joining SaleItems
    -- This script does not modify Product stock; handle in application if needed
END

GO

CREATE OR ALTER PROCEDURE dbo.sp_DeleteSale
    @SaleID INT
AS
BEGIN
    DELETE FROM dbo.SaleItems WHERE SaleID = @SaleID;
    DELETE FROM dbo.Sales WHERE SaleID = @SaleID;
END

GO
