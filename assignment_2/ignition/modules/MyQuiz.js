const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
let Q1 = "Taylor Swift has never won a Grammy Award";
let A1 = false;
let Q2 = "Taylor Swift's album '1989' was her first official pop music album";
let A2 = true;
let Q3 = "Was Taylor Swift born in Nashville?";
let A3 = false;
let Q4 = "Taylor Swift collaborated with Kendrick Lamar on the song 'Bad Blood'";
let A4 = true;
let Q5 = "Taylor Swift's first re-recording was the album 'Red'";
let A5 = false;
const arg1 = [Q1,Q2,Q3,Q4,Q5];
const arg2 = [A1,A2,A3,A4,A5];
const QuizModule = buildModule("QuizModule", (m) => {
    const quiz = m.contract("MyQuiz", [arg1,arg2]);
    m.call(quiz, "askQuestion", []);
    // m.call(quiz, "answerQuestion", []);
    // m.call(quiz, "getAnswer", []);
    m.call(quiz, "getQuestions", []);

    return { quiz };
});

module.exports = QuizModule;