const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const JAN_1ST_2030 = 1893456000;
const LOCKED_AMOUNT_ETH = 10000000000000000; // 0.01 Ether in wei

module.exports = buildModule("LockModule", (m) => {
  const unlockTime = m.getParameter("unlockTime", JAN_1ST_2030);
  const lockedAmount = m.getParameter("lockedAmount", LOCKED_AMOUNT_ETH);

  const lock2 = m.contract("Lock2", [unlockTime], {
    value: lockedAmount,
  });

  return { lock2 };
});
