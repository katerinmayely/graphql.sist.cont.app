-- Base de datos para manejo de cuentas personales

-- Tabla de Usuarios
CREATE TABLE proyecto_expertos.users(
    id INT PRIMARY KEY IDENTITY,
    email VARCHAR(50) UNIQUE NOT NULL,
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    register_date DATE,
    actived_at DATE,
    active BIT DEFAULT 0
)
GO

-- Tabla de Cuentas
CREATE TABLE proyecto_expertos.accounts (
    id INT PRIMARY KEY IDENTITY,
    account_name VARCHAR(100) NOT NULL,
    total DECIMAL(10,2),
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES proyecto_expertos.users(id)
);

-- Tabla de Transacciones
CREATE TABLE proyecto_expertos.transactions (
    id INT PRIMARY KEY IDENTITY,
    transaction_date DATE NOT NULL,
    description VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    account_id INT NOT NULL,
    user_id INT NOT NULL,
    current_balance DECIMAL(10,2)
    FOREIGN KEY (account_id) REFERENCES proyecto_expertos.accounts(id),
    FOREIGN KEY (user_id) REFERENCES proyecto_expertos.users(id)
);

-- Tabla de Etiquetas
CREATE TABLE proyecto_expertos.tags (
    id INT PRIMARY KEY IDENTITY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Tabla de relación Transacciones x Etiquetas
CREATE TABLE proyecto_expertos.transaction_tags (
    transaction_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (transaction_id, tag_id),
    FOREIGN KEY (transaction_id) REFERENCES proyecto_expertos.transactions(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES proyecto_expertos.tags(id) ON DELETE CASCADE
);

-- Tabla de códigos de activación
CREATE TABLE proyecto_expertos.activation_codes(
    id INT PRIMARY KEY IDENTITY,
    email VARCHAR(50) NOT NULL,
    code INT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    expired_at DATETIME NULL DEFAULT DATEADD(DAY, (2), GETDATE())

    CONSTRAINT FK_EMAIL FOREIGN KEY (email) REFERENCES proyecto_expertos.users (email)
)
GO

---------------------------------------------- PROCEDURES

CREATE PROCEDURE proyecto_expertos.create_user
    @Email NVARCHAR(255),
    @FirstName NVARCHAR(100),
    @LastName NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    -- Verificar si el email ya existe
    IF EXISTS (SELECT 1 FROM users WHERE email = @Email)
    BEGIN
        RAISERROR('El email ya está registrado.', 16, 1);
        RETURN;
    END

    -- Insertar el nuevo usuario
    INSERT INTO users (email, firstname, lastname, register_date)
    VALUES (@Email, @FirstName, @LastName, GETDATE());
END;
GO

CREATE PROCEDURE proyecto_expertos.validate_code
    @Email NVARCHAR(255),
    @Code INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- Declarar variables para los resultados
        DECLARE @IsValid BIT = 0;

        -- Comprobar si el código es válido
        IF EXISTS (
            SELECT 1
            FROM proyecto_expertos.activation_codes
            WHERE email = @Email
              AND code = @Code
              AND GETDATE() BETWEEN created_at AND expired_at
        )
        BEGIN
            SET @IsValid = 1;
        END

        -- Retornar el resultado
        SELECT @IsValid AS IsValid;
    END TRY
    BEGIN CATCH
        -- Manejo de errores
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        THROW 50001, @ErrorMessage, 1;
    END CATCH;
END;
GO

CREATE PROCEDURE proyecto_expertos.generate_activation_code
    @email NVARCHAR(255),
    @code INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @N INT = ( SELECT COUNT(*) FROM proyecto_expertos.users WHERE email = @email );

    IF @N > 0
    BEGIN
        INSERT INTO proyecto_expertos.activation_codes ( email, code ) VALUES ( @email, @code );
    END

    SELECT 1 AS completed;

END;
GO