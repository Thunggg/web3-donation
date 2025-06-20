import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer } from "ethers";

describe("ETHDonation Contract", function () {
    let ethDonation: any;
    let owner: Signer;
    let donor1: Signer;
    let donor2: Signer;
    let nonOwner: Signer;

    beforeEach(async function () {
        // Get signers
        [owner, donor1, donor2, nonOwner] = await ethers.getSigners();

        // Deploy contract
        const ETHDonationFactory = await ethers.getContractFactory("ETHDonation");
        ethDonation = await ETHDonationFactory.deploy();
        await ethDonation.waitForDeployment?.(); // compatible with both v5/v6
    });

    describe("Constructor", () => {
        it("Should set the deployer as owner", async function () {
            expect(await ethDonation.owner()).to.equal(await owner.getAddress());
        });


        it("should initialize totalAmount to 0", async () => {
            expect(await ethDonation.totalAmount()).to.equal(0)
        });
    });

    describe("function donate()", () => {
        const validAmount = ethers.parseEther("0.02");
        const invalidAmount = ethers.parseEther("0.009");
        const message = "Test donation message";

        it("should allow donation with valid amount", async () => {
            await expect(
                ethDonation.connect(donor1).donate(message, { value: validAmount })
            ).to.not.be.reverted;
        });

        it("Should revert donation with invalid amount (≤ 0.01 ETH)", async () => {
            await expect(
                ethDonation.connect(donor1).donate(message, { value: invalidAmount })
            ).to.be.revertedWith("Donation must be greater than 0");
        });

        it("Should handle first-time donor correctly", async () => {
            const inititalDonorCount = await ethDonation.getTotalDonors();

            await ethDonation.connect(donor1).donate(message, { value: validAmount })

            const finalDonorCount = await ethDonation.getTotalDonors();
            expect(finalDonorCount).to.be.equal(inititalDonorCount + 1n);


            const [donorAmount, donorMessage] = await ethDonation.getDonor(donor1.getAddress())
            expect(donorAmount).to.be.equal(validAmount);
            expect(donorMessage).to.be.equal(message);
        });

        it("Should handle repeat donations from same donor", async () => {
            const firstDonation = ethers.parseEther("0.02");
            const secondDonation = ethers.parseEther("0.03");

            // First donation
            await ethDonation.connect(donor1).donate("First donation", { value: firstDonation });
            const firstDonorCount = await ethDonation.getTotalDonors();

            // Second donation
            await ethDonation.connect(donor1).donate("Second donation", { value: secondDonation });
            const secondDonorCount = await ethDonation.getTotalDonors();

            expect(secondDonorCount).to.be.equal(firstDonorCount);

            const [totalAmount, latestMessage] = await ethDonation.getDonor(await donor1.getAddress())
            expect(totalAmount).to.be.equal(firstDonation + secondDonation);
            expect(latestMessage).to.be.equal("Second donation");
        });

        it("Should emit Donate event correctly", async () => {
            expect(
                ethDonation.connect(donor1).donate(message, { value: validAmount })
            )
                .to.emit(ethDonation, "Donate")
                .withArgs(await donor1.getAddress(), validAmount, message)
        });

        it("Should update totalAmount correctly", async () => {
            const initialTotal = await ethDonation.totalAmount();

            await ethDonation.connect(donor1).donate(message, { value: validAmount })

            const finalTotal = await ethDonation.totalAmount();

            expect(finalTotal).to.be.equal(initialTotal + validAmount);
        });

        it("Should save donor info correctly", async () => {
            await ethDonation.connect(donor1).donate(message, { value: validAmount });
            const [donorAmount, donorMessage] = await ethDonation.getDonor(await donor1.getAddress());
            expect(donorAmount).to.equal(validAmount);
            expect(donorMessage).to.equal(message);
        });

        it("Should add donation to history correctly", async () => {
            await ethDonation.connect(donor1).donate(message, { value: validAmount });

            // Get donation history
            const donationHistory = await ethDonation.getDonorHistory(await donor1.getAddress());

            expect(donationHistory.length).to.be.equal(1);

            const firstDonation = donationHistory[0];
            expect(firstDonation.amount).to.be.equal(validAmount);
            expect(firstDonation.message).to.be.equal(message);
            expect(firstDonation.timestamp).to.be.greaterThan(0);
        });

        it("Should update latestMessage correctly", async () => {
            const firstMessage = "First message";
            const secondMessage = "Second message";

            // First donation
            await ethDonation.connect(donor1).donate(firstMessage, { value: validAmount });

            // Check latest message after first donation
            const [amount1, latestMessage1] = await ethDonation.getDonor(await donor1.getAddress());
            expect(latestMessage1).to.equal(firstMessage);

            // Second donation with different message
            await ethDonation.connect(donor1).donate(secondMessage, { value: validAmount });

            // Check latest message after second donation
            const [amount2, latestMessage2] = await ethDonation.getDonor(await donor1.getAddress());
            expect(latestMessage2).to.equal(secondMessage);

            // Verify history has both donations
            const donationHistory = await ethDonation.getDonorHistory(await donor1.getAddress());
            expect(donationHistory.length).to.equal(2);
            expect(donationHistory[0].message).to.equal(firstMessage);
            expect(donationHistory[1].message).to.equal(secondMessage);
        });
    });

    describe("function withdraw", async () => {
        const donationAmount = ethers.parseEther("0.1");

        beforeEach(async function () {
            // Add some funds to contract
            await ethDonation.connect(donor1).donate("Test", { value: donationAmount });
        });


        it("Should allow owner to withdraw when there's balance", async () => {
            const initialBalance = await ethers.provider.getBalance(owner);

            const tx = await ethDonation.connect(owner).withdraw();
            const receipt = await tx.wait();
            const gasUsed = BigInt(receipt!.gasUsed) * BigInt(receipt!.gasPrice);
            const finalBalance = await ethers.provider.getBalance(owner);

            expect(finalBalance).to.be.closeTo(
                initialBalance + donationAmount - gasUsed,
                ethers.parseEther("0.001")
            );
        });

        it("Should revert when non-owner tries to withdraw", async () => {
            expect(
                ethDonation.connect(donor1).withdraw()
            ).to.be.revertedWith("Only owner can withdraw")
        });

        it("should revert when owner tries to withdraw with 0 balance", async () => {
            await ethDonation.connect(owner).withdraw();

            expect(
                ethDonation.connect(owner).withdraw()
            ).to.be.revertedWith("No funds to withdraw")
        });

        it("Should emit Withdraw event correctly", async () => {
            const contratBalance = await ethers.provider.getBalance(await ethDonation.getAddress())
            expect(
                await ethDonation.connect(owner).withdraw()
            ).to.emit(ethDonation, "Withdraw").withArgs(await owner.getAddress(), contratBalance)
        })
    });

    describe("View Functions", async () => {
        const donationAmount = ethers.parseEther("0.05");
        const message = "Test message";

        beforeEach(async function () {
            await ethDonation.connect(donor1).donate(message, { value: donationAmount });
        });
    });

    describe("View Functions", function () {
        const donationAmount = ethers.parseEther("0.05");
        const message = "Test message";

        beforeEach(async function () {
            await ethDonation.connect(donor1).donate(message, { value: donationAmount });
        });

        it("✅ Should return correct info for existing donor", async function () {
            const [amount, donorMessage] = await ethDonation.getDonor(await donor1.getAddress());
            expect(amount).to.equal(donationAmount);
            expect(donorMessage).to.equal(message);
        });

        it("✅ Should return zero values for non-existing donor", async function () {
            const [amount, donorMessage] = await ethDonation.getDonor(await donor2.getAddress());
            expect(amount).to.equal(0);
            expect(donorMessage).to.equal("");
        });

        it("✅ Should return correct total donors count", async function () {
            // Initially 1 donor
            expect(await ethDonation.getTotalDonors()).to.equal(1);

            // Add another donor
            await ethDonation.connect(donor2).donate("Second donor", { value: donationAmount });
            expect(await ethDonation.getTotalDonors()).to.equal(2);
        });

        it("✅ Should return correct contract balance", async function () {
            expect(await ethDonation.getContractBalance()).to.equal(donationAmount);

            // Add more funds
            await ethDonation.connect(donor2).donate("More funds", { value: donationAmount });
            expect(await ethDonation.getContractBalance()).to.equal(donationAmount * 2n);
        });
    });

    describe("Edge Cases", function () {
        it("✅ Should handle multiple donations from same address correctly", async function () {
            const firstAmount = ethers.parseEther("0.02");
            const secondAmount = ethers.parseEther("0.03");
            const thirdAmount = ethers.parseEther("0.01");

            await ethDonation.connect(donor1).donate("First", { value: firstAmount });
            await ethDonation.connect(donor1).donate("Second", { value: secondAmount });
            await ethDonation.connect(donor1).donate("Third", { value: thirdAmount });

            const [totalAmount, latestMessage] = await ethDonation.getDonor(await donor1.getAddress());
            expect(totalAmount).to.equal(firstAmount + secondAmount + thirdAmount);
            expect(latestMessage).to.equal("Third");
            expect(await ethDonation.getTotalDonors()).to.equal(1);
        });

        it("✅ Should handle donation with empty message", async function () {
            const amount = ethers.parseEther("0.02");

            await ethDonation.connect(donor1).donate("", { value: amount });

            const [donorAmount, donorMessage] = await ethDonation.getDonor(await donor1.getAddress());
            expect(donorAmount).to.equal(amount);
            expect(donorMessage).to.equal("");
        });

        it("✅ Should handle donation with very long message", async function () {
            const amount = ethers.parseEther("0.02");
            const longMessage = "A".repeat(1000); // Very long message

            await ethDonation.connect(donor1).donate(longMessage, { value: amount });

            const [donorAmount, donorMessage] = await ethDonation.getDonor(await donor1.getAddress());
            expect(donorAmount).to.equal(amount);
            expect(donorMessage).to.equal(longMessage);
        });

        it("Should handle exactly 0.01 ETH donation (boundary test)", async function () {
            const exactAmount = ethers.parseEther("0.01");

            await expect(
                ethDonation.connect(donor1).donate("Boundary test", { value: exactAmount })
            );
        });

        it("Should handle very small donation above minimum", async function () {
            const smallAmount = ethers.parseEther("0.010000000000000001"); // Slightly above 0.01 ETH

            await expect(
                ethDonation.connect(donor1).donate("Small donation", { value: smallAmount })
            ).to.not.be.reverted;
        });
    });

    describe("Integration Tests", function () {
        it("Should handle complete donation and withdrawal flow", async function () {
            const donation1 = ethers.parseEther("0.05");
            const donation2 = ethers.parseEther("0.03");

            // Multiple donors donate
            await ethDonation.connect(donor1).donate("Donor 1", { value: donation1 });
            await ethDonation.connect(donor2).donate("Donor 2", { value: donation2 });

            // Check contract state
            expect(await ethDonation.getTotalDonors()).to.equal(2);
            expect(await ethDonation.totalAmount()).to.equal(donation1 + donation2);
            expect(await ethDonation.getContractBalance()).to.equal(donation1 + donation2);

            // Owner withdraws
            const initialOwnerBalance = await ethers.provider.getBalance(await owner.getAddress());
            const tx = await ethDonation.connect(owner).withdraw();
            const receipt = await tx.wait();
            const gasUsed = BigInt(receipt!.gasUsed) * BigInt(receipt!.gasUsedz);

            // Check final state
            expect(await ethDonation.getContractBalance()).to.equal(0);
            const finalOwnerBalance = await ethers.provider.getBalance(owner.getAddress());
            expect(finalOwnerBalance).to.be.closeTo(
                initialOwnerBalance + donation1 + donation2 - gasUsed,
                ethers.parseEther("0.001")
            );
        });
    });
});