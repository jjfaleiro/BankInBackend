const createBank = `
CREATE TABLE IF NOT EXISTS bank (
id INTEGER PRIMARY KEY,
nameBank VARCHAR,
amountTransferred INTEGER DEFAULT 0,
deposit INTEGER DEFAULT 0,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO bank(id, nameBank)
  SELECT 1, 'BankIn'
    WHERE NOT EXISTS (SELECT 1 FROM bank WHERE id = 1);

`

module.exports = createBank
