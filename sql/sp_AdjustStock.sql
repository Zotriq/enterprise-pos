-- =========================================================================
-- INVENTORY ADJUSTMENT STORED PROCEDURE
-- Purpose: Adjust stock quantity for a product with status update
-- =========================================================================

USE POS;
GO

IF OBJECT_ID('dbo.sp_AdjustStock', 'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_AdjustStock;
GO

CREATE PROCEDURE dbo.sp_AdjustStock
    @ProductID INT,
    @NewStockQuantity INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    BEGIN TRY
        -- Validate product exists
        IF NOT EXISTS(SELECT 1 FROM Products WHERE ProductID = @ProductID)
        BEGIN
            THROW 50000, 'Product not found', 1;
        END

        -- Determine new status based on stock quantity
        DECLARE @NewStatus NVARCHAR(20) = 'Active';
        IF @NewStockQuantity <= 0 SET @NewStatus = 'Out';
        ELSE IF @NewStockQuantity <= 15 SET @NewStatus = 'Low';

        -- Update product with new stock and status
        UPDATE Products
        SET 
            StockQuantity = @NewStockQuantity,
            Status = @NewStatus
        WHERE ProductID = @ProductID;

        -- Return updated product details
        SELECT 
            ProductID,
            ProductName,
            StockQuantity,
            Status
        FROM Products
        WHERE ProductID = @ProductID;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO
