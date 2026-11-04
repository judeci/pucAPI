/* ============================================================
   BROWSER — runs in the page, loaded by index.html
   ============================================================ */

// //////////////////////////////////////////////
// create variables for the html elements

// const outputElement = document.getElementById("student-output");
const outputElement = document.getElementById("student-output2");
const hiddenContainer = document.getElementById("hidden-container");
const outputElementMsg = document.getElementById("student-output-msg");
const containerDiv = document.querySelector(".container");
const searchBtn = document.getElementById("search-btn");
const idInput = document.getElementById("idnum");

// //////////////////////////////////////////////
// function runs when u search a CID

async function lookupStudent() {
  const studentID = idInput.value.trim();
  if (!studentID) {
    showMessage("Please enter a Civil ID.");
    return;
  }

  showMessage("Searching…");

  try {
    const response = await fetch(
      `/dbo.tbl_Master_Student_Accepted/${studentID}`,
    );
    const response2 = await fetch(`/dbo.student_transaction/${studentID}`);

    if (response.status === 404) {
      showMessage("No student found with that ID.");
      return;
    }
    if (!response.ok) {
      throw new Error("Request failed");
    }

    const data = await response.json();
    const data2 = await response2.json();

    console.log(data);
    console.log(data2);

    outputElement.innerHTML = `
        <p>ID: ${data.Student_CID}</p>
        <p>Name: ${data.Student_Name}</p>
        <p>${data.Student_Name_Ar}</p>
        <p class="separate-output2">Country: ${data.Student_Country_Name_En} , ${data.Student_Country_Name_Ar}</p>
        <p>Studying: ${data.Student_Major_En} , ${data.Student_Major_Ar}</p>
        <p>Accepted on: ${data.Student_Accepted_Date ? data.Student_Accepted_Date : "long ago.."}</p>
        <p>Plan: ${data.Student_Plan_Desc} - ${data.Student_Plan_Year}</p>
        <p>${data.Stop_Scholarship_Flag == 1 ? `Status: غير مقيد` : "Status: مقيد"}</p>
        <p>Transactions: ${data2.Transaction_Subject ? data2.Transaction_Subject : "none"} <br> ${data2.Modified_Date ? data2.Modified_Date : "none"}</p>

        <button id="back-btn-inner2">Search again</button>
    `;

    // ////////////////////////////////////////////
    // for BETTER CSS AND VISUALS:
    //   outputElement.innerHTML = `
    //     <p>ID: ${data.Student_CID}</p>
    //     <p>Name: ${data.Student_Name}</p>
    //     <p>${data.Student_Name_Ar}</p>
    //     <p class="separate-output">Country: ${data.Student_Country_Name_En} , ${data.Student_Country_Name_Ar}</p>
    //     <p>Studying: ${data.Student_Major_En} , ${data.Student_Major_Ar}</p>
    //     <p>Accepted on: ${data.Student_Accepted_Date ? data.Student_Accepted_Date : "long ago.."}</p>
    //     <p>Plan: ${data.Student_Plan_Desc} - ${data.Student_Plan_Year}</p>
    //     <p>${data.Stop_Scholarship_Flag == 1 ? ` مقيد` : "Status: غير مقيد"}</p>
    //     <p>Transactions: ${data2.Transaction_Subject ? data2.Transaction_Subject : "none"} - ${data2.Modified_Date ? data2.Modified_Date : "none"}</p>

    //     <button id="back-btn-inner">Search again</button>
    // `;

    containerDiv.classList.add("hidden");
    outputElement.classList.remove("hidden");
    hiddenContainer.classList.remove("hidden");

    // /////////////////////////////////////////////
    // BETTER CSS
    // document.getElementById("back-btn-inner").addEventListener("click", goBack);
    document
      .getElementById("back-btn-inner2")
      .addEventListener("click", goBack);
  } catch (error) {
    console.error(error);
    showMessage("Could not reach the server.");
  }
}

// //////////////////////////////////////////////
// function for the error message

function showMessage(text) {
  outputElementMsg.textContent = text;
  outputElementMsg.classList.remove("hidden");
}

// //////////////////////////////////////////////
// function for the back button to look up a different CID

function goBack() {
  containerDiv.classList.remove("hidden");
  outputElementMsg.classList.add("hidden");
  outputElement.classList.add("hidden");
  hiddenContainer.classList.add("hidden");

  idInput.value = "";
  idInput.focus();
}

// //////////////////////////////////////////////
// call the lookup function when clicking the search button

searchBtn.addEventListener("click", lookupStudent);

/* enter key to search too, not just clicking search button */
idInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") lookupStudent();
});
