import {answerAndQuestions} from '@/constants.js';

export default function FAQ() {
  return (
    <>
    <h1 className="text-3xl font-bold text-center">FAQ's</h1>
    <h3 className="text-xl text-center mb-5">Have questions? We have answers.</h3>
    {answerAndQuestions.map((item, index) => {
      return (
        <div className="collapse collapse-arrow bg-base-200 mb-3">
        <input type="radio" name="my-accordion-2" defaultChecked />
        <div className="collapse-title text-xl font-medium">
          {item.question}
        </div>
        <div className="collapse-content">
          <p>{item.answer}</p>
        </div>
      </div>
      )
    })}
    </>
  )
}