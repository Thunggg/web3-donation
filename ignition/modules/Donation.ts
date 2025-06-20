import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("DonationModule", (m) => {
    const donation = m.contract("ETHDonation");
    return { donation };
});