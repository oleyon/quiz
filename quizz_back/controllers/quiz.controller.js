const db = require("../models");
const Quiz = db.quiz;
const Question = db.question;
const Answer = db.answer;
exports.create = async (req, res) => {
  try {
    const { title, questions } = req.body;

    // Create the quiz
    const quiz = await Quiz.create({ title });

    // Create questions and answers associated with the quiz
    for (const questionData of questions) {
      const { questionText, answers } = questionData;

      // Create the question
      const question = await Question.create({ questionText, QuizId: quiz.id });

      // Create the answers associated with the question
      for (const answerData of answers) {
        const { answerText, isCorrect } = answerData;
        await Answer.create({ answerText, isCorrect, QuestionId: question.id });
      }
    }

    res.status(201).json({ message: 'Quiz created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create the quiz' });
  }
};