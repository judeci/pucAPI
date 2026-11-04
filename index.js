/* ============================================================
   SERVER 
   ============================================================ */
require("dotenv").config();

const express = require("express");
const sql = require("mssql/msnodesqlv8");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname)); // need to change/remove this ?

// sql db:
// WINDOWS AUTH
const config = {
  connectionString: `Driver={ODBC Driver 18 for SQL Server};Server=${process.env.DB_HOST};Database=${process.env.DB_NAME};Trusted_Connection=yes;TrustServerCertificate=yes;`,
};

// const config2 = {
//   connectionString: `Driver={ODBC Driver 18 for SQL Server};Server=${process.env.DB_HOST};Database=${process.env.DB_NAME_2};Trusted_Connection=yes;TrustServerCertificate=yes;`,
// };   NEED TO PUT BACK ?

// connect once at startup and reuse the pool. don't connect per request.
const poolPromise = sql
  .connect(config)
  .then((pool) => {
    console.log("Connected to SQL Server");
    return pool;
  })
  .catch((err) => {
    console.error("Connection failed:", err.message);
    process.exit(1);
  });

// for the other DB
// const poolPromise2 = sql
//   .connect(config)
//   .then((pool) => {
//     console.log("Connected to SQL Server");
//     return pool;
//   })
//   .catch((err) => {
//     console.error("Connection failed:", err.message);
//     process.exit(1);
//   });   need to PUT BACK?

/* ---------- one row by cid ---------- */
// for table tbl_Master_Student_Accepted
app.get("/dbo.tbl_Master_Student_Accepted/:cid", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("cid", sql.NVarChar, req.params.cid)
      .query(
        // "SELECT * FROM dbo.tbl_Master_Student_Accepted WHERE Student_CID = @cid",
        "SELECT Student_CID, Student_Name, Student_Name_Ar, Student_Country_Name_En, Student_Country_Name_Ar, Student_Major_En, Student_Major_Ar, Stop_Scholarship_Flag, Stop_Scholarship_Date, Student_Accepted_Date, Student_Plan_Desc, Student_Plan_Year FROM dbo.tbl_Master_Student_Accepted WHERE Student_CID = @cid",
      );

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "No student found with that ID" });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

// for table name student_transaction:
app.get("/dbo.student_transaction/:cid", async (req, res) => {
  try {
    const pool = await poolPromise;
    // change to poolPromise2 if put it back

    const result = await pool
      .request()
      .input("cid", sql.NVarChar, req.params.cid)
      .query(
        // "SELECT * FROM MOHE.dbo.student_transaction WHERE Student_CID = @cid",
        "SELECT Student_Name_Ar, Student_CID, Modified_Date, Transaction_Subject FROM MOHE.dbo.student_transaction WHERE Student_CID = @cid",
      );

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "No student found with that ID" });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

/* ---------- start ---------- */
app.listen(PORT, () => {
  console.log(`API is running at http://localhost:${PORT}`);
});
