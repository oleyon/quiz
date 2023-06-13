const db = require("../models");
const Quiz = db.quiz;
const Question = db.question;
const Answer = db.answer;
exports.create = async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    // Create the quiz
    const quiz = await Quiz.create({ title, description });

    // Create questions and answers associated with the quiz
    for (const questionData of questions) {
      const { questionText, answers } = questionData;

      // Create the question
      const question = await Question.create({ questionText, quizId: quiz.id });

      // Create the answers associated with the question
      for (const answerData of answers) {
        const { answerText, isCorrect } = answerData;
        await Answer.create({ answerText, isCorrect, questionId: question.id });
      }
    }

    res.status(201).json({ quiz: quiz, message: 'Quiz created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create the quiz' });
  }
};

exports.getAll = async (req, res) => {
  const userId = req.userId;

  Quiz.findAll()
    .then(quizzes => {
      res.status(200).json(quizzes)
    })
};