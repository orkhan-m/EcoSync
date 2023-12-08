// Wait for the page to load
document.addEventListener("DOMContentLoaded", async () => {
  if (window.ethereum) {
    window.web3 = new Web3(
      new Web3.providers.HttpProvider("http://localhost:7545")
    ); // Ganache's default RPC URL

    // Contract ABI (replace with your contract's ABI)
    const contractAbi = [
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "walletAddress",
            type: "address",
          },
          {
            indexed: false,
            internalType: "string",
            name: "name",
            type: "string",
          },
        ],
        name: "CompanyAdded",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "company1",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "company2",
            type: "address",
          },
          {
            indexed: false,
            internalType: "bool",
            name: "isPartnership",
            type: "bool",
          },
        ],
        name: "EcosystemUpdated",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "observer",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "trustedCompany",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "otherParty",
            type: "address",
          },
          {
            indexed: false,
            internalType: "bool",
            name: "trustGranted",
            type: "bool",
          },
        ],
        name: "TrustChangedForTrustedCompany",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "trustor",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "trustee",
            type: "address",
          },
        ],
        name: "TrustGranted",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "trustor",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "trustee",
            type: "address",
          },
        ],
        name: "TrustRevoked",
        type: "event",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        name: "companies",
        outputs: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "address",
            name: "walletAddress",
            type: "address",
          },
          {
            internalType: "string",
            name: "profilePhoto",
            type: "string",
          },
          {
            internalType: "bool",
            name: "hasToken",
            type: "bool",
          },
          {
            internalType: "string",
            name: "tokenName",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
        constant: true,
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        name: "companyAddresses",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
        constant: true,
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        name: "trustMapping",
        outputs: [
          {
            internalType: "bool",
            name: "isTrusted",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "createdTimestamp",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "removedTimestamp",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
        constant: true,
      },
      {
        inputs: [
          {
            internalType: "string",
            name: "_name",
            type: "string",
          },
          {
            internalType: "string",
            name: "_profilePhoto",
            type: "string",
          },
          {
            internalType: "bool",
            name: "_hasToken",
            type: "bool",
          },
          {
            internalType: "string",
            name: "_tokenName",
            type: "string",
          },
        ],
        name: "addCompany",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_company2",
            type: "address",
          },
          {
            internalType: "bool",
            name: "_isTrusted",
            type: "bool",
          },
        ],
        name: "updateEcosystem",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "totalCompanies",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
        constant: true,
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "index",
            type: "uint256",
          },
        ],
        name: "companyAddressAtIndex",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
        constant: true,
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_company1",
            type: "address",
          },
          {
            internalType: "address",
            name: "_company2",
            type: "address",
          },
        ],
        name: "getTrustInfo",
        outputs: [
          {
            internalType: "bool",
            name: "isTrusted",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "createdTimestamp",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "removedTimestamp",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
        constant: true,
      },
    ];
    // Contract address (replace with your contract's address)
    const contractAddress = "0xD4AFf5446135D86020992b0Aa381Ebc66cF8Ed66";

    // Initialize contract instance
    const contract = new web3.eth.Contract(contractAbi, contractAddress);

    // Get the connected Ethereum account
    const accounts = await web3.eth.getAccounts();
    const account = accounts[1];

    // Function to navigate to the index.html page
    function navigateToIndexPage() {
      window.location.href = "index.html";
    }

    // Function to navigate to the companies.html page
    function navigateToCompaniesPage() {
      window.location.href = "companies.html";
    }

    // Function to navigate to the create-trust.html page
    function navigateToCreateTrustPage() {
      window.location.href = "create-trust.html";
    }

    // Function to navigate to the trust-statistics.html page
    function navigateToTrustStatsPage() {
      window.location.href = "trust-statistics.html";
    }

    // Function to navigate to the events.html page
    function navigateToEventsPage() {
      window.location.href = "events.html";
    }

    // Add event listeners to the buttons for navigation
    const indexPageButton = document.getElementById("indexPageButton");
    const companiesPageButton = document.getElementById("companiesPageButton");
    const createTrustPageButton = document.getElementById(
      "createTrustPageButton"
    );
    const trustStatsPageButton = document.getElementById(
      "trustStatsPageButton"
    );
    const eventsPageButton = document.getElementById("eventsPageButton");

    indexPageButton.addEventListener("click", navigateToIndexPage);
    companiesPageButton.addEventListener("click", navigateToCompaniesPage);
    createTrustPageButton.addEventListener("click", navigateToCreateTrustPage);
    trustStatsPageButton.addEventListener("click", navigateToTrustStatsPage);
    eventsPageButton.addEventListener("click", navigateToEventsPage);

    // Check if the current page is companies.html and display companies if so
    if (window.location.pathname.endsWith("companies.html")) {
      displayCompanies(); // Call the function to display companies
    }

    // Trust Statistics
    if (window.location.pathname.endsWith("trust-statistics.html")) {
      displayTrustStatistics();
    }

    // Function to display the list of companies on the companies.html page
    async function displayCompanies() {
      const companyListElement = document.getElementById("companyList"); // Get the element to display companies

      try {
        // Fetch the list of companies from your smart contract
        const totalCompanies = await contract.methods.totalCompanies().call();

        // Clear the existing content of the element
        companyListElement.innerHTML = "";

        for (let i = 0; i < totalCompanies; i++) {
          const companyAddress = await contract.methods
            .companyAddressAtIndex(i)
            .call();

          const companyInfo = await contract.methods
            .companies(companyAddress)
            .call();

          // Create a div to display company information
          const companyDiv = document.createElement("div");
          companyDiv.textContent = `Company Address: ${companyInfo.walletAddress}, Company Name: ${companyInfo.name}, Token Name: ${companyInfo.tokenName}`;
          companyListElement.appendChild(companyDiv);

          // Fetch trust information between this company and the current account
          const trustInfo = await contract.methods
            .trustMapping(account, companyInfo.walletAddress)
            .call();

          // Display trust information
          const trustDiv = document.createElement("div");
          trustDiv.textContent = `Trust with ${companyInfo.name}: ${
            trustInfo.isTrusted ? "Yes" : "No"
          }`;
          companyListElement.appendChild(trustDiv);
        }
      } catch (error) {
        // Handle error (you can display an error message)
        console.error("Error displaying companies:", error);
      }
    }

    // Function to create trust to another company
    async function createTrust(companyAddress) {
      try {
        // Call the updateEcosystem function in the smart contract to create trust
        await contract.methods
          .updateEcosystem(companyAddress, true)
          .send({ from: account, gas: 2000000 });

        // Handle success (you can display a success message)
        console.log("Trust created successfully");
      } catch (error) {
        // Handle error (you can display an error message)
        console.error("Error creating trust:", error);
      }
    }

    // New function to revoke trust
    async function revokeTrust(companyAddress) {
      try {
        // Call the updateEcosystem function in the smart contract to revoke trust
        await contract.methods
          .updateEcosystem(companyAddress, false) // false to indicate trust revocation
          .send({ from: account, gas: 2000000 });

        // Handle success (you can display a success message)
        console.log("Trust revoked successfully");
      } catch (error) {
        // Handle error (you can display an error message)
        console.error("Error revoking trust:", error);
      }
    }

    // Check if the current page is create-trust.html
    if (window.location.pathname.endsWith("create-trust.html")) {
      const createTrustForm = document.getElementById("createTrustForm");
      const revokeTrustForm = document.getElementById("revokeTrustForm");

      createTrustForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const companyAddress = document.getElementById("companyAddress").value;

        // Call the createTrust function to create trust to the specified company
        await createTrust(companyAddress);
      });
      revokeTrustForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const companyAddress = document.getElementById(
          "revokeCompanyAddress"
        ).value;
        await revokeTrust(companyAddress); // new function to revoke trust
      });
    }

    // Ensure this function is called only on the events.html page
    if (window.location.pathname.endsWith("events.html")) {
      async function fetchAndDisplayEvents() {
        try {
          // Fetch historical CompanyAdded events
          const companyAddedEvents = await contract.getPastEvents(
            "CompanyAdded",
            { fromBlock: 0, toBlock: "latest" }
          );
          updateEventDisplay("companyAddedEventContainer", companyAddedEvents);

          // Fetch historical TrustGranted events
          const trustGrantedEvents = await contract.getPastEvents(
            "TrustGranted",
            { fromBlock: 0, toBlock: "latest" }
          );
          updateEventDisplay("trustGrantedEventContainer", trustGrantedEvents);

          // Fetch historical TrustRevoked events
          const trustRevokedEvents = await contract.getPastEvents(
            "TrustRevoked",
            { fromBlock: 0, toBlock: "latest" }
          );
          updateEventDisplay("trustRevokedEventContainer", trustRevokedEvents);

          // Fetch historical TrustChangedForTrustedCompany events
          const trustChangedEvents = await contract.getPastEvents(
            "TrustChangedForTrustedCompany",
            { fromBlock: 0, toBlock: "latest" }
          );
          updateEventDisplay(
            "trustChangedForTrustedCompanyEventContainer",
            trustChangedEvents
          );
        } catch (error) {
          console.error("Error fetching events:", error);
        }
      }

      function updateEventDisplay(containerId, events) {
        const container = document.getElementById(containerId);
        events.forEach((event) => {
          const eventElement = document.createElement("div");
          eventElement.className = "event";
          eventElement.textContent = JSON.stringify(
            event.returnValues,
            null,
            2
          );
          container.appendChild(eventElement);
        });
      }

      fetchAndDisplayEvents();
    }

    try {
      // Request account access
      await window.ethereum.enable();

      // Form submission event listener
      const companyForm = document.getElementById("companyForm");
      companyForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const profilePhoto = document.getElementById("profilePhoto").value;
        const hasToken = document.getElementById("hasToken").checked;
        const tokenName = document.getElementById("tokenName").value;

        try {
          // Call the addCompany function in the smart contract
          await contract.methods
            .addCompany(name, profilePhoto, hasToken, tokenName)
            .send({ from: account, gas: 2000000 });

          // Handle success (you can display a success message)
          console.log("Company added successfully");
        } catch (error) {
          // Handle error (you can display an error message)
          console.error("Error adding company:", error);
        }
      });
    } catch (error) {
      console.error("User denied account access:", error);
    }

    // Add this function at the end of your app.js file
    async function displayTrustStatistics() {
      const totalCompanies = await contract.methods.totalCompanies().call();
      let trustCountsGiven = {};
      let trustCountsReceived = {};
      let allTrusts = [];

      for (let i = 0; i < totalCompanies; i++) {
        const companyAddress = await contract.methods
          .companyAddressAtIndex(i)
          .call();
        const companyName = await contract.methods
          .companies(companyAddress)
          .call()
          .then((company) => company.name);

        trustCountsGiven[companyAddress] = 0;
        trustCountsReceived[companyAddress] = 0;

        for (let j = 0; j < totalCompanies; j++) {
          if (i !== j) {
            const otherCompanyAddress = await contract.methods
              .companyAddressAtIndex(j)
              .call();
            const otherCompanyName = await contract.methods
              .companies(otherCompanyAddress)
              .call()
              .then((company) => company.name);
            const trustInfo = await contract.methods
              .getTrustInfo(companyAddress, otherCompanyAddress)
              .call();

            if (trustInfo.isTrusted) {
              trustCountsGiven[companyAddress]++;
              trustCountsReceived[otherCompanyAddress]++;
              allTrusts.push(
                `${companyName} (${companyAddress}) trusts ${otherCompanyName} (${otherCompanyAddress})`
              );
            }
          }
        }
      }

      updateTrustStatisticsOnPage(
        trustCountsGiven,
        trustCountsReceived,
        allTrusts
      );
    }

    async function updateTrustStatisticsOnPage(given, received, allTrusts) {
      // Find the company address with the most trusts given and received
      const mostTrustsGivenCompanyAddress = Object.keys(given).reduce((a, b) =>
        given[a] > given[b] ? a : b
      );
      const mostTrustsReceivedCompanyAddress = Object.keys(received).reduce(
        (a, b) => (received[a] > received[b] ? a : b)
      );

      // Fetch the company names using the addresses
      const mostTrustsGivenCompanyName = await contract.methods
        .companies(mostTrustsGivenCompanyAddress)
        .call()
        .then((company) => company.name);
      const mostTrustsReceivedCompanyName = await contract.methods
        .companies(mostTrustsReceivedCompanyAddress)
        .call()
        .then((company) => company.name);

      // Update HTML for Most Trusts Given
      document.getElementById(
        "mostTrustsGiven"
      ).innerText = `Company Name: ${mostTrustsGivenCompanyName} (Address: ${mostTrustsGivenCompanyAddress}), Trusts Given: ${given[mostTrustsGivenCompanyAddress]}`;

      // Update HTML for Most Trusts Received
      document.getElementById(
        "mostTrustsReceived"
      ).innerText = `Company Name: ${mostTrustsReceivedCompanyName} (Address: ${mostTrustsReceivedCompanyAddress}), Trusts Received: ${received[mostTrustsReceivedCompanyAddress]}`;

      // Update HTML for All Trusts List
      const allTrustsList = document.getElementById("allTrustsList");
      allTrustsList.innerHTML = "";
      allTrusts.forEach((trust) => {
        let listItem = document.createElement("li");
        listItem.innerText = trust;
        allTrustsList.appendChild(listItem);
      });
    }
  } else {
    console.error(
      "Web3 not detected. Please install MetaMask or another Ethereum wallet extension."
    );
  }
});
