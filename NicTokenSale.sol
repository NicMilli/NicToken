pragma solidity 0.8.10;

import "./CrowdSale1.sol";
import "./KycContract.sol";

contract NicTokenSale is CrowdSale1 {

    KycContract kyc;

    constructor(
        uint256 rate,    // rate in TKNbits
        address payable wallet,
        IERC20 token,
        KycContract _kyc
    )
        CrowdSale1(rate, wallet, token)
        public
    {
        kyc = _kyc;
    }

    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal view override {
       super._preValidatePurchase(beneficiary, weiAmount);
       require(kyc.kycCompleted(msg.sender), "KYC not completed, purchase rejcted");
    }

}