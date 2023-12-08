// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CompanyRegistry {
    struct Company {
        string name;
        address walletAddress;
        string profilePhoto;
        bool hasToken;
        string tokenName;
    }

    struct TrustRecord {
        bool isTrusted;
        uint256 createdTimestamp;
        uint256 removedTimestamp;
    }

    mapping(address => Company) public companies;
    mapping(address => mapping(address => TrustRecord)) public trustMapping;
    address[] public companyAddresses;

    // Events
    event CompanyAdded(address indexed walletAddress, string name);
    event EcosystemUpdated(address indexed company1, address indexed company2, bool isPartnership);
    event TrustGranted(address indexed trustor, address indexed trustee);
    event TrustRevoked(address indexed trustor, address indexed trustee);
    event TrustChangedForTrustedCompany(address indexed observer, address indexed trustedCompany, address indexed otherParty, bool trustGranted);

    function addCompany(
        string memory _name,
        string memory _profilePhoto,
        bool _hasToken,
        string memory _tokenName
    ) external {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(companies[msg.sender].walletAddress == address(0), "You already have a company");

        Company storage newCompany = companies[msg.sender];
        newCompany.name = _name;
        newCompany.walletAddress = msg.sender;
        newCompany.profilePhoto = _profilePhoto;
        newCompany.hasToken = _hasToken;
        newCompany.tokenName = _tokenName;

        companyAddresses.push(msg.sender);
        emit CompanyAdded(msg.sender, _name);
    }

    function updateEcosystem(address _company2, bool _isTrusted) external {
        require(companies[msg.sender].walletAddress != address(0), "Company not registered");
        require(companies[_company2].walletAddress != address(0), "Company 2 not registered");
        require(msg.sender != _company2, "A company cannot trust itself");

        TrustRecord storage record = trustMapping[msg.sender][_company2];

        if (_isTrusted) {
            require(!record.isTrusted, "Trust already exists");
            record.isTrusted = true;
            record.createdTimestamp = block.timestamp;
            emit TrustGranted(msg.sender, _company2);
            // Notify observers that trust a company
            notifyObservers(msg.sender, _company2, true);
        } else {
            require(record.isTrusted, "Trust does not exist");
            record.isTrusted = false;
            record.removedTimestamp = block.timestamp;
            emit TrustRevoked(msg.sender, _company2);
            // Notify observers that trust a company
            notifyObservers(msg.sender, _company2, false);
        }

        emit EcosystemUpdated(msg.sender, _company2, _isTrusted);
    }

    function notifyObservers(address _trustor, address _trustee, bool _trustGranted) internal {
        for (uint i = 0; i < companyAddresses.length; i++) {
            if (trustMapping[companyAddresses[i]][_trustee].isTrusted) {
                emit TrustChangedForTrustedCompany(companyAddresses[i], _trustee, _trustor, _trustGranted);
            }
        }
    }

    function totalCompanies() external view returns (uint) {
        return companyAddresses.length;
    }

    function companyAddressAtIndex(uint index) external view returns (address) {
        require(index < companyAddresses.length, "Index out of bounds");
        return companyAddresses[index];
    }

    function getTrustInfo(address _company1, address _company2) external view returns (bool isTrusted, uint256 createdTimestamp, uint256 removedTimestamp) {
        TrustRecord storage record = trustMapping[_company1][_company2];
        return (record.isTrusted, record.createdTimestamp, record.removedTimestamp);
    }
}
